import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Report } from '../types/report';
import { getReportSourceUrl } from '../services/convexReports';

interface ReportContentAreaProps {
  report: Report | null;
  isLoading?: boolean;
}

export function ReportContentArea({ report, isLoading = false }: ReportContentAreaProps) {
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
      <div className="mt-8 p-8 rounded-3xl" style={{ background: 'rgba(28,25,23,0.4)' }}>
        <div className="animate-pulse space-y-6 max-w-3xl">
          <div className="h-8 bg-stone-800 rounded w-2/3" />
          <div className="space-y-3">
            <div className="h-4 bg-stone-800 rounded" />
            <div className="h-4 bg-stone-800 rounded w-5/6" />
            <div className="h-4 bg-stone-800 rounded w-4/6" />
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-6 bg-stone-800 rounded w-1/3" />
            <div className="h-4 bg-stone-800 rounded" />
            <div className="h-4 bg-stone-800 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!displayReport) {
    return (
      <div
        className="mt-8 p-12 rounded-3xl flex flex-col items-center justify-center text-center"
        style={{ background: 'rgba(28,25,23,0.3)', minHeight: '240px' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(212,165,116,0.08)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <h3 className="font-newsreader text-2xl italic text-white mb-2">No Report Selected</h3>
        <p className="font-manrope text-stone-500 text-sm">
          Select a report from the index to read the full intelligence briefing.
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <article
        className="mt-8 p-8 rounded-3xl"
        style={{ background: 'rgba(28,25,23,0.4)' }}
      >
        {/* Report header */}
        <header className="mb-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-2.5 py-1 rounded-md font-manrope text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(212,165,116,0.12)', color: '#d4a574' }}
            >
              AI Intelligence
            </span>
            {displayReport.isLatest && (
              <span
                className="px-2.5 py-1 rounded-md font-manrope text-[10px] font-bold uppercase tracking-widest"
                style={{ background: 'rgba(127,176,105,0.12)', color: '#7fb069' }}
              >
                Latest
              </span>
            )}
            <a
              href={getReportSourceUrl(displayReport.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 font-manrope text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-stone-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
              View Source
            </a>
          </div>
          <h2 className="font-newsreader text-3xl italic text-white mb-1 leading-tight">
            {displayReport.displayLabel ?? displayReport.title}
          </h2>
          <p className="font-manrope text-stone-500 text-xs">
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
            {displayReport.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
