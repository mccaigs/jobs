# Daily AI Job Search Automation — Setup Guide

## Overview

This system automatically searches multiple UK job boards for permanent AI roles matching David Robertson's CV, twice daily (07:00 and 13:00 UK time). It uses:

- **GitHub Actions** — Scheduled automation runner
- **Python script** — Job board API integration + deduplication
- **Claude API** — Intelligent CV matching with prompt caching
- **Git automation** — Automatic commit and push of results

## Architecture

```
GitHub Actions (06:00 & 12:00 UTC)
    ↓
scripts/daily_job_search.py
    ├→ Search Adzuna API (UK permanent roles)
    ├→ Search Reed.co.uk API (UK permanent roles)
    ├→ Parse AIJobs.net RSS feed
    ├→ Deduplicate by URL
    ├→ Send batch to Claude API for filtering/ranking
    └→ Generate jobs/UK-AI-DailyJobSearch-DD-MM-YYYY-jobs.md
    ↓
Git commit & push to master
    ↓
Convex cron ingests latest file (existing system)
    ↓
Frontend displays results (existing system)
```

## Prerequisites

### 1. Job Board API Credentials

#### Adzuna (Job Aggregator)
- **Sign up:** https://developer.adzuna.com/
- **Get:** App ID and API key
- **Free tier:** 1,000 calls/month (sufficient for ~60 calls/day at 2 runs)
- **Documentation:** https://docs.adzuna.com/

#### Reed.co.uk
- **Sign up:** https://www.reed.co.uk/developers
- **Get:** API key (HTTP Basic Auth)
- **Free tier:** Unlimited requests
- **Documentation:** https://www.reed.co.uk/developer

#### AIJobs.net
- **No registration required** — Uses public RSS feed
- **Feed URL:** https://aijobs.net/feed/

### 2. Claude API Credential

- **Sign up:** https://console.anthropic.com
- **Get:** API key
- **Cost:** ~$0.05-0.10 per search run (with prompt caching)
- **Model used:** `claude-opus-4-6` (latest, most capable)

## GitHub Actions Setup

### Step 1: Add Secrets to Repository

1. Go to **GitHub repository** → **Settings** → **Secrets and variables** → **Actions**
2. Create these 4 secrets:

| Secret Name | Value | Where to get |
|-------------|-------|--------------|
| `ADZUNA_APP_ID` | Your Adzuna App ID | https://developer.adzuna.com/ |
| `ADZUNA_API_KEY` | Your Adzuna API key | https://developer.adzuna.com/ |
| `REED_API_KEY` | Your Reed API key | https://www.reed.co.uk/developers |
| `ANTHROPIC_API_KEY` | Your Claude API key | https://console.anthropic.com |

### Step 2: Verify Workflow

The workflow file is already in place:
- **Path:** `.github/workflows/daily-job-search.yml`
- **Schedule:** Runs at 06:00 and 12:00 UTC (07:00 and 13:00 UK time)
- **Trigger:** Automatic on schedule + manual via `workflow_dispatch`

To manually test:
1. Go to **GitHub** → **Actions** → **Daily UK AI Job Search**
2. Click **Run workflow** → **Run workflow**
3. Monitor the run in real-time

## Local Testing

### Run Locally (Dry Run)

```bash
# Set up environment
export ADZUNA_APP_ID=your_app_id
export ADZUNA_API_KEY=your_api_key
export REED_API_KEY=your_reed_key
export ANTHROPIC_API_KEY=your_claude_key
export DRY_RUN=true

# Install dependencies
pip install -r scripts/requirements.txt

# Run the script
python scripts/daily_job_search.py
```

This will:
- Search all job boards
- Run Claude filtering
- **NOT commit or push** (dry run)
- Show output on console

### Run Locally (Production Mode)

```bash
# Set environment variables as above
export DRY_RUN=false

# Configure git
git config user.name "AI Job Search Bot"
git config user.email "ai-job-bot@mccaigs.com"

# Run
python scripts/daily_job_search.py

# Manually push if needed
git push origin <your-branch>
```

## How It Works

### 1. Job Collection

**Adzuna API**
- Searches for each keyword in the `KEYWORDS` list
- Filters for: UK, Permanent, Full-time, Posted in last 24 hours
- Returns up to 20 results per keyword (multiple API calls)

**Reed API**
- Searches for each keyword in Edinburgh, Scotland, Remote locations
- Filters for: Permanent, Full-time, Posted in last 24 hours
- Handles basic auth with API key

**AIJobs.net RSS**
- Parses public RSS feed for AI-specific jobs
- Filters for posts within last 24 hours
- Extracts salary, location, and description

### 2. Deduplication

Jobs are deduplicated by URL to eliminate duplicates across sources.

### 3. Claude Filtering & Ranking

The script sends batches of jobs to Claude with:
- **System message:** Generic recruiter instructions (cached)
- **User message:** CV profile + job batch (not cached)
- **Prompt:** Evaluate each job against CV for:
  - Senior-level fit score (0-100)
  - Remote/hybrid status
  - Permanent/full-time confirmation
  - Compensation tier
  - Why it matches

**Claude returns JSON:**
```json
[
  {
    "job_index": 1,
    "fit_score": 85,
    "remote_status": "Fully Remote",
    "why_matches": "Production LLM systems and agentic workflows — perfect alignment with David's experience."
  },
  ...
]
```

Only jobs with `fit_score >= 65` are included in output.

### 4. Markdown Generation

Results are formatted as:

```markdown
# UK AI Daily Job Search — DD Month YYYY

## 1. Job Title — Company

**Link:** [Company](url)
**Salary:** £X,XXX – £Y,YYY
**Employment Type:** Permanent / Full-Time
**Remote Status:** Fully Remote
**Location:** Edinburgh
**Posted:** 2026-04-12

**Why It Matches:**
One sentence explaining fit.

**Fit Score:** 85/100

---
```

### 5. Git Commit & Push

If jobs found:
- Creates file: `jobs/UK-AI-DailyJobSearch-DD-MM-YYYY-jobs.md`
- Commits with message: `UK AI Daily job search update: DD-MM-YYYY`
- Pushes to `master` branch

If no matches:
- Appends to `logs/logs.md`
- Commits: `UK AI Daily job search update: DD-MM-YYYY`
- Pushes to `master` branch

## Monitoring

### GitHub Actions Dashboard

1. Go to **Actions** tab in repo
2. Click **Daily UK AI Job Search** workflow
3. See recent runs, logs, and status

### Output Files

- **Job results:** `jobs/UK-AI-DailyJobSearch-DD-MM-YYYY-jobs.md`
- **Log file:** `logs/logs.md` (updated if no matches)

### Frontend Display

The existing Convex cron system automatically:
- Detects new files in the repo (08:00 and 16:00 UK time)
- Ingests markdown content
- Displays in the React frontend at `/site`

## Customization

### Change Search Schedule

Edit `.github/workflows/daily-job-search.yml` line with `cron`:

```yaml
on:
  schedule:
    - cron: '0 6 * * *'    # 07:00 UK time
    - cron: '0 12 * * *'   # 13:00 UK time
```

[Cron syntax](https://crontab.guru/)

### Change CV Profile

Edit `scripts/daily_job_search.py` — search for `CV_PROFILE` (around line 70).

### Change Search Keywords

Edit `scripts/daily_job_search.py` — modify `KEYWORDS` list (around line 100).

### Change Minimum Fit Score

Edit `scripts/daily_job_search.py` — search for `fit_score >= 65` in Claude prompt.

### Change API Calls

- **Add new job board:** Create a `search_XXX()` function in `daily_job_search.py`
- **Remove source:** Comment out or remove the source call in `main()`

## API Rate Limits

### Adzuna
- **Free:** 1,000 calls/month
- **Current usage:** ~60 calls/day (2 runs × 30 keywords/locations) = ~1,800/month
- **Status:** Over free tier, but minimal cost to upgrade
- **Solution:** Batch keywords or upgrade account if needed

### Reed
- **Free:** Unlimited
- **Current usage:** ~60 calls/day
- **Status:** No limits

### Claude API
- **Cost:** ~$0.02-0.05 per run with prompt caching
- **Current usage:** 2 runs/day = ~$30-50/month
- **Rate limit:** 50,000 tokens/minute (claude-opus-4-6)
- **Status:** Well within limits

## Troubleshooting

### Workflow doesn't run
- ✅ Check **Actions** tab — is it enabled?
- ✅ Check **Secrets** — are all 4 credentials set?
- ✅ Check **Branch** — workflow pushes to `master`, not feature branch

### No jobs found
- ✅ Run locally with `DRY_RUN=true` to see what's happening
- ✅ Check API credentials are correct
- ✅ Check Claude's fit_score threshold (currently 65)
- ✅ Check if job boards are actually posting new roles

### Claude API errors
- ✅ Verify `ANTHROPIC_API_KEY` is correct
- ✅ Check API usage at https://console.anthropic.com
- ✅ Verify you're on a paid plan (free tier has limits)

### Git push fails
- ✅ Check permissions on the repository
- ✅ Ensure `GITHUB_TOKEN` secret is available (automatically provided)
- ✅ Check if branch is protected (workflow needs write access)

## Next Steps

### Phase 2: Application Automation
- Auto-generate tailored cover letters
- Auto-fill application forms
- Track applications in a database

### Phase 3: Advanced Filtering
- Parse salary expectations from job description
- Detect contract/freelance vs permanent in description
- Flag roles with suspicious requirements (phishing, fake postings)

### Phase 4: Market Analysis
- Trend salary over time
- Track which companies are hiring AI talent
- Identify emerging tech stacks

## Support

For issues or questions:
1. Check **GitHub Actions** logs for specific error
2. Run script locally with debugging
3. Verify API credentials are active
4. Check Claude API usage and quotas

---

**Last Updated:** 2026-04-12
**System Status:** ✅ Ready for production
