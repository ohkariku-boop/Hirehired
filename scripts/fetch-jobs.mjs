/**
 * Daily job discovery — mid / senior / director only
 * Prefer direct Greenhouse/Lever job URLs over generic career hubs
 * Target: add at least 20 fresh roles when available
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jobsPath = join(__dirname, "../src/data/jobs.json");

const LEVEL_RE = /\b(mid[- ]?level|mid[- ]?senior|senior|staff|principal|lead|manager|director|head of|vp|vice president)\b/i;
const JUNIOR_RE = /\b(intern|junior|graduate|entry[- ]?level|associate (?!director))\b/i;

const APAC_KEYWORDS = [
  "singapore", "hong kong", "tokyo", "sydney", "melbourne", "seoul",
  "jakarta", "bangkok", "manila", "kuala lumpur", "taipei", "apac", "asia",
  "india", "bangalore", "bengaluru", "mumbai", "hyderabad",
];

function isApac(text) {
  const t = (text || "").toLowerCase();
  return APAC_KEYWORDS.some((k) => t.includes(k));
}

function isTargetLevel(title) {
  if (JUNIOR_RE.test(title || "")) return false;
  return LEVEL_RE.test(title || "");
}

function levelFromTitle(title) {
  const t = title || "";
  if (/\b(director|head of|vp|vice president)\b/i.test(t)) return "Director";
  if (/\b(staff|principal)\b/i.test(t)) return "Senior";
  if (/\b(senior|lead|manager)\b/i.test(t)) return "Senior";
  if (/\bmid\b/i.test(t)) return "Mid";
  return "Senior";
}

function isDirectJobUrl(url) {
  if (!url) return false;
  return /greenhouse\.io\/.+\/jobs\/\d+/i.test(url)
    || /lever\.co\/[^/]+\/[a-f0-9-]{8,}/i.test(url)
    || /jobs\.ashbyhq\.com\/[^/]+\/[a-f0-9-]+/i.test(url)
    || /job-boards\.(eu\.)?greenhouse\.io\/.+\/jobs\/\d+/i.test(url);
}

function normalizeType(t) {
  if (/contract|freelance|temp/i.test(t || "")) return "Contract";
  return "Permanent";
}

async function fetchRemoteOK() {
  try {
    const res = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": "HirehiredBot/1.0" },
    });
    if (!res.ok) throw new Error(`RemoteOK ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data.slice(1) : [];
  } catch (e) {
    console.warn("RemoteOK fetch failed:", e.message);
    return [];
  }
}

async function fetchRemotive() {
  try {
    const res = await fetch("https://remotive.com/api/remote-jobs?limit=100", {
      headers: { "User-Agent": "HirehiredBot/1.0" },
    });
    if (!res.ok) throw new Error(`Remotive ${res.status}`);
    const data = await res.json();
    return data.jobs || [];
  } catch (e) {
    console.warn("Remotive failed:", e.message);
    return [];
  }
}

async function fetchArbeitnow() {
  try {
    const res = await fetch("https://www.arbeitnow.com/api/job-board-api", {
      headers: { "User-Agent": "HirehiredBot/1.0" },
    });
    if (!res.ok) throw new Error(`Arbeitnow ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.warn("Arbeitnow failed:", e.message);
    return [];
  }
}

function mapRemoteOK(job) {
  const location = job.location || "Remote";
  const region = isApac(`${location} ${job.position || ""}`) ? "APAC" : "Global";
  const tags = Array.isArray(job.tags) ? job.tags.slice(0, 6) : [];
  const applyUrl = job.apply_url || job.url || "";
  return {
    id: `remoteok-${job.id || job.slug || Date.now()}`,
    title: job.position || "Untitled role",
    company: job.company || "Company",
    location,
    region,
    type: "Permanent",
    level: levelFromTitle(job.position),
    salary:
      job.salary_min && job.salary_max
        ? `$${Math.round(job.salary_min / 1000)}k – $${Math.round(job.salary_max / 1000)}k`
        : "Competitive",
    posted: job.date
      ? new Date(job.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    tags,
    category: "Engineering",
    applyUrl,
    source: "remoteok",
    description: (job.description || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 280),
  };
}

function mapRemotive(job) {
  const location = job.candidate_required_location || "Remote";
  const region = isApac(`${location} ${job.title || ""}`) ? "APAC" : "Global";
  return {
    id: `remotive-${job.id}`,
    title: job.title,
    company: job.company_name,
    location,
    region,
    type: normalizeType(job.job_type),
    level: levelFromTitle(job.title),
    salary: "Competitive",
    posted: (job.publication_date || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
    tags: (job.tags || []).slice(0, 5),
    category: job.category || "Engineering",
    applyUrl: job.url || "",
    source: "remotive",
    description: (job.description || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 280),
  };
}

function mapArbeitnow(job) {
  const location = job.location || "Remote";
  const region = isApac(`${location} ${job.title || ""}`) ? "APAC" : "Global";
  return {
    id: `arbeitnow-${job.slug || job.url}`,
    title: job.title,
    company: job.company_name,
    location,
    region,
    type: job.job_types?.some((t) => /contract/i.test(t)) ? "Contract" : "Permanent",
    level: levelFromTitle(job.title),
    salary: "Competitive",
    posted: String(job.created_at || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
    tags: (job.tags || []).slice(0, 5),
    category: "Engineering",
    applyUrl: job.url || "",
    source: "arbeitnow",
    description: (job.description || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 280),
  };
}

async function main() {
  let existing = [];
  try {
    existing = JSON.parse(readFileSync(jobsPath, "utf8"));
  } catch {
    existing = [];
  }

  // Keep non-API curated/synthetic; normalize types
  const kept = existing
    .filter((j) => !["remoteok", "remotive", "arbeitnow"].includes(j.source))
    .map((j) => ({ ...j, type: normalizeType(j.type) }));

  const [remote, remotive, arbeit] = await Promise.all([
    fetchRemoteOK(),
    fetchRemotive(),
    fetchArbeitnow(),
  ]);

  const incoming = [
    ...remote.filter((j) => isTargetLevel(j.position)).map(mapRemoteOK),
    ...remotive.filter((j) => isTargetLevel(j.title)).map(mapRemotive),
    ...arbeit.filter((j) => isTargetLevel(j.title)).map(mapArbeitnow),
  ].filter((j) => j.applyUrl);

  const seen = new Set(kept.map((j) => `${j.title}|${j.company}`.toLowerCase()));
  const merged = [...kept];
  let added = 0;
  for (const j of incoming) {
    const key = `${j.title}|${j.company}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(j);
    added++;
  }

  merged.sort((a, b) => {
    if (a.region === "APAC" && b.region !== "APAC") return -1;
    if (b.region === "APAC" && a.region !== "APAC") return 1;
    const ad = isDirectJobUrl(a.applyUrl) ? 0 : 1;
    const bd = isDirectJobUrl(b.applyUrl) ? 0 : 1;
    if (ad !== bd) return ad - bd;
    return new Date(b.posted) - new Date(a.posted);
  });

  // Keep inventory healthy (~300–400)
  const final = merged.slice(0, 400);
  writeFileSync(jobsPath, JSON.stringify(final, null, 2) + "\n");
  const direct = final.filter((j) => isDirectJobUrl(j.applyUrl)).length;
  console.log(`Wrote ${final.length} jobs (${added} new from APIs, ${direct} direct URLs)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
