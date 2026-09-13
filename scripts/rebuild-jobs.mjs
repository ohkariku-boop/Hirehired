/**
 * Rebuild jobs from LIVE sources — Tech + Compliance only.
 * Target: 100+ compliance/KYC/KYB/CDD/AML roles + strong tech inventory.
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jobsPath = join(__dirname, "../src/data/jobs.json");

const JUNIOR_RE =
  /\b(intern|internship|junior|graduate|entry[- ]?level|apprentice|trainee|student)\b/i;

const COMP_RE =
  /\b(compliance|aml|kyc|kyb|sanctions|fraud|regulatory|cdd|edd|financial.?crime|fincrime|bsa|ofac|transaction.?monitoring|anti-?money|credit.?risk|risk.?analyst|risk.?manager|risk.?officer|risk.?director|risk.?lead)\b/i;

const TECH_RE =
  /\b(engineer|software|developer|devops|sre|platform|infra|backend|frontend|full[- ]?stack|machine.?learning|data.?scien|mlops|security.?engineer|architect|engineering.?manager|technical.?lead|staff|principal)\b/i;

const LEVEL_RE =
  /\b(mid[- ]?level|mid[- ]?senior|senior|staff|principal|lead|manager|director|head of|vp|vice president|head,|analyst|specialist|officer)\b/i;

const APAC_KEYWORDS = [
  "singapore", "hong kong", "tokyo", "sydney", "melbourne", "seoul",
  "jakarta", "bangkok", "manila", "kuala lumpur", "taipei", "apac", "asia",
  "india", "bangalore", "bengaluru", "mumbai", "hyderabad", "australia",
  "japan", "korea", "malaysia", "indonesia", "philippines", "thailand",
  "vietnam", "taiwan", "new zealand", "auckland", "el salvador",
];

function isApac(text) {
  const t = (text || "").toLowerCase();
  return APAC_KEYWORDS.some((k) => t.includes(k));
}

function isJunior(title) {
  return JUNIOR_RE.test(title || "");
}

function isComplianceTitle(title) {
  return COMP_RE.test(title || "");
}

function isTechTitle(title) {
  return TECH_RE.test(title || "");
}

function isTargetLevel(title) {
  if (isJunior(title)) return false;
  // Compliance: Analyst/Specialist/Officer count as mid+
  if (isComplianceTitle(title)) {
    return LEVEL_RE.test(title) || /\b(analyst|specialist|officer)\b/i.test(title);
  }
  return LEVEL_RE.test(title);
}

function levelFromTitle(title) {
  const t = title || "";
  if (/\b(director|head of|head,|vp|vice president)\b/i.test(t)) return "Director";
  if (/\b(staff|principal)\b/i.test(t)) return "Senior";
  if (/\b(senior|lead|manager)\b/i.test(t)) return "Senior";
  if (/\b(mid|analyst|specialist|officer)\b/i.test(t)) return "Mid";
  return "Senior";
}

function categoryFromTitle(title) {
  if (isComplianceTitle(title)) return "Compliance";
  if (/data scien|machine learning|ml engineer|analytics|data engineer/i.test(title))
    return "Data";
  return "Engineering";
}

function tagsFromTitle(title) {
  const t = title || "";
  const tags = [];
  if (/\bkyc\b/i.test(t)) tags.push("KYC");
  if (/\bkyb\b/i.test(t)) tags.push("KYB");
  if (/\baml\b/i.test(t)) tags.push("AML");
  if (/\bcdd\b/i.test(t)) tags.push("CDD");
  if (/\bedd\b/i.test(t)) tags.push("EDD");
  if (/compliance/i.test(t)) tags.push("Compliance");
  if (/fraud/i.test(t)) tags.push("Fraud");
  if (/sanctions/i.test(t)) tags.push("Sanctions");
  if (/java/i.test(t)) tags.push("Java");
  if (/python/i.test(t)) tags.push("Python");
  if (/react|frontend|front-end/i.test(t)) tags.push("Frontend");
  if (/backend|back-end/i.test(t)) tags.push("Backend");
  if (/kubernetes|k8s|devops|sre|infra/i.test(t)) tags.push("Infra");
  if (/security/i.test(t)) tags.push("Security");
  if (/data/i.test(t)) tags.push("Data");
  return tags.slice(0, 5);
}

const GREENHOUSE_BOARDS = [
  // Fintech / compliance-heavy first
  ["okx", "OKX"],
  ["alpaca", "Alpaca"],
  ["stripe", "Stripe"],
  ["coinbase", "Coinbase"],
  ["adyen", "Adyen"],
  ["affirm", "Affirm"],
  ["monzo", "Monzo"],
  ["n26", "N26"],
  ["block", "Block"],
  ["chime", "Chime"],
  ["plaid", "Plaid"],
  ["brex", "Brex"],
  ["ramp", "Ramp"],
  ["complyadvantage", "ComplyAdvantage"],
  ["wise", "Wise"],
  ["gemini", "Gemini"],
  ["ripple", "Ripple"],
  ["robinhood", "Robinhood"],
  ["tide", "Tide"],
  ["klarna", "Klarna"],
  ["paypal", "PayPal"],
  ["checkoutcom", "Checkout.com"],
  ["bitgo", "BitGo"],
  ["anchorage", "Anchorage Digital"],
  ["fireblocks", "Fireblocks"],
  // Tech
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
  ["scaleai", "Scale AI"],
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
      .filter((j) => isComplianceTitle(j.title) || isTechTitle(j.title))
      .map((j) => {
        const loc =
          (j.location && j.location.name) ||
          (Array.isArray(j.offices) && j.offices[0]?.name) ||
          "Remote";
        const region = isApac(`${loc} ${j.title}`) ? "APAC" : "Global";
        const applyUrl = j.absolute_url || "";
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl)) return null;
        const compliance = isComplianceTitle(j.title);
        return {
          id: `gh-${board}-${j.id}`,
          title: j.title.trim(),
          company,
          location: loc,
          region,
          type: "Permanent",
          level: levelFromTitle(j.title),
          salary: "Competitive",
          posted:
            (j.updated_at || j.created_at || "").slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          tags: tagsFromTitle(j.title),
          category: compliance ? "Compliance" : categoryFromTitle(j.title),
          applyUrl,
          source: "greenhouse",
          description: `${j.title.trim()} at ${company}. Apply directly on the employer career page.`,
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
      .filter((j) => isComplianceTitle(j.position) || isTechTitle(j.position))
      .map((j) => {
        const applyUrl = j.apply_url || j.url || "";
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl)) return null;
        const location = j.location || "Remote";
        const compliance = isComplianceTitle(j.position);
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
          tags: Array.isArray(j.tags)
            ? j.tags.slice(0, 5)
            : tagsFromTitle(j.position),
          category: compliance ? "Compliance" : categoryFromTitle(j.position),
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
      .filter((j) => isComplianceTitle(j.title) || isTechTitle(j.title))
      .map((j) => {
        const applyUrl = j.url || "";
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl)) return null;
        const location = j.candidate_required_location || "Remote";
        const compliance = isComplianceTitle(j.title);
        return {
          id: `remotive-${j.id}`,
          title: j.title,
          company: j.company_name,
          location,
          region: isApac(`${location} ${j.title}`) ? "APAC" : "Global",
          type: /contract|freelance/i.test(j.job_type || "")
            ? "Contract"
            : "Permanent",
          level: levelFromTitle(j.title),
          salary: "Competitive",
          posted:
            (j.publication_date || "").slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          tags: (j.tags || []).slice(0, 5),
          category: compliance ? "Compliance" : categoryFromTitle(j.title),
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
      .filter((j) => isComplianceTitle(j.title) || isTechTitle(j.title))
      .map((j) => {
        const applyUrl = j.url || "";
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl)) return null;
        const location = j.location || "Remote";
        const compliance = isComplianceTitle(j.title);
        return {
          id: `arbeitnow-${j.slug || applyUrl}`,
          title: j.title,
          company: j.company_name,
          location,
          region: isApac(`${location} ${j.title}`) ? "APAC" : "Global",
          type: j.job_types?.some((t) => /contract/i.test(t))
            ? "Contract"
            : "Permanent",
          level: levelFromTitle(j.title),
          salary: "Competitive",
          posted:
            String(j.created_at || "").slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          tags: (j.tags || []).slice(0, 5),
          category: compliance ? "Compliance" : categoryFromTitle(j.title),
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
    /gh_jid=\d+/i.test(url)
  );
}

async function main() {
  console.log("Fetching Greenhouse boards (tech + compliance only)...");
  const ghResults = await Promise.all(
    GREENHOUSE_BOARDS.map(([board, company]) =>
      fetchGreenhouseBoard(board, company)
    )
  );
  const fromGh = ghResults.flat();
  const ghComp = fromGh.filter((j) => j.category === "Compliance");
  console.log(
    `Greenhouse: ${fromGh.length} total, ${ghComp.length} compliance`
  );

  console.log("Fetching public APIs...");
  const [remote, remotive, arbeit] = await Promise.all([
    fetchRemoteOK(),
    fetchRemotive(),
    fetchArbeitnow(),
  ]);
  console.log(
    `RemoteOK: ${remote.length}, Remotive: ${remotive.length}, Arbeitnow: ${arbeit.length}`
  );

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

  const compliance = merged.filter((j) => j.category === "Compliance");
  const tech = merged.filter((j) => j.category !== "Compliance");

  // Sort each pool: APAC first, direct URL, recency
  const sortPool = (list) =>
    list.sort((a, b) => {
      if (a.region === "APAC" && b.region !== "APAC") return -1;
      if (b.region === "APAC" && a.region !== "APAC") return 1;
      const ad = isDirectJobUrl(a.applyUrl) ? 0 : 1;
      const bd = isDirectJobUrl(b.applyUrl) ? 0 : 1;
      if (ad !== bd) return ad - bd;
      return new Date(b.posted) - new Date(a.posted);
    });

  sortPool(compliance);
  sortPool(tech);

  // Take all compliance (aim 100+), then fill with tech up to ~450
  const companyCount = {};
  const final = [];
  const add = (list, maxPerCompany = 25) => {
    for (const j of list) {
      const c = companyCount[j.company] || 0;
      if (c >= maxPerCompany) continue;
      companyCount[j.company] = c + 1;
      final.push(j);
    }
  };

  // No company cap for compliance — we need volume
  for (const j of compliance) final.push(j);
  add(tech, 20);

  // Cap overall
  const capped = final.slice(0, 450);

  capped.sort((a, b) => {
    if (a.region === "APAC" && b.region !== "APAC") return -1;
    if (b.region === "APAC" && a.region !== "APAC") return 1;
    if (a.category === "Compliance" && b.category !== "Compliance") return -1;
    if (b.category === "Compliance" && a.category !== "Compliance") return 1;
    return new Date(b.posted) - new Date(a.posted);
  });

  writeFileSync(jobsPath, JSON.stringify(capped, null, 2) + "\n");

  const compN = capped.filter((j) => j.category === "Compliance").length;
  const techN = capped.length - compN;
  console.log(`\nWrote ${capped.length} LIVE jobs (Tech + Compliance only)`);
  console.log(`  Compliance/KYC/KYB/CDD/AML: ${compN}`);
  console.log(`  Tech: ${techN}`);
  console.log(`  APAC: ${capped.filter((j) => j.region === "APAC").length}`);
  console.log(
    `  Companies: ${new Set(capped.map((j) => j.company)).size}`
  );
  console.log("  Compliance samples:");
  capped
    .filter((j) => j.category === "Compliance")
    .slice(0, 12)
    .forEach((j) =>
      console.log(`   - ${j.company}: ${j.title.slice(0, 60)}`)
    );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
