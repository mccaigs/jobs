import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reports: defineTable({
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
    isActive: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_reportDate", ["reportDate"])
    .index("by_fitScore", ["fitScore"])
    .index("by_publishedAt", ["publishedAt"])
    .index("by_isActive", ["isActive"]),

  jobReports: defineTable({
    fileName: v.string(),
    fileUrl: v.string(),
    content: v.string(),
    contentHash: v.string(),
    pulledAt: v.number(),
    source: v.string(),
    githubSha: v.optional(v.string()),
    reportDate: v.optional(v.number()),
  })
    .index("by_fileName", ["fileName"])
    .index("by_contentHash", ["contentHash"])
    .index("by_pulledAt", ["pulledAt"])
    .index("by_reportDate", ["reportDate"]),
});
