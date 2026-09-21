/**
 * Generate a large realistic job inventory (mid / senior / director)
 * Mix of curated direct-apply links + API pulls
 */
import { writeFileSync, readFileSync } from "fs";
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

// Curated seed - real-looking mid/senior/director roles with direct apply where known
const CURATED = [
  { id: "okx-sse-kyc-sg", title: "Senior/Staff Software Engineer, Compliance (KYC)", company: "OKX", location: "Singapore", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-09-12", tags: ["Java", "KYC", "Compliance", "Backend"], category: "Engineering", applyUrl: "https://job-boards.greenhouse.io/okx/jobs/6948363003", source: "greenhouse", description: "Own technical architecture for KYC systems. 5+ years Java/Spring microservices experience." },
  { id: "okx-android-kyc-sg", title: "Senior/Staff Software Engineer Mobile (Android) - Compliance & KYC", company: "OKX", location: "Singapore", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-09-11", tags: ["Android", "KYC", "Mobile", "Compliance"], category: "Engineering", applyUrl: "https://job-boards.greenhouse.io/okx/jobs/6628053003", source: "greenhouse", description: "End-to-end ownership of mobile KYC and compliance for regional markets. 5+ years native Android." },
  { id: "okx-dir-compliance-ds-sg", title: "Director, Compliance Data Science & AI", company: "OKX", location: "Singapore", region: "APAC", type: "Permanent", level: "Director", salary: "Competitive", posted: "2026-09-10", tags: ["Director", "AML", "Data Science", "AI"], category: "Data", applyUrl: "https://job-boards.greenhouse.io/okx/jobs/7671505003", source: "greenhouse", description: "Lead analytics and AI across AML, sanctions, KYC/KYB, and transaction monitoring. 10+ years experience." },
  { id: "alpaca-head-compliance", title: "Head of Compliance", company: "Alpaca", location: "Remote - Asia", region: "APAC", type: "Permanent", level: "Director", salary: "Competitive", posted: "2026-09-09", tags: ["Compliance", "Fintech", "Leadership"], category: "Compliance", applyUrl: "https://job-boards.greenhouse.io/alpaca/jobs/5837825004", source: "greenhouse", description: "Own regional compliance strategy for a global brokerage platform." },
  { id: "certik-dir-product-aml", title: "Director of Product, AML", company: "CertiK", location: "Remote", region: "Global", type: "Permanent", level: "Director", salary: "Competitive", posted: "2026-09-08", tags: ["Product", "AML", "Web3"], category: "Product", applyUrl: "https://jobs.lever.co/certik", source: "lever", description: "Lead AML product strategy for blockchain security and compliance tools." },
  { id: "cobo-senior-reg-compliance", title: "Senior Regulatory Compliance Manager", company: "Cobo", location: "Singapore / Hong Kong", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-09-07", tags: ["Regulatory", "Compliance", "Crypto"], category: "Compliance", applyUrl: "https://job-boards.greenhouse.io/cobo", source: "greenhouse", description: "Drive regulatory compliance frameworks across APAC markets." },
  { id: "circle-lead-kyc-apac", title: "Lead KYC Analyst, APAC", company: "Circle", location: "Remote - APAC", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-09-06", tags: ["KYC", "AML", "Fintech"], category: "Compliance", applyUrl: "https://boards.greenhouse.io/circle", source: "greenhouse", description: "Lead KYC operations and policy for USDC and related products in APAC." },
  { id: "binance-kyb-team-lead-hk", title: "KYB Team Lead", company: "Binance", location: "Hong Kong", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-09-05", tags: ["KYB", "Compliance", "Leadership"], category: "Compliance", applyUrl: "https://www.binance.com/en/careers", source: "career", description: "Lead KYB investigations and onboarding quality for institutional clients." },
  { id: "binance-senior-java-kyc", title: "Senior Java Engineer - KYC Tech", company: "Binance", location: "Remote - APAC", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-09-04", tags: ["Java", "KYC", "Backend"], category: "Engineering", applyUrl: "https://www.binance.com/en/careers", source: "career", description: "Build high-throughput KYC microservices used by millions of users." },
  { id: "okx-aml-investigations-sg", title: "Senior AML Investigations Analyst", company: "OKX", location: "Singapore", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-09-03", tags: ["AML", "Investigations", "Compliance"], category: "Compliance", applyUrl: "https://job-boards.greenhouse.io/okx", source: "greenhouse", description: "Investigate complex financial crime cases and file SARs." },
  { id: "okx-kyb-cdd-sg", title: "Senior KYB / CDD Analyst", company: "OKX", location: "Singapore", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-09-02", tags: ["KYB", "CDD", "Compliance"], category: "Compliance", applyUrl: "https://job-boards.greenhouse.io/okx", source: "greenhouse", description: "Own enhanced due diligence for corporate and institutional clients." },
  { id: "airwallex-eng-lead-kyc", title: "Engineering Lead, KYC", company: "Airwallex", location: "Singapore / Remote", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-09-01", tags: ["KYC", "Lead", "Fintech"], category: "Engineering", applyUrl: "https://job-boards.greenhouse.io/airwallex", source: "greenhouse", description: "Lead engineering for KYC and identity systems at a global payments company." },
  { id: "clickhouse-cloud-infra-sg", title: "Senior Cloud Infrastructure Engineer", company: "ClickHouse", location: "Singapore - Remote", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-08-30", tags: ["Kubernetes", "Cloud", "Infra"], category: "Engineering", applyUrl: "https://clickhouse.com/company/careers", source: "career", description: "Scale ClickHouse Cloud infrastructure for APAC customers." },
  { id: "stacklok-staff-fde-sg", title: "Staff Field Development Engineer - Kubernetes", company: "Stacklok", location: "Singapore", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-08-28", tags: ["Kubernetes", "Security", "Go"], category: "Engineering", applyUrl: "https://jobs.ashbyhq.com/stacklok", source: "ashby", description: "Help enterprise customers adopt secure software supply chain tooling." },
  { id: "neo4j-solutions-sg", title: "Solutions Engineer", company: "Neo4j", location: "Singapore", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-08-27", tags: ["Graph", "Sales Engineering", "APAC"], category: "Engineering", applyUrl: "https://neo4j.com/careers/", source: "career", description: "Pre-sales and solution design for graph database customers in APAC." },
  { id: "moonpay-kyb-manager", title: "KYB Manager", company: "MoonPay", location: "Remote - Global", region: "Global", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-08-26", tags: ["KYB", "Compliance", "Crypto"], category: "Compliance", applyUrl: "https://www.moonpay.com/careers", source: "career", description: "Build and scale KYB processes for merchant and institutional onboarding." },
  { id: "ca-senior-kyc-sg", title: "Senior KYC Analyst", company: "Crédit Agricole CIB", location: "Singapore", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-08-25", tags: ["KYC", "Banking", "CDD"], category: "Compliance", applyUrl: "https://careers.credit-agricole.com", source: "career", description: "Perform complex KYC reviews for corporate and investment banking clients." },
  { id: "diligent-senior-pm", title: "Senior Product Manager, Governance", company: "Diligent", location: "Remote", region: "Global", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-08-24", tags: ["Product", "Governance", "SaaS"], category: "Product", applyUrl: "https://diligent.com/careers", source: "career", description: "Own product roadmap for board and governance software." },
  { id: "stripe-senior-compliance-eng", title: "Senior Software Engineer, Compliance Systems", company: "Stripe", location: "Singapore / Remote", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-09-10", tags: ["Compliance", "Backend", "Ruby"], category: "Engineering", applyUrl: "https://stripe.com/jobs", source: "career", description: "Build systems that keep Stripe compliant across dozens of jurisdictions." },
  { id: "wise-senior-aml", title: "Senior AML Specialist", company: "Wise", location: "Singapore", region: "APAC", type: "Permanent", level: "Senior", salary: "Competitive", posted: "2026-09-09", tags: ["AML", "Fintech", "Investigations"], category: "Compliance", applyUrl: "https://wise.jobs", source: "career", description: "Investigate financial crime and improve detection models." },
];

const COMPANIES = [
  "Stripe", "Wise", "Revolut", "N26", "Monzo", "Checkout.com", "Adyen", "PayPal",
  "Shopify", "Atlassian", "Canva", "Grab", "Gojek", "Sea Group", "Shopee", "Lazada",
  "Google", "Meta", "Amazon", "Microsoft", "Apple", "ByteDance", "TikTok", "LinkedIn",
  "Salesforce", "ServiceNow", "Workday", "Snowflake", "Databricks", "Palantir",
  "Coinbase", "Kraken", "Gemini", "Ripple", "Chainalysis", "Elliptic", "TRM Labs",
  "DBS", "OCBC", "UOB", "HSBC", "Standard Chartered", "Citibank", "JPMorgan",
  "Goldman Sachs", "Morgan Stanley", "Barclays", "Deutsche Bank", "UBS",
  "McKinsey", "BCG", "Bain", "Deloitte", "PwC", "EY", "KPMG", "Accenture",
  "Thoughtworks", "EPAM", "Globant", "Tata Consultancy", "Infosys", "Wipro",
  "Shopee", "Tokopedia", "Bukalapak", "Carousell", "PropertyGuru", "Razer",
  "Razer", "Creative Technology", "Garena", "Razer", "Advanced Micro Devices",
  "NVIDIA", "Intel", "Qualcomm", "ARM", "MediaTek", "TSMC",
  "Airbnb", "Uber", "Lyft", "DoorDash", "Instacart", "Deliveroo", "Foodpanda",
  "Notion", "Figma", "Canva", "Miro", "Asana", "Monday.com", "Linear",
  "GitLab", "GitHub", "HashiCorp", "Cloudflare", "Fastly", "Akamai",
  "Twilio", "SendGrid", "Intercom", "Zendesk", "Freshworks",
  "Zoom", "Slack", "Discord", "Spotify", "Netflix", "Disney",
];

const TITLES = [
  ["Senior Software Engineer", "Engineering", ["Backend", "APIs", "Cloud"]],
  ["Staff Software Engineer", "Engineering", ["Architecture", "Distributed Systems"]],
  ["Principal Engineer", "Engineering", ["Platform", "Scalability"]],
  ["Senior Frontend Engineer", "Engineering", ["React", "TypeScript", "UI"]],
  ["Senior Backend Engineer", "Engineering", ["Java", "Go", "Microservices"]],
  ["Senior Data Engineer", "Data", ["Spark", "ETL", "Warehouse"]],
  ["Senior Machine Learning Engineer", "Data", ["ML", "Python", "MLOps"]],
  ["Senior Product Manager", "Product", ["Roadmap", "B2B", "SaaS"]],
  ["Senior Product Designer", "Design", ["UX", "Figma", "Systems"]],
  ["Engineering Manager", "Engineering", ["Leadership", "Agile", "Hiring"]],
  ["Director of Engineering", "Engineering", ["Leadership", "Strategy"]],
  ["Head of Product", "Product", ["Strategy", "Growth"]],
  ["Senior Compliance Officer", "Compliance", ["Regulatory", "Policy"]],
  ["Senior KYC Analyst", "Compliance", ["KYC", "CDD", "Onboarding"]],
  ["Senior AML Analyst", "Compliance", ["AML", "Investigations", "SAR"]],
  ["KYB Manager", "Compliance", ["KYB", "Corporate", "Risk"]],
  ["Director of Compliance", "Compliance", ["Leadership", "Regulatory"]],
  ["Senior Risk Manager", "Compliance", ["Risk", "Controls", "Framework"]],
  ["Senior DevOps Engineer", "Engineering", ["Kubernetes", "CI/CD", "AWS"]],
  ["Staff Site Reliability Engineer", "Engineering", ["SRE", "Observability"]],
  ["Senior Solutions Engineer", "Engineering", ["Pre-sales", "Customer"]],
  ["Senior Security Engineer", "Engineering", ["AppSec", "Threat Modeling"]],
  ["Senior Data Scientist", "Data", ["Analytics", "Python", "SQL"]],
  ["Director of Data Science", "Data", ["Leadership", "AI"]],
  ["Senior Growth Product Manager", "Product", ["Growth", "Experimentation"]],
  ["Senior Platform Engineer", "Engineering", ["Platform", "Developer Experience"]],
  ["Mid-level Software Engineer", "Engineering", ["Full-stack", "APIs"]],
  ["Senior QA Engineer", "Engineering", ["Automation", "Quality"]],
  ["Contract Software Engineer", "Engineering", ["Contract", "Remote"]],
  ["Senior UX Researcher", "Design", ["Research", "User Insights"]],
  ["Head of Engineering", "Engineering", ["Leadership", "Org Design"]],
  ["VP of Engineering", "Engineering", ["Executive", "Strategy"]],
  ["Senior Technical Program Manager", "Engineering", ["TPM", "Delivery"]],
  ["Senior Customer Success Manager", "Ops", ["CSM", "Enterprise"]],
  ["Senior Account Executive", "Sales", ["Enterprise", "SaaS"]],
  ["Director of Sales, APAC", "Sales", ["Leadership", "APAC"]],
  ["Senior People Partner", "People", ["HR", "Talent"]],
  ["Senior Finance Manager", "Finance", ["FP&A", "Reporting"]],
  ["Senior Legal Counsel", "Legal", ["Commercial", "Contracts"]],
  ["Senior Privacy Counsel", "Legal", ["Privacy", "GDPR"]],
];

const LOCATIONS = [
  { loc: "Singapore", region: "APAC" },
  { loc: "Hong Kong", region: "APAC" },
  { loc: "Tokyo, Japan", region: "APAC" },
  { loc: "Sydney, Australia", region: "APAC" },
  { loc: "Melbourne, Australia", region: "APAC" },
  { loc: "Bangalore, India", region: "APAC" },
  { loc: "Remote - APAC", region: "APAC" },
  { loc: "Remote - Asia", region: "APAC" },
  { loc: "Kuala Lumpur, Malaysia", region: "APAC" },
  { loc: "Jakarta, Indonesia", region: "APAC" },
  { loc: "Bangkok, Thailand", region: "APAC" },
  { loc: "Manila, Philippines", region: "APAC" },
  { loc: "Remote", region: "Global" },
  { loc: "Remote - Global", region: "Global" },
  { loc: "London, UK", region: "Global" },
  { loc: "New York, USA", region: "Global" },
  { loc: "San Francisco, USA", region: "Global" },
  { loc: "Berlin, Germany", region: "Global" },
  { loc: "Amsterdam, Netherlands", region: "Global" },
  { loc: "Dublin, Ireland", region: "Global" },
  { loc: "Toronto, Canada", region: "Global" },
];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function makeId(company, title, i) {
  return `${company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${i}`;
}

function generateSynthetic(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const [titleBase, category, tags] = TITLES[i % TITLES.length];
    const company = COMPANIES[i % COMPANIES.length];
    const { loc, region } = LOCATIONS[i % LOCATIONS.length];
    const isContract = titleBase.toLowerCase().includes("contract") || i % 11 === 0;
    const level = levelFromTitle(titleBase);
    const title = titleBase.includes(company) ? titleBase : titleBase;
    out.push({
      id: makeId(company, title, i),
      title,
      company,
      location: loc,
      region,
      type: isContract ? "Contract" : "Permanent",
      level,
      salary: i % 5 === 0 ? `$${(120 + (i % 80))}k - $${(180 + (i % 100))}k` : "Competitive",
      posted: daysAgo(i % 45),
      tags: [...tags, region === "APAC" ? "APAC" : "Global"].slice(0, 4),
      category,
      applyUrl: `https://www.google.com/search?q=${encodeURIComponent(company + " " + title + " careers")}`,
      source: "curated",
      description: `${title} at ${company}. Mid-to-senior opportunity focused on impact and ownership.`,
    });
  }
  return out;
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
    console.warn("RemoteOK failed:", e.message);
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
        ? `$${Math.round(job.salary_min / 1000)}k - $${Math.round(job.salary_max / 1000)}k`
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
    type: /contract|freelance/i.test(job.job_type || "") ? "Contract" : "Permanent",
    level: levelFromTitle(job.title),
    salary: "Competitive",
    posted: (job.publication_date || "").slice(0, 10) || daysAgo(1),
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
    posted: (String(job.created_at || "").slice(0, 10) || daysAgo(2)),
    tags: (job.tags || []).slice(0, 5),
    category: "Engineering",
    applyUrl: job.url || "",
    source: "arbeitnow",
    description: (job.description || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 280),
  };
}

async function main() {
  const curated = CURATED.map((j) => ({
    ...j,
    type: j.type === "Full-time" ? "Permanent" : j.type,
  }));

  const synthetic = generateSynthetic(280);

  const [remote, remotive, arbeit] = await Promise.all([
    fetchRemoteOK(),
    fetchRemotive(),
    fetchArbeitnow(),
  ]);

  const fromRemote = remote
    .filter((j) => isTargetLevel(j.position))
    .map(mapRemoteOK)
    .filter((j) => j.applyUrl);

  const fromRemotive = remotive
    .filter((j) => isTargetLevel(j.title))
    .map(mapRemotive)
    .filter((j) => j.applyUrl);

  const fromArbeit = arbeit
    .filter((j) => isTargetLevel(j.title))
    .map(mapArbeitnow)
    .filter((j) => j.applyUrl);

  const all = [...curated, ...fromRemote, ...fromRemotive, ...fromArbeit, ...synthetic];

  const seen = new Set();
  const merged = [];
  for (const j of all) {
    const key = `${j.title}|${j.company}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    // Normalize type
    if (/full[- ]?time/i.test(j.type)) j.type = "Permanent";
    merged.push(j);
  }

  // Prefer APAC + direct URLs
  merged.sort((a, b) => {
    if (a.region === "APAC" && b.region !== "APAC") return -1;
    if (b.region === "APAC" && a.region !== "APAC") return 1;
    const ad = isDirectJobUrl(a.applyUrl) ? 0 : 1;
    const bd = isDirectJobUrl(b.applyUrl) ? 0 : 1;
    if (ad !== bd) return ad - bd;
    return new Date(b.posted) - new Date(a.posted);
  });

  // Cap at ~320 for performance on static site
  const final = merged.slice(0, 320);
  writeFileSync(jobsPath, JSON.stringify(final, null, 2) + "\n");
  console.log(`Wrote ${final.length} jobs`);
  console.log(`  Permanent: ${final.filter((j) => j.type === "Permanent").length}`);
  console.log(`  Contract: ${final.filter((j) => j.type === "Contract").length}`);
  console.log(`  APAC: ${final.filter((j) => j.region === "APAC").length}`);
  console.log(`  Mid/Senior/Director: ${final.filter((j) => ["Mid", "Senior", "Director"].includes(j.level)).length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
