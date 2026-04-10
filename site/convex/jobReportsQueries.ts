import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the latest job report from the jobReports table
 * This table is populated by the cron jobs that run twice daily
 */
export const getLatestJobReport = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("jobReports")
      .withIndex("by_pulledAt")
      .order("desc")
      .first();
  },
});

/**
 * Get all job reports ordered by pulledAt (newest first)
 */
export const listJobReports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("jobReports")
      .withIndex("by_pulledAt")
      .order("desc")
      .collect();
  },
});

/**
 * Get a specific job report by fileName
 */
export const getJobReportByFileName = query({
  args: { fileName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobReports")
      .withIndex("by_fileName", (q) => q.eq("fileName", args.fileName))
      .first();
  },
});
