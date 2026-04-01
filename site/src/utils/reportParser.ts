export interface JobMatch {
  title: string;
  company: string;
  region: string;
  fitScore: number;
  summary: string;
  badge: 'High Fit' | 'Priority' | 'Review' | 'Edinburgh' | 'UK Remote';
  url?: string;
}

export interface ParsedReport {
  title: string;
  date: Date;
  region: string;
  totalScanned: number;
  highFitCount: number;
  topFitScore: number;
  averageFitScore: number;
  summary: string;
  topMatches: JobMatch[];
  rawContent: string;
}

function extractNumber(text: string, patterns: RegExp[]): number {
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      const n = parseInt(m[1].replace(/,/g, ''), 10);
      if (!isNaN(n)) return n;
    }
  }
  return 0;
}

function extractFitScore(text: string, patterns: RegExp[]): number {
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!isNaN(n) && n >= 0 && n <= 100) return n;
    }
  }
  return 0;
}

function badgeForScore(score: number): JobMatch['badge'] {
  if (score >= 85) return 'High Fit';
  if (score >= 75) return 'Priority';
  return 'Review';
}

function parseJobMatchesFromMarkdown(content: string): JobMatch[] {
  const matches: JobMatch[] = [];

  // Strategy 1: look for table rows with fit scores
  // Pattern: | Job Title | Company | Score | ...
  const tableRowPattern = /\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(\d{2,3})%?\s*\|/g;
  let tableMatch;
  while ((tableMatch = tableRowPattern.exec(content)) !== null) {
    const [, col1, col2, score] = tableMatch;
    const fitScore = parseInt(score, 10);
    // Skip header rows
    if (col1.toLowerCase().includes('role') || col1.toLowerCase().includes('title') || col1.toLowerCase().includes('---')) continue;
    if (isNaN(fitScore) || fitScore < 50 || fitScore > 100) continue;
    if (matches.length >= 6) break;

    const company = col2.trim();
    const title = col1.trim();
    if (title.length < 3 || company.length < 2) continue;

    matches.push({
      title,
      company,
      region: content.toLowerCase().includes('edinburgh') ? 'Edinburgh' : 'UK',
      fitScore,
      summary: `${fitScore >= 85 ? 'Strong' : 'Good'} alignment with AI systems and engineering background.`,
      badge: badgeForScore(fitScore),
    });
  }

  if (matches.length >= 3) return matches.slice(0, 6);

  // Strategy 2: look for numbered/bulleted job listings with score patterns
  // e.g. "## 1. Senior AI Engineer at Acme Corp — 92%"
  const sectionPattern = /#{1,3}\s*\d*\.?\s*(.+?)\s+(?:at|@|—|-)\s+(.+?)\s*[—\-–]\s*(\d{2,3})%/g;
  let secMatch;
  while ((secMatch = sectionPattern.exec(content)) !== null) {
    const [, title, company, score] = secMatch;
    const fitScore = parseInt(score, 10);
    if (isNaN(fitScore) || fitScore < 50 || fitScore > 100) continue;
    if (matches.length >= 6) break;

    matches.push({
      title: title.trim(),
      company: company.trim(),
      region: content.toLowerCase().includes('edinburgh') ? 'Edinburgh' : 'UK',
      fitScore,
      summary: `${fitScore >= 85 ? 'Strong' : 'Good'} fit based on CV alignment.`,
      badge: badgeForScore(fitScore),
    });
  }

  if (matches.length >= 3) return matches.slice(0, 6);

  // Strategy 3: look for bold job titles followed by score on same/next line
  // **Senior AI Engineer** - 88%
  const boldPattern = /\*\*([^*]+)\*\*[^*\n]*?(?:at|@|–|-)\s*([^*\n]+?)(?:\n|[—\-–])\s*(?:FIT|Fit|fit|Score|score)?[:\s]*(\d{2,3})%/g;
  let boldMatch;
  while ((boldMatch = boldPattern.exec(content)) !== null) {
    const [, title, company, score] = boldMatch;
    const fitScore = parseInt(score, 10);
    if (isNaN(fitScore) || fitScore < 50 || fitScore > 100) continue;
    if (matches.length >= 6) break;

    matches.push({
      title: title.trim(),
      company: company.trim(),
      region: 'Edinburgh',
      fitScore,
      summary: `Identified as ${fitScore >= 85 ? 'high-priority' : 'relevant'} opportunity.`,
      badge: badgeForScore(fitScore),
    });
  }

  return matches.slice(0, 6);
}

export function parseReport(content: string, date: Date): ParsedReport {
  const lines = content.split('\n');

  // Title from first H1
  const titleLine = lines.find(l => l.startsWith('# '));
  const title = titleLine
    ? titleLine.replace(/^#\s+/, '').trim()
    : `AI Jobs Report — ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;

  // Region
  const isEdinburgh = /edinburgh/i.test(content);
  const isUK = /uk.?wide|united kingdom|nationwide/i.test(content);
  const region = isEdinburgh ? 'Edinburgh' : isUK ? 'UK' : 'Edinburgh';

  // Summary: first non-heading paragraph
  let summary = '';
  let inFirstPara = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      if (inFirstPara && summary) break;
      continue;
    }
    if (trimmed.startsWith('|') || trimmed.startsWith('```') || trimmed.startsWith('-')) {
      if (inFirstPara && summary) break;
      continue;
    }
    inFirstPara = true;
    summary += (summary ? ' ' : '') + trimmed;
    if (summary.length > 200) break;
  }
  if (!summary) summary = `AI job market intelligence scan for ${region}. Analysing opportunities against active CV profile.`;

  // Total jobs scanned
  const totalScanned = extractNumber(content, [
    /(\d+)\s+(?:jobs?|roles?|positions?|listings?)\s+(?:scanned|found|analysed|analyzed|reviewed|identified)/i,
    /(?:scanned|analysed|reviewed|found)\s+(\d+)\s+(?:jobs?|roles?|positions?)/i,
    /total[:\s]+(\d+)\s+(?:jobs?|roles?)/i,
    /(\d+)\s+total\s+(?:jobs?|roles?)/i,
  ]);

  // High fit count
  const highFitCount = extractNumber(content, [
    /(\d+)\s+high[\s-]fit/i,
    /high[\s-]fit[:\s]+(\d+)/i,
    /(\d+)\s+(?:strong|excellent)\s+(?:matches?|fits?)/i,
    /(?:strong|high)\s+matches?[:\s]+(\d+)/i,
  ]);

  // Top fit score
  const topFitScore = extractFitScore(content, [
    /top\s+fit[:\s]+(\d{2,3})%?/i,
    /highest?\s+(?:fit|score|match)[:\s]+(\d{2,3})%?/i,
    /best\s+(?:fit|score|match)[:\s]+(\d{2,3})%?/i,
    /(\d{2,3})%\s+fit/i,
    /fit[:\s]+(\d{2,3})%/i,
  ]);

  // Average fit
  const averageFitScore = extractFitScore(content, [
    /avg(?:erage)?\s+fit[:\s]+(\d{2,3})%?/i,
    /average\s+(?:fit|score|match)[:\s]+(\d{2,3})%?/i,
    /mean\s+(?:fit|score)[:\s]+(\d{2,3})%?/i,
  ]);

  // Job matches
  const topMatches = parseJobMatchesFromMarkdown(content);

  return {
    title,
    date,
    region,
    totalScanned,
    highFitCount,
    topFitScore,
    averageFitScore,
    summary,
    topMatches,
    rawContent: content,
  };
}
