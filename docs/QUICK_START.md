# Quick Start: Daily AI Job Search Automation

## In 5 Minutes

### 1. Get API Keys (15 min)

| Service | URL | What to Get |
|---------|-----|------------|
| Adzuna | https://developer.adzuna.com/ | App ID + API key |
| Reed | https://www.reed.co.uk/developers | API key (free) |
| Claude | https://console.anthropic.com | API key (credit card required) |

### 2. Add Secrets to GitHub (2 min)

Go to **GitHub** → **Settings** → **Secrets and variables** → **Actions**

Add these 4 secrets:
- `ADZUNA_APP_ID` = your Adzuna App ID
- `ADZUNA_API_KEY` = your Adzuna API key
- `REED_API_KEY` = your Reed API key
- `ANTHROPIC_API_KEY` = your Claude API key

### 3. Test Locally (Optional, 5 min)

```bash
export ADZUNA_APP_ID=xxx
export ADZUNA_API_KEY=xxx
export REED_API_KEY=xxx
export ANTHROPIC_API_KEY=xxx
export DRY_RUN=true

pip install -r scripts/requirements.txt
python scripts/daily_job_search.py
```

### 4. Done! ✅

The workflow will run automatically at:
- **07:00 UK time** (06:00 UTC)
- **13:00 UK time** (12:00 UTC)

Manual trigger: Go to **Actions** → **Daily UK AI Job Search** → **Run workflow**

## What Happens

Each run:
1. Searches Adzuna, Reed, AIJobs.net for permanent AI roles
2. Claude filters and ranks against your CV
3. Creates markdown file: `jobs/UK-AI-DailyJobSearch-DD-MM-YYYY-jobs.md`
4. Pushes to GitHub automatically
5. Frontend displays results (already set up via Convex)

## Files Created

```
.github/workflows/daily-job-search.yml    ← Automation config
scripts/daily_job_search.py               ← Main search script
scripts/requirements.txt                  ← Python dependencies
logs/logs.md                              ← Search log
```

## Customization

- **Keywords:** Edit `KEYWORDS` in `scripts/daily_job_search.py`
- **CV:** Edit `CV_PROFILE` in `scripts/daily_job_search.py`
- **Schedule:** Edit cron in `.github/workflows/daily-job-search.yml`
- **Fit score threshold:** Edit `fit_score >= 65` in Claude prompt

See `docs/AUTOMATION_SETUP.md` for detailed setup and troubleshooting.

---

**Cost:** ~$30-50/month (Claude API) + negligible API calls to Adzuna/Reed
