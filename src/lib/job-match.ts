/**
 * Rules-based profile ↔ job match %.
 * Additive model so strong overlaps can reach the 80%+ top band.
 */

import type { HirehiredProfile } from "@/lib/profile";
import type { Job } from "@/components/JobsBoard";

export type MatchTier = "top" | "strong" | "possible" | "weak";

export type JobMatch = {
  percent: number;
  tier: MatchTier;
  reasons: string[];
};

export function matchTier(percent: number): MatchTier {
  if (percent >= 80) return "top";
  if (percent >= 60) return "strong";
  if (percent >= 40) return "possible";
  return "weak";
}

export function tierLabel(tier: MatchTier): string {
  switch (tier) {
    case "top":
      return "Top match";
    case "strong":
      return "Strong";
    case "possible":
      return "Possible";
    default:
      return "Low";
  }
}

function normalize(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s: string): string[] {
  return normalize(s)
    .split(/[\s,/|;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

const DOMAIN_PHRASES: { phrase: string; weight: number }[] = [
  { phrase: "digital transformation", weight: 14 },
  { phrase: "technology transformation", weight: 12 },
  { phrase: "core platform", weight: 8 },
  { phrase: "cloud migration", weight: 12 },
  { phrase: "cloud governance", weight: 10 },
  { phrase: "it governance", weight: 12 },
  { phrase: "technology governance", weight: 12 },
  { phrase: "technology risk", weight: 10 },
  { phrase: "head of it", weight: 14 },
  { phrase: "head of technology", weight: 14 },
  { phrase: "chief technology", weight: 14 },
  { phrase: "interim cto", weight: 12 },
  { phrase: "service delivery", weight: 10 },
  { phrase: "program management", weight: 10 },
  { phrase: "project management", weight: 8 },
  { phrase: "portfolio management", weight: 8 },
  { phrase: "enterprise architecture", weight: 8 },
  { phrase: "financial services", weight: 8 },
  { phrase: "ci/cd", weight: 6 },
  { phrase: "devops", weight: 6 },
  { phrase: "finops", weight: 6 },
  { phrase: "disaster recovery", weight: 6 },
  { phrase: "chief of staff", weight: 8 },
  { phrase: "mas trm", weight: 8 },
  { phrase: "bnm trm", weight: 6 },
];

function profileBlob(p: HirehiredProfile): string {
  return normalize(
    [
      p.full_name,
      p.headline,
      p.location,
      p.summary,
      (p.skills || []).join(" "),
      (p.preferred_locations || []).join(" "),
      (p.claims || []).map((c) => `${c.title} ${c.description || ""}`).join(" "),
    ].join(" ")
  );
}

function jobBlob(j: Job): string {
  return normalize(
    [
      j.title,
      j.company,
      j.location,
      j.region,
      j.level,
      j.type,
      j.category,
      (j.tags || []).join(" "),
      j.description || "",
    ].join(" ")
  );
}

/**
 * Additive 0–99 score. Strong title + domain + level + location can clear 80.
 */
export function scoreJobMatch(profile: HirehiredProfile, job: Job): JobMatch {
  const pText = profileBlob(profile);
  const jText = jobBlob(job);
  if (!pText || pText.length < 20) {
    return { percent: 0, tier: "weak", reasons: [] };
  }

  let score = 0;
  const reasons: string[] = [];

  // 1) Domain phrases (cap contribution)
  let domainPts = 0;
  for (const { phrase, weight } of DOMAIN_PHRASES) {
    if (!pText.includes(phrase)) continue;
    if (jText.includes(phrase)) {
      domainPts += weight;
      if (reasons.length < 5) reasons.push(phrase);
    } else {
      const words = phrase.split(/\s+/).filter((w) => w.length >= 3);
      const hits = words.filter((w) => jText.includes(w)).length;
      if (hits > 0) domainPts += weight * 0.3 * (hits / words.length);
    }
  }
  score += Math.min(36, domainPts);

  // 2) Skills (count hits, not miss penalty)
  const skills = (profile.skills || []).map((s) => normalize(s)).filter((s) => s.length >= 2);
  let skillHits = 0;
  for (const sk of skills) {
    if (jText.includes(sk)) {
      skillHits += 1;
      if (reasons.length < 6) reasons.push(sk);
    }
  }
  // Each hit +4, cap 28
  score += Math.min(28, skillHits * 4);

  // 3) Level alignment (up to 20)
  const jobLevel = normalize(job.level + " " + job.title);
  const isExecProfile = /director|head of|vp|vice president|chief|cto|cio|interim cto|head of it|head of regional/.test(
    pText
  );
  const isExecJob = /director|head of|head,|vp|vice president|chief|cto|cio/.test(jobLevel);
  const isSeniorJob = /senior|lead|manager|staff|principal|director|head|vp/.test(jobLevel);
  if (isExecProfile && isExecJob) {
    score += 20;
    if (reasons.length < 6) reasons.push("director-level");
  } else if (isExecProfile && isSeniorJob) {
    score += 12;
  } else if (isSeniorJob) {
    score += 6;
  }

  // 4) Location (up to 12)
  if (
    /singapore|apac|asean/.test(pText) &&
    /singapore|apac|malaysia|hong kong|indonesia|philippines|remote|asean/.test(jText)
  ) {
    score += 12;
    if (reasons.length < 6) reasons.push("APAC / Singapore");
  } else if (/remote/i.test(job.location)) {
    score += 6;
  }

  // 5) Role family fit (up to 12)
  const techLeadJob =
    /it|technology|digital|cloud|program|pmo|architect|governance|transformation|cto|cio|infrastructure|delivery|engineering manager|head of/.test(
      normalize(job.title + " " + job.category)
    );
  const techLeadProfile = /technology|digital|it|cloud|pmo|program|cto|governance|transformation|service delivery/.test(
    pText
  );
  if (techLeadJob && techLeadProfile) {
    score += 12;
  } else if (techLeadJob) {
    score += 4;
  }

  // 6) Title token overlap (up to 10)
  const stop = new Set([
    "the", "and", "for", "with", "from", "this", "that", "role", "team", "year",
    "years", "work", "services", "manager", "senior",
  ]);
  const pTokens = new Set(tokenize(pText).filter((t) => !stop.has(t) && t.length > 3));
  const jTokens = tokenize(job.title).filter((t) => !stop.has(t) && t.length > 3);
  let tokHits = 0;
  for (const tok of jTokens) {
    if (pTokens.has(tok)) tokHits += 1;
  }
  score += Math.min(10, tokHits * 3);

  const percent = Math.max(0, Math.min(99, Math.round(score)));

  return {
    percent,
    tier: matchTier(percent),
    reasons: [...new Set(reasons)].slice(0, 4),
  };
}

export function hasMatchableProfile(p: HirehiredProfile | null | undefined): boolean {
  if (!p) return false;
  if ((p.skills || []).length >= 3) return true;
  if ((p.summary || "").trim().length >= 80) return true;
  if ((p.headline || "").trim().length >= 10 && (p.full_name || "").trim()) return true;
  return false;
}
