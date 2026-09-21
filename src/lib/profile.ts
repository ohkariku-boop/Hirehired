/** Strategy A portable profile — local + future Supabase */

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
};

const STORAGE_KEY = "hirehired.profile.v1";

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
    };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export function saveProfile(p: HirehiredProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...p, schema: "hirehired.profile.v1" }));
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
