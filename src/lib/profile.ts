/** Strategy A portable profile - local storage + optional public card */

export type ClaimStatus = "self_reported" | "linked" | "issuer_signed" | "revoked";

export type Claim = {
  id: string;
  claim_type: "skill" | "employment" | "education" | "cert" | "contribution" | "link";
  title: string;
  description?: string;
  evidence_url?: string;
  issuer_name?: string;
  status: ClaimStatus;
};

export type HirehiredProfile = {
  schema: "hirehired.profile.v1";
  exported_at?: string;
  full_name: string;
  headline: string;
  location: string;
  summary: string;
  skills: string[];
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  preferred_locations: string[];
  open_to: string[];
  claims: Claim[];
  /** Public card */
  share_enabled: boolean;
  public_slug: string;
  published_at?: string;
};

/** Subset shown on the public card */
export type PublicCard = {
  schema: "hirehired.card.v1";
  slug: string;
  full_name: string;
  headline: string;
  location: string;
  summary: string;
  skills: string[];
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  claims: Claim[];
  published_at: string;
};

export const EMPTY_PROFILE: HirehiredProfile = {
  schema: "hirehired.profile.v1",
  full_name: "",
  headline: "",
  location: "",
  summary: "",
  skills: [],
  github_url: "",
  linkedin_url: "",
  portfolio_url: "",
  preferred_locations: [],
  open_to: ["permanent"],
  claims: [],
  share_enabled: false,
  public_slug: "",
};

const STORAGE_KEY = "hirehired.profile.v1";
const PUBLIC_REGISTRY_KEY = "hirehired.publicCards.v1";

export function loadProfile(): HirehiredProfile {
  if (typeof window === "undefined") return { ...EMPTY_PROFILE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_PROFILE };
    const parsed = JSON.parse(raw) as Partial<HirehiredProfile>;
    return {
      ...EMPTY_PROFILE,
      ...parsed,
      schema: "hirehired.profile.v1",
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      claims: Array.isArray(parsed.claims) ? parsed.claims : [],
      preferred_locations: Array.isArray(parsed.preferred_locations)
        ? parsed.preferred_locations
        : [],
      open_to: Array.isArray(parsed.open_to) ? parsed.open_to : ["permanent"],
      share_enabled: Boolean(parsed.share_enabled),
      public_slug: typeof parsed.public_slug === "string" ? parsed.public_slug : "",
    };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export function saveProfile(p: HirehiredProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...p, schema: "hirehired.profile.v1" })
  );
}

export function exportProfileJson(p: HirehiredProfile): string {
  const pack: HirehiredProfile = {
    ...p,
    schema: "hirehired.profile.v1",
    exported_at: new Date().toISOString(),
  };
  return JSON.stringify(pack, null, 2);
}

export function newClaimId() {
  return `claim_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function statusLabel(s: ClaimStatus): string {
  switch (s) {
    case "self_reported":
      return "Self-reported";
    case "linked":
      return "Linked evidence";
    case "issuer_signed":
      return "Issuer signed";
    case "revoked":
      return "Revoked";
    default:
      return s;
  }
}

export function slugifyName(name: string): string {
  const base = (name || "card")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
  return base || "card";
}

export function profileToPublicCard(p: HirehiredProfile): PublicCard | null {
  const slug = (p.public_slug || slugifyName(p.full_name)).toLowerCase();
  if (!slug || !p.full_name.trim()) return null;
  return {
    schema: "hirehired.card.v1",
    slug,
    full_name: p.full_name.trim(),
    headline: p.headline.trim(),
    location: p.location.trim(),
    summary: p.summary.trim(),
    skills: p.skills.slice(0, 20),
    github_url: p.github_url.trim(),
    linkedin_url: p.linkedin_url.trim(),
    portfolio_url: p.portfolio_url.trim(),
    claims: p.claims.filter((c) => c.status !== "revoked").slice(0, 15),
    published_at: p.published_at || new Date().toISOString(),
  };
}

/** Same-browser registry so /c/slug works before Supabase is wired */
export function saveCardLocally(card: PublicCard) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PUBLIC_REGISTRY_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, PublicCard>) : {};
    map[card.slug.toLowerCase()] = card;
    localStorage.setItem(PUBLIC_REGISTRY_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function loadCardLocally(slug: string): PublicCard | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PUBLIC_REGISTRY_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, PublicCard>;
    return map[slug.toLowerCase()] || null;
  } catch {
    return null;
  }
}

export function removeCardLocally(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PUBLIC_REGISTRY_KEY);
    if (!raw) return;
    const map = JSON.parse(raw) as Record<string, PublicCard>;
    delete map[slug.toLowerCase()];
    localStorage.setItem(PUBLIC_REGISTRY_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}
