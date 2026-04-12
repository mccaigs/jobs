import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

const ORDINAL_SUFFIXES = ["th", "st", "nd", "rd"];
function ordinal(n: number): string {
  const v = n % 100;
  return n + (ORDINAL_SUFFIXES[(v - 20) % 10] ?? ORDINAL_SUFFIXES[v] ?? ORDINAL_SUFFIXES[0]);
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const REGION_MAP: Record<string, string> = {
  edinburgh: "Edinburgh",
  "uk-wide": "UK",
  uk: "UK",
  daily: "Edinburgh",
  jobs: "Edinburgh",
  london: "London",
  cambridge: "Cambridge",
  manchester: "Manchester",
  scotland: "Scotland",
  nationwide: "UK",
};

function parseFrontmatter(raw: string): { frontmatter: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };
  const fm: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
    if (key) fm[key] = value;
  }
  return { frontmatter: fm, body: match[2] };
}

function extractNumber(text: string, patterns: RegExp[]): number {
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const n = parseInt(m[1].replace(/,/g, ""), 10);
      if (!isNaN(n)) return n;
    }
  }
  return 0;
}

function extractFitScore(text: string, patterns: RegExp[]): number {
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!isNaN(n) && n >= 0 && n <= 100) return n;
    }
  }
  return 0;
}

function deriveMetaFromFilename(filename: string) {
  const base = filename.replace(/\.md$/, "").split("/").pop() ?? filename;
  
  let year: string, month: string, day: string, suffix: string;
  
  const isoMatch = base.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (isoMatch) {
    [, year, month, day, suffix] = isoMatch;
  } else {
    const ddmmyyyyMatch = base.match(/^(\d{2})-(\d{2})-(\d{4})-(.+)$/);
    if (ddmmyyyyMatch) {
      const [, d, m, y, s] = ddmmyyyyMatch;
      day = d; month = m; year = y; suffix = s;
    } else {
      const prefixMatch = base.match(/^.+?-(\d{2})-(\d{2})-(\d{4})-(.+)$/);
      if (prefixMatch) {
        const [, d, m, y, s] = prefixMatch;
        day = d; month = m; year = y; suffix = s;
      } else {
        const prefixIsoMatch = base.match(/^.+?-(\d{4})-(\d{2})-(\d{2})-(.+)$/);
        if (prefixIsoMatch) {
          [, year, month, day, suffix] = prefixIsoMatch;
        } else {
          return null;
        }
      }
    }
  }
  
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  if (isNaN(date.getTime())) return null;
  
  const suffixKey = suffix.toLowerCase();
  const type = suffixKey.includes("uk") || base.toLowerCase().includes("uk") ? "uk-wide" : "daily";
  let region = "Edinburgh";
  for (const [key, label] of Object.entries(REGION_MAP)) {
    if (suffixKey === key || suffixKey.includes(key) || base.toLowerCase().includes(key)) { 
      region = label; 
      break; 
    }
  }
  
  const dayNum = parseInt(day, 10);
  const monthName = MONTH_NAMES[parseInt(month, 10) - 1] ?? month;
  const displayLabel = `${ordinal(dayNum)} ${monthName} · ${region}`;
  
  return { slug: base, date, type: type as "daily" | "uk-wide", region, displayLabel };
}

function extractSummary(content: string): string {
  const lines = content.split("\n");
  let summary = "";
  let inFirstPara = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      if (inFirstPara && summary) break;
      continue;
    }
    if (trimmed.startsWith("|") || trimmed.startsWith("```") || trimmed.startsWith("-")) {
      if (inFirstPara && summary) break;
      continue;
    }
    inFirstPara = true;
    summary += (summary ? " " : "") + trimmed;
    if (summary.length > 300) break;
  }
  return summary;
}

http.route({
  path: "/ingest",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { filename, content, sourceRepo } = body as {
      filename?: string;
      content?: string;
      sourceRepo?: string;
    };

    if (!filename || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: filename, content" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const fileMeta = deriveMetaFromFilename(filename);
    if (!fileMeta) {
      return new Response(
        JSON.stringify({ error: `Cannot parse filename: ${filename}` }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      );
    }

    const { frontmatter, body: markdownBody } = parseFrontmatter(content);

    const title = frontmatter.title ?? fileMeta.displayLabel;
    const displayLabel = frontmatter.displayLabel ?? fileMeta.displayLabel;
    const region = frontmatter.region ?? fileMeta.region;
    const type = (frontmatter.type as "daily" | "uk-wide") ?? fileMeta.type;
    const summary = frontmatter.summary ?? extractSummary(markdownBody);

    const fitScore = extractFitScore(markdownBody, [
      /top\s+fit[:\s]+(\d{2,3})%?/i,
      /highest?\s+(?:fit|score|match)[:\s]+(\d{2,3})%?/i,
      /best\s+(?:fit|score|match)[:\s]+(\d{2,3})%?/i,
      /(\d{2,3})%\s+fit/i,
      /fit[:\s]+(\d{2,3})%/i,
    ]);

    const totalScanned = extractNumber(markdownBody, [
      /(\d+)\s+(?:jobs?|roles?|positions?|listings?)\s+(?:scanned|found|analysed|analyzed|reviewed|identified)/i,
      /(?:scanned|analysed|reviewed|found)\s+(\d+)\s+(?:jobs?|roles?|positions?)/i,
      /total[:\s]+(\d+)\s+(?:jobs?|roles?)/i,
    ]);

    const highFitCount = extractNumber(markdownBody, [
      /(\d+)\s+high[\s-]fit/i,
      /high[\s-]fit[:\s]+(\d+)/i,
      /(\d+)\s+(?:strong|excellent)\s+(?:matches?|fits?)/i,
    ]);

    const averageFitScore = extractFitScore(markdownBody, [
      /avg(?:erage)?\s+fit[:\s]+(\d{2,3})%?/i,
      /average\s+(?:fit|score|match)[:\s]+(\d{2,3})%?/i,
    ]);

    const tagsRaw = frontmatter.tags;
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t: string) => t.trim()).filter(Boolean)
      : undefined;

    const id = await ctx.runMutation(api.reports.upsertReport, {
      slug: fileMeta.slug,
      title,
      displayLabel,
      region,
      reportDate: fileMeta.date.getTime(),
      type,
      summary,
      markdownBody,
      sourcePath: filename,
      sourceRepo: sourceRepo ?? "mccaigs/jobs",
      fitScore: fitScore || undefined,
      totalScanned: totalScanned || undefined,
      highFitCount: highFitCount || undefined,
      averageFitScore: averageFitScore || undefined,
      tags,
      jobType: frontmatter.jobType,
      employmentType: frontmatter.employmentType,
      salaryOrRate: frontmatter.salaryOrRate,
      publishedAt: fileMeta.date.getTime(),
    });

    return new Response(
      JSON.stringify({ ok: true, id, slug: fileMeta.slug }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),
});

http.route({
  path: "/ingest/github",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { repo, token } = body as { repo?: string; token?: string };
    const targetRepo = repo ?? "mccaigs/jobs";
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const listUrl = `https://api.github.com/repos/${targetRepo}/contents/reports`;
    const listRes = await fetch(listUrl, { headers });
    if (!listRes.ok) {
      return new Response(
        JSON.stringify({ error: `GitHub API error: ${listRes.status} ${listRes.statusText}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const files: Array<{ name: string; path: string; type: string; download_url: string }> =
      await listRes.json();

    const mdFiles = files.filter(
      (f) => f.type === "file" && /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f.name)
    );

    const results: Array<{ slug: string; ok: boolean; error?: string }> = [];

    for (const file of mdFiles) {
      try {
        const rawRes = await fetch(file.download_url, { headers });
        if (!rawRes.ok) throw new Error(`Failed to fetch ${file.name}: ${rawRes.statusText}`);
        const content = await rawRes.text();

        const fileMeta = deriveMetaFromFilename(file.name);
        if (!fileMeta) { results.push({ slug: file.name, ok: false, error: "Unrecognised filename" }); continue; }

        const { frontmatter, body: markdownBody } = parseFrontmatter(content);
        const title = frontmatter.title ?? fileMeta.displayLabel;
        const displayLabel = frontmatter.displayLabel ?? fileMeta.displayLabel;
        const region = frontmatter.region ?? fileMeta.region;
        const type = (frontmatter.type as "daily" | "uk-wide") ?? fileMeta.type;
        const summary = frontmatter.summary ?? extractSummary(markdownBody);

        const fitScore = extractFitScore(markdownBody, [
          /top\s+fit[:\s]+(\d{2,3})%?/i,
          /(\d{2,3})%\s+fit/i,
          /fit[:\s]+(\d{2,3})%/i,
        ]);

        const totalScanned = extractNumber(markdownBody, [
          /(\d+)\s+(?:jobs?|roles?|positions?)\s+(?:scanned|found|analysed|analyzed|reviewed)/i,
          /(?:scanned|analysed|reviewed|found)\s+(\d+)\s+(?:jobs?|roles?|positions?)/i,
        ]);

        const highFitCount = extractNumber(markdownBody, [
          /(\d+)\s+high[\s-]fit/i,
          /high[\s-]fit[:\s]+(\d+)/i,
        ]);

        const averageFitScore = extractFitScore(markdownBody, [
          /avg(?:erage)?\s+fit[:\s]+(\d{2,3})%?/i,
          /average\s+(?:fit|score|match)[:\s]+(\d{2,3})%?/i,
        ]);

        await ctx.runMutation(api.reports.upsertReport, {
          slug: fileMeta.slug,
          title,
          displayLabel,
          region,
          reportDate: fileMeta.date.getTime(),
          type,
          summary,
          markdownBody,
          sourcePath: file.path,
          sourceRepo: targetRepo,
          fitScore: fitScore || undefined,
          totalScanned: totalScanned || undefined,
          highFitCount: highFitCount || undefined,
          averageFitScore: averageFitScore || undefined,
          publishedAt: fileMeta.date.getTime(),
        });

        results.push({ slug: fileMeta.slug, ok: true });
      } catch (err) {
        results.push({ slug: file.name, ok: false, error: String(err) });
      }
    }

    return new Response(
      JSON.stringify({ ok: true, ingested: results.filter((r) => r.ok).length, results }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),
});

/**
 * POST /ingest/sync
 * Manually triggers the GitHub ingestion action immediately.
 * Writes a syncLog entry after each run so the admin panel can show last sync status.
 */
http.route({
  path: "/ingest/sync",
  method: "POST",
  handler: httpAction(async (ctx) => {
    const ranAt = Date.now();
    try {
      const result = await ctx.runAction(internal.githubIngest.ingestLatestJobReport, {});

      // Derive latestReportDate from the most-recently inserted/updated report
      const latestReport = await ctx.runQuery(api.jobReportsQueries.listJobReports, {});
      const latestReportDate =
        Array.isArray(latestReport) && latestReport.length > 0
          ? (latestReport[0].reportDate ?? latestReport[0].pulledAt)
          : undefined;

      await ctx.runMutation(internal.syncLog.writeSyncLog, {
        ranAt,
        success: (result as { success?: boolean }).success ?? true,
        inserted: (result as { processed?: number }).processed ?? 0,
        updated: (result as { updated?: number }).updated ?? 0,
        skipped: (result as { skipped?: number }).skipped ?? 0,
        errors: (result as { errors?: string[] }).errors ?? [],
        totalFiles: (result as { totalFiles?: number }).totalFiles ?? 0,
        latestReportDate,
        message: (result as { message?: string }).message ?? "Sync complete",
      });

      return new Response(JSON.stringify({ ok: true, result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      await ctx.runMutation(internal.syncLog.writeSyncLog, {
        ranAt,
        success: false,
        inserted: 0,
        updated: 0,
        skipped: 0,
        errors: [String(err)],
        totalFiles: 0,
        message: String(err),
      });
      return new Response(JSON.stringify({ ok: false, error: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
