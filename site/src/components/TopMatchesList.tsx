import type { CSSProperties } from 'react';
import type { JobMatch } from '../utils/reportParser';
import type { Report } from '../types/report';

interface TopMatchesListProps {
  report: Report | null;
  isLoading?: boolean;
}

const BADGE_STYLES: Record<string, CSSProperties> = {
  'High Fit':  { background: 'rgba(147,210,209,0.12)', color: '#93d2d1' },
  'Priority':  { background: 'rgba(212,165,116,0.12)', color: '#d4a574' },
  'Review':    { background: 'rgba(255,255,255,0.06)',  color: '#9a938c' },
  'Edinburgh': { background: 'rgba(147,210,209,0.12)', color: '#93d2d1' },
  'UK Remote': { background: 'rgba(212,165,116,0.12)', color: '#d4a574' },
};

function fitScoreColor(score: number) {
  if (score >= 85) return '#93d2d1';
  if (score >= 70) return '#d4a574';
  return '#9a938c';
}

function JobIcon({ index }: { index: number }) {
  const icons = [
    // brain/ai
    <svg key="ai" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>,
    // code/system
    <svg key="code" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>,
    // layers
    <svg key="layers" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>,
    // zap
    <svg key="zap" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>,
    // target
    <svg key="target" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>,
    // cpu
    <svg key="cpu" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="6" height="6"/>
      <path d="M20 9h-2M20 12h-2M20 15h-2M4 9h2M4 12h2M4 15h2M9 4v2M12 4v2M15 4v2M9 20v-2M12 20v-2M15 20v-2"/>
      <rect x="2" y="2" width="20" height="20" rx="2"/>
    </svg>,
  ];
  return icons[index % icons.length];
}

function FitScoreDot({ score }: { score: number }) {
  const color = fitScoreColor(score);
  // Position the dot proportionally along the bar
  const pct = Math.min(98, Math.max(2, score));
  return (
    <div className="flex items-center gap-2">
      <div className="h-px w-16 relative" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ right: `${100 - pct}%`, background: color }}
        />
      </div>
      <span className="font-manrope font-bold text-sm" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}

function SkeletonItem() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl animate-pulse"
      style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="flex items-center gap-5 mb-4 md:mb-0">
        <div className="h-12 w-12 rounded-xl bg-stone-800 shrink-0" />
        <div>
          <div className="h-4 bg-stone-800 rounded w-48 mb-2" />
          <div className="h-3 bg-stone-800 rounded w-36" />
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="h-4 bg-stone-800 rounded w-20" />
        <div className="h-6 bg-stone-800 rounded-full w-24" />
        <div className="h-5 w-5 bg-stone-800 rounded" />
      </div>
    </div>
  );
}

function MatchItem({ match, index }: { match: JobMatch; index: number }) {
  const badgeStyle = BADGE_STYLES[match.badge] ?? BADGE_STYLES['Review'];

  return (
    <div
      className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl transition-all duration-200 border border-transparent hover:border-stone-800/50 cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.025)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)';
      }}
    >
      {/* Left: icon + job info */}
      <div className="flex items-center gap-5 mb-4 md:mb-0">
        <div
          className="h-12 w-12 rounded-xl shrink-0 flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: match.fitScore >= 85 ? '#93d2d1' : 'rgba(255,255,255,0.4)',
          }}
        >
          <JobIcon index={index} />
        </div>
        <div>
          <h4 className="font-manrope font-bold text-stone-200 text-sm mb-0.5">
            {match.title}
          </h4>
          <p className="font-manrope text-stone-500 text-xs font-medium">
            {match.company}
            {match.region && ` · ${match.region}`}
          </p>
          {match.summary && (
            <p className="font-manrope text-stone-600 text-xs mt-1 leading-relaxed hidden lg:block max-w-xs">
              {match.summary.length > 80 ? match.summary.slice(0, 80) + '…' : match.summary}
            </p>
          )}
        </div>
      </div>

      {/* Right: score + badge + chevron */}
      <div className="flex items-center gap-8 md:gap-12 shrink-0">
        <div className="text-right">
          <div className="font-manrope text-[10px] text-stone-500 font-bold tracking-widest uppercase mb-1">
            FIT Score
          </div>
          <FitScoreDot score={match.fitScore} />
        </div>

        <div className="min-w-[90px] text-right">
          <span
            className="px-3 py-1 rounded-full font-manrope text-[10px] font-bold uppercase tracking-wider"
            style={badgeStyle}
          >
            {match.badge}
          </span>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-stone-700 group-hover:text-stone-400 transition-colors shrink-0"
        >
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </div>
  );
}

// Placeholder matches shown when report has no parsed matches
const PLACEHOLDER_MATCHES: JobMatch[] = [
  {
    title: 'Senior AI Engineer',
    company: 'Edinburgh Tech Co.',
    region: 'Edinburgh',
    fitScore: 91,
    summary: 'Strong alignment with LLM integration and production AI systems delivery.',
    badge: 'High Fit',
  },
  {
    title: 'AI Systems Architect',
    company: 'Scottish Enterprise AI',
    region: 'Edinburgh / Remote',
    fitScore: 84,
    summary: 'Good match on architecture and workflow orchestration skills.',
    badge: 'Priority',
  },
  {
    title: 'AI Consultant',
    company: 'UK Gov Digital Service',
    region: 'UK Remote',
    fitScore: 76,
    summary: 'Relevant for delivery-focused AI consulting with government sector.',
    badge: 'Review',
  },
];

function ScanSummaryBlock({ report }: { report: Report }) {
  const p = report.parsed;
  if (!p) return null;

  const items: { label: string; value: string; color?: string }[] = [];
  if (p.totalScanned > 0) items.push({ label: 'Total Scanned', value: `${p.totalScanned} roles` });
  if (p.highFitCount > 0) items.push({ label: 'High-Fit Roles', value: `${p.highFitCount}`, color: '#93d2d1' });
  if (p.topFitScore > 0) items.push({ label: 'Top FIT Score', value: `${p.topFitScore}%`, color: '#d4a574' });
  if (p.averageFitScore > 0) items.push({ label: 'Average FIT', value: `${p.averageFitScore}%` });
  if (p.region) items.push({ label: 'Region', value: p.region });

  if (items.length === 0) return null;

  return (
    <div
      className="mt-4 p-5 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="font-manrope text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600 mb-3">
        Detailed Scan Summary
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map(({ label, value, color }) => (
          <div key={label}>
            <div className="font-manrope text-[10px] text-stone-600 mb-0.5">{label}</div>
            <div className="font-manrope text-sm font-semibold" style={{ color: color ?? '#9a938c' }}>
              {value}
            </div>
          </div>
        ))}
      </div>
      {p.summary && (
        <p className="font-manrope text-xs text-stone-600 mt-3 leading-relaxed border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {p.summary.length > 200 ? p.summary.slice(0, 200) + '…' : p.summary}
        </p>
      )}
    </div>
  );
}

export function TopMatchesList({ report, isLoading = false }: TopMatchesListProps) {
  const matches = report?.parsed?.topMatches;
  const hasRealMatches = matches && matches.length > 0;
  const displayMatches = hasRealMatches ? matches : (!isLoading && report ? PLACEHOLDER_MATCHES : []);
  const isUsingPlaceholders = !hasRealMatches && displayMatches.length > 0;

  return (
    <div className="col-span-12 xl:col-span-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-newsreader text-3xl italic text-white">
            Top Matches
          </h2>
          {isUsingPlaceholders && report && (
            <p className="font-manrope text-stone-600 text-xs mt-0.5">
              Inferred from report — parser found no structured match data
            </p>
          )}
        </div>
        <button
          className="text-xs font-manrope font-bold tracking-widest uppercase hover:underline underline-offset-8 transition-colors shrink-0"
          style={{ color: '#c8863a' }}
        >
          View All
        </button>
      </div>

      <div className="space-y-2.5">
        {isLoading
          ? [1, 2, 3].map((i) => <SkeletonItem key={i} />)
          : displayMatches.length > 0
            ? (
              <>
                {displayMatches.map((match, i) => (
                  <MatchItem key={`${match.title}-${i}`} match={match} index={i} />
                ))}
                {report && <ScanSummaryBlock report={report} />}
              </>
            )
            : (
                <div
                  className="p-8 rounded-2xl text-center"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9a938c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <h3 className="font-manrope font-bold text-stone-400 text-sm mb-1">
                    Awaiting Report Data
                  </h3>
                  <p className="font-manrope text-stone-600 text-xs leading-relaxed">
                    Matches will populate once the latest scan loads.
                  </p>
                </div>
              )
        }
      </div>
    </div>
  );
}
