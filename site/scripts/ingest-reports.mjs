#!/usr/bin/env node
import { fetchAllReports } from './githubReports.mjs';

const CONVEX_URL = 'https://third-lark-419.convex.site/ingest';
const GITHUB_OWNER = 'mccaigs';
const GITHUB_REPO = 'jobs';
const GITHUB_BRANCH = 'master';

async function ingestReport(filename, content, sha) {
  const payload = {
    filename,
    content,
    sourceRepo: `${GITHUB_OWNER}/${GITHUB_REPO}`,
    sourceSha: sha
  };

  const response = await fetch(CONVEX_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return await response.json();
}

async function main() {
  console.log('🚀 Starting GitHub ingestion');
  console.log(`📦 Source: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`);
  console.log(`🎯 Target: ${CONVEX_URL}\n`);
  
  const reports = await fetchAllReports(GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH);
  const results = [];

  console.log(`\n📥 Ingesting ${reports.length} reports to Convex...\n`);

  for (const report of reports) {
    process.stdout.write(`📄 Processing: ${report.filename}... `);
    
    try {
      const result = await ingestReport(report.filename, report.content, report.sha);
      console.log(`✅ ${result.slug}`);
      results.push({ file: report.filename, status: 'success', slug: result.slug });
    } catch (error) {
      console.log(`❌ ${error.message}`);
      results.push({ file: report.filename, status: 'failed', error: error.message });
    }
  }

  console.log('\n=== Ingestion Summary ===');
  const success = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'failed').length;
  console.log(`Total: ${results.length} | Success: ${success} | Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failed files:');
    results.filter(r => r.status === 'failed').forEach(r => {
      console.log(`  - ${r.file}: ${r.error}`);
    });
    process.exit(1);
  }
  
  console.log('\n✨ GitHub ingestion complete!');
}

main().catch(console.error);
