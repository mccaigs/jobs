import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listReports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_reportDate")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

export const getReportBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});

export const upsertReport = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    displayLabel: v.optional(v.string()),
    region: v.optional(v.string()),
    reportDate: v.number(),
    type: v.union(v.literal("daily"), v.literal("uk-wide")),
    summary: v.optional(v.string()),
    markdownBody: v.string(),
    sourcePath: v.optional(v.string()),
    sourceRepo: v.optional(v.string()),
    fitScore: v.optional(v.number()),
    totalScanned: v.optional(v.number()),
    highFitCount: v.optional(v.number()),
    averageFitScore: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    jobType: v.optional(v.string()),
    employmentType: v.optional(v.string()),
    salaryOrRate: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("reports")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        isActive: true,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("reports", {
        ...args,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        publishedAt: args.publishedAt ?? now,
      });
    }
  },
});
