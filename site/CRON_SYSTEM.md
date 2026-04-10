# Convex Cron Job System Documentation

## Overview

The AIJobs Intelligence Dashboard now features an automated data ingestion system using Convex cron jobs. The system automatically fetches the latest job reports from the GitHub repository twice daily and updates the frontend in real-time.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Convex Cron Jobs (Scheduled)                                │
│ - Morning: 08:00 Europe/London                              │
│ - Afternoon: 16:00 Europe/London                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ GitHub Ingestion Action (githubIngest.ts)                   │
│ - Fetches file list from GitHub API                         │
│ - Identifies latest job report                              │
│ - Downloads raw markdown content                            │
│ - Generates content hash for deduplication                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Deduplication Check (jobReportsMutations.ts)                │
│ - Check by contentHash (exact content match)                │
│ - Check by fileName (duplicate filename)                    │
│ - Skip if duplicate, insert if new                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Convex Database (jobReports table)                          │
│ - fileName: string                                           │
│ - fileUrl: string                                            │
│ - content: string (raw markdown)                             │
│ - contentHash: string (SHA-256)                              │
│ - pulledAt: number (timestamp)                               │
│ - source: "github"                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend Queries (jobReportsQueries.ts)                     │
│ - getLatestJobReport()                                       │
│ - listJobReports()                                           │
│ - getJobReportByFileName()                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ React Frontend (App.tsx)                                     │
│ - Real-time updates via Convex subscriptions                │
│ - Automatic display of latest reports                        │
│ - No manual refresh needed                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Files Created/Modified

### Backend (Convex)

1. **`convex/crons.ts`** - Cron job configuration
   - Schedules: 08:00 and 16:00 Europe/London daily
   - Triggers: `githubIngest.ingestLatestJobReport`

2. **`convex/githubIngest.ts`** - GitHub ingestion action
   - Fetches markdown files from GitHub API
   - Identifies latest job report by date
   - Downloads content and generates hash
   - Calls mutation to store data

3. **`convex/jobReportsMutations.ts`** - Database mutations
   - `storeJobReport` - Inserts new reports with deduplication

4. **`convex/jobReportsQueries.ts`** - Database queries
   - `getLatestJobReport` - Get most recent report
   - `listJobReports` - Get all reports (newest first)
   - `getJobReportByFileName` - Get specific report

5. **`convex/schema.ts`** - Updated schema
   - Added `jobReports` table with indexes

### Frontend

6. **`src/services/jobReportsService.ts`** - Data mapping service
   - Maps raw `jobReports` to `Report` type
   - Extracts metadata from filenames and content
   - Provides consistent interface for frontend

7. **`src/App.tsx`** - Updated to use jobReports
   - Changed from `reports.listReports` to `jobReportsQueries.listJobReports`
   - Uses `mapJobReportsToReports` for data transformation

---

## Cron Schedule

### Morning Ingestion
- **Time**: 08:00 Europe/London
- **Cron Expression**: `0 8 * * *`
- **Purpose**: Catch overnight job postings

### Afternoon Ingestion
- **Time**: 16:00 Europe/London
- **Cron Expression**: `0 16 * * *`
- **Purpose**: Catch daytime job postings

**Note**: Times automatically adjust for British Summer Time (BST) / Greenwich Mean Time (GMT).

---

## Database Schema

### jobReports Table

```typescript
{
  fileName: string,        // e.g., "08-04-2026-jobs.md"
  fileUrl: string,         // GitHub raw URL
  content: string,         // Full markdown content
  contentHash: string,     // SHA-256 hash for deduplication
  pulledAt: number,        // Timestamp when fetched
  source: string,          // Always "github"
}
```

### Indexes
- `by_fileName` - Query by filename
- `by_contentHash` - Deduplication check
- `by_pulledAt` - Sort by ingestion time

---

## Deduplication Logic

The system prevents duplicate entries using two checks:

1. **Content Hash Check**
   - Generates SHA-256 hash of markdown content
   - Skips if exact content already exists
   - Handles renamed files with same content

2. **Filename Check**
   - Checks if filename already exists
   - Prevents duplicate entries for same file
   - Useful for manual re-runs

**Result**: Only new or updated reports are stored.

---

## Manual Testing

### Trigger Ingestion Manually

```bash
cd c:\dev\jobs\site
npx convex run githubIngest:ingestLatestJobReport
```

### View Stored Reports

```bash
npx convex data jobReports
```

### Check Cron Execution Logs

```bash
npx convex logs --history 50
```

### View Latest Report

```bash
npx convex run jobReportsQueries:getLatestJobReport
```

---

## Monitoring

### Success Indicators

✅ **Cron runs successfully**
- Check logs for: `🚀 Starting GitHub job report ingestion...`
- Look for: `✅ Successfully stored: [filename]`

✅ **Deduplication working**
- Check logs for: `ℹ️ Skipped (duplicate_hash): [filename]`
- Or: `Skipping duplicate filename: [filename]`

✅ **Frontend updates**
- New reports appear automatically
- No page refresh needed
- Real-time via Convex subscriptions

### Error Indicators

❌ **GitHub API errors**
- Check logs for: `GitHub API error: [status]`
- Verify repo is public and accessible

❌ **No files found**
- Check logs for: `⚠️ No job reports found`
- Verify markdown files exist in repo

❌ **Mutation errors**
- Check logs for: `❌ Error during ingestion:`
- Review error stack trace

---

## Troubleshooting

### Cron Not Running

**Check deployment**:
```bash
npx convex deploy
```

**Verify crons.ts is deployed**:
- Look for "Deployed Convex functions" message
- Check Convex dashboard for cron jobs

### No Data Appearing in Frontend

**Check jobReports table**:
```bash
npx convex data jobReports
```

**Verify query is working**:
```bash
npx convex run jobReportsQueries:listJobReports
```

**Check browser console**:
- Look for Convex connection errors
- Verify `useQuery` is receiving data

### Duplicate Entries

**This should not happen** due to deduplication, but if it does:

1. Check contentHash generation
2. Verify mutation logic
3. Review logs for skip messages

**Manual cleanup** (if needed):
```bash
# Delete duplicates via Convex dashboard
# Or write a cleanup mutation
```

---

## GitHub Repository Configuration

### Source Repository
- **Owner**: `mccaigs`
- **Repo**: `jobs`
- **Branch**: `master`
- **Access**: Public (no authentication required)

### File Patterns Recognized
- `YYYY-MM-DD-jobs.md` (e.g., `2026-04-08-jobs.md`)
- `DD-MM-YYYY-jobs.md` (e.g., `08-04-2026-jobs.md`)
- `UK-AI-DailyJobSearch-*.md` (e.g., `UK-AI-DailyJobSearch-08-04-2026-jobs.md`)

### Latest File Selection
- Files sorted by extracted date (newest first)
- Only the **latest** file is ingested per cron run
- Prevents bulk ingestion on every run

---

## Frontend Integration

### Data Flow

1. **Cron job** runs → Ingests latest report → Stores in `jobReports` table
2. **Frontend** subscribes to `jobReportsQueries.listJobReports`
3. **Convex** pushes updates to frontend in real-time
4. **Service layer** maps raw data to `Report` type
5. **UI components** render updated data automatically

### Real-Time Updates

- **No polling required** - Convex handles subscriptions
- **Automatic refresh** - New data appears instantly
- **No manual refresh** - Users see updates without action

### Backward Compatibility

- Frontend still supports `Report` type
- Mapping layer handles transformation
- Existing UI components work unchanged

---

## Performance Considerations

### Cron Execution
- **Runs twice daily** - Minimal load
- **Fetches only latest** - Efficient API usage
- **Deduplication** - Prevents redundant storage

### Frontend Queries
- **Indexed queries** - Fast retrieval
- **Sorted by pulledAt** - Latest first
- **Real-time subscriptions** - No polling overhead

### Storage
- **Raw markdown** - Full content preserved
- **Content hash** - 64 characters (SHA-256)
- **Metadata** - Minimal overhead

---

## Future Enhancements

### Potential Improvements

1. **Parse Markdown Content**
   - Extract structured job data
   - Store in separate tables
   - Enable advanced filtering

2. **Multiple File Ingestion**
   - Ingest all new files, not just latest
   - Batch processing
   - Configurable limits

3. **Webhook Integration**
   - GitHub webhook on push
   - Instant ingestion
   - No waiting for cron

4. **Error Notifications**
   - Email/Slack alerts on failure
   - Monitoring dashboard
   - Retry logic

5. **Historical Data**
   - Archive old reports
   - Trend analysis
   - Data retention policies

---

## Security Notes

- ✅ **No secrets in code** - GitHub repo is public
- ✅ **No authentication needed** - Read-only access
- ✅ **Deduplication** - Prevents data bloat
- ✅ **Content hashing** - Detects changes reliably

---

## Deployment Checklist

Before deploying to production:

- [ ] Verify cron schedule is correct
- [ ] Test manual ingestion
- [ ] Check deduplication logic
- [ ] Verify frontend displays data
- [ ] Monitor first few cron runs
- [ ] Set up error alerting
- [ ] Document for team

---

## Support

### Convex Documentation
- [Cron Jobs](https://docs.convex.dev/scheduling/cron-jobs)
- [Actions](https://docs.convex.dev/functions/actions)
- [Queries](https://docs.convex.dev/functions/queries)

### GitHub API
- [Git Trees API](https://docs.github.com/en/rest/git/trees)
- [Contents API](https://docs.github.com/en/rest/repos/contents)

---

**Last Updated**: April 2026  
**Convex Deployment**: `third-lark-419`  
**Repository**: `https://github.com/mccaigs/jobs`
