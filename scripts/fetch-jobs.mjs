/**
 * Daily job discovery for Hirehired
 * Focus: mid–senior tech + compliance / KYC / KYB
 * Priority: APAC, then global remote
 *
 * Uses public RemoteOK API for tech roles, then merges with curated
 * compliance listings already in jobs.json (preserves hand-picked KYC/KYB).
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jobsPath = join(__dirname, "../src/data/jobs.json");

const APAC_KEYWORDS = [
  "singapore",
  "hong kong",
  "tokyo",
  "sydney",
  "melbourne",
  "seoul",
  "jakarta",
  "bangkok",
  "manila",
  "kuala lumpur",
  "taipei",
  "apac",
  "asia",
];

const TECH_KEYWORDS = [
  "engineer",
  "developer",
  "software",
  "backend",
  "frontend",
  "full.?stack",
  "devops",
  "sre",
  "platform",
  "infrastructure",
  "data engineer",
  "machine learning",
  "security engineer",
];

const COMPLIANCE_KEYWORDS = [
  "kyc",
  "kyb",
  "aml",
  "compliance",
  "due diligence",
  "financial crime",
  "sanctions",
  "cdd",
  "edd",
];

const SENIOR_KEYWORDS = [
  "senior",
  "staff",
  "principal",
  "lead",
  "manager",
  "head of",
  "director",
];

function isApac(text) {
  const t = (text || "").toLowerCase();
  return APAC_KEYWORDS.some((k) => t.includes(k));
}

function matchesFocus(title, tags = []) {
  const blob = `${title} ${(tags || []).join(" ")}`.toLowerCase();
  const tech = TECH_KEYWORDS.some((k) => new RegExp(k, "i").test(blob));
  const compliance = COMPLIANCE_KEYWORDS.some((k) =>
    new RegExp(k, "i").test(blob)
  );
  const senior = SENIOR_KEYWORDS.some((k) => new RegExp(k, "i").test(blob));
  return (tech || compliance) && senior;
}

async function fetchRemoteOK() {
  try {
    const res = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": "HirehiredBot/1.0 (job aggregator)" },
    });
    if (!res.ok) throw new Error(`RemoteOK ${res.status}`);
    const data = await res.json();
    // First item is metadata
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
  const isCompliance = COMPLIANCE_KEYWORDS.some((k) =>
    new RegExp(k, "i").test(`${job.position} ${tags.join(" ")}`)
  );

  return {
    id: `remoteok-${job.id || job.slug || Date.now()}`,
    title: job.position || "Untitled role",
    company: job.company || "Company",
    location: location || "Remote",
    region,
    type: "Full-time",
    level: SENIOR_KEYWORDS.some((k) =>
      new RegExp(k, "i").test(job.position || "")
    )
      ? "Senior"
      : "Mid–Senior",
    salary:
      job.salary_min && job.salary_max
        ? `$${Math.round(job.salary_min / 1000)}k – $${Math.round(job.salary_max / 1000)}k`
        : "Competitive",
    posted: job.date
      ? new Date(job.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    tags,
    category: isCompliance ? "Compliance" : "Engineering",
    applyUrl: job.url || job.apply_url || "https://remoteok.com/",
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

  // Keep hand-curated (non-remoteok) listings
  const curated = existing.filter((j) => j.source !== "remoteok");

  const remote = await fetchRemoteOK();
  const filtered = remote
    .filter((j) => matchesFocus(j.position, j.tags))
    .map(mapRemoteOK)
    // Prefer APAC in sort order later
    .slice(0, 40);

  // Merge: curated first, then remote (dedupe by title+company)
  const seen = new Set(
    curated.map((j) => `${j.title}|${j.company}`.toLowerCase())
  );
  const merged = [...curated];
  for (const j of filtered) {
    const key = `${j.title}|${j.company}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(j);
    }
  }

  // Sort: APAC first, then by date desc
  merged.sort((a, b) => {
    if (a.region === "APAC" && b.region !== "APAC") return -1;
    if (b.region === "APAC" && a.region !== "APAC") return 1;
    return new Date(b.posted) - new Date(a.posted);
  });

  writeFileSync(jobsPath, JSON.stringify(merged, null, 2) + "\n");
  console.log(
    `Wrote ${merged.length} jobs (${curated.length} curated + ${merged.length - curated.length} from RemoteOK)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
