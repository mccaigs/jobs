import type { Report } from '../types/report';
import { parseReport } from '../utils/reportParser';

export interface ConvexReport {
  _id: string;
  _creationTime: number;
  slug: string;
  title: string;
  displayLabel?: string;
  region?: string;
  reportDate: number;
  type: 'daily' | 'uk-wide';
  summary?: string;
  markdownBody: string;
  sourcePath?: string;
  sourceRepo?: string;
  fitScore?: number;
  totalScanned?: number;
  highFitCount?: number;
  averageFitScore?: number;
  tags?: string[];
  jobType?: string;
  employmentType?: string;
  salaryOrRate?: string;
  isActive: boolean;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export function convexReportToReport(r: ConvexReport, isLatest: boolean): Report {
  const date = new Date(r.reportDate);
  const parsed = parseReport(r.markdownBody, date);

  return {
    id: r.slug,
    slug: r.slug,
    title: r.displayLabel ?? r.title,
    date,
    type: r.type,
    content: r.markdownBody,
    isLatest,
    parsed,
    displayLabel: r.displayLabel ?? r.title,
    region: r.region ?? parsed.region,
  };
}

export function mapConvexReports(rows: ConvexReport[]): Report[] {
  if (!rows.length) return [];
  const sorted = [...rows].sort((a, b) => b.reportDate - a.reportDate);
  return sorted.map((r, i) => convexReportToReport(r, i === 0));
}

export function getReportSourceUrl(slug: string, sourceRepo = 'mccaigs/jobs'): string {
  return `https://github.com/${sourceRepo}/blob/main/reports/${slug}.md`;
}
