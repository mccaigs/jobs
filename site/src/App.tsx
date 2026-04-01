import { useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { anyApi } from 'convex/server';
import { TopNavBar } from './components/TopNavBar';
import { SideNavBar } from './components/SideNavBar';
import { HeroPanel } from './components/HeroPanel';
import { MarketSignalCard } from './components/MarketSignalCard';
import { TopMatchesList } from './components/TopMatchesList';
import { ReportIndexRail } from './components/ReportIndexRail';
import { ReportContentArea } from './components/ReportContentArea';
import { mapConvexReports } from './services/convexReports';
import type { ConvexReport } from './services/convexReports';
import type { Report } from './types/report';

function IntelligencePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const rawReports = useQuery(anyApi.reports.listReports, {});
  const isLoading = rawReports === undefined;
  const isError = rawReports === null;

  const reports = useMemo<Report[]>(() => {
    if (!rawReports || isError) return [];
    return mapConvexReports(rawReports as ConvexReport[]);
  }, [rawReports, isError]);

  const currentReport = useMemo<Report | null>(() => {
    if (slug) return reports.find(r => r.slug === slug) ?? null;
    return reports.find(r => r.isLatest) ?? reports[0] ?? null;
  }, [slug, reports]);

  // Auto-navigate to latest on initial load
  useEffect(() => {
    if (!isLoading && !slug && currentReport) {
      navigate(`/report/${currentReport.slug}`, { replace: true });
    }
  }, [isLoading, slug, currentReport, navigate]);

  const handleSelectReport = (reportSlug: string) => {
    navigate(`/report/${reportSlug}`);
  };

  const handleRefresh = () => {
    // Convex subscriptions auto-refresh; this is a no-op placeholder
    // for the TopNavBar button to remain functional
  };

  // Full-page error
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0c0a09' }}>
        <TopNavBar onRefresh={handleRefresh} isLoading={false} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            className="text-center max-w-sm p-10 rounded-3xl"
            style={{ background: 'rgba(28,25,23,0.8)' }}
          >
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(209,102,102,0.12)' }}
            >
              <svg className="w-8 h-8" fill="none" stroke="#d16666" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="font-newsreader text-2xl text-white mb-3 italic">
              Failed to Load Reports
            </h1>
            <p className="font-manrope text-stone-500 text-sm leading-relaxed mb-6">
              Could not connect to Convex. Check VITE_CONVEX_URL and Convex deployment status.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0c0a09', color: '#ece8e0' }}>
      {/* Fixed top nav */}
      <TopNavBar onRefresh={handleRefresh} isLoading={isLoading} />

      {/* Page body: sidebar + main content canvas */}
      <div className="flex flex-1 max-w-[1440px] mx-auto w-full relative">

        {/* Left sidebar — Stitch insight rail */}
        <SideNavBar
          reports={reports}
          activeReportId={currentReport?.id ?? null}
          onSelectReport={handleSelectReport}
          isLoading={isLoading}
        />

        {/* Main content canvas */}
        <section
          className="flex-1 p-8 lg:p-12 overflow-y-auto"
          style={{ background: 'rgb(12,10,9)' }}
        >
          {/* Bento header grid: hero panel + market signal card */}
          <div className="grid grid-cols-12 gap-6 mb-8">
            <HeroPanel report={currentReport} isLoading={isLoading} />
            <MarketSignalCard report={currentReport} isLoading={isLoading} />
          </div>

          {/* Bottom grid: matches list + report index rail */}
          <div className="grid grid-cols-12 gap-8">
            {/* Top matches */}
            <TopMatchesList report={currentReport} isLoading={isLoading} />

            {/* Right rail: report index + CV + match engine context */}
            <ReportIndexRail
              reports={reports}
              activeReportId={currentReport?.id ?? null}
              onSelectReport={handleSelectReport}
              isLoading={isLoading}
            />
          </div>

          {/* Full MDX report content area */}
          <ReportContentArea report={currentReport} isLoading={isLoading} />
        </section>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntelligencePage />} />
        <Route path="/report/:slug" element={<IntelligencePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
