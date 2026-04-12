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
      className="lg:col-span-4 pt-5 lg:pt-1 pb-5 lg:pb-6 flex flex-col justify-between"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', borderTop: 'none' }}
    >
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-3 bg-stone-800/50 rounded w-20" />
          <div className="h-8 bg-stone-800/40 rounded w-1/2" />
          <div className="space-y-2 mt-4">
            <div className="h-1.5 bg-stone-800/30 rounded" />
            <div className="h-1.5 bg-stone-800/30 rounded" />
          </div>
        </div>
      ) : (
        <>
          <div>
            <div className="font-manrope text-[10px] uppercase tracking-[0.18em] text-stone-600 mb-2">
              Signal
            </div>
            {topFit > 0 ? (
              <>
                <div className="font-newsreader text-3xl italic mb-0.5" style={{ color: '#d4a574' }}>
                  {topFit}%
                </div>
                <p className="font-manrope text-stone-600 text-xs">
                  Top FIT · active CV
                </p>
              </>
            ) : (
              <>
                <div className="font-newsreader text-3xl italic mb-0.5" style={{ color: '#2e2b28' }}>
                  -
                </div>
                <p className="font-manrope text-stone-700 text-xs">
                  No fit score in this report
                </p>
              </>
            )}
          </div>

          <div className="mt-5 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between font-manrope text-[10px] text-stone-600">
                <span>Scanned</span>
                <span className="text-stone-400">{totalScanned > 0 ? totalScanned : '-'}</span>
              </div>
              <ProgressBar value={scannedPct} color="#c8863a" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-manrope text-[10px] text-stone-600">
                <span>High-fit</span>
                <span className="text-stone-400">{highFitCount > 0 ? highFitCount : '-'}</span>
              </div>
              <ProgressBar
                value={highFitCount > 0 && totalScanned > 0 ? (highFitCount / totalScanned) * 100 : 0}
                color="#93d2d1"
              />
            </div>

            {avgFit > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between font-manrope text-[10px] text-stone-600">
                  <span>Average FIT</span>
                  <span className="text-stone-400">{avgFit}%</span>
                </div>
                <ProgressBar value={avgFit} color="#6b5d4a" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
