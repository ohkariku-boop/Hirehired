/**
 * Daily job discovery — mid / senior / director only
 * Prefer direct Greenhouse/Lever job URLs over generic career hubs
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
  // Greenhouse / Lever / Ashby individual job pages
  return /greenhouse\.io\/.+\/jobs\/\d+/i.test(url)
    || /lever\.co\/[^/]+\/[a-f0-9-]{8,}/i.test(url)
    || /jobs\.ashbyhq\.com\/[^/]+\/[a-f0-9-]+/i.test(url)
    || /job-boards\.(eu\.)?greenhouse\.io\/.+\/jobs\/\d+/i.test(url);
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
    type: "Full-time",
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

async function main() {
  let existing = [];
  try {
    existing = JSON.parse(readFileSync(jobsPath, "utf8"));
  } catch {
    existing = [];
  }

  // Keep curated with direct URLs preferred
  const curated = existing
    .filter((j) => j.source !== "remoteok")
    .filter((j) => isTargetLevel(j.title) || ["Mid", "Senior", "Director"].includes(j.level));

  const remote = await fetchRemoteOK();
  const filtered = remote
    .filter((j) => isTargetLevel(j.position))
    .map(mapRemoteOK)
    .filter((j) => j.applyUrl) // must have some apply link
    .slice(0, 30);

  const seen = new Set(curated.map((j) => `${j.title}|${j.company}`.toLowerCase()));
  const merged = [...curated];
  for (const j of filtered) {
    const key = `${j.title}|${j.company}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(j);
    }
  }

  // Prefer listings with direct job URLs when sorting within same region
  merged.sort((a, b) => {
    if (a.region === "APAC" && b.region !== "APAC") return -1;
    if (b.region === "APAC" && a.region !== "APAC") return 1;
    const ad = isDirectJobUrl(a.applyUrl) ? 0 : 1;
    const bd = isDirectJobUrl(b.applyUrl) ? 0 : 1;
    if (ad !== bd) return ad - bd;
    return new Date(b.posted) - new Date(a.posted);
  });

  writeFileSync(jobsPath, JSON.stringify(merged, null, 2) + "\n");
  const direct = merged.filter((j) => isDirectJobUrl(j.applyUrl)).length;
  console.log(`Wrote ${merged.length} jobs (${direct} with direct job URLs)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
