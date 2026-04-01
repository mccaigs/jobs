import { useState } from 'react';
import type { Report } from '../types/report';

interface ReportIndexRailProps {
  reports: Report[];
  activeReportId: string | null;
  onSelectReport: (slug: string) => void;
  isLoading?: boolean;
}

function IconReport() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

function IconChevron() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

function IconSignal() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}

function IconCV() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function IconEngine() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  );
}

function ReportSkeletonItem() {
  return (
    <div className="p-3.5 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="h-2 bg-stone-800 rounded w-20 mb-2" />
      <div className="h-3 bg-stone-800 rounded w-28 mb-2" />
      <div className="flex gap-3">
        <div className="h-2 bg-stone-800 rounded w-16" />
        <div className="h-2 bg-stone-800 rounded w-12" />
      </div>
    </div>
  );
}

export function ReportIndexRail({
  reports,
  activeReportId,
  onSelectReport,
  isLoading = false,
}: ReportIndexRailProps) {
  const [cvExpanded, setCvExpanded] = useState(false);
  const activeReport = reports.find(r => r.id === activeReportId) ?? reports[0] ?? null;

  const coreStrengths = [
    'LLM Integration',
    'Workflow Automation',
    'Retrieval Pipelines',
    'Backend Systems',
    'SaaS AI Delivery',
    'Python / TypeScript',
  ];

  return (
    <div className="col-span-12 xl:col-span-4 space-y-4">

      {/* ── CURRENT SCAN ── */}
      <div
        className="p-5 rounded-2xl border"
        style={{ background: 'rgba(28,25,23,0.7)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span style={{ color: '#c8863a' }}><IconSignal /></span>
          <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
            Current Scan
          </span>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-stone-800 rounded w-3/4" />
            <div className="h-3 bg-stone-800 rounded w-1/2" />
          </div>
        ) : activeReport ? (
          <>
            <div className="font-newsreader text-white text-xl italic mb-1 leading-tight">
              {activeReport.displayLabel ?? activeReport.title}
            </div>
            <div className="font-manrope text-stone-500 text-xs">
              {activeReport.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            {activeReport.parsed && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {activeReport.parsed.totalScanned > 0 && (
                  <span className="font-manrope text-[10px] text-stone-500">
                    {activeReport.parsed.totalScanned} scanned
                  </span>
                )}
                {activeReport.parsed.highFitCount > 0 && (
                  <span className="font-manrope text-[10px]" style={{ color: '#93d2d1' }}>
                    {activeReport.parsed.highFitCount} high-fit
                  </span>
                )}
                {activeReport.parsed.topFitScore > 0 && (
                  <span className="font-manrope text-[10px]" style={{ color: '#d4a574' }}>
                    Top {activeReport.parsed.topFitScore}%
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="font-manrope text-stone-500 text-sm">No scan loaded</div>
        )}
      </div>

      {/* ── AVAILABLE REPORTS ── */}
      <div
        className="p-5 rounded-2xl border"
        style={{ background: 'rgba(28,25,23,0.5)', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span style={{ color: '#c8863a' }}><IconReport /></span>
          <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
            Available Reports
          </span>
        </div>

        <div className="space-y-1.5">
          {isLoading
            ? [1, 2, 3].map(i => <ReportSkeletonItem key={i} />)
            : reports.length === 0
              ? (
                <p className="font-manrope text-stone-600 text-xs py-2">
                  No reports found in repository.
                </p>
              )
              : reports.map(report => {
                  const isActive = report.id === activeReportId;
                  const p = report.parsed;
                  return (
                    <button
                      key={report.id}
                      onClick={() => onSelectReport(report.slug)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 relative group ${
                        isActive ? '' : 'hover:bg-white/3'
                      }`}
                      style={{
                        background: isActive ? 'rgba(212,165,116,0.09)' : 'transparent',
                      }}
                    >
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                          style={{ background: '#d4a574' }}
                        />
                      )}

                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span
                          className="font-manrope text-xs font-semibold leading-tight"
                          style={{ color: isActive ? '#e8d5b8' : '#9a938c' }}
                        >
                          {report.displayLabel ?? report.title}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          {report.isLatest && (
                            <span
                              className="font-manrope text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={{ background: 'rgba(212,165,116,0.15)', color: '#d4a574' }}
                            >
                              New
                            </span>
                          )}
                          <span className={`transition-colors ${isActive ? 'text-stone-400' : 'text-stone-700 group-hover:text-stone-500'}`}>
                            <IconChevron />
                          </span>
                        </div>
                      </div>

                      {p ? (
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                          {p.totalScanned > 0 && (
                            <span className="font-manrope text-[10px] text-stone-600">
                              {p.totalScanned} scanned
                            </span>
                          )}
                          {p.highFitCount > 0 && (
                            <span className="font-manrope text-[10px] text-stone-500">
                              {p.highFitCount} high-fit
                            </span>
                          )}
                          {p.topFitScore > 0 && (
                            <span className="font-manrope text-[10px]" style={{ color: '#93d2d1' }}>
                              Top {p.topFitScore}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="font-manrope text-[10px] text-stone-700">
                          {report.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </button>
                  );
                })}
        </div>
      </div>

      {/* ── ACTIVE CV PROFILE ── */}
      <div
        className="p-5 rounded-2xl border group hover:border-white/10 transition-all duration-300"
        style={{ background: 'rgba(17,15,14,0.8)', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setCvExpanded(v => !v)}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: '#c8863a' }}><IconCV /></span>
            <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
              Active CV Profile
            </span>
          </div>
          <span className={`text-stone-600 transition-transform duration-200 ${cvExpanded ? 'rotate-90' : ''}`}>
            <IconChevron />
          </span>
        </button>

        <div className="mt-3">
          <div className="font-manrope text-stone-200 text-sm font-semibold">David Robertson</div>
          <div className="font-manrope text-stone-500 text-xs mt-0.5">AI Engineer · AI Systems Architect · Contract</div>
          <div className="font-manrope text-stone-600 text-xs mt-0.5">Edinburgh, UK</div>
        </div>

        {cvExpanded && (
          <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div>
              <div className="font-manrope text-[10px] text-stone-600 uppercase tracking-widest mb-2">Core Strengths</div>
              <div className="flex flex-wrap gap-x-0.5 gap-y-0.5">
                {coreStrengths.map(s => (
                  <span key={s} className="font-manrope text-[10px] text-stone-500 px-1 hover:text-stone-300 transition-colors cursor-default">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                className="flex-1 py-2 rounded-lg font-manrope text-stone-400 text-[10px] font-bold uppercase tracking-wider transition-colors hover:text-white"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                View CV
              </button>
              <button
                className="flex-1 py-2 rounded-lg font-manrope text-stone-400 text-[10px] font-bold uppercase tracking-wider transition-colors hover:text-white"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                Refresh Match
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MATCH ENGINE CONTEXT ── */}
      <div
        className="p-5 rounded-2xl border"
        style={{ background: 'rgba(28,25,23,0.4)', borderColor: 'rgba(255,255,255,0.04)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span style={{ color: '#c8863a' }}><IconEngine /></span>
          <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
            Match Engine Context
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="font-manrope text-[10px] text-stone-600 uppercase tracking-widest mb-1">Primary Domain</div>
            <div className="font-manrope text-stone-300 text-xs font-medium">AI Systems Architecture</div>
          </div>
          <div>
            <div className="font-manrope text-[10px] text-stone-600 uppercase tracking-widest mb-1.5">Preferred Roles</div>
            <div className="font-manrope text-stone-400 text-xs leading-relaxed">
              AI Engineer · AI Architect · AI Consultant · AI Solutions Engineer · Contract AI Delivery
            </div>
          </div>
          <div>
            <div className="font-manrope text-[10px] text-stone-600 uppercase tracking-widest mb-1.5">Match Signals</div>
            <div className="space-y-1">
              {[
                'Strong fit for execution-heavy AI roles',
                'Strong fit for system design + AI integration',
              ].map(s => (
                <div key={s} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: '#93d2d1' }} />
                  <span className="font-manrope text-[10px] text-stone-500 leading-relaxed">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
