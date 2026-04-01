import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Report } from '../types/report';
import { getReportSourceUrl } from '../services/convexReports';

interface ReportViewerProps {
  report: Report | null;
  isLoading?: boolean;
}

export function ReportViewer({ report, isLoading = false }: ReportViewerProps) {
  if (isLoading) {
    return (
      <main className="flex-1 bg-surface h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto px-12 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-surface_container_high rounded w-3/4" />
            <div className="space-y-3">
              <div className="h-4 bg-surface_container_high rounded" />
              <div className="h-4 bg-surface_container_high rounded w-5/6" />
              <div className="h-4 bg-surface_container_high rounded w-4/6" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="flex-1 bg-surface h-screen overflow-y-auto flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-surface_container_high flex items-center justify-center">
            <svg className="w-10 h-10 text-on_surface_dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-newsreader text-on_surface mb-3 tracking-tight">
            Select a Report
          </h1>
          <p className="text-sm text-on_surface_dim font-manrope leading-relaxed">
            Choose a report from the sidebar to view AI job intelligence for Edinburgh
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-surface h-screen overflow-y-auto scrollbar-thin">
      <article className="max-w-4xl mx-auto px-12 py-16">
        {/* Report Header */}
        <header className="mb-16">
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/15 text-primary text-[10px] font-manrope font-bold uppercase tracking-widest rounded-md">
                  AI Intelligence
                </span>
                {report.isLatest && (
                  <span className="px-3 py-1 bg-success/15 text-success text-[10px] font-manrope font-bold uppercase tracking-widest rounded-md">
                    Latest
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-newsreader text-on_surface leading-tight tracking-tight mb-6 text-shadow-soft">
                {report.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-on_surface_dim font-manrope">
                <time dateTime={report.date.toISOString()} className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {report.date.toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </time>
                <a
                  href={getReportSourceUrl(report.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary_hover transition-colors-smooth"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>View Source</span>
                </a>
              </div>
            </div>
          </div>
          <div className="h-px bg-linear-to-r from-outline_variant/20 via-outline_variant/40 to-outline_variant/20" />
        </header>

        {/* Markdown Content */}
        <div className="prose-custom">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-newsreader text-on_surface mt-20 mb-8 first:mt-0 tracking-tight">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-newsreader text-on_surface mt-16 mb-6 tracking-tight">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-newsreader text-on_surface mt-12 mb-4 tracking-tight">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-xl font-manrope font-semibold text-on_surface mt-8 mb-3">
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p className="text-base text-on_surface_variant leading-relaxed mb-6 font-manrope">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-2 mb-8 ml-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-2 mb-8 ml-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-base text-on_surface_variant leading-relaxed pl-6 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/60 font-manrope">
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-primary/50 pl-8 py-4 my-10 bg-surface_container_high/50 rounded-r-xl">
                  <div className="text-base text-on_surface italic font-manrope leading-relaxed">
                    {children}
                  </div>
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-10">
                  <table className="w-full card-premium overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-surface_container_highest">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="px-6 py-4 text-left text-xs uppercase tracking-widest text-on_surface_dim font-manrope font-bold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-6 py-4 text-sm text-on_surface_variant border-t border-outline_variant/10 font-manrope">
                  {children}
                </td>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary_hover underline decoration-primary/40 hover:decoration-primary transition-colors-smooth"
                >
                  {children}
                </a>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="px-2 py-0.5 bg-surface_container_highest text-primary text-sm rounded-md font-mono">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="block px-6 py-5 bg-surface_container_high text-on_surface_variant text-sm rounded-xl overflow-x-auto font-mono my-8 leading-relaxed">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="my-8">
                  {children}
                </pre>
              ),
              hr: () => (
                <hr className="my-16 border-0 h-px bg-linear-to-r from-transparent via-outline_variant/30 to-transparent" />
              ),
            }}
          >
            {report.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
