import type { Report } from '../types/report';

interface SideNavBarProps {
  reports: Report[];
  activeReportId: string | null;
  onSelectReport: (slug: string) => void;
  isLoading?: boolean;
}


function IconRepo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
    </svg>
  );
}


export function SideNavBar({ reports, activeReportId, onSelectReport, isLoading = false }: SideNavBarProps) {
  return (
    <aside
      className="hidden lg:flex flex-col px-5 py-8 sticky shrink-0 w-56 xl:w-60"
      style={{
        top: '53px',
        height: 'calc(100vh - 53px)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Section label */}
      <div className="mb-6 px-2">
        <span className="font-manrope text-[10px] uppercase tracking-[0.18em] font-bold text-stone-600">
          Scan Archive
        </span>
      </div>

      {/* Report list */}
      <div className="flex flex-col gap-0.5 overflow-y-auto flex-1 pr-1">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="px-2 py-3 animate-pulse">
                <div className="h-2 bg-stone-800/60 rounded w-16 mb-2" />
                <div className="h-2.5 bg-stone-800/40 rounded w-28" />
              </div>
            ))
          : reports.map((report) => {
              const isActive = report.id === activeReportId;
              const p = report.parsed;
              return (
                <button
                  key={report.id}
                  onClick={() => onSelectReport(report.slug)}
                  className="w-full text-left px-2 py-2.5 rounded-lg transition-colors duration-150 relative group"
                  style={{
                    background: isActive ? 'rgba(212,165,116,0.06)' : 'transparent',
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-5"
                      style={{ background: '#d4a574' }}
                    />
                  )}
                  <div className="flex items-center justify-between mb-0.5 pl-1">
                    <time className={`font-manrope text-[10px] uppercase tracking-wider ${isActive ? 'text-stone-400' : 'text-stone-600 group-hover:text-stone-500'} transition-colors`}>
                      {report.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </time>
                    {report.isLatest && (
                      <span className="font-manrope text-[9px] uppercase tracking-wider" style={{ color: '#d4a574' }}>
                        New
                      </span>
                    )}
                  </div>
                  <div className={`font-manrope text-xs pl-1 truncate leading-snug ${isActive ? 'text-stone-200' : 'text-stone-500 group-hover:text-stone-300'} transition-colors`}>
                    {report.displayLabel ?? (p?.region ? `${p.region} Scan` : 'Edinburgh Scan')}
                  </div>
                  {p && p.topFitScore > 0 && (
                    <div className="font-manrope text-[10px] pl-1 mt-0.5" style={{ color: '#93d2d1' }}>
                      Top {p.topFitScore}%
                    </div>
                  )}
                </button>
              );
            })}
      </div>

      {/* Footer */}
      <div className="pt-5 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <a
          href="https://github.com/mccaigs/jobs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 py-1.5 font-manrope text-[10px] uppercase tracking-[0.12em] text-stone-600 hover:text-stone-400 transition-colors"
        >
          <IconRepo />
          Source Repo
        </a>
      </div>
    </aside>
  );
}
