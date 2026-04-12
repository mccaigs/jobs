import type { Report } from '../types/report';

interface HeroPanelProps {
  report: Report | null;
  isLoading?: boolean;
}

export function HeroPanel({ report, isLoading = false }: HeroPanelProps) {
  const region = report?.parsed?.region || report?.region || 'Edinburgh';
  const runDate = report?.date
    ? report.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const summary = report?.parsed?.summary;

  return (
    <div className="lg:col-span-8 pt-1 pb-5 lg:pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-9 bg-stone-800/50 rounded w-2/3" />
          <div className="h-3 bg-stone-800/30 rounded w-1/3" />
        </div>
      ) : (
        <>
          <h1
            className="font-newsreader italic text-white mb-2"
            style={{ fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
          >
            AI Market Intelligence
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {runDate && (
              <span className="font-manrope text-xs text-stone-500">
                {runDate}
              </span>
            )}
            <span className="font-manrope text-xs text-stone-600">
              {region} · Edinburgh &amp; UK
            </span>
            <span className="font-manrope text-xs text-stone-700">
              David Robertson · AI Engineer
            </span>
          </div>

          {summary && (
            <p className="font-manrope text-stone-500 text-sm leading-relaxed mt-3 max-w-2xl">
              {summary.length > 200 ? summary.slice(0, 200) + '…' : summary}
            </p>
          )}
        </>
      )}
    </div>
  );
}
