/**
 * Shared utility for extracting a normalised Date from a job report filename.
 *
 * Handles all filename variants used in mccaigs/jobs:
 *   2026-03-23-jobs.md          → YYYY-MM-DD (ISO)
 *   01-04-2026-jobs.md          → DD-MM-YYYY
 *   25-03-2026-jobs.md          → DD-MM-YYYY
 *   UK-AI-DailyJobSearch-01-04-2026-jobs.md  → DD-MM-YYYY embedded
 *   UK-AI-DailyJobSearch-12-04-2026-jobs.md  → DD-MM-YYYY embedded
 *
 * Returns null if no date can be parsed (caller should fall back gracefully).
 *
 * IMPORTANT: DD-MM-YYYY must be tested BEFORE YYYY-MM-DD because a string
 * like "01-04-2026" would be incorrectly swallowed by a greedy YYYY match
 * if the regex engine finds "4-20" and tries to treat it as a year prefix.
 * We prevent this by requiring the 4-digit group to be at position [0] for
 * ISO format, while DD-MM-YYYY requires the 4-digit year to come LAST.
 */
export function extractReportDate(fileName: string): Date | null {
  // Strip any leading directory path (e.g. "reports/01-04-2026-jobs.md" → "01-04-2026-jobs.md")
  const baseName = fileName.includes('/') ? fileName.split('/').pop()! : fileName;

  // 1. DD-MM-YYYY: matches "01-04-2026", "25-03-2026", etc.
  //    Require that the year (4 digits) is preceded by two 2-digit groups.
  //    Use word boundaries / non-digit anchors to avoid partial matches.
  const ddmmyyyyMatch = baseName.match(/(?:^|[^0-9])(\d{2})-(\d{2})-(\d{4})(?:[^0-9]|$)/);
  if (ddmmyyyyMatch) {
    const [, dd, mm, yyyy] = ddmmyyyyMatch;
    const d = new Date(`${yyyy}-${mm}-${dd}`);
    if (!isNaN(d.getTime())) return d;
  }

  // 2. YYYY-MM-DD: matches "2026-03-23", "2026-03-24", etc.
  const isoMatch = baseName.match(/(?:^|[^0-9])(\d{4})-(\d{2})-(\d{2})(?:[^0-9]|$)/);
  if (isoMatch) {
    const [, yyyy, mm, dd] = isoMatch;
    const d = new Date(`${yyyy}-${mm}-${dd}`);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

/**
 * Same as extractReportDate but returns a unix timestamp (ms),
 * suitable for storing in Convex as a number field.
 * Returns 0 if no date found (sorts to the bottom).
 */
export function extractReportDateMs(fileName: string): number {
  const d = extractReportDate(fileName);
  return d ? d.getTime() : 0;
}
