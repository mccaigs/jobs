import type { Report } from '../types/report';

interface MarketSignalCardProps {
  report: Report | null;
  isLoading?: boolean;
}

function ProgressBar({ value, color = '#c8863a' }: { value: number; color?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export function MarketSignalCard({ report, isLoading = false }: MarketSignalCardProps) {
  const p = report?.parsed;

  const topFit = p?.topFitScore || 0;
  const totalScanned = p?.totalScanned || 0;
  const highFitCount = p?.highFitCount || 0;
  const avgFit = p?.averageFitScore || 0;

  const scannedPct = totalScanned > 0 ? Math.min(100, (totalScanned / 200) * 100) : 0;

  return (
    <div
      className="col-span-12 lg:col-span-4 p-8 rounded-3xl border flex flex-col justify-between"
      style={{
        background: 'rgb(17,15,14)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-3 bg-stone-800 rounded w-28" />
          <div className="h-10 bg-stone-800 rounded w-1/2" />
          <div className="h-3 bg-stone-800 rounded w-3/4" />
          <div className="space-y-4 mt-8">
            <div className="h-2 bg-stone-800 rounded" />
            <div className="h-1 bg-stone-800 rounded" />
            <div className="h-2 bg-stone-800 rounded" />
            <div className="h-1 bg-stone-800 rounded" />
          </div>
        </div>
      ) : (
        <>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span
                className="font-manrope text-[10px] font-bold tracking-[0.2em] uppercase"
                style={{ color: '#c8863a' }}
              >
                Market Signal
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-600">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>

            {topFit > 0 ? (
              <>
                <div className="font-newsreader text-4xl italic text-white mb-1">
                  {topFit}%
                </div>
                <p className="text-stone-500 text-sm font-manrope">
                  Top FIT score · based on active CV profile
                </p>
              </>
            ) : (
              <>
                <div className="font-newsreader text-4xl italic mb-1" style={{ color: '#3d3935' }}>
                  —
                </div>
                <p className="text-stone-600 text-sm font-manrope">
                  Loading latest scan data…
                </p>
              </>
            )}
          </div>

          <div className="mt-8 space-y-4">
            {/* Jobs Scanned */}
            <div className="flex justify-between items-end text-xs font-bold uppercase tracking-tighter text-stone-400 font-manrope">
              <span>Jobs Scanned</span>
              <span className="text-white">{totalScanned > 0 ? totalScanned : '—'}</span>
            </div>
            <ProgressBar value={scannedPct} color="#c8863a" />

            {/* High-Fit Roles */}
            <div className="flex justify-between items-end text-xs font-bold uppercase tracking-tighter text-stone-400 font-manrope">
              <span>High-Fit Roles</span>
              <span className="text-white">{highFitCount > 0 ? highFitCount : '—'}</span>
            </div>
            <ProgressBar
              value={highFitCount > 0 && totalScanned > 0 ? (highFitCount / totalScanned) * 100 : 0}
              color="#93d2d1"
            />

            {/* Average FIT */}
            {avgFit > 0 && (
              <>
                <div className="flex justify-between items-end text-xs font-bold uppercase tracking-tighter text-stone-400 font-manrope">
                  <span>Average FIT</span>
                  <span className="text-white">{avgFit}%</span>
                </div>
                <ProgressBar value={avgFit} color="#8b7355" />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
