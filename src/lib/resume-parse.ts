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
  return text
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

async function dynamicImport(url: string): Promise<any> {
  // Avoid bundler resolving CDN URLs at build time
  return new Function("u", "return import(u)")(url);
}

export async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const type = file.type || "";

  if (name.endsWith(".txt") || name.endsWith(".md") || type.startsWith("text/")) {
    return file.text();
  }

  if (name.endsWith(".pdf") || type === "application/pdf") {
    return extractPdfText(file);
  }

  if (name.endsWith(".docx") || type.includes("wordprocessingml")) {
    return extractDocxText(file);
  }

  if (name.endsWith(".doc")) {
    throw new Error("Old .doc files are not supported. Use PDF, DOCX, or TXT.");
  }

  try {
    const t = await file.text();
    if (t && t.length > 40 && !t.includes("\u0000")) return t;
  } catch {
    /* ignore */
  }
  throw new Error("Unsupported file. Upload a PDF, DOCX, or TXT resume.");
}

async function extractPdfText(file: File): Promise<string> {
  const data = new Uint8Array(await file.arrayBuffer());
  const pdfjs = await dynamicImport(
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs"
  );
  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
  const doc = await pdfjs.getDocument({ data }).promise;
  const parts: string[] = [];
  const maxPages = Math.min(doc.numPages, 8);
  for (let i = 1; i <= maxPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const line = (content.items as { str?: string }[])
      .map((it) => it.str || "")
      .join(" ");
    parts.push(line);
  }
  const text = parts.join("\n").replace(/\s+/g, " ").trim();
  if (!text || text.length < 30) {
    throw new Error(
      "Could not read text from this PDF (it may be image-only). Try DOCX or TXT."
    );
  }
  return text;
}

async function extractDocxText(file: File): Promise<string> {
  const mod = await dynamicImport("https://esm.sh/mammoth@1.8.0");
  const mammoth = mod.default || mod;
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = (result.value || "").trim();
  if (!text || text.length < 30) {
    throw new Error("Could not read text from this DOCX.");
  }
  return text;
}

function findUrl(text: string, host: RegExp): string {
  const m = text.match(
    new RegExp(`https?:\\/\\/(?:www\\.)?${host.source}[^\\s)\\]>\"']+`, "i")
  );
  if (m) return m[0].replace(/[.,;:]+$/, "");
  const bare = text.match(
    new RegExp(`(?:^|\\s)(${host.source}\\/[^\\s)\\]>\"']+)`, "i")
  );
  if (bare) return "https://" + bare[1].replace(/[.,;:]+$/, "");
  return "";
}

function guessName(lines: string[]): string {
  for (const line of lines.slice(0, 8)) {
    if (line.length < 3 || line.length > 60) continue;
    if (/@|http|www\.|linkedin|github|resume|curriculum|phone|email|\d{3}/i.test(line))
      continue;
    if (/^(summary|experience|education|skills|projects|objective|profile)\b/i.test(line))
      continue;
    if (/^[A-Z][a-z]+([ -][A-Z][a-z.]+)+$/.test(line)) return line;
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$/.test(line)) return line;
  }
  return "";
}

function guessLocation(text: string, lines: string[]): string {
  const cities =
    /\b(Singapore|Hong Kong|Tokyo|Sydney|Melbourne|London|New York|San Francisco|Berlin|Remote|Kuala Lumpur|Bangkok|Jakarta|Seoul|Taipei|Mumbai|Bangalore|Bengaluru|Hyderabad|Dubai|Toronto|Vancouver|Austin|Seattle|Boston)\b/i;
  for (const line of lines.slice(0, 15)) {
    const m = line.match(cities);
    if (m) return m[1];
  }
  const m = text.match(cities);
  return m ? m[1] : "";
}

function guessHeadline(lines: string[], text: string): string {
  const roleLine = lines.find((l, i) => {
    if (i === 0) return false;
    return (
      l.length > 8 &&
      l.length < 100 &&
      /\b(engineer|developer|manager|director|analyst|specialist|lead|architect|officer|consultant|product|compliance|designer)\b/i.test(
        l
      ) &&
      !/\b(experience|education|university|company)\b/i.test(l)
    );
  });
  if (roleLine) return roleLine;
  const m = text.match(
    /\b((?:Senior|Staff|Principal|Lead)?\s*(?:Software|Platform|Data|Compliance|Product)?\s*(?:Engineer|Manager|Director|Analyst|Architect)[^.\n]{0,40})/i
  );
  return m ? m[1].trim() : "";
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
  const lines = cleanLines(normalized);
  const full_name = guessName(lines);
  const headline = guessHeadline(lines, normalized);
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
