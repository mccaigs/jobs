import type { ParsedReport } from '../utils/reportParser';

export interface Report {
  id: string;
  title: string;
  date: Date;
  type: 'daily' | 'uk-wide';
  content: string;
  isLatest: boolean;
  slug: string;
  parsed?: ParsedReport;
  displayLabel?: string;
  region?: string;
}

export interface ReportMetadata {
  title: string;
  date: Date;
  type: 'daily' | 'uk-wide';
}
