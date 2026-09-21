/**
 * Client-side resume text extraction and field heuristics.
 * PDF/DOCX loaders from CDN at runtime (no extra npm packages).
 */

export type ParsedResume = {
  full_name: string;
  headline: string;
  location: string;
  summary: string;
  skills: string[];
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  raw_preview: string;
};

const SKILL_LEXICON = [
  "javascript", "typescript", "python", "java", "go", "golang", "rust", "kotlin",
  "react", "next.js", "node.js", "nodejs", "aws", "azure", "gcp", "kubernetes",
  "docker", "postgresql", "postgres", "mysql", "mongodb", "redis", "graphql",
  "terraform", "ci/cd", "devops", "sre", "machine learning", "data science",
  "kyc", "aml", "sanctions", "cdd", "edd", "compliance", "financial crime",
  "fincrime", "regulatory", "risk management", "audit", "sox", "gdpr",
  "product management", "project management", "program management", "agile",
  "scrum", "system design", "microservices", "api", "sql", "spark", "airflow",
  "platform engineering", "security", "cybersecurity", "blockchain", "fintech",
];


function cleanLines(text: string): string[] {
  // PDFs often glue words; also split on bullets and pipes
  const softened = text
    .replace(/\r/g, "\n")
    .replace(/[•·▪◦]/g, "\n")
    .replace(/\s*\|\s*/g, "\n")
    .replace(/\t+/g, "\n");
  return softened
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** Rebuild lines when PDF extraction returns one long string */
function expandLines(text: string): string[] {
  let lines = cleanLines(text);
  if (lines.length >= 6) return lines;
  // Split long blob on common resume anchors
  const blob = text.replace(/\s+/g, " ").trim();
  const pieces = blob
    .split(
      /(?=\b(?:Summary|Professional Summary|Profile|Objective|Experience|Work Experience|Employment|Education|Skills|Technical Skills|Projects|Certifications|Contact)\b)/i
    )
    .flatMap((p) => p.split(/(?<=\.)\s+(?=[A-Z])/))
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
  if (pieces.length > lines.length) return pieces;
  // Last resort: split every ~60 chars on spaces near start for name hunting
  return lines.length ? lines : [blob.slice(0, 200)];
}

function titleCaseName(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => {
      if (w.length <= 2 && w === w.toUpperCase()) return w; // JR, II
      if (/^[A-Z]\.?$/.test(w)) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

function looksLikeName(line: string): boolean {
  const s = line.trim();
  if (s.length < 3 || s.length > 70) return false;
  if (
    /@|https?:|www\.|\.com|linkedin|github|resume|curriculum|vitae|phone|mobile|email|address|street|singapore \d|postal|tel\.|fax/i.test(
      s
    )
  )
    return false;
  if (
    /^(summary|experience|education|skills|projects|objective|profile|contact|work history|employment|certifications|technical)\b/i.test(
      s
    )
  )
    return false;
  if (/\d{5,}/.test(s)) return false;
  // ALL CAPS name: JANE MARY SMITH
  if (/^[A-Z][A-Z]+(?:\s+[A-Z][A-Z.]+){1,4}$/.test(s) && s.split(/\s+/).length <= 5)
    return true;
  // Title Case: Jane Mary Smith / Jane M. Smith
  if (
    /^[A-Z][a-z]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][a-z]+)+$/.test(s) &&
    s.split(/\s+/).length >= 2 &&
    s.split(/\s+/).length <= 5
  )
    return true;
  // Mixed: JANE Smith
  if (/^[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z.]+){1,3}$/.test(s) && !/\b(Engineer|Manager|Director|Developer)\b/i.test(s))
    return true;
  return false;
}

function nameFromEmail(text: string): string {
  const m = text.match(
    /([a-zA-Z][a-zA-Z._-]{1,30})@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );
  if (!m) return "";
  const local = m[1].replace(/[._-]+/g, " ").trim();
  const parts = local.split(/\s+/).filter((p) => p.length > 1);
  if (parts.length < 2) return "";
  if (parts.length > 4) return "";
  return titleCaseName(parts.join(" "));
}

function nameFromLabel(text: string): string {
  const m = text.match(
    /(?:^|\n)\s*(?:name|full\s*name|candidate)\s*[:\-]\s*([A-Za-z][A-Za-z .'-]{2,50})/i
  );
  if (!m) return "";
  const n = m[1].trim();
  return looksLikeName(n) || /^[A-Za-z].*\s+[A-Za-z]/.test(n) ? titleCaseName(n) : "";
}

function guessName(lines: string[], text: string): string {
  const labeled = nameFromLabel(text);
  if (labeled) return labeled;

  const head = lines.slice(0, 12);
  for (const line of head) {
    // "Name | Title" or "Name - Title"
    const split = line.split(/\s+[|–—-]\s+/);
    if (split.length >= 2 && looksLikeName(split[0])) {
      return titleCaseName(split[0]);
    }
    if (looksLikeName(line)) {
      return titleCaseName(line);
    }
  }

  // First line might be "JOHN DOE Senior Engineer" without separator
  const first = head[0] || "";
  const roleHit = first.match(
    /^([A-Za-z][A-Za-z .']{2,40}?)\s+(?=(?:Senior|Staff|Principal|Lead|Junior)?\s*(?:Software|Platform|Data|Compliance|Product|IT)?\s*(?:Engineer|Developer|Manager|Director|Analyst|Architect|Officer|Consultant|Designer)\b)/i
  );
  if (roleHit && looksLikeName(roleHit[1].trim())) {
    return titleCaseName(roleHit[1].trim());
  }

  const fromEmail = nameFromEmail(text);
  if (fromEmail) return fromEmail;

  return "";
}

function guessLocation(text: string, lines: string[]): string {
  const cities =
    /\b(Singapore|Hong Kong|Tokyo|Sydney|Melbourne|London|New York|San Francisco|Berlin|Remote|Kuala Lumpur|Bangkok|Jakarta|Seoul|Taipei|Mumbai|Bangalore|Bengaluru|Hyderabad|Dubai|Toronto|Vancouver|Austin|Seattle|Boston|Chicago|Los Angeles|Paris|Amsterdam|Zurich)\b/i;
  for (const line of lines.slice(0, 20)) {
    const m = line.match(cities);
    if (m) return m[1];
  }
  const m = text.match(cities);
  return m ? m[1] : "";
}

const ROLE_WORDS =
  /\b(engineer|engineering|developer|manager|director|analyst|specialist|lead|architect|officer|consultant|designer|scientist|programmer|administrator|head of|vp|vice president|product owner|scrum master|cto|cio)\b/i;

function cleanHeadline(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .replace(/^[\s|·•\-–—]+|[\s|·•\-–—]+$/g, "")
    .trim()
    .slice(0, 120);
}

function guessHeadline(lines: string[], text: string, name: string): string {
  const skipName = (l: string) =>
    name && l.toLowerCase() === name.toLowerCase();

  // Same line as name: "Jane Doe | Senior Engineer"
  for (const line of lines.slice(0, 10)) {
    const split = line.split(/\s+[|–—]\s+/);
    if (split.length >= 2) {
      const right = split.slice(1).join(" - ");
      if (ROLE_WORDS.test(right) && right.length < 100) return cleanHeadline(right);
    }
    const dash = line.match(
      /^[A-Za-z .']{3,40}\s+[-–—]\s+(.+)$/
    );
    if (dash && ROLE_WORDS.test(dash[1])) return cleanHeadline(dash[1]);
  }

  // Dedicated title lines near the top
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const l = lines[i];
    if (skipName(l)) continue;
    if (l.length < 6 || l.length > 110) continue;
    if (/@|https?:|www\./i.test(l)) continue;
    if (
      /^(summary|experience|education|skills|projects|objective|profile|contact|work history)\b/i.test(
        l
      )
    )
      continue;
    if (ROLE_WORDS.test(l) && !/\b(university|bachelor|master|degree|graduated)\b/i.test(l)) {
      // Prefer lines that look like job titles, not job bullets
      if (/^[•\-\d]/.test(l)) continue;
      if (/\bat\b.+\d{4}/i.test(l)) continue; // "Engineer at X 2019"
      return cleanHeadline(l);
    }
  }

  // Labeled title
  const labeled = text.match(
    /(?:title|headline|role|current role|position)\s*[:\-]\s*([^\n]{6,100})/i
  );
  if (labeled && ROLE_WORDS.test(labeled[1])) return cleanHeadline(labeled[1]);

  // Regex over full text for common patterns
  const patterns = [
    /\b((?:Senior|Staff|Principal|Lead|Junior)?\s*Software\s+Engineers?(?:\s*,?\s*[A-Za-z /&]+){0,4})/i,
    /\b((?:Senior|Staff|Principal|Lead)?\s*(?:Platform|Backend|Frontend|Full[- ]?Stack|Data|DevOps|Security|Cloud)\s+Engineers?(?:\s*,?\s*[A-Za-z /&]+){0,3})/i,
    /\b((?:Senior|Staff|Lead)?\s*Product\s+Managers?(?:\s*,?\s*[A-Za-z /&]+){0,3})/i,
    /\b((?:Senior|Lead)?\s*(?:Compliance|AML|KYC|Risk)\s+(?:Manager|Officer|Analyst|Director|Lead)(?:\s*,?\s*[A-Za-z /&]+){0,3})/i,
    /\b((?:Head of|VP|Vice President|Director of)\s+[A-Za-z][A-Za-z /&]{2,40})/i,
    /\b((?:Senior|Staff|Principal|Lead)?\s*(?:Engineering|Technology)\s+Managers?(?:\s*,?\s*[A-Za-z /&]+){0,3})/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return cleanHeadline(m[1]);
  }

  return "";
}

function guessSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const skill of SKILL_LEXICON) {
    const re = new RegExp(
      `\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")}\\b`,
      "i"
    );
    if (re.test(lower)) {
      const label = skill
        .split(" ")
        .map((w) =>
          w === "aws" ||
          w === "gcp" ||
          w === "sql" ||
          w === "api" ||
          w === "ci/cd" ||
          w.length <= 3
            ? w.toUpperCase()
            : w.charAt(0).toUpperCase() + w.slice(1)
        )
        .join(" ")
        .replace("NODE.JS", "Node.js")
        .replace("NEXT.JS", "Next.js")
        .replace("GOLANG", "Go");
      if (!found.includes(label)) found.push(label);
    }
  }
  return found.slice(0, 16);
}

function sectionBlob(text: string, headers: RegExp): string {
  const re = new RegExp(
    `(?:${headers.source})[:\\s]*([\\s\\S]{20,800}?)(?=\\n\\s*(?:experience|education|skills|projects|work history|employment|certifications)\\b|$)`,
    "i"
  );
  const m = text.match(re);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

export function buildSummaryFromResume(
  text: string,
  parsed: Partial<ParsedResume>
): string {
  const lines = cleanLines(text);
  const about =
    sectionBlob(text, /summary|profile|objective|about me|professional summary/) ||
    lines.slice(0, 12).join(" ");

  const sentences = about
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && s.length < 280)
    .slice(0, 3);

  if (sentences.length >= 2) return sentences.join(" ");
  if (sentences.length === 1) return sentences[0];

  const name = parsed.full_name || "Candidate";
  const headline = parsed.headline || "professional";
  const location = parsed.location ? ` based in ${parsed.location}` : "";
  const skills = (parsed.skills || []).slice(0, 6);
  const skillBit = skills.length ? ` Skills include ${skills.join(", ")}.` : "";
  return `${name} is a ${headline}${location}. Summary generated from the uploaded resume.${skillBit}`;
}

export function parseResumeText(text: string): ParsedResume {
  const normalized = text.replace(/\u0000/g, " ");
  const lines = expandLines(normalized);
  const full_name = guessName(lines, normalized);
  const headline = guessHeadline(lines, normalized, full_name);
  const location = guessLocation(normalized, lines);
  const skills = guessSkills(normalized);
  const github_url = findUrl(normalized, /github\.com/);
  const linkedin_url = findUrl(normalized, /linkedin\.com/);
  const portfolio_url =
    findUrl(normalized, /(?:portfolio|vercel\.app|netlify\.app|github\.io)/) || "";

  const partial = {
    full_name,
    headline,
    location,
    skills,
    github_url,
    linkedin_url,
    portfolio_url,
  };
  const summary = buildSummaryFromResume(normalized, partial);

  return {
    full_name,
    headline,
    location,
    summary,
    skills,
    github_url,
    linkedin_url,
    portfolio_url,
    raw_preview: normalized.slice(0, 500),
  };
}
