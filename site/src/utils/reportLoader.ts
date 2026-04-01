import type { Report, ReportMetadata } from '../types/report';

const reportModules = import.meta.glob('../../reports/**/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

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

function parseFilename(filepath: string): (ReportMetadata & { displayLabel: string; region: string }) | null {
  const filename = filepath.split('/').pop()?.replace('.md', '') || '';

  // Match patterns like: 2024-03-30-daily, 2024-03-30-uk-wide, 2024-03-30-edinburgh
  const datePattern = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;
  const match = filename.match(datePattern);

  if (!match) return null;

  const [, year, month, day, suffix] = match;
  const date = new Date(`${year}-${month}-${day}`);
  if (isNaN(date.getTime())) return null;

  const suffixKey = suffix.toLowerCase();
  const type: Report['type'] = suffixKey.includes('uk') ? 'uk-wide' : 'daily';

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

  return { title: displayLabel, date, type, displayLabel, region };
}

export function loadReports(): Report[] {
  const reports: Report[] = [];
  
  for (const [filepath, content] of Object.entries(reportModules)) {
    const metadata = parseFilename(filepath);
    if (!metadata) continue;
    
    const slug = filepath.split('/').pop()?.replace('.md', '') || '';
    
    reports.push({
      id: slug,
      slug,
      title: metadata.title,
      date: metadata.date,
      type: metadata.type,
      content: content as string,
      isLatest: false,
      displayLabel: metadata.displayLabel,
      region: metadata.region,
    });
  }
  
  // Sort by date descending
  reports.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Mark the latest report
  if (reports.length > 0) {
    reports[0].isLatest = true;
  }
  
  return reports;
}

export function getReportBySlug(slug: string, reports: Report[]): Report | undefined {
  return reports.find(r => r.slug === slug);
}

export function getLatestReport(reports: Report[]): Report | undefined {
  return reports.find(r => r.isLatest);
}

export function groupReportsByType(reports: Report[]): { daily: Report[], ukWide: Report[] } {
  return {
    daily: reports.filter(r => r.type === 'daily'),
    ukWide: reports.filter(r => r.type === 'uk-wide'),
  };
}
