import type { Report } from '../types/report';

interface MobileReportSwitcherProps {
  reports: Report[];
  currentReport: Report | null;
  onSelectReport: (slug: string) => void;
  isLoading?: boolean;
}

export function MobileReportSwitcher({
  reports,
  currentReport,
  onSelectReport,
  isLoading = false,
}: MobileReportSwitcherProps) {
  if (isLoading || reports.length === 0) return null;

  return (
    <div
      className="lg:hidden mb-5 pb-5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <label
        htmlFor="mobile-report-select"
        className="block font-manrope text-[10px] uppercase tracking-[0.18em] text-stone-600 mb-2"
      >
        Report
      </label>

      <div className="relative">
        <select
          id="mobile-report-select"
          value={currentReport?.slug ?? ''}
          onChange={(e) => onSelectReport(e.target.value)}
          className="w-full font-manrope text-sm text-stone-200 rounded-lg px-3 py-2.5 pr-8 appearance-none focus:outline-none focus:ring-1"
          style={{
            background: 'rgba(28,25,23,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            WebkitAppearance: 'none',
            colorScheme: 'dark',
          }}
        >
          {reports.map((report) => (
            <option key={report.id} value={report.slug}>
              {report.date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              {' - '}
              {report.region ?? 'Edinburgh'}
              {report.isLatest ? ' (latest)' : ''}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <div
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
          style={{ color: '#6b6560' }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {currentReport && (
        <p className="font-manrope text-[10px] text-stone-700 mt-1.5">
          {reports.length} report{reports.length !== 1 ? 's' : ''} available
          {currentReport.parsed?.topFitScore ? ` - top fit ${currentReport.parsed.topFitScore}%` : ''}
        </p>
      )}
    </div>
  );
}
