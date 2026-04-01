# GitHub Ingestion Implementation

## Summary

The ingestion pipeline has been **successfully migrated from local files to live GitHub repository**.

## Changes Made

### 1. Created GitHub Fetching Module
**File**: `scripts/githubReports.mjs`

- `discoverReportFiles()` - Uses GitHub API to list all markdown files
- `fetchReportContent()` - Fetches raw content from GitHub
- `fetchAllReports()` - Orchestrates discovery and fetching

### 2. Updated Ingestion Script
**File**: `scripts/ingest-reports.mjs`

**Before**:
```javascript
const files = fs.readdirSync(REPORTS_DIR).filter(f => f.endsWith('.md'));
const content = fs.readFileSync(path.join(REPORTS_DIR, file), 'utf-8');
```

**After**:
```javascript
const reports = await fetchAllReports(GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH);
// Fetches from https://github.com/mccaigs/jobs
```

### 3. Enhanced Filename Parser
**File**: `convex/http.ts` - `deriveMetaFromFilename()`

**Added support for multiple date formats**:
- `YYYY-MM-DD-{suffix}.md` (original)
- `DD-MM-YYYY-{suffix}.md` (new)
- `{prefix}-DD-MM-YYYY-{suffix}.md` (new)
- `{prefix}-YYYY-MM-DD-{suffix}.md` (new)

This handles all filename formats found in the GitHub repo.

### 4. Updated Documentation
- `CONVEX_SETUP.md` - Updated data flow and ingestion instructions
- `README.md` - Updated report format and workflow

## Test Results

### Ingestion Test
```
🚀 Starting GitHub ingestion
📦 Source: https://github.com/mccaigs/jobs
🎯 Target: https://third-lark-419.convex.site/ingest

🔍 Discovering markdown files in mccaigs/jobs...
📋 Found 16 markdown files

📥 Ingesting 16 reports to Convex...

=== Ingestion Summary ===
Total: 16 | Success: 16 | Failed: 0

✨ GitHub ingestion complete!
```

### Files Ingested from GitHub
1. `01-04-2026-jobs.md`
2. `2026-03-23-jobs.md`
3. `2026-03-24-jobs.md`
4. `25-03-2026-jobs.md`
5. `26-03-2026-jobs.md`
6. `27-03-2026-jobs.md`
7. `28-03-2026-jobs.md`
8. `29-03-2026-jobs.md`
9. `30-03-2026-jobs.md`
10. `31-03-2026-jobs.md`
11. `UK-AI-DailyJobSearch-01-04-2026-jobs.md`
12. `UK-AI-DailyJobSearch-25-03-2026-jobs.md`
13. `UK-AI-DailyJobSearch-26-03-2026-jobs.md`
14. `UK-AI-DailyJobSearch-28-03-2026-jobs.md`
15. `UK-AI-DailyJobSearch-30-03-2026-jobs.md`
16. `UK-AI-DailyJobSearch-31-03-2026-jobs.md`

## Verification

### Convex Deployment
- ✅ Cloud URL: `https://third-lark-419.convex.cloud`
- ✅ HTTP Actions: `https://third-lark-419.convex.site`
- ✅ No conflicting deployments detected

### Data Source
- ✅ GitHub repo: `mccaigs/jobs` (public)
- ✅ Branch: `master`
- ✅ No authentication required
- ✅ 16 markdown files discovered and ingested

### Frontend
- ✅ Reads from Convex via `useQuery(anyApi.reports.listReports)`
- ✅ No local file dependencies
- ✅ Real-time updates from Convex database

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GitHub Repository (mccaigs/jobs)                         │
│    - Public repo with markdown reports                      │
│    - No authentication needed                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GitHub API                                               │
│    GET /repos/mccaigs/jobs/git/trees/master?recursive=1     │
│    - Discovers all .md files                                │
│    - Returns file paths and SHAs                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Ingestion Script (scripts/ingest-reports.mjs)           │
│    - Fetches raw content from GitHub                        │
│    - Sends to Convex HTTP action                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Convex HTTP Action (POST /ingest)                       │
│    - Parses filename (multiple formats supported)           │
│    - Extracts frontmatter and markdown body                 │
│    - Calls upsertReport mutation                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Convex Database (reports table)                         │
│    - Stores structured report data                          │
│    - Indexed by slug, date, region, etc.                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. React Frontend                                           │
│    - useQuery(anyApi.reports.listReports)                   │
│    - Real-time updates via Convex                           │
│    - No local file access                                   │
└─────────────────────────────────────────────────────────────┘
```

## Running Ingestion

### Manual Trigger
```bash
cd c:\dev\jobs\site
node scripts/ingest-reports.mjs
```

### Via HTTP Action
```bash
curl -X POST https://third-lark-419.convex.site/ingest/github \
  -H "Content-Type: application/json" \
  -d '{"repo": "mccaigs/jobs"}'
```

## Future Workflow

When new reports are added to the GitHub repo:

1. **Push to GitHub**: `git push origin master`
2. **Run ingestion**: `node scripts/ingest-reports.mjs`
3. **View in UI**: Refresh browser - reports appear automatically

## Automation Ready

The ingestion can be automated via:
- **GitHub Webhook**: Trigger on push to `master`
- **Cron Job**: Schedule periodic sync (e.g., hourly)
- **CI/CD Pipeline**: Run after deployment

Example webhook payload:
```json
POST https://third-lark-419.convex.site/ingest/github
{
  "repo": "mccaigs/jobs",
  "branch": "master"
}
```

## Key Benefits

✅ **Live Data**: Reports sourced from GitHub, not local files  
✅ **No Manual Sync**: Single command syncs all reports  
✅ **Idempotent**: Safe to run multiple times  
✅ **Flexible Formats**: Handles various filename patterns  
✅ **Public Access**: No GitHub token required  
✅ **Scalable**: Ready for automation  

## Files Modified

1. `scripts/githubReports.mjs` - **Created** (GitHub fetching logic)
2. `scripts/ingest-reports.mjs` - **Modified** (replaced local files with GitHub)
3. `convex/http.ts` - **Modified** (enhanced filename parser)
4. `CONVEX_SETUP.md` - **Updated** (documentation)
5. `README.md` - **Updated** (workflow instructions)

## Verification Commands

```bash
# Check Convex data
npx convex data reports

# View ingestion logs
npx convex logs --history 20

# Test ingestion
node scripts/ingest-reports.mjs
```

---

**Status**: ✅ **Complete** - GitHub ingestion fully operational
