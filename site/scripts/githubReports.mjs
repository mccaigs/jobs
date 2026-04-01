#!/usr/bin/env node

const GITHUB_API = 'https://api.github.com';
const GITHUB_RAW = 'https://raw.githubusercontent.com';

export async function discoverReportFiles(owner, repo, branch = 'master') {
  const treeUrl = `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  
  const response = await fetch(treeUrl, {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  const markdownFiles = data.tree
    .filter(item => item.type === 'blob' && item.path.endsWith('.md'))
    .filter(item => item.path !== 'README.md')
    .map(item => ({
      path: item.path,
      sha: item.sha,
      url: item.url
    }));

  return markdownFiles;
}

export async function fetchReportContent(owner, repo, filePath, branch = 'master') {
  const rawUrl = `${GITHUB_RAW}/${owner}/${repo}/${branch}/${filePath}`;
  
  const response = await fetch(rawUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`);
  }

  return await response.text();
}

export async function fetchAllReports(owner, repo, branch = 'master') {
  console.log(`🔍 Discovering markdown files in ${owner}/${repo}...`);
  
  const files = await discoverReportFiles(owner, repo, branch);
  console.log(`📋 Found ${files.length} markdown files`);

  const reports = [];

  for (const file of files) {
    try {
      const content = await fetchReportContent(owner, repo, file.path, branch);
      reports.push({
        filename: file.path,
        content,
        sha: file.sha
      });
    } catch (error) {
      console.error(`⚠️  Failed to fetch ${file.path}: ${error.message}`);
    }
  }

  return reports;
}
