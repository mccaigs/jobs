# Convex Integration - Setup Guide

## Overview

The AIJobs application now uses **Convex** as the exclusive backend and data source for job reports. All markdown reports are ingested into Convex and served to the frontend via real-time queries.

## Deployment Information

- **Convex Cloud URL**: `https://third-lark-419.convex.cloud`
- **HTTP Actions URL**: `https://third-lark-419.convex.site`
- **Project**: `jobs` (third-lark-419)

## Architecture

### Backend (Convex)

**Location**: `c:\dev\jobs\site\convex\`

#### Schema (`schema.ts`)
- **Table**: `reports`
- **Fields**: slug, title, company, location, reportDate, fitScore, summary, markdownBody, sourcePath, sourceRepo, publishedAt, tags, jobType, employmentType, salaryOrRate, isActive, createdAt, updatedAt
- **Indexes**: by_slug, by_reportDate, by_publishedAt, by_isActive, by_fitScore

#### Functions (`reports.ts`)
- `listReports` - Query: Returns all reports sorted by date (newest first)
- `getReportBySlug` - Query: Fetch a single report by slug
- `upsertReport` - Mutation: Insert or update a report (idempotent)

#### HTTP Actions (`http.ts`)
- `POST /ingest` - Ingest a single markdown report
- `POST /ingest/github` - Ingest all reports from GitHub repo (mccaigs/jobs)

### Frontend (React + Vite)

**Location**: `c:\dev\jobs\site\src\`

#### Convex Client (`services/convexClient.ts`)
- Creates `ConvexReactClient` instance
- Validates `VITE_CONVEX_URL` environment variable
- Guards against incorrect deployment URLs

#### Data Mapping (`services/convexReports.ts`)
- Maps Convex data model to existing `Report` type
- Preserves backward compatibility with existing UI components

#### Main App (`App.tsx`)
- Uses `useQuery(anyApi.reports.listReports)` to fetch reports
- Handles loading, error, and empty states
- Preserves all existing UI/UX design

## Environment Configuration

**File**: `c:\dev\jobs\site\.env`

```env
VITE_CONVEX_URL=https://third-lark-419.convex.cloud
```

## Manual Ingestion

### Using Node.js Script (Recommended)

```bash
cd c:\dev\jobs\site
node scripts/ingest-reports.mjs
```

This script:
- Fetches all `.md` files from the live GitHub repo `mccaigs/jobs`
- Discovers markdown files using GitHub API
- Posts each to the Convex `/ingest` endpoint
- Provides success/failure summary

**Source**: `https://github.com/mccaigs/jobs` (public repo, no auth required)

### Using HTTP Action Directly

```bash
curl -X POST https://third-lark-419.convex.site/ingest/github \
  -H "Content-Type: application/json" \
  -d '{"repo": "mccaigs/jobs"}'
```

### Manual Single Report

```bash
curl -X POST https://third-lark-419.convex.site/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "2026-03-30-jobs.md",
    "content": "# Report content here...",
    "sourceRepo": "mccaigs/jobs"
  }'
```

## Deployment Commands

### Deploy Convex Backend

```bash
cd c:\dev\jobs\site
$env:CONVEX_DEPLOY_KEY="dev:third-lark-419|<your-key>"
npx convex deploy
```

### View Deployed Functions

```bash
npx convex function-spec
```

### View Data

```bash
npx convex data reports
```

### Watch Logs

```bash
npx convex logs --history 20
```

## Development Workflow

### 1. Start Dev Server

```bash
cd c:\dev\jobs\site
npm run dev
```

Frontend runs on `http://localhost:5175` (or next available port)

### 2. Ingest Reports

```bash
node scripts/ingest-reports.mjs
```

### 3. View in Browser

Open `http://localhost:5175` - reports load automatically from Convex

## Data Flow

```
GitHub Repo (github.com/mccaigs/jobs)
    ↓
GitHub API (discover .md files)
    ↓
Ingestion Script (scripts/ingest-reports.mjs)
    ↓
HTTP Action (POST /ingest)
    ↓
Convex Mutation (upsertReport)
    ↓
Convex Database (reports table)
    ↓
Convex Query (listReports)
    ↓
React Frontend (useQuery)
    ↓
UI Components (display)
```

## Ingestion Details

### Frontmatter Parsing

The ingestion pipeline extracts:
- **title**: From first H1 heading
- **reportDate**: From filename (YYYY-MM-DD)
- **region**: From filename suffix (e.g., "uk-wide", "daily")
- **slug**: Generated from filename
- **displayLabel**: Formatted date + region

### Markdown Processing

- Full markdown body stored in `markdownBody` field
- Rendered client-side using `react-markdown` + `remark-gfm`
- Preserves all formatting, tables, and GitHub-flavored markdown

### Upsert Logic

- Reports are identified by `slug`
- Repeated ingestion updates existing records
- `createdAt` preserved, `updatedAt` refreshed
- Idempotent - safe to run multiple times

## Troubleshooting

### Reports Not Appearing

1. Check Convex data: `npx convex data reports`
2. Verify environment: `echo $env:VITE_CONVEX_URL`
3. Check browser console for query errors
4. Verify dev server is running

### Ingestion Failures

1. Check HTTP action logs: `npx convex logs`
2. Verify markdown files exist in `c:\dev\jobs\reports\`
3. Test single report ingestion manually
4. Check JSON encoding (use Node.js script, not PowerShell)

### Deployment Issues

1. Ensure `convex/` folder is at `site/convex/` (not repo root)
2. Run from `site/` directory where `package.json` exists
3. Verify deploy key is set correctly
4. Check `npx convex function-spec` shows functions

## Future Automation

The ingestion layer is designed to support:
- **Scheduled ingestion**: Cron job calling the script
- **GitHub webhook**: Trigger on push to `reports/` folder
- **CI/CD pipeline**: Automated ingestion on deploy

To add automation, simply call:
```bash
node c:\dev\jobs\site\scripts\ingest-reports.mjs
```

Or POST to the HTTP action:
```bash
curl -X POST https://third-lark-419.convex.site/ingest/github \
  -H "Content-Type: application/json" \
  -d '{"repo": "mccaigs/jobs"}'
```

## Security Notes

- Convex deployment uses dev key (not production)
- HTTP actions are public (no authentication required)
- For production, add authentication to `/ingest` endpoints
- Consider rate limiting for public endpoints

## Success Metrics

✅ **Completed**:
- 16 reports successfully ingested from GitHub
- Live ingestion from `github.com/mccaigs/jobs`
- Frontend loads data from Convex
- All UI components working
- Loading/error states handled
- Existing design preserved
- Multiple filename formats supported

## Next Steps

1. Push new reports to `github.com/mccaigs/jobs`
2. Run `node scripts/ingest-reports.mjs` to sync
3. Refresh browser to see new reports
4. Consider adding authentication for production
5. Set up automated ingestion schedule (webhook or cron)
