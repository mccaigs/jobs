import type { Report } from '../types/report';
import { parseReport } from '../utils/reportParser';

const GITHUB_REPO = 'mccaigs/jobs';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

const ORDINAL_SUFFIXES = ['th', 'st', 'nd', 'rd'];
function ordinal(n: number): string {
  const v = n % 100;
  return n + (ORDINAL_SUFFIXES[(v - 20) % 10] ?? ORDINAL_SUFFIXES[v] ?? ORDINAL_SUFFIXES[0]);
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const REGION_MAP: Record<string, string> = {
  'edinburgh': 'Edinburgh',
  'uk-wide': 'UK',
  'uk': 'UK',
  'daily': 'Edinburgh',
  'jobs': 'Edinburgh',
  'london': 'London',
  'cambridge': 'Cambridge',
  'manchester': 'Manchester',
  'scotland': 'Scotland',
  'nationwide': 'UK',
};

export interface ReportLabel {
  date: Date;
  slug: string;
  region: string;
  displayLabel: string;
}

function parseReportFilename(filename: string): ReportLabel | null {
  // Match pattern: YYYY-MM-DD-<suffix>.md
  const pattern = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;
  const match = filename.match(pattern);

  if (!match) return null;

  const [, year, month, day, suffix] = match;
  const date = new Date(`${year}-${month}-${day}`);

  if (isNaN(date.getTime())) return null;

  const slug = filename.replace('.md', '');

  // Normalise region from suffix
  const suffixKey = suffix.toLowerCase();
  let region = 'Edinburgh';
  for (const [key, label] of Object.entries(REGION_MAP)) {
    if (suffixKey === key || suffixKey.includes(key)) {
      region = label;
      break;
    }
  }

  const dayNum = parseInt(day, 10);
  const monthName = MONTH_NAMES[parseInt(month, 10) - 1] ?? month;
  const displayLabel = `${ordinal(dayNum)} ${monthName} · ${region}`;

  return { date, slug, region, displayLabel };
}

async function fetchReportContent(filename: string): Promise<string> {
  const url = `${GITHUB_RAW_BASE}/${GITHUB_REPO}/main/${filename}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch report: ${response.statusText}`);
  }
  
  return response.text();
}

async function fetchDirectoryListing(path: string): Promise<GitHubFile[]> {
  const url = `${GITHUB_API_BASE}/repos/${GITHUB_REPO}/contents/${path}`;
  const response = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github.v3+json' },
  });
  if (!response.ok) return [];
  return response.json();
}

export async function fetchReportsFromGitHub(): Promise<Report[]> {
  try {
    // Try /reports/ subdirectory first, then fall back to root
    let files: GitHubFile[] = await fetchDirectoryListing('reports');
    if (files.length === 0) {
      const rootResponse = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_REPO}/contents`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' },
      });
      if (!rootResponse.ok) throw new Error(`GitHub API error: ${rootResponse.statusText}`);
      files = await rootResponse.json();
    }

    // Filter for report files matching the pattern
    const reportFiles = files.filter(file => {
      return file.type === 'file' && parseReportFilename(file.name) !== null;
    });

    // Fetch content for each report
    const reportPromises = reportFiles.map(async (file) => {
      const label = parseReportFilename(file.name);
      if (!label) return null;

      try {
        const filePath = file.path ?? file.name;
        const content = await fetchReportContent(filePath);

        const parsedData = parseReport(content, label.date);

        // Use display label as title (override raw H1 for cleaner UI)
        const title = label.displayLabel;

        // Determine report type from region
        const type: Report['type'] = label.region === 'UK' ? 'uk-wide' : 'daily';

        return {
          id: label.slug,
          slug: label.slug,
          title,
          date: label.date,
          type,
          content,
          isLatest: false,
          parsed: parsedData,
          displayLabel: label.displayLabel,
          region: label.region,
        };
      } catch (error) {
        console.error(`Failed to fetch content for ${file.name}:`, error);
        return null;
      }
    });

    const reports = await Promise.all(reportPromises);

    // Filter out failed fetches and sort by date descending
    const validReports = reports.filter((r): r is NonNullable<typeof r> => r !== null);
    validReports.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Mark the latest report
    if (validReports.length > 0) {
      validReports[0].isLatest = true;
    }

    return validReports;
  } catch (error) {
    console.error('Failed to fetch reports from GitHub:', error);
    throw error;
  }
}

export function getReportSourceUrl(slug: string): string {
  return `https://github.com/${GITHUB_REPO}/blob/main/reports/${slug}.md`;
}
