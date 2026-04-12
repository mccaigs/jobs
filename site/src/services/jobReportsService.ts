import type { Report } from '../types/report';
import { parseReport } from '../utils/reportParser';

export interface JobReport {
  _id: string;
  _creationTime: number;
  fileName: string;
  fileUrl: string;
  content: string;
  contentHash: string;
  pulledAt: number;
  source: string;
}

/**
 * Extracts date from filename
 */
function extractDateFromFileName(fileName: string): Date {
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
  
  // Fallback to pulledAt
  return new Date();
}

/**
 * Generates slug from fileName
 */
function generateSlug(fileName: string): string {
  return fileName.replace(/\.md$/, '');
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
 * Maps a JobReport from Convex to the Report type expected by the frontend
 */
export function mapJobReportToReport(jobReport: JobReport, isLatest: boolean = false): Report {
  const date = extractDateFromFileName(jobReport.fileName);
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
