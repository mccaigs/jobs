import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Records the result of a sync run. Called from the HTTP /ingest/sync handler
 * and (optionally) from the cron after each ingestLatestJobReport invocation.
 */
export const writeSyncLog = internalMutation({
  args: {
    ranAt: v.number(),
    success: v.boolean(),
    inserted: v.number(),
    updated: v.number(),
    skipped: v.number(),
    errors: v.array(v.string()),
    totalFiles: v.number(),
    latestReportDate: v.optional(v.number()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("syncLog", args);
  },
});

/**
 * Returns the single most-recent sync log entry, or null if none exists.
 * Used by the admin panel to show last sync status without exposing history.
 */
export const getLatestSyncLog = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("syncLog")
      .withIndex("by_ranAt")
      .order("desc")
      .first();
  },
});
