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
 * Get all job reports ordered by reportDate desc (newest report date first).
 * reportDate is the date extracted from the filename at ingest time and is
 * the authoritative sort key. Rows without reportDate (legacy rows ingested
 * before this field was added) are collected separately and appended at the end.
 * No artificial limit - returns every stored report.
 */
export const listJobReports = query({
  args: {},
  handler: async (ctx) => {
    // Collect all rows (no index needed for a full scan - the sort happens client-side
    // in mapJobReportsToReports, but we do a DB-level sort here for consistency).
    const all = await ctx.db.query("jobReports").collect();
    // Sort by reportDate desc; rows missing reportDate fall to the end.
    all.sort((a, b) => {
      const da = a.reportDate ?? 0;
      const db = b.reportDate ?? 0;
      return db - da;
    });
    return all;
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
