"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import crypto from "crypto";

const GITHUB_OWNER = "mccaigs";
const GITHUB_REPO = "jobs";
const GITHUB_BRANCH = "master";
const GITHUB_API = "https://api.github.com";
const GITHUB_RAW = "https://raw.githubusercontent.com";

interface GitHubTreeItem {
  path: string;
  sha: string;
  url: string;
  type: string;
}

interface GitHubTreeResponse {
  tree: GitHubTreeItem[];
}

/**
 * Fetches the list of markdown files from the GitHub repository
 */
async function fetchGitHubFiles(): Promise<Array<{ path: string; sha: string; url: string }>> {
  const treeUrl = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`;
  
  const response = await fetch(treeUrl, {
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Convex-Cron-Job",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as GitHubTreeResponse;
  
  return data.tree
    .filter((item: GitHubTreeItem) => 
      item.type === "blob" && 
      item.path.endsWith(".md") && 
      item.path !== "README.md"
    )
    .map((item: GitHubTreeItem) => ({
      path: item.path,
      sha: item.sha,
      url: item.url,
    }));
}

/**
 * Fetches the raw content of a file from GitHub
 */
async function fetchFileContent(filePath: string): Promise<string> {
  const rawUrl = `${GITHUB_RAW}/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;
  
  const response = await fetch(rawUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`);
  }
  
  return await response.text();
}

/**
 * Determines if a file is a job report based on naming patterns.
 * Strips any leading directory path before matching so files in subdirectories
 * (e.g. "reports/01-04-2026-jobs.md") are still recognised correctly.
 */
function isJobReport(filePath: string): boolean {
  const baseName = filePath.includes('/') ? filePath.split('/').pop()! : filePath;
  const patterns = [
    /^\d{4}-\d{2}-\d{2}-jobs\.md$/,           // YYYY-MM-DD-jobs.md
    /^\d{2}-\d{2}-\d{4}-jobs\.md$/,           // DD-MM-YYYY-jobs.md
    /^UK-AI-DailyJobSearch-.*\.md$/,          // UK-AI-DailyJobSearch-*.md
  ];
  return patterns.some(pattern => pattern.test(baseName));
}

/**
 * Extracts date from filename for sorting.
 * Tests DD-MM-YYYY before YYYY-MM-DD to avoid ambiguous partial matches
 * (e.g. "01-04-2026" must not be parsed as year=0104 month=20 day=26).
 * Uses non-digit boundary anchors to avoid matching inside longer digit runs.
 */
function extractDateFromFileName(filePath: string): Date | null {
  const baseName = filePath.includes('/') ? filePath.split('/').pop()! : filePath;

  // DD-MM-YYYY: e.g. 01-04-2026, 25-03-2026
  const ddmmyyyyMatch = baseName.match(/(?:^|[^0-9])(\d{2})-(\d{2})-(\d{4})(?:[^0-9]|$)/);
  if (ddmmyyyyMatch) {
    const d = new Date(`${ddmmyyyyMatch[3]}-${ddmmyyyyMatch[2]}-${ddmmyyyyMatch[1]}`);
    if (!isNaN(d.getTime())) return d;
  }

  // YYYY-MM-DD: e.g. 2026-03-23
  const isoMatch = baseName.match(/(?:^|[^0-9])(\d{4})-(\d{2})-(\d{2})(?:[^0-9]|$)/);
  if (isoMatch) {
    const d = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

/**
 * Generates a SHA-256 hash of the content for deduplication
 */
function generateContentHash(content: string): string {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

/**
 * Main action to ingest job reports from GitHub.
 *
 * Three-branch SHA-diff design (two network phases):
 *
 *   Phase 1 – classify (no content downloads):
 *     a) Fetch the GitHub repo tree (one API call) → get path + blob SHA for every file.
 *     b) Query Convex for { fileName, githubSha } of every stored report (one DB call).
 *     c) Classify each GitHub job-report file as one of:
 *        • NEW      – fileName not in Convex → must fetch + insert
 *        • UNCHANGED – fileName in Convex AND stored githubSha === tree SHA → skip entirely
 *        • CHANGED  – fileName in Convex BUT githubSha differs (or was never stored) → must fetch + patch
 *
 *   Phase 2 – fetch & write (only for NEW and CHANGED files):
 *     Download raw content only for files that need it, then insert or patch.
 *
 * Steady-state cost with no repo changes: 1 GitHub API call + 1 Convex query, 0 downloads.
 */
export const ingestLatestJobReport = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log("🚀 Starting GitHub job report ingestion (SHA-diff)...");

    try {
      // ── Phase 1a: fetch GitHub tree ───────────────────────────────────────
      console.log("📋 Fetching file list from GitHub...");
      const allFiles = await fetchGitHubFiles();
      console.log(`Found ${allFiles.length} markdown files in repo`);

      const jobReportFiles = allFiles.filter((f) => isJobReport(f.path));
      console.log(`Identified ${jobReportFiles.length} job report files`);

      if (jobReportFiles.length === 0) {
        console.log("⚠️  No job reports found");
        return { success: true, message: "No job reports found", processed: 0 };
      }

      // ── Phase 1b: query Convex metadata ──────────────────────────────────
      type FileMeta = { id: string; fileName: string; githubSha: string | null };
      const existingMeta: FileMeta[] = await ctx.runQuery(
        internal.jobReportsMutations.listExistingFileMeta,
        {}
      );

      // Build a map of fileName → { id, githubSha } for O(1) lookup
      const storedMap = new Map<string, { id: string; githubSha: string | null }>(
        existingMeta.map((m) => [m.fileName, { id: m.id, githubSha: m.githubSha }])
      );
      console.log(`Convex has ${storedMap.size} stored report(s)`);

      // ── Phase 1c: classify ───────────────────────────────────────────────
      type NewFile     = { kind: "new";     path: string; sha: string };
      type ChangedFile = { kind: "changed"; path: string; sha: string; existingId: Id<"jobReports"> };

      const toProcess: Array<NewFile | ChangedFile> = [];
      let unchangedCount = 0;

      for (const file of jobReportFiles) {
        const stored = storedMap.get(file.path);

        if (!stored) {
          // NEW: not in Convex at all
          toProcess.push({ kind: "new", path: file.path, sha: file.sha });
        } else if (stored.githubSha !== null && stored.githubSha === file.sha) {
          // UNCHANGED: SHA matches – content is identical, skip
          unchangedCount++;
        } else {
          // CHANGED: fileName known but SHA differs (or was never recorded)
          toProcess.push({ kind: "changed", path: file.path, sha: file.sha, existingId: stored.id as Id<"jobReports"> });
        }
      }

      console.log(
        `Classification: ${toProcess.filter(f => f.kind === "new").length} new, ` +
        `${toProcess.filter(f => f.kind === "changed").length} changed, ` +
        `${unchangedCount} unchanged`
      );

      if (toProcess.length === 0) {
        console.log("ℹ️  All reports up to date – nothing to fetch");
        return {
          success: true,
          message: "All reports up to date",
          processed: 0,
          updated: 0,
          skipped: unchangedCount,
          totalFiles: jobReportFiles.length,
        };
      }

      // Sort newest-first by file date so the most recent report is processed first
      toProcess.sort((a, b) => {
        const dateA = extractDateFromFileName(a.path);
        const dateB = extractDateFromFileName(b.path);
        if (!dateA || !dateB) return 0;
        return dateB.getTime() - dateA.getTime();
      });

      // ── Phase 2: fetch content & write ───────────────────────────────────
      console.log(`📄 Fetching content for ${toProcess.length} file(s)...`);

      let inserted = 0;
      let updated = 0;
      const errors: string[] = [];
      const now = Date.now();

      for (const file of toProcess) {
        try {
          const content = await fetchFileContent(file.path);
          const contentHash = generateContentHash(content);

          if (file.kind === "new") {
            const fileUrl = `${GITHUB_RAW}/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${file.path}`;
            const reportDateMs = extractDateFromFileName(file.path)?.getTime() ?? now;
            const result = await ctx.runMutation(internal.jobReportsMutations.storeJobReport, {
              fileName: file.path,
              fileUrl,
              content,
              contentHash,
              pulledAt: now,
              source: "github",
              githubSha: file.sha,
              reportDate: reportDateMs,
            });
            if (result.inserted) {
              console.log(`✅ Inserted new: ${file.path}`);
              inserted++;
            } else {
              console.log(`ℹ️  Race-skipped (${result.reason}): ${file.path}`);
            }
          } else {
            // CHANGED: patch the existing row
            const reportDateMs = extractDateFromFileName(file.path)?.getTime() ?? now;
            await ctx.runMutation(internal.jobReportsMutations.updateJobReport, {
              id: file.existingId,
              content,
              contentHash,
              pulledAt: now,
              githubSha: file.sha,
              reportDate: reportDateMs,
            });
            console.log(`🔄 Updated changed: ${file.path}`);
            updated++;
          }
        } catch (fileError) {
          const msg = fileError instanceof Error ? fileError.message : String(fileError);
          console.error(`❌ Failed to process ${file.path}: ${msg}`);
          errors.push(`${file.path}: ${msg}`);
        }
      }

      const message =
        `Ingestion complete: ${inserted} inserted, ${updated} updated, ` +
        `${unchangedCount} unchanged, ${errors.length} errors`;
      console.log(`🏁 ${message}`);

      return {
        success: true,
        message,
        processed: inserted,
        updated,
        skipped: unchangedCount,
        errors,
        totalFiles: jobReportFiles.length,
      };
    } catch (error) {
      console.error("❌ Error during ingestion:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        error: error instanceof Error ? error.stack : String(error),
        processed: 0,
      };
    }
  },
});