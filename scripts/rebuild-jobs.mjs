/**
 * Rebuild jobs from LIVE sources - Tech + Compliance only.
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
  /\b(compliance|aml|kyc|kyb|sanctions|fraud|regulatory|cdd|edd|financial.?crime|fincrime|bsa|ofac|transaction.?monitoring|anti-?money|credit.?risk|risk.?analyst|risk.?manager|risk.?officer|risk.?director|risk.?lead|money.?laundering|mlro|sar|suspicious.?activit|due.?diligence|onboarding.?compliance|policy.?compliance|ethics.?and.?compliance|grc|governance.?risk|conduct.?risk|operational.?risk|enterprise.?risk|financial.?crime|fc.?analyst|fc.?manager|investigations?\b.*\b(aml|fraud|crime)|compliance.?officer|compliance.?analyst|compliance.?manager|compliance.?director|compliance.?lead|head of compliance|vp.?compliance|chief.?compliance)\b/i;

// End-to-end IT: eng, product, project/program/portfolio PM, IT gov/strategy/infra/software, Head of IT
const TECH_RE =
  /\b(engineer|engineering|software|developer|devops|sre|platform.?engineer|platform.?engineering|tech.?platform|data.?platform|cloud.?platform|infra|infrastructure|backend|frontend|full[- ]?stack|machine.?learning|data.?scien|data.?engineer|mlops|security.?engineer|architect|engineering.?manager|technical.?lead|staff|principal|product.?manager|product.?owner|product.?lead|product.?director|head of product|vp.?product|chief.?product|project.?manager|program.?manager|portfolio.?manager|technical.?program|\btpm\b|it.?project.?manager|technology.?project.?manager|digital.?project.?manager|it.?program.?manager|technology.?program.?manager|it.?portfolio|technology.?portfolio|it.?manager|it.?director|head of it|head of technology|head of digital|head of engineering|vp.?it|vp.?technology|chief.?information|cio\b|cto\b|chief.?technology|it.?governance|tech.?governance|technology.?governance|it.?strategy|tech.?strategy|technology.?strategy|digital.?strategy|it.?architecture|technology.?architecture|enterprise.?architecture|it.?operations|it.?service|it.?support|systems.?admin|system.?administrator|network.?engineer|cloud.?engineer|solutions.?architect|enterprise.?architect|scrum.?master|delivery.?manager|release.?manager|qa.?engineer|quality.?assurance|test.?engineer|site.?reliability|platform.?engineer|security.?architect|info.?sec|information.?security|cyber.?security|application.?security|devsecops|agile.?coach|change.?manager.?it|it.?change|technology.?risk)\b/i;

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
  if (/product.?manager|product.?owner|product.?lead|product.?director|head of product|vp.?product/i.test(title))
    return "Product";
  if (/project.?manager|program.?manager|portfolio.?manager|technical.?program|\btpm\b|delivery.?manager|scrum.?master/i.test(title))
    return "Program";
  if (/it.?governance|it.?strategy|head of it|cio\b|it.?director|it.?manager/i.test(title))
    return "IT";
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


const MAX_AGE_DAYS = 30;

function isRecent(job, maxDays = MAX_AGE_DAYS) {
  if (!job?.posted) return false;
  const t = new Date(job.posted).getTime();
  if (Number.isNaN(t)) return false;
  const ageMs = Date.now() - t;
  if (ageMs < 0) return true; // future-dated treat as fresh
  return ageMs <= maxDays * 86400000;
}

const GREENHOUSE_BOARDS = [
  // Fintech / payments / crypto
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
  ["straitsx", "StraitsX"],
  ["ebanx", "EBANX"],
  ["thunes", "Thunes"],
  ["mercury", "Mercury"],
  ["blockchain", "Blockchain.com"],
  ["govtech", "GovTech Singapore"],
  ["trustbank", "Trust Bank"],
  ["trmlabs", "TRM Labs"],
  ["hyphenconnect", "Hyphen Connect"],
  ["bybit", "Bybit"],
  ["consensys", "Consensys"],
  ["nansen", "Nansen"],
  ["paradigm", "Paradigm"],
  ["flowtraders", "Flow Traders"],
  // Quant / trading
  ["janestreet", "Jane Street"],
  ["jumptrading", "Jump Trading"],
  ["imc", "IMC Trading"],
  ["point72", "Point72"],
  ["worldquant", "WorldQuant"],
  ["schonfeld", "Schonfeld"],
  ["aqr", "AQR Capital"],
  ["virtu", "Virtu Financial"],
  ["akunacapital", "Akuna Capital"],
  ["pdtpartners", "PDT Partners"],
  // Tech / F500-scale
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
  ["spacex", "SpaceX"],
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
      .filter((j) => {
        // Keep IT-side PMs; drop pure sales/marketing/HR program roles without tech signal
        const title = j.title || "";
        if (isComplianceTitle(title)) return true;
        if (/\b(sales|marketing|account executive|recruiter|people partner|hr generalist|customer success)\b/i.test(title)
            && !/\b(engineer|software|product manager|technical|it |data|platform|infra|security|compliance)\b/i.test(title)) {
          return false;
        }
        return true;
      })
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
              ? `$${Math.round(j.salary_min / 1000)}k - $${Math.round(j.salary_max / 1000)}k`
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
      .filter((j) => {
        // Keep IT-side PMs; drop pure sales/marketing/HR program roles without tech signal
        const title = j.title || "";
        if (isComplianceTitle(title)) return true;
        if (/\b(sales|marketing|account executive|recruiter|people partner|hr generalist|customer success)\b/i.test(title)
            && !/\b(engineer|software|product manager|technical|it |data|platform|infra|security|compliance)\b/i.test(title)) {
          return false;
        }
        return true;
      })
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
      .filter((j) => {
        // Keep IT-side PMs; drop pure sales/marketing/HR program roles without tech signal
        const title = j.title || "";
        if (isComplianceTitle(title)) return true;
        if (/\b(sales|marketing|account executive|recruiter|people partner|hr generalist|customer success)\b/i.test(title)
            && !/\b(engineer|software|product manager|technical|it |data|platform|infra|security|compliance)\b/i.test(title)) {
          return false;
        }
        return true;
      })
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


function isNonItSupport(title) {
  const t = title || "";
  if (isComplianceTitle(t)) return false;
  // Customer support / service is not Tech (even if title says "Platform")
  if (/\b(customer support|customer service|enterprise support|support specialist|support team lead|partner support|client support|helpdesk|help desk|call center|contact center)\b/i.test(t))
    return true;
  // Pure commercial/HR without tech signal
  if (/\b(sales program|marketing services program|marketing program|account executive|recruiter|people partner|hr generalist|customer success manager|brand manager)\b/i.test(t))
    return true;
  if (/\b(sales|marketing)\b/i.test(t) && !/\b(engineer|software|product manager|technical|data|platform.?engineer|security|developer)\b/i.test(t))
    return true;
  return false;
}


const LEVER_COMPANIES = [
  ["nium", "NIUM"],
  ["certik", "CertiK"],
  ["spotify", "Spotify"],
  ["palantir", "Palantir"],
  ["binance", "Binance"],
];

async function fetchLever(companySlug, companyName) {
  try {
    const r = await fetch(`https://api.lever.co/v0/postings/${companySlug}?mode=json`, {
      headers: { "User-Agent": "HirehiredBot/1.0" },
    });
    if (!r.ok) return [];
    const jobs = await r.json();
    return (jobs || [])
      .filter((j) => isTargetLevel(j.text || ""))
      .filter((j) => isComplianceTitle(j.text || "") || isTechTitle(j.text || ""))
      .map((j) => {
        const title = j.text || "Role";
        const loc =
          (j.categories && j.categories.location) ||
          (Array.isArray(j.categories?.allLocations) && j.categories.allLocations[0]) ||
          "Remote";
        const applyUrl = j.hostedUrl || j.applyUrl || "";
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl)) return null;
        const compliance = isComplianceTitle(title);
        return {
          id: `lever-${companySlug}-${j.id}`,
          title: title.trim(),
          company: companyName,
          location: loc,
          region: isApac(`${loc} ${title}`) ? "APAC" : "Global",
          type: "Permanent",
          level: levelFromTitle(title),
          salary: "Competitive",
          posted: j.createdAt
            ? new Date(j.createdAt).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
          tags: tagsFromTitle(title),
          category: compliance ? "Compliance" : categoryFromTitle(title),
          applyUrl,
          source: "lever",
          description: `${title.trim()} at ${companyName}. Apply on the employer page.`,
        };
      })
      .filter(Boolean);
  } catch (e) {
    console.warn(`Lever ${companySlug}:`, e.message);
    return [];
  }
}


const WORKDAY_SITES = [
  // host, tenant, site, company
  ["dbs.wd3.myworkdayjobs.com", "dbs", "DBS_Careers", "DBS"],
  ["uobgroup.wd3.myworkdayjobs.com", "uobgroup", "UOBExternal", "UOB"],
  ["ocbc.wd102.myworkdayjobs.com", "ocbc", "External", "OCBC"],
  ["citi.wd5.myworkdayjobs.com", "citi", "2", "Citi"],
  ["hlb.wd3.myworkdayjobs.com", "hlb", "HLBCareers", "Hong Leong Bank"],
  ["santander.wd3.myworkdayjobs.com", "santander", "SantanderCareers", "Santander"],
  ["blackrock.wd1.myworkdayjobs.com", "blackrock", "BlackRock_Professional", "BlackRock"],
  ["bbh.wd5.myworkdayjobs.com", "bbh", "BBH", "Brown Brothers Harriman"],
  ["sggovterp.wd102.myworkdayjobs.com", "sggovterp", "PublicServiceCareers", "Singapore Public Service"],
  ["adobe.wd5.myworkdayjobs.com", "adobe", "external_experienced", "Adobe"],
  ["salesforce.wd12.myworkdayjobs.com", "salesforce", "External_Career_Site", "Salesforce"],
  ["nvidia.wd5.myworkdayjobs.com", "nvidia", "NVIDIAExternalCareerSite", "NVIDIA"],
];

const WORKDAY_SEARCHES = [
  "compliance",
  "KYC",
  "AML",
  "KYB",
  "CDD",
  "fraud",
  "sanctions",
  "software engineer",
  "product manager",
  "technical program manager",
  "IT manager",
];

function parseWorkdayPosted(postedOn) {
  if (!postedOn) return new Date().toISOString().slice(0, 10);
  const m = String(postedOn).match(/Posted (\d+) Day/i);
  if (m) {
    const d = new Date();
    d.setDate(d.getDate() - parseInt(m[1], 10));
    return d.toISOString().slice(0, 10);
  }
  if (/today/i.test(postedOn)) return new Date().toISOString().slice(0, 10);
  if (/yesterday/i.test(postedOn)) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

async function fetchWorkdaySite(host, tenant, site, company, searchText) {
  try {
    const endpoint = `https://${host}/wday/cxs/${tenant}/${site}/jobs`;
    const jobs = [];
    let offset = 0;
    const limit = 20;
    for (let page = 0; page < 15; page++) {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; HirehiredBot/1.0)",
        },
        body: JSON.stringify({
          appliedFacets: {},
          limit,
          offset,
          searchText: searchText || "",
        }),
      });
      if (!r.ok) break;
      const data = await r.json();
      const postings = data.jobPostings || [];
      if (!postings.length) break;
      for (const j of postings) {
        const title = j.title || "";
        try {
          if (!isTargetLevel(title)) continue;
          if (!(isComplianceTitle(title) || isTechTitle(title))) continue;
          if (typeof isNonItSupport === "function" && isNonItSupport(title)) continue;
        } catch (err) {
          console.warn("filter error", title, err.message);
          continue;
        }
        const path = j.externalPath || "";
        if (!path) continue;
        const loc = j.locationsText || "Remote";
        const applyUrl = `https://${host}/${site}${path}`;
        const compliance = isComplianceTitle(title);
        jobs.push({
          id: `wd-${tenant}-${path.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 80)}`,
          title: title.trim(),
          company,
          location: loc,
          region: isApac(`${loc} ${title}`) ? "APAC" : "Global",
          type: /contract|temporary/i.test(j.timeType || "") ? "Contract" : "Permanent",
          level: levelFromTitle(title),
          salary: "Competitive",
          posted: parseWorkdayPosted(j.postedOn),
          tags: tagsFromTitle(title),
          category: compliance ? "Compliance" : categoryFromTitle(title),
          applyUrl,
          source: "workday",
          description: `${title.trim()} at ${company}. Apply on the employer Workday careers page.`,
        });
      }
      offset += limit;
      if (offset >= (data.total || 0)) break;
    }
    return jobs;
  } catch (e) {
    console.warn(`Workday ${company}:`, e.message);
    return [];
  }
}

async function fetchAllWorkday() {
  const all = [];
  for (const [host, tenant, site, company] of WORKDAY_SITES) {
    // One broad pull + compliance-focused pull
    const batches = await Promise.all([
      fetchWorkdaySite(host, tenant, site, company, "compliance KYC AML"),
      fetchWorkdaySite(host, tenant, site, company, "engineer software product manager"),
      fetchWorkdaySite(host, tenant, site, company, "IT project manager program manager"),
      fetchWorkdaySite(host, tenant, site, company, "Head of IT technology governance strategy"),
    ]);
    all.push(...batches.flat());
    console.log(`  Workday ${company}: ${batches.flat().length} matched`);
  }
  return all;
}

/** Optional Adzuna (set ADZUNA_APP_ID + ADZUNA_APP_KEY in env / GitHub secrets) */
async function fetchAdzuna() {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    console.log("Adzuna: skipped (no ADZUNA_APP_ID/KEY)");
    return [];
  }
  const countries = ["sg", "gb", "us", "au"];
  const queries = [
    "compliance KYC AML",
    "software engineer senior",
    "product manager",
    "IT project manager",
    "Head of IT",
    "technology governance",
    "IT strategy",
  ];
  const out = [];
  for (const country of countries) {
    for (const what of queries) {
      try {
        const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${encodeURIComponent(what)}&content-type=application/json`;
        const r = await fetch(url, { headers: { "User-Agent": "HirehiredBot/1.0" } });
        if (!r.ok) continue;
        const data = await r.json();
        for (const j of data.results || []) {
          const title = j.title || "";
          if (!isTargetLevel(title)) continue;
          if (!(isComplianceTitle(title) || isTechTitle(title))) continue;
          if (isNonItSupport(title)) continue;
          const applyUrl = j.redirect_url || j.adref || "";
          if (!applyUrl) continue;
          const loc = j.location?.display_name || country.toUpperCase();
          const compliance = isComplianceTitle(title);
          out.push({
            id: `adzuna-${j.id}`,
            title: title.trim(),
            company: j.company?.display_name || "Company",
            location: loc,
            region: isApac(`${loc} ${title}`) || country === "sg" || country === "au" ? "APAC" : "Global",
            type: /contract/i.test(j.contract_type || "") ? "Contract" : "Permanent",
            level: levelFromTitle(title),
            salary:
              j.salary_min && j.salary_max
                ? `$${Math.round(j.salary_min / 1000)}k - $${Math.round(j.salary_max / 1000)}k`
                : "Competitive",
            posted: (j.created || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
            tags: tagsFromTitle(title),
            category: compliance ? "Compliance" : categoryFromTitle(title),
            applyUrl,
            source: "adzuna",
            description: (j.description || "").replace(/\s+/g, " ").trim().slice(0, 280),
          });
        }
      } catch (e) {
        console.warn("Adzuna", country, e.message);
      }
    }
  }
  return out;
}


const ASHBY_BOARDS = [
  ["openai", "OpenAI"],
  ["notion", "Notion"],
  ["linear", "Linear"],
  ["ramp", "Ramp"],
  ["plaid", "Plaid"],
  ["snowflake", "Snowflake"],
  ["sardine", "Sardine"],
  ["sentry", "Sentry"],
  ["supabase", "Supabase"],
  ["alchemy", "Alchemy"],
  ["persona", "Persona"],
  ["column", "Column"],
  ["posthog", "PostHog"],
  ["render", "Render"],
  ["resend", "Resend"],
  // Crypto
  ["circle", "Circle"],
  ["elliptic", "Elliptic"],
  ["mystenlabs", "Mysten Labs"],
  ["paradigm", "Paradigm"],
  ["opensea", "OpenSea"],
  ["uniswap", "Uniswap"],
];

async function fetchAshby(slug, company) {
  try {
    const r = await fetch(
      `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
      { headers: { "User-Agent": "HirehiredBot/1.0" } }
    );
    if (!r.ok) return [];
    const data = await r.json();
    return (data.jobs || [])
      .filter((j) => j.isListed !== false)
      .filter((j) => isTargetLevel(j.title || ""))
      .filter((j) => isComplianceTitle(j.title || "") || isTechTitle(j.title || ""))
      .filter((j) => !isNonItSupport(j.title || ""))
      .map((j) => {
        const title = (j.title || "").trim();
        const loc =
          j.location ||
          (j.isRemote ? "Remote" : "") ||
          (Array.isArray(j.secondaryLocations) && j.secondaryLocations[0]) ||
          "Remote";
        const applyUrl = j.jobUrl || j.applyUrl || "";
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl)) return null;
        const compliance = isComplianceTitle(title);
        return {
          id: `ashby-${slug}-${j.id}`,
          title,
          company,
          location: String(loc),
          region: isApac(`${loc} ${title}`) ? "APAC" : "Global",
          type: /contract|temporary/i.test(j.employmentType || "") ? "Contract" : "Permanent",
          level: levelFromTitle(title),
          salary: "Competitive",
          posted: j.publishedAt
            ? new Date(j.publishedAt).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
          tags: tagsFromTitle(title),
          category: compliance ? "Compliance" : categoryFromTitle(title),
          applyUrl,
          source: "ashby",
          description: (j.descriptionPlain || title)
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 280),
        };
      })
      .filter(Boolean);
  } catch (e) {
    console.warn(`Ashby ${slug}:`, e.message);
    return [];
  }
}

/** Reed.co.uk - set REED_API_KEY (free at reed.co.uk/developers) */
async function fetchReed() {
  const key = process.env.REED_API_KEY;
  if (!key) {
    console.log("Reed: skipped (no REED_API_KEY)");
    return [];
  }
  const queries = [
    { keywords: "compliance AML KYC", locationName: "London" },
    { keywords: "compliance", locationName: "Singapore" },
    { keywords: "senior software engineer", locationName: "London" },
    { keywords: "product manager", locationName: "London" },
    { keywords: "IT project manager", locationName: "London" },
    { keywords: "Head of IT", locationName: "London" },
    { keywords: "IT governance", locationName: "London" },
    { keywords: "technology strategy", locationName: "London" },
  ];
  const out = [];
  const auth = Buffer.from(`${key}:`).toString("base64");
  for (const q of queries) {
    try {
      const params = new URLSearchParams({
        keywords: q.keywords,
        locationName: q.locationName,
        resultsToTake: "100",
      });
      const r = await fetch(
        `https://www.reed.co.uk/api/1.0/search?${params}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "User-Agent": "HirehiredBot/1.0",
          },
        }
      );
      if (!r.ok) {
        console.warn("Reed HTTP", r.status);
        continue;
      }
      const data = await r.json();
      for (const j of data.results || []) {
        const title = j.jobTitle || "";
        if (!isTargetLevel(title)) continue;
        if (!(isComplianceTitle(title) || isTechTitle(title))) continue;
        if (isNonItSupport(title)) continue;
        const applyUrl = j.jobUrl || "";
        if (!applyUrl) continue;
        const loc = j.locationName || q.locationName;
        const compliance = isComplianceTitle(title);
        out.push({
          id: `reed-${j.jobId}`,
          title: title.trim(),
          company: j.employerName || "Company",
          location: loc,
          region: isApac(`${loc} ${title}`) ? "APAC" : "Global",
          type: j.contractType
            ? /contract|temp/i.test(j.contractType)
              ? "Contract"
              : "Permanent"
            : "Permanent",
          level: levelFromTitle(title),
          salary:
            j.minimumSalary && j.maximumSalary
              ? `£${Math.round(j.minimumSalary / 1000)}k - £${Math.round(j.maximumSalary / 1000)}k`
              : "Competitive",
          posted: (j.date || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
          tags: tagsFromTitle(title),
          category: compliance ? "Compliance" : categoryFromTitle(title),
          applyUrl,
          source: "reed",
          description: (j.jobDescription || "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 280),
        });
      }
    } catch (e) {
      console.warn("Reed:", e.message);
    }
  }
  return out;
}

/** JobsPipe - set JOBSPIPE_API_KEY (free tier ~1k jobs/mo at jobspipe.dev) */
async function fetchJobsPipe() {
  const key = process.env.JOBSPIPE_API_KEY;
  if (!key) {
    console.log("JobsPipe: skipped (no JOBSPIPE_API_KEY) - evaluate free tier at jobspipe.dev");
    return [];
  }
  const queries = [
    { job_title_or: ["compliance", "KYC", "AML"], limit: 50 },
    { job_title_or: ["senior software engineer", "staff engineer"], limit: 50 },
    { job_title_or: ["product manager"], limit: 25 },
    { job_title_or: ["IT project manager", "project manager IT"], limit: 25 },
    { job_title_or: ["Head of IT", "IT Director"], limit: 25 },
    { job_title_or: ["IT governance", "technology governance", "IT strategy"], limit: 25 },
  ];
  const out = [];
  for (const body of queries) {
    try {
      const r = await fetch("https://api.jobspipe.dev/v1/jobs/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
          "User-Agent": "HirehiredBot/1.0",
        },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        console.warn("JobsPipe HTTP", r.status, (await r.text()).slice(0, 120));
        continue;
      }
      const data = await r.json();
      const rows = data.data || data.jobs || data.results || [];
      for (const j of rows) {
        const title = j.job_title || j.title || "";
        if (!isTargetLevel(title)) continue;
        if (!(isComplianceTitle(title) || isTechTitle(title))) continue;
        if (isNonItSupport(title)) continue;
        const applyUrl = j.url || j.apply_url || j.job_url || "";
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl)) continue;
        const loc = j.location || j.locations_text || "Remote";
        const company = j.company || j.company_name || "Company";
        const compliance = isComplianceTitle(title);
        out.push({
          id: `jobspipe-${j.id || applyUrl}`,
          title: title.trim(),
          company,
          location: String(loc),
          region: isApac(`${loc} ${title}`) ? "APAC" : "Global",
          type: "Permanent",
          level: levelFromTitle(title),
          salary:
            j.min_annual_salary_usd && j.max_annual_salary_usd
              ? `$${Math.round(j.min_annual_salary_usd / 1000)}k - $${Math.round(j.max_annual_salary_usd / 1000)}k`
              : "Competitive",
          posted: (j.date_posted || j.discovered_at || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
          tags: tagsFromTitle(title),
          category: compliance ? "Compliance" : categoryFromTitle(title),
          applyUrl,
          source: "jobspipe",
          description: `${title} at ${company}`,
        });
      }
    } catch (e) {
      console.warn("JobsPipe:", e.message);
    }
  }
  return out;
}


const SMARTRECRUITERS_COMPANIES = [
  ["Grab", "Grab"],
  ["Wise", "Wise"],
  ["DeliveryHero", "Delivery Hero"],
  ["Auto1", "AUTO1 Group"],
  ["Siemens", "Siemens"],
  ["Visa", "Visa"],
  ["Mastercard", "Mastercard"],
  ["Accenture", "Accenture"],
  ["Deloitte", "Deloitte"],
];

async function fetchSmartRecruiters(slug, company) {
  try {
    const jobs = [];
    let offset = 0;
    const limit = 100;
    for (let page = 0; page < 5; page++) {
      const r = await fetch(
        `https://api.smartrecruiters.com/v1/companies/${slug}/postings?limit=${limit}&offset=${offset}`,
        { headers: { "User-Agent": "HirehiredBot/1.0", Accept: "application/json" } }
      );
      if (!r.ok) break;
      const data = await r.json();
      const content = data.content || [];
      if (!content.length) break;
      for (const j of content) {
        const title = j.name || j.title || "";
        if (!isTargetLevel(title)) continue;
        if (!(isComplianceTitle(title) || isTechTitle(title))) continue;
        if (isNonItSupport(title)) continue;
        // Never use api.smartrecruiters.com (returns raw JSON). Prefer careers board URL.
        let applyUrl =
          j.postingUrl ||
          j.applyUrl ||
          (j.id ? `https://jobs.smartrecruiters.com/${slug}/${j.id}` : "");
        if (applyUrl && /api\.smartrecruiters\.com/i.test(applyUrl) && j.id) {
          applyUrl = `https://jobs.smartrecruiters.com/${slug}/${j.id}`;
        }
        if (j.ref && /^https?:\/\//i.test(j.ref) && !/api\.smartrecruiters\.com/i.test(j.ref)) {
          applyUrl = j.ref;
        }
        if (!applyUrl || !/^https?:\/\//i.test(applyUrl) || /api\.smartrecruiters\.com/i.test(applyUrl))
          continue;
        const loc =
          j.location?.fullLocation ||
          j.location?.city ||
          j.location?.region ||
          (j.location?.remote ? "Remote" : "") ||
          j.location?.country ||
          "Remote";
        const compliance = isComplianceTitle(title);
        jobs.push({
          id: `sr-${slug}-${j.id || title}`,
          title: title.trim(),
          company,
          location: String(loc),
          region: isApac(`${loc} ${title}`) ? "APAC" : "Global",
          type: /contract|temporary/i.test(j.typeOfEmployment?.label || "")
            ? "Contract"
            : "Permanent",
          level: levelFromTitle(title),
          salary: "Competitive",
          posted: (j.releasedDate || j.createdOn || "").slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          tags: tagsFromTitle(title),
          category: compliance ? "Compliance" : categoryFromTitle(title),
          applyUrl,
          source: "smartrecruiters",
          description: `${title.trim()} at ${company}. Apply on the employer SmartRecruiters page.`,
        });
      }
      offset += limit;
      if (offset >= (data.totalFound || 0)) break;
    }
    return jobs;
  } catch (e) {
    console.warn(`SmartRecruiters ${slug}:`, e.message);
    return [];
  }
}

const WORKABLE_ACCOUNTS = [
  ["spotify", "Spotify"],
  ["intercom", "Intercom"],
  ["typeform", "Typeform"],
  ["revolut", "Revolut"],
  ["transferwise", "Wise"],
  ["monzo", "Monzo"],
  ["deliveroo", "Deliveroo"],
  ["skyscanner", "Skyscanner"],
  ["n26", "N26"],
  ["checkout", "Checkout.com"],
];

async function fetchWorkable(slug, company) {
  try {
    let data = null;
    for (const url of [
      `https://www.workable.com/api/accounts/${slug}?details=true`,
      `https://apply.workable.com/api/v1/widget/accounts/${slug}?details=true`,
    ]) {
      const r = await fetch(url, {
        headers: { "User-Agent": "HirehiredBot/1.0", Accept: "application/json" },
      });
      if (!r.ok) continue;
      data = await r.json();
      if ((data.jobs || []).length) break;
    }
    if (!data) return [];
    const list = data.jobs || data.results || (Array.isArray(data) ? data : []);
    return list
      .filter((j) => isTargetLevel(j.title || ""))
      .filter((j) => isComplianceTitle(j.title || "") || isTechTitle(j.title || ""))
      .filter((j) => !isNonItSupport(j.title || ""))
      .map((j) => {
        const title = (j.title || "").trim();
        const loc =
          j.city ||
          j.location ||
          (Array.isArray(j.locations) && j.locations[0]) ||
          "Remote";
        const applyUrl =
          j.url ||
          j.application_url ||
          (j.shortcode
            ? `https://jobs.workable.com/view/${j.shortcode}`
            : "") ||
          (j.id ? `https://apply.workable.com/${slug}/j/${j.shortcode || j.id}/` : "");
        if (!applyUrl || !/^https?:\/\//i.test(String(applyUrl))) return null;
        const compliance = isComplianceTitle(title);
        return {
          id: `workable-${slug}-${j.shortcode || j.id || title}`,
          title,
          company,
          location: String(loc),
          region: isApac(`${loc} ${title}`) ? "APAC" : "Global",
          type: /contract|temporary/i.test(j.employment_type || j.type || "")
            ? "Contract"
            : "Permanent",
          level: levelFromTitle(title),
          salary: "Competitive",
          posted: (j.published_on || j.created_at || "").slice(0, 10) ||
            new Date().toISOString().slice(0, 10),
          tags: tagsFromTitle(title),
          category: compliance ? "Compliance" : categoryFromTitle(title),
          applyUrl: String(applyUrl),
          source: "workable",
          description: `${title} at ${company}. Apply on the employer Workable page.`,
        };
      })
      .filter(Boolean);
  } catch (e) {
    console.warn(`Workable ${slug}:`, e.message);
    return [];
  }
}


/** MyCareersFuture (Singapore government) - public POST search, no key */
async function fetchMyCareersFuture() {
  const queries = [
    "compliance AML KYC CDD",
    "KYC analyst",
    "AML officer",
    "compliance manager Singapore",
    "software engineer senior",
    "product manager",
    "IT manager",
    "technical program manager",
    "IT project manager",
    "Head of IT",
    "technology governance",
    "IT governance",
    "IT strategy",
    "technology strategy",
    "program manager IT",
    "crypto compliance",
    "blockchain",
    "digital assets compliance",
    "virtual assets",
    "quantitative analyst",
    "quant researcher",
    "trading systems",
  ];
  const out = [];
  for (const search of queries) {
    for (let page = 0; page < 3; page++) {
      try {
        const r = await fetch("https://api.mycareersfuture.gov.sg/v2/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "HirehiredBot/1.0",
          },
          body: JSON.stringify({ search, limit: 50, page }),
        });
        if (!r.ok) break;
        const data = await r.json();
        const rows = data.results || [];
        if (!rows.length) break;
        for (const j of rows) {
          const title = j.title || "";
          if (!isTargetLevel(title)) continue;
          if (!(isComplianceTitle(title) || isTechTitle(title))) continue;
          if (isNonItSupport(title)) continue;
          const applyUrl =
            j.metadata?.jobDetailsUrl ||
            (j.uuid
              ? `https://www.mycareersfuture.gov.sg/job/${j.uuid}`
              : "");
          if (!applyUrl) continue;
          const companyName =
            (j.postedCompany && j.postedCompany.name) ||
            (j.hiringCompany && j.hiringCompany.name) ||
            "Singapore employer";
          const locParts = [];
          if (j.address?.building) locParts.push(j.address.building);
          if (j.address?.street) locParts.push(j.address.street);
          if (j.address?.districts?.[0]?.location)
            locParts.push(j.address.districts[0].location);
          const loc = locParts.length ? locParts.join(", ") + ", Singapore" : "Singapore";
          const levelHint = (j.positionLevels || [])
            .map((p) => p.position)
            .join(" ");
          const compliance = isComplianceTitle(title);
          const sal =
            j.salary?.minimum && j.salary?.maximum
              ? `S$${Math.round(j.salary.minimum / 1000)}k - S$${Math.round(j.salary.maximum / 1000)}k`
              : "Competitive";
          out.push({
            id: `mcf-${j.uuid || j.metadata?.jobPostId}`,
            title: title.trim(),
            company: companyName,
            location: loc,
            region: "APAC",
            type: /contract|temporary/i.test(
              (j.employmentTypes || []).map((e) => e.employmentType).join(" ") || ""
            )
              ? "Contract"
              : "Permanent",
            level: levelFromTitle(`${title} ${levelHint}`),
            salary: sal,
            posted:
              j.metadata?.newPostingDate ||
              (j.metadata?.updatedAt || "").slice(0, 10) ||
              new Date().toISOString().slice(0, 10),
            tags: tagsFromTitle(title),
            category: compliance ? "Compliance" : categoryFromTitle(title),
            applyUrl,
            source: "mycareersfuture",
            description: `${title.trim()} at ${companyName} (MyCareersFuture Singapore).`,
          });
        }
        if (rows.length < 50) break;
      } catch (e) {
        console.warn("MCF:", e.message);
        break;
      }
    }
  }
  return out;
}

function isDirectJobUrl(url) {
  if (!url) return false;
  return (
    /greenhouse\.io\/.+\/jobs\/\d+/i.test(url) ||
    /job-boards\.(eu\.)?greenhouse\.io\/.+\/jobs\/\d+/i.test(url) ||
    /boards\.greenhouse\.io\/.+\/jobs\/\d+/i.test(url) ||
    /gh_jid=\d+/i.test(url) || /myworkdayjobs\.com/i.test(url) || /ashbyhq\.com/i.test(url) || /smartrecruiters\.com/i.test(url) && !/api\.smartrecruiters\.com/i.test(url) || /workable\.com/i.test(url) || /mycareersfuture\.gov\.sg/i.test(url)
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

  console.log("Fetching Lever boards...");
  const leverResults = await Promise.all(
    LEVER_COMPANIES.map(([slug, name]) => fetchLever(slug, name))
  );
  const fromLever = leverResults.flat();
  console.log(`Lever: ${fromLever.length}`);

  console.log("Fetching Ashby boards...");
  const ashbyResults = await Promise.all(
    ASHBY_BOARDS.map(([slug, name]) => fetchAshby(slug, name))
  );
  const fromAshby = ashbyResults.flat();
  console.log(`Ashby: ${fromAshby.length}`);

  console.log("Fetching SmartRecruiters...");
  const srResults = await Promise.all(
    SMARTRECRUITERS_COMPANIES.map(([slug, name]) => fetchSmartRecruiters(slug, name))
  );
  const fromSr = srResults.flat();
  console.log(`SmartRecruiters: ${fromSr.length}`);

  console.log("Fetching Workable...");
  const workableResults = await Promise.all(
    WORKABLE_ACCOUNTS.map(([slug, name]) => fetchWorkable(slug, name))
  );
  const fromWorkable = workableResults.flat();
  console.log(`Workable: ${fromWorkable.length}`);

  console.log("Fetching Workday banks / enterprises...");
  const fromWd = await fetchAllWorkday();
  console.log(`Workday: ${fromWd.length}`);

  console.log("Fetching public APIs + optional Adzuna / Reed / JobsPipe...");
  console.log("Fetching MyCareersFuture (Singapore)...");
  const fromMcf = await fetchMyCareersFuture();
  console.log(`MyCareersFuture: ${fromMcf.length}`);

  const [remote, remotive, arbeit, adzuna, reed, jobspipe] = await Promise.all([
    fetchRemoteOK(),
    fetchRemotive(),
    fetchArbeitnow(),
    fetchAdzuna(),
    fetchReed(),
    fetchJobsPipe(),
  ]);
  console.log(
    `RemoteOK: ${remote.length}, Remotive: ${remotive.length}, Arbeitnow: ${arbeit.length}, Adzuna: ${adzuna.length}, Reed: ${reed.length}, JobsPipe: ${jobspipe.length}`
  );

  const all = [
    ...fromGh,
    ...fromLever,
    ...fromAshby,
    ...fromSr,
    ...fromWorkable,
    ...fromWd,
    ...fromMcf,
    ...remote,
    ...remotive,
    ...arbeit,
    ...adzuna,
    ...reed,
    ...jobspipe,
  ];

  const seen = new Set();
  const merged = [];
  for (const j of all) {
    const key = `${j.title}|${j.company}`.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    if (/google\.com\/search/i.test(j.applyUrl)) continue;
    if (!j.applyUrl || !/^https?:\/\//i.test(j.applyUrl)) continue;
    if (isNonItSupport(j.title)) continue;
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

  // Take all compliance (aim 100+), then fill with tech up to ~700
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

  // No company cap for compliance - we need volume
  for (const j of compliance) final.push(j);
  add(tech, 25);

  // Cap overall
  // Keep only jobs posted within the last 30 days
  const recent = final.filter((j) => isRecent(j, MAX_AGE_DAYS));
  console.log(
    `Age filter: ${final.length} → ${recent.length} (last ${MAX_AGE_DAYS} days)`
  );
  const capped = recent.slice(0, 1000);

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
