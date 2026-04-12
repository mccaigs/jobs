import type { Report } from '../types/report';
import { parseReport } from '../utils/reportParser';
import { extractReportDate } from '../utils/reportDate';

export interface JobReport {
  _id: string;
  _creationTime: number;
  fileName: string;
  fileUrl: string;
  content: string;
  contentHash: string;
  pulledAt: number;
  source: string;
  reportDate?: number;
  githubSha?: string;
}

/**
 * Generates slug from fileName
 */
function generateSlug(fileName: string): string {
  const baseName = fileName.includes('/') ? fileName.split('/').pop()! : fileName;
  return baseName.replace(/\.md$/, '');
}

/**
 * Determines report type from fileName
 */
function determineReportType(fileName: string): 'daily' | 'uk-wide' {
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes('uk-ai') || lowerName.includes('uk-wide')) {
    return 'uk-wide';
  }
  return 'daily';
}

/**
 * Maps a JobReport from Convex to the Report type expected by the frontend.
 * Date resolution order: reportDate field from DB → filename parsing → pulledAt.
 */
export function mapJobReportToReport(jobReport: JobReport, isLatest: boolean = false): Report {
  const date =
    (jobReport.reportDate ? new Date(jobReport.reportDate) : null) ??
    extractReportDate(jobReport.fileName) ??
    new Date(jobReport.pulledAt);
  const slug = generateSlug(jobReport.fileName);
  const type = determineReportType(jobReport.fileName);
  const parsed = parseReport(jobReport.content, date);

  return {
    id: jobReport._id,
    slug,
    title: parsed.title,
    date,
    type,
    content: jobReport.content,
    isLatest,
    displayLabel: `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} · ${parsed.region}`,
    region: parsed.region,
    parsed,
  };
}

/**
 * Maps multiple JobReports to Report array sorted by file date descending.
 * isLatest is set on the report with the newest file date, not the most
 * recently pulled one, so the default selection is always the newest report.
 */
export function mapJobReportsToReports(jobReports: JobReport[]): Report[] {
  if (!jobReports || jobReports.length === 0) return [];

  const mapped = jobReports.map((jr) => mapJobReportToReport(jr, false));

  // Sort by report date descending (newest file first)
  mapped.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Mark only the first entry (newest by date) as latest
  if (mapped.length > 0) {
    mapped[0] = { ...mapped[0], isLatest: true };
  }

  return mapped;
}
