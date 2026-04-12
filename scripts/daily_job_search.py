#!/usr/bin/env python3
"""
Daily UK AI Job Search Automation
Searches multiple job boards for permanent AI roles matching David Robertson's CV.
Uses Claude API with prompt caching for intelligent filtering and ranking.
"""

import os
import json
import sys
import re
import requests
import feedparser
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from urllib.parse import urljoin

try:
    import anthropic
except ImportError:
    print("Error: anthropic package not installed. Run: pip install -r scripts/requirements.txt")
    sys.exit(1)

# ============================================================================
# Configuration
# ============================================================================

ADZUNA_APP_ID = os.environ.get('ADZUNA_APP_ID', '')
ADZUNA_API_KEY = os.environ.get('ADZUNA_API_KEY', '')
REED_API_KEY = os.environ.get('REED_API_KEY', '')
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY', '')
DRY_RUN = os.environ.get('DRY_RUN', 'false').lower() == 'true'

if not all([ADZUNA_APP_ID, ADZUNA_API_KEY, REED_API_KEY, ANTHROPIC_API_KEY]):
    print("❌ Missing API credentials. Please set:")
    print("   - ADZUNA_APP_ID, ADZUNA_API_KEY")
    print("   - REED_API_KEY")
    print("   - ANTHROPIC_API_KEY")
    sys.exit(1)

# ============================================================================
# CV Profile
# ============================================================================

CV_PROFILE = """DAVID ROBERTSON
AI Architect · AI Systems Engineer · AI Product Builder
Edinburgh, UK

PROFILE
AI systems builder with deep experience designing and delivering production AI systems that execute real work.
Specialises in workflow automation, multi-step AI execution, retrieval systems, structured data pipelines, and AI-powered SaaS products.

CORE SKILLS
- LLM Integration & AI Agents
- Workflow Automation & Task Execution
- AI Systems Architecture
- Retrieval / Search Systems
- Structured Data Pipelines
- Next.js / TypeScript
- Node.js / Python
- REST APIs & SaaS Integration
- VPS / Linux / Production Deployment
- Product Architecture
- Stakeholder Collaboration

EXPERIENCE HIGHLIGHTS
- Built production AI SaaS platforms across education and recruitment
- Architected agentic execution systems and orchestration pipelines
- Designed AI job matching, CV optimisation, and structured scoring systems
- Founded early EdTech search platform UniSearch (1998-2003)
- Strong commercial and product leadership background
- 20+ years in high-pressure commercial environments

PREFERENCES
- Remote-first or Edinburgh-based roles
- Permanent / Full-Time positions
- Senior-level roles (£95k+ base)
- Production AI systems, not demos
"""

# Search keywords
KEYWORDS = [
    "AI Engineer",
    "AI Architect",
    "Machine Learning Engineer",
    "Generative AI",
    "LLM Engineer",
    "Applied AI",
    "AI Solutions Engineer",
    "Head of AI",
]

LOCATIONS = ["remote", "edinburgh", "scotland"]

# ============================================================================
# Data Classes
# ============================================================================

@dataclass
class Job:
    """Represents a job listing"""
    title: str
    company: str
    location: str
    url: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "GBP"
    description: Optional[str] = None
    posted_date: Optional[str] = None
    contract_type: str = "permanent"
    contract_time: str = "full_time"
    source: str = "unknown"
    employment_type: str = "Permanent / Full-Time"

    def salary_str(self) -> str:
        """Format salary for display"""
        if self.salary_min and self.salary_max:
            return f"£{self.salary_min:,} – £{self.salary_max:,}"
        elif self.salary_min:
            return f"£{self.salary_min:,}+"
        else:
            return "Not stated"

    def summary_for_claude(self) -> str:
        """Create a summary for Claude evaluation"""
        desc = (self.description or "")[:400]
        return f"""
Title: {self.title}
Company: {self.company}
Location: {self.location}
Salary: {self.salary_str()}
URL: {self.url}
Description: {desc}
"""


# ============================================================================
# Job Search Functions
# ============================================================================

def search_adzuna(keyword: str) -> List[Job]:
    """Search Adzuna API for permanent AI roles"""
    jobs = []

    try:
        params = {
            "app_id": ADZUNA_APP_ID,
            "app_key": ADZUNA_API_KEY,
            "what": keyword,
            "where": "uk",
            "full_time": 1,
            "permanent": 1,
            "results_per_page": 20,
            "max_days_old": 1,  # Last 24 hours
            "content-type": "application/json",
        }

        response = requests.get(
            "https://api.adzuna.com/v1/api/jobs/gb/search/1",
            params=params,
            timeout=10
        )

        if response.status_code == 200:
            data = response.json()

            for result in data.get("results", []):
                job = Job(
                    title=result.get("title", ""),
                    company=result.get("company", {}).get("display_name", "Unknown"),
                    location=result.get("location", {}).get("display_name", ""),
                    url=result.get("redirect_url", ""),
                    salary_min=result.get("salary_min"),
                    salary_max=result.get("salary_max"),
                    description=result.get("description", ""),
                    posted_date=result.get("created", ""),
                    contract_type=result.get("contract_type", "permanent"),
                    contract_time=result.get("contract_time", "full_time"),
                    source="adzuna",
                )

                if job.url and job.title:
                    jobs.append(job)
        else:
            print(f"⚠️  Adzuna API error for '{keyword}': {response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f"⚠️  Adzuna request failed for '{keyword}': {e}")

    return jobs


def search_reed() -> List[Job]:
    """Search Reed.co.uk API for permanent AI roles"""
    jobs = []

    try:
        for location in LOCATIONS:
            for keyword in KEYWORDS:
                params = {
                    "keywords": keyword,
                    "locationName": location.capitalize(),
                    "permanent": "true",
                    "fullTime": "true",
                }

                response = requests.get(
                    "https://www.reed.co.uk/api/1.0/search",
                    params=params,
                    auth=(REED_API_KEY, ""),
                    timeout=10
                )

                if response.status_code == 200:
                    data = response.json()

                    for result in data.get("results", []):
                        # Check if posted within last 24 hours
                        posted_str = result.get("datePosted", "")
                        if posted_str:
                            try:
                                posted_date = datetime.fromisoformat(
                                    posted_str.replace("Z", "+00:00")
                                )
                                age = datetime.now(timezone.utc) - posted_date
                                if age > timedelta(hours=24):
                                    continue
                            except ValueError:
                                pass

                        job = Job(
                            title=result.get("jobTitle", ""),
                            company=result.get("employerName", ""),
                            location=result.get("locationName", ""),
                            url=result.get("jobUrl", ""),
                            salary_min=result.get("minimumSalary"),
                            salary_max=result.get("maximumSalary"),
                            description=result.get("jobDescription", ""),
                            posted_date=result.get("datePosted", ""),
                            contract_type="permanent",
                            contract_time="full_time",
                            source="reed",
                        )

                        if job.url and job.title:
                            jobs.append(job)
                elif response.status_code != 404:
                    print(f"⚠️  Reed API error for '{keyword}' in {location}: {response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f"⚠️  Reed request failed: {e}")

    return jobs


def search_aijobs_rss() -> List[Job]:
    """Parse AIJobs.net RSS feed for AI-specific roles"""
    jobs = []

    try:
        feed = feedparser.parse("https://aijobs.net/feed/")

        if feed.get("bozo_exception"):
            print(f"⚠️  AIJobs RSS parse error: {feed.bozo_exception}")
            return jobs

        cutoff = datetime.now(timezone.utc) - timedelta(hours=24)

        for entry in feed.get("entries", []):
            # Parse published date
            published_str = entry.get("published", "")
            if published_str:
                try:
                    from email.utils import parsedate_to_datetime
                    published = parsedate_to_datetime(published_str)
                    if published.replace(tzinfo=timezone.utc) < cutoff:
                        continue
                except (ValueError, TypeError):
                    pass

            # Extract job details from RSS entry
            title = entry.get("title", "")
            location = entry.get("location", "")
            company = entry.get("author", "")
            link = entry.get("link", "")
            description = entry.get("summary", "")

            # Simple salary extraction from description
            salary_min = salary_max = None
            salary_pattern = r"£([\d,]+)\s*(?:[-–]\s*£([\d,]+))?"
            salary_match = re.search(salary_pattern, description or "")
            if salary_match:
                salary_min = int(salary_match.group(1).replace(",", ""))
                if salary_match.group(2):
                    salary_max = int(salary_match.group(2).replace(",", ""))

            job = Job(
                title=title,
                company=company,
                location=location,
                url=link,
                salary_min=salary_min,
                salary_max=salary_max,
                description=description,
                posted_date=published_str,
                source="aijobs",
            )

            if job.url and job.title:
                jobs.append(job)

    except Exception as e:
        print(f"⚠️  AIJobs RSS parsing failed: {e}")

    return jobs


# ============================================================================
# Deduplication
# ============================================================================

def deduplicate_jobs(jobs: List[Job]) -> List[Job]:
    """Remove duplicate jobs by URL and title"""
    seen = {}
    unique = []

    for job in jobs:
        # Use URL as primary key
        key = job.url.lower().strip()

        if key not in seen:
            seen[key] = True
            unique.append(job)

    return unique


# ============================================================================
# Claude Filtering & Ranking
# ============================================================================

def filter_and_rank_jobs_with_claude(jobs: List[Job]) -> List[Dict[str, Any]]:
    """Use Claude API to filter and rank jobs against the CV"""

    if not jobs:
        return []

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # Batch jobs for Claude evaluation
    batch_size = 15
    all_evaluations = []

    for batch_start in range(0, len(jobs), batch_size):
        batch_end = min(batch_start + batch_size, len(jobs))
        batch = jobs[batch_start:batch_end]

        print(f"  Evaluating batch {batch_start // batch_size + 1} ({len(batch)} jobs)...")

        job_summaries = "\n---\n".join(
            f"Job {i}: {job.summary_for_claude()}"
            for i, job in enumerate(batch, start=1)
        )

        prompt = f"""You are an expert recruiter matching job opportunities to an AI systems engineer's profile.

CANDIDATE PROFILE:
{CV_PROFILE}

JOBS TO EVALUATE:
{job_summaries}

For each job, evaluate:
1. Is this a genuine SENIOR-LEVEL match? (Score 0-100)
2. Is it remote/Edinburgh/Scotland hybrid (max 2 days on-site)?
3. Is it permanent/full-time?
4. Does it meet the £95k+ compensation target (or better)?

Return a JSON array with ONLY jobs you would recommend (fit_score >= 65):

[
  {{
    "job_index": 1,
    "fit_score": 85,
    "remote_status": "Fully Remote" | "Edinburgh Hybrid" | "Scotland Hybrid" | "UK Hybrid",
    "why_matches": "One sentence explaining why this is a great fit"
  }}
]

CRITICAL: Only include jobs with fit_score >= 65 that genuinely align with David's profile.
Do NOT include junior, contract, or below-market roles."""

        try:
            response = client.messages.create(
                model="claude-opus-4-6",
                max_tokens=2000,
                system=[
                    {
                        "type": "text",
                        "text": "You are an expert technical recruiter specializing in AI engineering roles.",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            response_text = response.content[0].text

            # Extract JSON from response
            json_match = re.search(r'\[.*?\]', response_text, re.DOTALL)
            if json_match:
                evaluations = json.loads(json_match.group())

                for eval in evaluations:
                    if 0 <= eval.get("job_index", 0) - 1 < len(batch):
                        job = batch[eval["job_index"] - 1]
                        all_evaluations.append({
                            "job": job,
                            "fit_score": eval.get("fit_score", 0),
                            "remote_status": eval.get("remote_status", "Unknown"),
                            "why_matches": eval.get("why_matches", "Strong alignment"),
                        })

        except Exception as e:
            print(f"❌ Claude API error: {e}")
            continue

    # Sort by fit score
    all_evaluations.sort(key=lambda x: x["fit_score"], reverse=True)

    return all_evaluations


# ============================================================================
# Markdown Generation
# ============================================================================

def generate_markdown(evaluated_jobs: List[Dict[str, Any]], date: datetime) -> str:
    """Generate the output markdown file"""

    date_str = date.strftime("%d %B %Y")
    date_short = date.strftime("%d-%m-%Y")

    header = f"""# UK AI Daily Job Search — {date_str}

> **Search Parameters:** Keywords: AI Engineer, AI Architect, Machine Learning, Generative AI, LLM, Applied AI, Head of AI | Location: Remote UK + Edinburgh/Scotland Hybrid (≤2 days on-site)
>
> **CV Match Note:** Roles assessed against David Robertson's profile — AI systems architect specialising in LLM integration, agentic AI, workflow automation, structured output pipelines, SaaS product AI features, Python, TypeScript, Node.js, production deployment. Targeting permanent roles at £95k+.
>
> **Sources Searched:** Adzuna (aggregates Reed, Totaljobs, CWJobs, CV-Library, JobServe), Reed.co.uk, AIJobs.net
>
> **Timestamp:** {date.isoformat()}

---

"""

    if not evaluated_jobs:
        return header + "> No qualifying permanent AI roles found today matching the search criteria and CV profile.\n"

    sections = []

    for i, eval_data in enumerate(evaluated_jobs, start=1):
        job = eval_data["job"]
        fit_score = eval_data["fit_score"]
        remote_status = eval_data["remote_status"]
        why_matches = eval_data["why_matches"]

        section = f"""## {i}. {job.title} — {job.company}

**Link:** [{job.company}]({job.url})
**Salary:** {job.salary_str()}
**Employment Type:** {job.employment_type}
**Remote Status:** {remote_status}
**Location:** {job.location}
**Posted:** {job.posted_date or "Recent'}
**Source:** {job.source.capitalize()}

**Why It Matches:**
{why_matches}

**Fit Score:** {fit_score}/100

---

"""
        sections.append(section)

    return header + "\n".join(sections)


# ============================================================================
# Main Execution
# ============================================================================

def main():
    """Main job search execution"""

    today = datetime.now(timezone.utc)
    date_str = today.strftime("%d-%m-%Y")

    print(f"\n🔍 Starting daily AI job search for {today.strftime('%d %B %Y')}...")
    print(f"📌 Searching for: permanent, remote/Edinburgh-based AI roles")

    # Collect jobs from all sources
    print("\n📡 Searching job boards...")
    all_jobs = []

    # Adzuna search
    print("  • Adzuna API...", end=" ", flush=True)
    adzuna_jobs = []
    for keyword in KEYWORDS:
        adzuna_jobs.extend(search_adzuna(keyword))
    print(f"({len(adzuna_jobs)} found)")
    all_jobs.extend(adzuna_jobs)

    # Reed search
    print("  • Reed.co.uk API...", end=" ", flush=True)
    reed_jobs = search_reed()
    print(f"({len(reed_jobs)} found)")
    all_jobs.extend(reed_jobs)

    # AIJobs.net RSS
    print("  • AIJobs.net RSS...", end=" ", flush=True)
    aijobs = search_aijobs_rss()
    print(f"({len(aijobs)} found)")
    all_jobs.extend(aijobs)

    print(f"\n✅ Total raw results: {len(all_jobs)} jobs")

    # Deduplicate
    print(f"🔄 Deduplicating...", end=" ")
    unique_jobs = deduplicate_jobs(all_jobs)
    print(f"({len(unique_jobs)} unique)")

    # Filter and rank with Claude
    print(f"\n🤖 Filtering and ranking with Claude...", end="\n")
    evaluated_jobs = filter_and_rank_jobs_with_claude(unique_jobs)

    print(f"✅ {len(evaluated_jobs)} high-quality matches found")

    # Generate output file
    output_dir = "jobs"
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, f"UK-AI-DailyJobSearch-{date_str}-jobs.md")

    markdown = generate_markdown(evaluated_jobs, today)

    if not DRY_RUN:
        with open(output_file, 'w') as f:
            f.write(markdown)
        print(f"\n📝 Written to {output_file}")
    else:
        print(f"\n📝 [DRY RUN] Would write to {output_file}")

    # Log if no matches
    if not evaluated_jobs:
        logs_dir = "logs"
        os.makedirs(logs_dir, exist_ok=True)
        logs_file = os.path.join(logs_dir, "logs.md")

        log_entry = f"\n- No new permanent matches found — {date_str}\n"

        if not DRY_RUN:
            with open(logs_file, 'a') as f:
                f.write(log_entry)
            print(f"📋 Logged to {logs_file}")
        else:
            print(f"📋 [DRY RUN] Would log to {logs_file}")

    print("\n✅ Job search complete.\n")

    return len(evaluated_jobs)


if __name__ == "__main__":
    result = main()
    sys.exit(0)
