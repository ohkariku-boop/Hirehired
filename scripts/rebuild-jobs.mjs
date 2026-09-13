/**
 * Rebuild jobs.json from LIVE sources only.
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jobsPath = join(__dirname, "../src/data/jobs.json");

const LEVEL_RE = /\b(mid[- ]?level|mid[- ]?senior|senior|staff|principal|lead|manager|director|head of|vp|vice president|head,)\b/i;
const JUNIOR_RE = /\b(intern|internship|junior|graduate|entry[- ]?level|associate (?!director)|apprentice|trainee)\b/i;

const APAC_KEYWORDS = [
  "singapore", "hong kong", "tokyo", "sydney", "melbourne", "seoul",
  "jakarta", "bangkok", "manila", "kuala lumpur", "taipei", "apac", "asia",
  "india", "bangalore", "bengaluru", "mumbai", "hyderabad", "australia",
  "japan", "korea", "malaysia", "indonesia", "philippines", "thailand",
  "vietnam", "taiwan", "new zealand", "auckland",
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
  if (/\b(director|head of|head,|vp|vice president)\b/i.test(t)) return "Director";
  if (/\b(staff|principal)\b/i.test(t)) return "Senior";
  if (/\b(senior|lead|manager)\b/i.test(t)) return "Senior";
  if (/\bmid\b/i.test(t)) return "Mid";
  return "Senior";
}

function normalizeType(t) {
  if (/contract|freelance|temp|temporary/i.test(t || "")) return "Contract";
  return "Permanent";
}

function categoryFromTitle(title) {
  const t = (title || "").toLowerCase();
  if (/compliance|aml|kyc|kyb|sanctions|fraud|risk|regulatory/i.test(t)) return "Compliance";
  if (/product manager|product owner|product design/i.test(t)) return "Product";
  if (/design|ux|ui|researcher/i.test(t)) return "Design";
  if (/data scien|machine learning|ml engineer|analytics/i.test(t)) return "Data";
  if (/sales|account executive|business development/i.test(t)) return "Sales";
  if (/marketing|growth/i.test(t)) return "Marketing";
  if (/legal|counsel|privacy/i.test(t)) return "Legal";
  if (/people|hr |talent|recruiter/i.test(t)) return "People";
  if (/finance|accounting|controller/i.test(t)) return "Finance";
  return "Engineering";
}

function tagsFromTitle(title) {
  const t = title || "";
  const tags = [];
  if (/kyc/i.test(t)) tags.push("KYC");
  if (/kyb/i.test(t)) tags.push("KYB");
  if (/aml/i.test(t)) tags.push("AML");
  if (/compliance/i.test(t)) tags.push("Compliance");
  if (/java/i.test(t)) tags.push("Java");
  if (/python/i.test(t)) tags.push("Python");
  if (/react|frontend|front-end/i.test(t)) tags.push("Frontend");
  if (/backend|back-end/i.test(t)) tags.push("Backend");
  if (/kubernetes|k8s|devops|sre|infra/i.test(t)) tags.push("Infra");
  if (/android|ios|mobile/i.test(t)) tags.push("Mobile");
  if (/data/i.test(t)) tags.push("Data");
  if (/security|appsec/i.test(t)) tags.push("Security");
  return tags.slice(0, 5);
}

const GREENHOUSE_BOARDS = [
  ["okx", "OKX"],
  ["alpaca", "Alpaca"],
  ["stripe", "Stripe"],
  ["coinbase", "Coinbase"],
  ["openai", "OpenAI"],
  ["anthropic", "Anthropic"],
  ["cloudflare", "Cloudflare"],
  ["databricks", "Databricks"],
  ["hashicorp", "HashiCorp"],
  ["gitlab", "GitLab"],
  ["discord", "Discord"],
  ["spotify", "Spotify"],
  ["airbnb", "Airbnb"],
  ["lyft", "Lyft"],
  ["uber", "Uber"],
  ["figma", "Figma"],
  ["notion", "Notion"],
  ["robinhood", "Robinhood"],
  ["gemini", "Gemini"],
  ["ripple", "Ripple"],
  ["chime", "Chime"],
  ["affirm", "Affirm"],
  ["plaid", "Plaid"],
  ["brex", "Brex"],
  ["ramp", "Ramp"],
  ["complyadvantage", "ComplyAdvantage"],
  ["wise", "Wise"],
  ["scaleai", "Scale AI"],
  ["samsara", "Samsara"],
  ["duolingo", "Duolingo"],
  ["reddit", "Reddit"],
  ["dropbox", "Dropbox"],
  ["twilio", "Twilio"],
  ["asana", "Asana"],
  ["airtable", "Airtable"],
  ["vercel", "Vercel"],
  ["sentry", "Sentry"],
  ["elastic", "Elastic"],
  ["mongodb", "MongoDB"],
  ["datadog", "Datadog"],
  ["okta", "Okta"],
  ["n26", "N26"],
  ["klarna", "Klarna"],
];

async function fetchGreenhouseBoard(board, company) {
  try {
    const r = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${board}/jobs`,
      { headers: { "User-Agent": "HirehiredBot/1.0" } }
    );
    if (!r.ok) return [];
    const data = await r.json();
    const jobs = data.jobs || [];
    return jobs
      .filter((j) => isTargetLevel(j.title))
      .map((j) => {
        const loc =
          (j.location && j.location.name) ||
          (Array.isArray(j.offices) && j.offices[0]?.name) ||
          "Remote";
        const region = isApac(`${loc} ${j.title}`) ? "APAC" : "Global";
        const applyUrl = j.absolute_url || "";
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl)) return null;
        return {
          id: `gh-${board}-${j.id}`,
          title: j.title,
          company,
          location: loc,
          region,
          type: "Permanent",
          level: levelFromTitle(j.title),
          salary: "Competitive",
          posted: (j.updated_at || j.created_at || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
          tags: tagsFromTitle(j.title),
          category: categoryFromTitle(j.title),
          applyUrl,
          source: "greenhouse",
          description: `${j.title} at ${company}. Apply directly on the employer career page.`,
        };
      })
      .filter(Boolean);
  } catch (e) {
    console.warn(`Greenhouse ${board}:`, e.message);
    return [];
  }
}

async function fetchRemoteOK() {
  try {
    const r = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": "HirehiredBot/1.0" },
    });
    if (!r.ok) return [];
    const data = await r.json();
    return (Array.isArray(data) ? data.slice(1) : [])
      .filter((j) => isTargetLevel(j.position))
      .map((j) => {
        const applyUrl = j.apply_url || j.url || "";
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl)) return null;
        const location = j.location || "Remote";
        return {
          id: `remoteok-${j.id || j.slug}`,
          title: j.position,
          company: j.company || "Company",
          location,
          region: isApac(`${location} ${j.position}`) ? "APAC" : "Global",
          type: "Permanent",
          level: levelFromTitle(j.position),
          salary:
            j.salary_min && j.salary_max
              ? `$${Math.round(j.salary_min / 1000)}k – $${Math.round(j.salary_max / 1000)}k`
              : "Competitive",
          posted: j.date
            ? new Date(j.date).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
          tags: Array.isArray(j.tags) ? j.tags.slice(0, 5) : tagsFromTitle(j.position),
          category: categoryFromTitle(j.position),
          applyUrl,
          source: "remoteok",
          description: (j.description || "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 280),
        };
      })
      .filter(Boolean);
  } catch (e) {
    console.warn("RemoteOK:", e.message);
    return [];
  }
}

async function fetchRemotive() {
  try {
    const r = await fetch("https://remotive.com/api/remote-jobs?limit=100", {
      headers: { "User-Agent": "HirehiredBot/1.0" },
    });
    if (!r.ok) return [];
    const data = await r.json();
    return (data.jobs || [])
      .filter((j) => isTargetLevel(j.title))
      .map((j) => {
        const applyUrl = j.url || "";
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl)) return null;
        const location = j.candidate_required_location || "Remote";
        return {
          id: `remotive-${j.id}`,
          title: j.title,
          company: j.company_name,
          location,
          region: isApac(`${location} ${j.title}`) ? "APAC" : "Global",
          type: normalizeType(j.job_type),
          level: levelFromTitle(j.title),
          salary: "Competitive",
          posted: (j.publication_date || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
          tags: (j.tags || []).slice(0, 5),
          category: j.category || categoryFromTitle(j.title),
          applyUrl,
          source: "remotive",
          description: (j.description || "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 280),
        };
      })
      .filter(Boolean);
  } catch (e) {
    console.warn("Remotive:", e.message);
    return [];
  }
}

async function fetchArbeitnow() {
  try {
    const r = await fetch("https://www.arbeitnow.com/api/job-board-api", {
      headers: { "User-Agent": "HirehiredBot/1.0" },
    });
    if (!r.ok) return [];
    const data = await r.json();
    return (data.data || [])
      .filter((j) => isTargetLevel(j.title))
      .map((j) => {
        const applyUrl = j.url || "";
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl)) return null;
        const location = j.location || "Remote";
        return {
          id: `arbeitnow-${j.slug || applyUrl}`,
          title: j.title,
          company: j.company_name,
          location,
          region: isApac(`${location} ${j.title}`) ? "APAC" : "Global",
          type: j.job_types?.some((t) => /contract/i.test(t)) ? "Contract" : "Permanent",
          level: levelFromTitle(j.title),
          salary: "Competitive",
          posted:
            String(j.created_at || "").slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          tags: (j.tags || []).slice(0, 5),
          category: categoryFromTitle(j.title),
          applyUrl,
          source: "arbeitnow",
          description: (j.description || "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 280),
        };
      })
      .filter(Boolean);
  } catch (e) {
    console.warn("Arbeitnow:", e.message);
    return [];
  }
}

function isDirectJobUrl(url) {
  if (!url) return false;
  return (
    /greenhouse\.io\/.+\/jobs\/\d+/i.test(url) ||
    /job-boards\.(eu\.)?greenhouse\.io\/.+\/jobs\/\d+/i.test(url) ||
    /boards\.greenhouse\.io\/.+\/jobs\/\d+/i.test(url) ||
    /lever\.co\/[^/]+\/[a-f0-9-]{8,}/i.test(url) ||
    /jobs\.ashbyhq\.com\/[^/]+\/[a-f0-9-]+/i.test(url) ||
    /gh_jid=\d+/i.test(url)
  );
}

async function main() {
  console.log("Fetching Greenhouse boards...");
  const ghResults = await Promise.all(
    GREENHOUSE_BOARDS.map(([board, company]) =>
      fetchGreenhouseBoard(board, company)
    )
  );
  const fromGh = ghResults.flat();
  console.log(`Greenhouse: ${fromGh.length} mid/senior/director roles`);

  console.log("Fetching public APIs...");
  const [remote, remotive, arbeit] = await Promise.all([
    fetchRemoteOK(),
    fetchRemotive(),
    fetchArbeitnow(),
  ]);
  console.log(`RemoteOK: ${remote.length}, Remotive: ${remotive.length}, Arbeitnow: ${arbeit.length}`);

  const all = [...fromGh, ...remote, ...remotive, ...arbeit];

  const seen = new Set();
  const merged = [];
  for (const j of all) {
    const key = `${j.title}|${j.company}`.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    if (/google\.com\/search/i.test(j.applyUrl)) continue;
    if (!j.applyUrl || !/^https?:\/\//i.test(j.applyUrl)) continue;
    seen.add(key);
    merged.push(j);
  }

  // Prefer direct URLs + recency within pools
  merged.sort((a, b) => {
    const ad = isDirectJobUrl(a.applyUrl) ? 0 : 1;
    const bd = isDirectJobUrl(b.applyUrl) ? 0 : 1;
    if (ad !== bd) return ad - bd;
    return new Date(b.posted) - new Date(a.posted);
  });

  // Balance: ~50% APAC, diversify companies (max ~15 per company in first pass)
  const apac = merged.filter((j) => j.region === "APAC");
  const global = merged.filter((j) => j.region !== "APAC");
  const companyCount = {};
  const final = [];
  const take = (list, target) => {
    for (const j of list) {
      if (final.length >= target) break;
      const c = companyCount[j.company] || 0;
      if (c >= 18) continue;
      companyCount[j.company] = c + 1;
      final.push(j);
    }
  };
  take(apac, 200);
  take(global, 400);
  // Fill remaining from either pool if under 300
  if (final.length < 300) {
    for (const j of merged) {
      if (final.length >= 350) break;
      if (final.includes(j)) continue;
      final.push(j);
    }
  }
  // Inject public API jobs (for Contract + variety) if not already present
  const finalKeys = new Set(final.map((j) => `${j.title}|${j.company}`.toLowerCase()));
  for (const j of [...remote, ...remotive, ...arbeit]) {
    if (final.length >= 420) break;
    const key = `${j.title}|${j.company}`.toLowerCase();
    if (finalKeys.has(key)) continue;
    finalKeys.add(key);
    final.push(j);
  }

  // Sort final: APAC first, then recency
  final.sort((a, b) => {
    if (a.region === "APAC" && b.region !== "APAC") return -1;
    if (b.region === "APAC" && a.region !== "APAC") return 1;
    return new Date(b.posted) - new Date(a.posted);
  });
  writeFileSync(jobsPath, JSON.stringify(final, null, 2) + "\n");

  console.log(`\nWrote ${final.length} LIVE jobs`);
  console.log(`  Permanent: ${final.filter((j) => j.type === "Permanent").length}`);
  console.log(`  Contract: ${final.filter((j) => j.type === "Contract").length}`);
  console.log(`  APAC: ${final.filter((j) => j.region === "APAC").length}`);
  console.log(`  Direct job URLs: ${final.filter((j) => isDirectJobUrl(j.applyUrl)).length}`);
  console.log(`  Sources:`, [...new Set(final.map((j) => j.source))].join(", "));
  console.log(`  Sample:`);
  final.slice(0, 10).forEach((j) =>
    console.log(`   - ${j.company}: ${j.title.slice(0, 55)}`)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
