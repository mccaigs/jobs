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


function SkeletonItem() {
  return (
    <div className="flex items-center justify-between py-3.5 animate-pulse" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex-1">
        <div className="h-3 bg-stone-800/60 rounded w-48 mb-2" />
        <div className="h-2.5 bg-stone-800/40 rounded w-32" />
      </div>
      <div className="flex items-center gap-5 shrink-0">
        <div className="h-3 bg-stone-800/40 rounded w-10" />
        <div className="h-4 bg-stone-800/30 rounded-full w-16" />
      </div>
    </div>
  );
}

function MatchItem({ match }: { match: JobMatch; index: number }) {
  const badgeStyle = BADGE_STYLES[match.badge] ?? BADGE_STYLES['Review'];
  const scoreColor = fitScoreColor(match.fitScore);

  return (
    <div
      className="group flex items-center justify-between py-3.5 transition-colors duration-150 cursor-default"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="flex-1 min-w-0 pr-6">
        <div className="font-manrope text-sm text-stone-200 mb-0.5 truncate">
          {match.title}
        </div>
        <div className="font-manrope text-xs text-stone-600">
          {match.company}{match.region ? ` · ${match.region}` : ''}
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <span className="font-manrope font-semibold text-sm tabular-nums" style={{ color: scoreColor }}>
          {match.fitScore}%
        </span>
        <span
          className="px-2.5 py-0.5 rounded font-manrope text-[10px] font-bold uppercase tracking-wider"
          style={badgeStyle}
        >
          {match.badge}
        </span>
      </div>
    </div>
  );
}


function ScanSummaryBlock({ report }: { report: Report }) {
  const p = report.parsed;
  if (!p) return null;

  const items: { label: string; value: string; color?: string }[] = [];
  if (p.totalScanned > 0) items.push({ label: 'Scanned', value: `${p.totalScanned}` });
  if (p.highFitCount > 0) items.push({ label: 'High-fit', value: `${p.highFitCount}`, color: '#93d2d1' });
  if (p.topFitScore > 0) items.push({ label: 'Top FIT', value: `${p.topFitScore}%`, color: '#d4a574' });
  if (p.averageFitScore > 0) items.push({ label: 'Avg FIT', value: `${p.averageFitScore}%` });
  if (p.region) items.push({ label: 'Region', value: p.region });

  if (items.length === 0) return null;

  return (
    <div className="mt-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {items.map(({ label, value, color }) => (
          <div key={label}>
            <div className="font-manrope text-[10px] text-stone-700 mb-0.5">{label}</div>
            <div className="font-manrope text-xs font-semibold" style={{ color: color ?? '#6b6560' }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopMatchesList({ report, isLoading = false }: TopMatchesListProps) {
  const matches = report?.parsed?.topMatches;
  const hasRealMatches = matches && matches.length > 0;
  const displayMatches = hasRealMatches ? matches : [];

  return (
    <div className="col-span-12 xl:col-span-8">
      <div className="flex justify-between items-baseline mb-1">
        <h2 className="font-newsreader text-2xl italic text-white">
          Top Matches
        </h2>
        <a
          href="https://github.com/mccaigs/jobs"
          target="_blank"
          rel="noopener noreferrer"
          className="font-manrope text-[10px] uppercase tracking-[0.12em] text-stone-600 hover:text-stone-400 transition-colors"
        >
          View source
        </a>
      </div>

      <div>
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
              <p className="font-manrope text-stone-600 text-xs py-4">
                No structured matches found in this report.
              </p>
            )
        }
      </div>
    </div>
  );
}
