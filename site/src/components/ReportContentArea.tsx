import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Report } from '../types/report';
import { getReportSourceUrl } from '../services/convexReports';
import { normaliseContent } from '../utils/contentNormalise';
import { MobileReportSwitcher } from './MobileReportSwitcher';

interface ReportContentAreaProps {
  report: Report | null;
  reports?: Report[];
  onSelectReport?: (slug: string) => void;
  isLoading?: boolean;
}

export function ReportContentArea({ report, reports = [], onSelectReport, isLoading = false }: ReportContentAreaProps) {
  const [displayReport, setDisplayReport] = useState<Report | null>(report);
  const [visible, setVisible] = useState(true);
  const pendingReport = useRef<Report | null>(null);

  useEffect(() => {
    if (report?.id === displayReport?.id) return;
    pendingReport.current = report;
    // Start fade-out immediately via CSS (set invisible class flag)
    const fadeOut = setTimeout(() => {
      setVisible(false);
    }, 0);
    const swap = setTimeout(() => {
      setDisplayReport(pendingReport.current);
      setVisible(true);
    }, 190);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(swap);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report?.id]);

  const containerStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(6px)',
    transition: 'opacity 220ms cubic-bezier(0.4,0,0.2,1), transform 220ms cubic-bezier(0.4,0,0.2,1)',
  };

  if (isLoading) {
    return (
      <div className="mt-10 animate-pulse space-y-5 max-w-3xl">
        <div className="h-7 bg-stone-800/50 rounded w-2/3" />
        <div className="h-3 bg-stone-800/30 rounded w-1/4" />
        <div className="space-y-2.5 pt-4">
          <div className="h-3.5 bg-stone-800/40 rounded" />
          <div className="h-3.5 bg-stone-800/40 rounded w-5/6" />
          <div className="h-3.5 bg-stone-800/40 rounded w-4/6" />
        </div>
        <div className="space-y-2.5 pt-2">
          <div className="h-5 bg-stone-800/30 rounded w-1/3" />
          <div className="h-3.5 bg-stone-800/40 rounded" />
          <div className="h-3.5 bg-stone-800/40 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!displayReport) {
    return (
      <div className="mt-10 py-8">
        <p className="font-manrope text-stone-700 text-sm">
          Select a report from the index.
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Mobile-only report switcher – desktop uses the sidebar */}
      <MobileReportSwitcher
        reports={reports}
        currentReport={displayReport}
        onSelectReport={onSelectReport ?? (() => {})}
        isLoading={isLoading}
      />

      <article className="overflow-x-hidden">
        {/* Report header */}
        <header className="mb-6 sm:mb-8 pb-5 sm:pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="font-manrope text-[10px] uppercase tracking-[0.15em] text-stone-600">
                AI Intelligence
              </span>
              {displayReport.isLatest && (
                <span className="font-manrope text-[10px] uppercase tracking-[0.15em]" style={{ color: '#d4a574' }}>
                  · Latest
                </span>
              )}
            </div>
            <a
              href={getReportSourceUrl(displayReport.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-manrope text-[10px] uppercase tracking-[0.12em] text-stone-700 hover:text-stone-400 transition-colors"
            >
              View source
            </a>
          </div>
          <h2
            className="font-newsreader italic text-white leading-tight mb-2"
            style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', letterSpacing: '-0.015em' }}
          >
            {displayReport.displayLabel ?? displayReport.title}
          </h2>
          <p className="font-manrope text-stone-600 text-xs">
            {displayReport.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </header>

        {/* MDX-style rendered markdown */}
        <div className="prose-intelligence">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="font-newsreader text-3xl italic text-white mt-10 mb-5 first:mt-0 leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="font-newsreader text-2xl italic text-white mt-8 mb-4 leading-tight" style={{ letterSpacing: '-0.015em' }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-newsreader text-xl text-stone-100 mt-7 mb-3 leading-snug">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="font-manrope text-sm font-bold text-stone-300 uppercase tracking-wider mt-5 mb-2">
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p className="font-manrope text-stone-400 text-sm leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-1.5 mb-5 ml-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-1.5 mb-5 ml-1 list-decimal list-inside">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="font-manrope text-stone-400 text-sm leading-relaxed flex gap-2.5 items-start">
                  <span className="shrink-0 mt-[0.55em] w-1 h-1 rounded-full inline-block" style={{ background: 'rgba(212,165,116,0.5)', minWidth: '4px' }} />
                  <span>{children}</span>
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote
                  className="pl-5 py-3 my-6 rounded-r-xl"
                  style={{ borderLeft: '2px solid rgba(212,165,116,0.4)', background: 'rgba(28,25,23,0.6)' }}
                >
                  <div className="font-manrope text-sm text-stone-300 italic leading-relaxed">
                    {children}
                  </div>
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="w-full rounded-xl overflow-hidden" style={{ background: 'rgba(28,25,23,0.6)' }}>
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left font-manrope text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 font-manrope text-xs text-stone-400" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  {children}
                </td>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400/80 hover:text-amber-300 underline decoration-amber-400/30 hover:decoration-amber-300/60 transition-colors"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-manrope font-bold text-stone-200">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="font-newsreader text-stone-300" style={{ fontStyle: 'italic' }}>
                  {children}
                </em>
              ),
              code: ({ children, className }) => {
                const isBlock = !!className;
                if (isBlock) {
                  return (
                    <code
                      className="block px-5 py-4 font-mono text-xs text-stone-300 rounded-xl my-4 overflow-x-auto leading-relaxed"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <code
                    className="px-1.5 py-0.5 font-mono text-xs text-amber-400/80 rounded-md"
                    style={{ background: 'rgba(212,165,116,0.1)' }}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => <pre className="my-4">{children}</pre>,
              hr: () => (
                <hr
                  className="my-8 border-0 h-px"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }}
                />
              ),
            }}
          >
            {normaliseContent(displayReport.content)}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
