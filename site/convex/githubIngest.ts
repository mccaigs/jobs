"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
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
 * Determines if a file is a job report based on naming patterns
 */
function isJobReport(fileName: string): boolean {
  const patterns = [
    /^\d{4}-\d{2}-\d{2}-jobs\.md$/,           // YYYY-MM-DD-jobs.md
    /^\d{2}-\d{2}-\d{4}-jobs\.md$/,           // DD-MM-YYYY-jobs.md
    /^UK-AI-DailyJobSearch-.*\.md$/,          // UK-AI-DailyJobSearch-*.md
  ];
  
  return patterns.some(pattern => pattern.test(fileName));
}

/**
 * Extracts date from filename for sorting
 */
function extractDateFromFileName(fileName: string): Date | null {
  // YYYY-MM-DD format
  const isoMatch = fileName.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`);
  }
  
  // DD-MM-YYYY format
  const ddmmyyyyMatch = fileName.match(/(\d{2})-(\d{2})-(\d{4})/);
  if (ddmmyyyyMatch) {
    return new Date(`${ddmmyyyyMatch[3]}-${ddmmyyyyMatch[2]}-${ddmmyyyyMatch[1]}`);
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
 * Main action to ingest the latest job report from GitHub
 */
export const ingestLatestJobReport = action({
  args: {},
  handler: async (ctx) => {
    console.log("🚀 Starting GitHub job report ingestion...");
    
    try {
      // Fetch all markdown files from GitHub
      console.log("📋 Fetching file list from GitHub...");
      const files = await fetchGitHubFiles();
      console.log(`Found ${files.length} markdown files`);

      // Filter to job reports only
      const jobReportFiles = files.filter(file => isJobReport(file.path));
      console.log(`Identified ${jobReportFiles.length} job report files`);

      if (jobReportFiles.length === 0) {
        console.log("⚠️  No job reports found");
        return { success: true, message: "No job reports found", processed: 0 };
      }

      // Sort by date (newest first)
      const sortedFiles = jobReportFiles.sort((a, b) => {
        const dateA = extractDateFromFileName(a.path);
        const dateB = extractDateFromFileName(b.path);
        
        if (!dateA || !dateB) return 0;
        return dateB.getTime() - dateA.getTime();
      });

      // Get the latest file
      const latestFile = sortedFiles[0];
      console.log(`📄 Latest job report: ${latestFile.path}`);

      // Fetch content
      console.log("⬇️  Fetching file content...");
      const content = await fetchFileContent(latestFile.path);
      const contentHash = generateContentHash(content);
      
      console.log(`Content size: ${content.length} bytes`);
      console.log(`Content hash: ${contentHash.substring(0, 16)}...`);

      // Store in database
      const fileUrl = `${GITHUB_RAW}/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${latestFile.path}`;
      
      const result = await ctx.runMutation(internal.jobReportsMutations.storeJobReport, {
        fileName: latestFile.path,
        fileUrl,
        content,
        contentHash,
        pulledAt: Date.now(),
        source: "github",
      });

      if (result.inserted) {
        console.log(`✅ Successfully stored: ${latestFile.path}`);
        return {
          success: true,
          message: "New job report ingested",
          fileName: latestFile.path,
          contentHash,
          processed: 1,
        };
      } else {
        console.log(`ℹ️  Skipped (${result.reason}): ${latestFile.path}`);
        return {
          success: true,
          message: `Job report already exists (${result.reason})`,
          fileName: latestFile.path,
          contentHash,
          processed: 0,
        };
      }
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