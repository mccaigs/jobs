import { describe, it, expect } from 'vitest';
import { extractReportDate, extractReportDateMs } from './reportDate';

// Helper: build a UTC date string for comparison
function utcDate(year: number, month: number, day: number): Date {
  return new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
}

describe('extractReportDate', () => {
  // ── DD-MM-YYYY variants ───────────────────────────────────────────────────
  it('parses 01-04-2026-jobs.md as 1 April 2026', () => {
    const d = extractReportDate('01-04-2026-jobs.md');
    expect(d).toEqual(utcDate(2026, 4, 1));
  });

  it('parses 25-03-2026-jobs.md as 25 March 2026', () => {
    const d = extractReportDate('25-03-2026-jobs.md');
    expect(d).toEqual(utcDate(2026, 3, 25));
  });

  it('parses 31-03-2026-jobs.md as 31 March 2026', () => {
    const d = extractReportDate('31-03-2026-jobs.md');
    expect(d).toEqual(utcDate(2026, 3, 31));
  });

  // ── YYYY-MM-DD variants ───────────────────────────────────────────────────
  it('parses 2026-03-23-jobs.md as 23 March 2026', () => {
    const d = extractReportDate('2026-03-23-jobs.md');
    expect(d).toEqual(utcDate(2026, 3, 23));
  });

  it('parses 2026-03-24-jobs.md as 24 March 2026', () => {
    const d = extractReportDate('2026-03-24-jobs.md');
    expect(d).toEqual(utcDate(2026, 3, 24));
  });

  // ── UK-AI-DailyJobSearch variants (DD-MM-YYYY embedded) ──────────────────
  it('parses UK-AI-DailyJobSearch-01-04-2026-jobs.md as 1 April 2026', () => {
    const d = extractReportDate('UK-AI-DailyJobSearch-01-04-2026-jobs.md');
    expect(d).toEqual(utcDate(2026, 4, 1));
  });

  it('parses UK-AI-DailyJobSearch-12-04-2026-jobs.md as 12 April 2026', () => {
    const d = extractReportDate('UK-AI-DailyJobSearch-12-04-2026-jobs.md');
    expect(d).toEqual(utcDate(2026, 4, 12));
  });

  it('parses UK-AI-DailyJobSearch-25-03-2026-jobs.md as 25 March 2026', () => {
    const d = extractReportDate('UK-AI-DailyJobSearch-25-03-2026-jobs.md');
    expect(d).toEqual(utcDate(2026, 3, 25));
  });

  it('parses UK-AI-DailyJobSearch-30-03-2026-jobs.md as 30 March 2026', () => {
    const d = extractReportDate('UK-AI-DailyJobSearch-30-03-2026-jobs.md');
    expect(d).toEqual(utcDate(2026, 3, 30));
  });

  // ── DD-MM-YYYY must not be confused with YYYY-MM-DD ──────────────────────
  it('does NOT parse 01-04-2026 as year=0104 (DD-MM-YYYY is tried first)', () => {
    const d = extractReportDate('01-04-2026-jobs.md');
    // Correct: April 1 2026 — NOT some nonsense date from treating 0104 as a year
    expect(d?.getFullYear()).toBe(2026);
    expect(d?.getMonth()).toBe(3); // 0-indexed → April
    expect(d?.getDate()).toBe(1);
  });

  // ── Directory-prefixed paths ──────────────────────────────────────────────
  it('strips directory prefix before parsing', () => {
    const d = extractReportDate('reports/01-04-2026-jobs.md');
    expect(d).toEqual(utcDate(2026, 4, 1));
  });

  it('strips nested directory prefix', () => {
    const d = extractReportDate('archive/2026/2026-03-23-jobs.md');
    expect(d).toEqual(utcDate(2026, 3, 23));
  });

  // ── Unparseable filenames ─────────────────────────────────────────────────
  it('returns null for README.md', () => {
    expect(extractReportDate('README.md')).toBeNull();
  });

  it('returns null for a filename with no date pattern', () => {
    expect(extractReportDate('design.md')).toBeNull();
  });

  // ── Sorting correctness ───────────────────────────────────────────────────
  it('12-04-2026 sorts after 01-04-2026', () => {
    const a = extractReportDate('UK-AI-DailyJobSearch-12-04-2026-jobs.md')!;
    const b = extractReportDate('01-04-2026-jobs.md')!;
    expect(a.getTime()).toBeGreaterThan(b.getTime());
  });

  it('2026-03-23 sorts before 01-04-2026', () => {
    const a = extractReportDate('2026-03-23-jobs.md')!;
    const b = extractReportDate('01-04-2026-jobs.md')!;
    expect(a.getTime()).toBeLessThan(b.getTime());
  });
});

describe('extractReportDateMs', () => {
  it('returns timestamp ms for a valid filename', () => {
    const ms = extractReportDateMs('2026-03-23-jobs.md');
    expect(ms).toBe(utcDate(2026, 3, 23).getTime());
  });

  it('returns 0 for an unparseable filename', () => {
    expect(extractReportDateMs('README.md')).toBe(0);
  });
});
