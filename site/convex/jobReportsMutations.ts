import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Returns fileName, githubSha, and _id for every stored job report.
 * Used by the ingest action to diff GitHub tree against Convex without
 * downloading any file content.
 */
export const listExistingFileMeta = internalQuery({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("jobReports").collect();
    return rows.map((r) => ({
      id: r._id,
      fileName: r.fileName,
      githubSha: r.githubSha ?? null,
    }));
  },
});

/**
 * Inserts a new job report.
 * Safety-net deduplication by contentHash and fileName is preserved for
 * race conditions between concurrent cron runs.
 */
export const storeJobReport = internalMutation({
  args: {
    fileName: v.string(),
    fileUrl: v.string(),
    content: v.string(),
    contentHash: v.string(),
    pulledAt: v.number(),
    source: v.string(),
    githubSha: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Safety net: skip if identical content already exists anywhere
    const existingByHash = await ctx.db
      .query("jobReports")
      .withIndex("by_contentHash", (q) => q.eq("contentHash", args.contentHash))
      .first();

    if (existingByHash) {
      console.log(`Skipping duplicate content: ${args.fileName} (hash match)`);
      return { inserted: false, reason: "duplicate_hash", id: existingByHash._id };
    }

    // Safety net: skip if this filename is already stored (action should have
    // caught this in the diff phase, but guard against races)
    const existingByName = await ctx.db
      .query("jobReports")
      .withIndex("by_fileName", (q) => q.eq("fileName", args.fileName))
      .first();

    if (existingByName) {
      console.log(`Skipping duplicate filename: ${args.fileName}`);
      return { inserted: false, reason: "duplicate_filename", id: existingByName._id };
    }

    const id = await ctx.db.insert("jobReports", args);
    console.log(`Stored new job report: ${args.fileName}`);
    return { inserted: true, id };
  },
});

/**
 * Patches an existing job report row with new content.
 * Called when the GitHub blob SHA for a known filename has changed,
 * meaning the file was edited in the repository.
 */
export const updateJobReport = internalMutation({
  args: {
    id: v.id("jobReports"),
    content: v.string(),
    contentHash: v.string(),
    pulledAt: v.number(),
    githubSha: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, patch);
    console.log(`Updated job report ${String(id)} with new content`);
    return { updated: true, id };
  },
});
