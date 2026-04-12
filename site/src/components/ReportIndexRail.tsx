import { useState } from 'react';
import type { Report } from '../types/report';

interface ReportIndexRailProps {
  reports: Report[];
  activeReportId: string | null;
  onSelectReport: (slug: string) => void;
  isLoading?: boolean;
}


function IconChevron() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
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

  return (
    <div className="space-y-8">

      {/* ── CURRENT SCAN ── */}
      {(isLoading || activeReport) && (
        <div>
          <div className="font-manrope text-[10px] uppercase tracking-[0.18em] text-stone-600 mb-3">
            Current scan
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-stone-800/50 rounded w-3/4" />
              <div className="h-3 bg-stone-800/30 rounded w-1/2" />
            </div>
          ) : activeReport && (
            <>
              <div className="font-newsreader text-white text-xl italic leading-snug mb-1">
                {activeReport.displayLabel ?? activeReport.title}
              </div>
              <div className="font-manrope text-stone-600 text-xs">
                {activeReport.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              {activeReport.parsed && (
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5">
                  {activeReport.parsed.totalScanned > 0 && (
                    <span className="font-manrope text-[10px] text-stone-600">
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
          )}
        </div>
      )}

      {/* ── AVAILABLE REPORTS ── */}
      <div>
        <div className="font-manrope text-[10px] uppercase tracking-[0.18em] text-stone-600 mb-3">
          Reports
        </div>
        <div className="space-y-0.5">
          {isLoading
            ? [1, 2, 3].map(i => <ReportSkeletonItem key={i} />)
            : reports.length === 0
              ? (
                <p className="font-manrope text-stone-700 text-xs py-2">
                  No reports available.
                </p>
              )
              : reports.map(report => {
                  const isActive = report.id === activeReportId;
                  const p = report.parsed;
                  return (
                    <button
                      key={report.id}
                      onClick={() => onSelectReport(report.slug)}
                      className="w-full text-left py-2.5 px-2 rounded-lg transition-colors duration-150 relative group"
                      style={{ background: isActive ? 'rgba(212,165,116,0.06)' : 'transparent' }}
                    >
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-5"
                          style={{ background: '#d4a574' }}
                        />
                      )}
                      <div className="flex items-start justify-between gap-2 pl-1">
                        <span
                          className="font-manrope text-xs leading-snug"
                          style={{ color: isActive ? '#e8d5b8' : '#6b6560' }}
                        >
                          {report.displayLabel ?? report.title}
                        </span>
                        {report.isLatest && (
                          <span className="font-manrope text-[9px] uppercase tracking-wider shrink-0 mt-0.5" style={{ color: '#d4a574' }}>
                            New
                          </span>
                        )}
                      </div>
                      {p && (p.topFitScore > 0 || p.totalScanned > 0) && (
                        <div className="flex gap-3 pl-1 mt-0.5">
                          {p.totalScanned > 0 && (
                            <span className="font-manrope text-[10px] text-stone-700">{p.totalScanned} scanned</span>
                          )}
                          {p.topFitScore > 0 && (
                            <span className="font-manrope text-[10px]" style={{ color: '#93d2d1' }}>
                              Top {p.topFitScore}%
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
        </div>
      </div>

      {/* ── CV PROFILE ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
        <button
          className="w-full flex items-center justify-between mb-2"
          onClick={() => setCvExpanded(v => !v)}
        >
          <span className="font-manrope text-[10px] uppercase tracking-[0.18em] text-stone-600">
            CV Profile
          </span>
          <span className={`text-stone-700 transition-transform duration-200 ${cvExpanded ? 'rotate-90' : ''}`}>
            <IconChevron />
          </span>
        </button>

        <div className="font-manrope text-stone-300 text-sm">David Robertson</div>
        <div className="font-manrope text-stone-600 text-xs mt-0.5">AI Engineer · Contract · Edinburgh</div>

        {cvExpanded && (
          <div className="mt-4 space-y-3">
            <div>
              <div className="font-manrope text-[10px] text-stone-700 uppercase tracking-widest mb-1.5">Preferred roles</div>
              <div className="font-manrope text-stone-500 text-xs leading-relaxed">
                AI Engineer · AI Architect · AI Consultant · Contract AI Delivery
              </div>
            </div>
            <div>
              <div className="font-manrope text-[10px] text-stone-700 uppercase tracking-widest mb-1.5">Match signals</div>
              <div className="space-y-1">
                {['Execution-heavy AI roles', 'System design + AI integration'].map(s => (
                  <div key={s} className="font-manrope text-[10px] text-stone-600">{s}</div>
                ))}
              </div>
            </div>
            <a
              href="https://github.com/mccaigs/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-manrope text-[10px] uppercase tracking-[0.12em] text-stone-600 hover:text-stone-400 transition-colors mt-1"
            >
              View source repo →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
