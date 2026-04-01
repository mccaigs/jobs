import type { Report } from '../types/report';

interface SideNavBarProps {
  reports: Report[];
  activeReportId: string | null;
  onSelectReport: (slug: string) => void;
  isLoading?: boolean;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
}

function IconFeed() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  );
}

function IconHistory() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 8 12 12 14 14"/>
      <path d="M3.05 11a9 9 0 1 0 .5-4"/>
      <polyline points="3 3 3 7 7 7"/>
    </svg>
  );
}

function IconScan() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function IconMatch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}

function IconRepo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
    </svg>
  );
}

function IconCV() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function IconSettings() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

const mainNavItems: NavItem[] = [
  { label: 'Intelligence Feed', icon: <IconFeed /> },
  { label: 'Edinburgh Scan', icon: <IconScan /> },
  { label: 'UK Scan', icon: <IconScan /> },
  { label: 'Recent Activity', icon: <IconHistory /> },
  { label: 'Match Signals', icon: <IconMatch /> },
];

export function SideNavBar({ reports, activeReportId, onSelectReport, isLoading = false }: SideNavBarProps) {
  return (
    <aside className="hidden lg:flex flex-col p-6 gap-y-4 sticky top-[65px] w-72 shrink-0"
      style={{
        height: 'calc(100vh - 65px)',
        background: 'rgba(28,25,23,0.5)',
        borderRadius: '0 1rem 1rem 0',
      }}>
      {/* Brand identity */}
      <div className="mb-6">
        <h3 className="font-newsreader italic text-xl text-primary">Intelligence Feed</h3>
        <p className="font-manrope text-[10px] tracking-[0.15em] uppercase font-bold text-stone-500 mt-1">
          David Robertson · AI Jobs
        </p>
      </div>

      {/* Main nav */}
      <nav className="flex flex-col gap-1">
        {mainNavItems.map((item) => (
          <a
            key={item.label}
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-primary hover:translate-x-1 transition-all duration-200 group rounded-lg"
          >
            <span className="group-hover:text-primary text-stone-500 transition-colors shrink-0">
              {item.icon}
            </span>
            <span className="font-manrope text-xs tracking-wide uppercase font-bold">
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Report archive — compact intelligence summaries */}
      {(isLoading || reports.length > 0) && (
        <div className="mt-2">
          <div className="px-4 mb-2">
            <span className="font-manrope text-[10px] tracking-[0.15em] uppercase font-bold text-stone-600">
              Scan Archive
            </span>
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto max-h-[260px] scrollbar-thin pr-1">
            {isLoading
              ? [1, 2, 3].map((i) => (
                  <div key={i} className="mx-1 p-3 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="h-2.5 bg-stone-800 rounded w-24 mb-2" />
                    <div className="h-2 bg-stone-800 rounded w-full mb-1" />
                    <div className="h-2 bg-stone-800 rounded w-3/4" />
                  </div>
                ))
              : reports.map((report) => {
                  const isActive = report.id === activeReportId;
                  const p = report.parsed;
                  return (
                    <button
                      key={report.id}
                      onClick={() => onSelectReport(report.slug)}
                      className={`
                        w-full text-left mx-1 p-3 rounded-xl transition-all duration-200 relative group
                        ${isActive
                          ? 'text-on_surface'
                          : 'text-stone-400 hover:text-stone-200'}
                      `}
                      style={{
                        background: isActive
                          ? 'rgba(212,165,116,0.08)'
                          : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r"
                          style={{ background: '#d4a574' }}
                        />
                      )}
                      <div className="flex items-center justify-between mb-1">
                        <time className={`font-manrope text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-stone-500'}`}>
                          {report.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </time>
                        {report.isLatest && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(212,165,116,0.15)', color: '#d4a574' }}>
                            New
                          </span>
                        )}
                      </div>

                      <div className="font-manrope text-xs font-semibold mb-1.5 truncate">
                        {report.displayLabel ?? (p?.region ? `${p.region} Scan` : 'Edinburgh Scan')}
                      </div>

                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        {p && p.totalScanned > 0 && (
                          <span className="font-manrope text-[10px] text-stone-500">
                            {p.totalScanned} scanned
                          </span>
                        )}
                        {p && p.highFitCount > 0 && (
                          <span className="font-manrope text-[10px] text-stone-500">
                            {p.highFitCount} high-fit
                          </span>
                        )}
                        {p && p.topFitScore > 0 && (
                          <span className="font-manrope text-[10px]" style={{ color: '#93d2d1' }}>
                            Top {p.topFitScore}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
          </div>
        </div>
      )}

      {/* Bottom utility section */}
      <div className="mt-auto pt-6 border-t border-stone-800/30">
        <div className="flex flex-col gap-1">
          <a
            href="https://github.com/mccaigs/jobs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2 text-stone-500 hover:text-stone-300 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <span className="text-stone-600"><IconRepo /></span>
            Source Repo
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-stone-500 hover:text-stone-300 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <span className="text-stone-600"><IconCV /></span>
            Active CV
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-stone-500 hover:text-stone-300 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <span className="text-stone-600"><IconSettings /></span>
            Settings
          </a>
        </div>
      </div>
    </aside>
  );
}
