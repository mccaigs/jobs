import type { Report } from '../types/report';

interface HeroPanelProps {
  report: Report | null;
  isLoading?: boolean;
}

const PIPELINE_TAGS = [
  'AI Systems',
  'LLM Integration',
  'Workflow Orchestration',
  'Retrieval',
  'Python',
  'AI Architecture',
];

function formatRunDate(date: Date): string {
  const day = date.getDate();
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = day % 100;
  const suffix = suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0];
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  const year = date.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
}

export function HeroPanel({ report, isLoading = false }: HeroPanelProps) {
  const region = report?.parsed?.region || report?.region || 'Edinburgh';
  const summary = report?.parsed?.summary || 'Autonomous signal detection for AI, ML, LLM, data and systems roles across the UK market.';
  const runDate = report?.date ? formatRunDate(report.date) : null;

  return (
    <div
      className="col-span-12 lg:col-span-8 p-8 rounded-3xl relative overflow-hidden"
      style={{ background: 'rgba(28,25,23,0.4)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"
        style={{ background: 'rgba(212,165,116,0.06)' }}
      />

      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        {/* System emblem */}
        <div className="relative shrink-0">
          <div
            className="h-28 w-28 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.15), rgba(184,147,95,0.08))' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </div>
          <div
            className="absolute -bottom-2 -right-2 p-1.5 rounded-lg border"
            style={{ background: '#1c1917', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-stone-800 rounded-xl w-3/4" />
              <div className="h-4 bg-stone-800 rounded w-full" />
              <div className="flex gap-2 mt-4">
                {[1,2,3,4].map(i => <div key={i} className="h-6 bg-stone-800 rounded-full w-24" />)}
              </div>
            </div>
          ) : (
            <>
              <h1
                className="font-newsreader text-4xl lg:text-5xl italic tracking-tight text-white mb-1"
                style={{ lineHeight: 1.05 }}
              >
                AI Market Intelligence Engine
              </h1>
              <p className="font-manrope text-stone-400 text-base mb-2">
                Edinburgh and UK AI market scan matched against active CV
              </p>
              {/* Active scan metadata */}
              {runDate && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                  <span className="font-manrope text-xs text-stone-500 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Latest run: {runDate}
                  </span>
                  <span className="font-manrope text-xs text-stone-500 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    Region: {region}
                  </span>
                  <span className="font-manrope text-xs text-stone-500 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Source: repo markdown report
                  </span>
                </div>
              )}
              {report && (
                <p className="font-manrope text-stone-500 text-sm mb-5 leading-relaxed">
                  {summary.length > 180 ? summary.slice(0, 180) + '…' : summary}
                </p>
              )}
              {!report && (
                <p className="font-manrope text-stone-500 text-sm mb-5">
                  Autonomous signal detection for AI, ML, LLM, data and systems roles
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {PIPELINE_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full font-manrope text-stone-300 text-xs font-bold tracking-wider uppercase"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
