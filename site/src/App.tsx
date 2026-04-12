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
import { mapJobReportsToReports } from './services/jobReportsService';
import type { JobReport } from './services/jobReportsService';
import type { Report } from './types/report';
import { AdminPanel } from './components/AdminPanel';

function IntelligencePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch from jobReports table (populated by cron jobs)
  const rawJobReports = useQuery(anyApi.jobReportsQueries.listJobReports, {});
  const isLoading = rawJobReports === undefined;
  const isError = rawJobReports === null;

  const reports = useMemo<Report[]>(() => {
    if (!rawJobReports || isError) return [];
    return mapJobReportsToReports(rawJobReports as JobReport[]);
  }, [rawJobReports, isError]);

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

  // Empty state: loaded but no reports at all
  if (!isLoading && !isError && reports.length === 0) {
    return (
      <div className="flex flex-col" style={{ background: '#0c0a09', minHeight: '100vh' }}>
        <TopNavBar onRefresh={handleRefresh} isLoading={false} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            className="text-center max-w-sm p-10 rounded-3xl"
            style={{ background: 'rgba(28,25,23,0.8)' }}
          >
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(120,113,108,0.10)' }}
            >
              <svg className="w-8 h-8" fill="none" stroke="#78716c" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="font-newsreader text-2xl text-white mb-3 italic">
              No Reports Yet
            </h1>
            <p className="font-manrope text-stone-500 text-sm leading-relaxed mb-6">
              The archive is empty. Trigger a sync to ingest reports from GitHub.
            </p>
            <div className="mt-2">
              <AdminPanel reportCount={0} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full-page error
  if (isError) {
    return (
      <div className="flex flex-col" style={{ background: '#0c0a09' }}>
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
    <div className="flex flex-col" style={{ background: '#0c0a09', color: '#ece8e0', minHeight: '100vh' }}>
      {/* Fixed top nav */}
      <TopNavBar onRefresh={handleRefresh} isLoading={isLoading} />

      {/* Page body: sidebar + main content canvas */}
      <div className="flex flex-1 max-w-[1440px] mx-auto w-full">

        {/* Left sidebar — scan archive rail */}
        <SideNavBar
          reports={reports}
          activeReportId={currentReport?.id ?? null}
          onSelectReport={handleSelectReport}
          isLoading={isLoading}
        />

        {/* Main content canvas */}
        <section className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 min-w-0 overflow-x-hidden">

          {/* Masthead row: title + signal card */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-12 mb-8 sm:mb-10">
            <HeroPanel report={currentReport} isLoading={isLoading} />
            <MarketSignalCard report={currentReport} isLoading={isLoading} />
          </div>

          {/* Content + right rail */}
          <div className="flex flex-col xl:grid xl:grid-cols-12 xl:gap-x-12">
            {/* Main column */}
            <div className="xl:col-span-8 space-y-8 sm:space-y-10 min-w-0">
              <TopMatchesList report={currentReport} isLoading={isLoading} />
              <ReportContentArea
                report={currentReport}
                reports={reports}
                onSelectReport={handleSelectReport}
                isLoading={isLoading}
              />

              {/* Admin panel */}
              <AdminPanel reportCount={reports.length} />
            </div>

            {/* Right rail */}
            <div className="hidden xl:block xl:col-span-4 mt-8 xl:mt-0">
              <div className="sticky" style={{ top: '65px' }}>
                <ReportIndexRail
                  reports={reports}
                  activeReportId={currentReport?.id ?? null}
                  onSelectReport={handleSelectReport}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
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
