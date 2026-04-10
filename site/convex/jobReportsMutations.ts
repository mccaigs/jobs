import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Internal mutation to store a job report
 * Handles deduplication by contentHash and fileName
 */
export const storeJobReport = internalMutation({
  args: {
    fileName: v.string(),
    fileUrl: v.string(),
    content: v.string(),
    contentHash: v.string(),
    pulledAt: v.number(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if this exact content already exists
    const existingByHash = await ctx.db
      .query("jobReports")
      .withIndex("by_contentHash", (q) => q.eq("contentHash", args.contentHash))
      .first();

    if (existingByHash) {
      console.log(`Skipping duplicate content: ${args.fileName} (hash match)`);
      return { inserted: false, reason: "duplicate_hash", id: existingByHash._id };
    }

    // Check if this filename already exists
    const existingByName = await ctx.db
      .query("jobReports")
      .withIndex("by_fileName", (q) => q.eq("fileName", args.fileName))
      .first();

    if (existingByName) {
      console.log(`Skipping duplicate filename: ${args.fileName}`);
      return { inserted: false, reason: "duplicate_filename", id: existingByName._id };
    }

    // Insert new record
    const id = await ctx.db.insert("jobReports", args);
    console.log(`Stored new job report: ${args.fileName}`);
    
    return { inserted: true, id };
  },
});
