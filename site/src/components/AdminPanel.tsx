import { useState } from 'react';
import { useQuery } from 'convex/react';
import { anyApi } from 'convex/server';

interface SyncLog {
  _id: string;
  ranAt: number;
  success: boolean;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
  totalFiles: number;
  latestReportDate?: number;
  message: string;
}

interface AdminPanelProps {
  reportCount: number;
}

const SITE_URL = import.meta.env.VITE_CONVEX_SITE_URL as string | undefined;

function fmtDate(ms: number): string {
  return new Date(ms).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtReportDate(ms: number): string {
  return new Date(ms).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function AdminPanel({ reportCount }: AdminPanelProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);

  const latestSync = useQuery(anyApi.syncLog.getLatestSyncLog, {}) as SyncLog | null | undefined;

  const handleSync = async () => {
    if (!SITE_URL) {
      setSyncError('VITE_CONVEX_SITE_URL not configured');
      return;
    }
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(null);
    try {
      const res = await fetch(`${SITE_URL}/ingest/sync`, { method: 'POST' });
      const data = await res.json() as { ok: boolean; result?: { message?: string }; error?: string };
      if (data.ok) {
        setSyncSuccess(data.result?.message ?? 'Sync triggered');
      } else {
        setSyncError(data.error ?? 'Sync failed');
      }
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : String(err));
    } finally {
      setSyncing(false);
    }
  };

  const isLoadingLog = latestSync === undefined;
  const hasLog = latestSync !== null && latestSync !== undefined;

  return (
    <div
      className="font-manrope text-[11px] leading-relaxed"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '20px',
        marginTop: '8px',
        color: '#57534e',
      }}
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span className="text-[10px] uppercase tracking-widest" style={{ color: '#44403c', letterSpacing: '0.12em' }}>
          Sync Status
        </span>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium transition-all"
          style={{
            background: syncing ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)',
            color: syncing ? '#57534e' : '#a8a29e',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: syncing ? 'not-allowed' : 'pointer',
          }}
        >
          {syncing ? (
            <>
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Syncing…
            </>
          ) : (
            <>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync now
            </>
          )}
        </button>
      </div>

      {/* Inline feedback */}
      {syncSuccess && (
        <div className="mb-3 px-2.5 py-1.5 rounded text-[10px]" style={{ background: 'rgba(74,222,128,0.07)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.12)' }}>
          {syncSuccess}
        </div>
      )}
      {syncError && (
        <div className="mb-3 px-2.5 py-1.5 rounded text-[10px]" style={{ background: 'rgba(209,102,102,0.07)', color: '#d16666', border: '1px solid rgba(209,102,102,0.12)' }}>
          {syncError}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
        <Row label="Reports in DB" value={String(reportCount)} />

        {isLoadingLog ? (
          <Row label="Last sync" value="…" />
        ) : hasLog ? (
          <>
            <Row
              label="Last sync"
              value={fmtDate(latestSync!.ranAt)}
              accent={latestSync!.success ? undefined : '#d16666'}
            />
            <Row label="Status" value={latestSync!.success ? 'OK' : 'Failed'} accent={latestSync!.success ? '#4ade80' : '#d16666'} />
            <Row label="Inserted" value={String(latestSync!.inserted)} />
            <Row label="Updated" value={String(latestSync!.updated)} />
            <Row label="Skipped" value={String(latestSync!.skipped)} />
            <Row label="Total files" value={String(latestSync!.totalFiles)} />
            {latestSync!.latestReportDate ? (
              <Row label="Latest report" value={fmtReportDate(latestSync!.latestReportDate)} />
            ) : null}
            {latestSync!.errors.length > 0 && (
              <div className="col-span-2 mt-1">
                {latestSync!.errors.map((e, i) => (
                  <div key={i} className="text-[10px] truncate" style={{ color: '#d16666' }}>{e}</div>
                ))}
              </div>
            )}
          </>
        ) : (
          <Row label="Last sync" value="Never" />
        )}
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <>
      <span style={{ color: '#44403c' }}>{label}</span>
      <span style={{ color: accent ?? '#78716c', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </>
  );
}
