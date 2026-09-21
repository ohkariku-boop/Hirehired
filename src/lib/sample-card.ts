import type { PublicCard } from "@/lib/profile";

/** Demo cards - always available at /c/{slug} */

export const KELLY_GRAYSON_CARD: PublicCard = {
  schema: "hirehired.card.v1",
  slug: "kelly-grayson",
  full_name: "Kelly Grayson",
  headline: "Senior Compliance Manager, APAC",
  location: "Singapore",
  summary:
    "Compliance and financial crime professional with experience in KYC, AML, and regulatory programs across banking and fintech. Open to permanent roles in Singapore and remote APAC.",
  skills: [
    "KYC",
    "AML",
    "Sanctions",
    "CDD",
    "Regulatory compliance",
    "Stakeholder management",
  ],
  github_url: "",
  linkedin_url: "https://www.linkedin.com/in/example",
  portfolio_url: "",
  claims: [
    {
      id: "kelly-claim-1",
      claim_type: "employment",
      title: "Senior Compliance Manager - regional bank",
      status: "self_reported",
    },
    {
      id: "kelly-claim-2",
      claim_type: "cert",
      title: "CAMS (sample claim)",
      status: "self_reported",
    },
    {
      id: "kelly-claim-3",
      claim_type: "skill",
      title: "KYC quality assurance",
      evidence_url: "https://www.acams.org/",
      status: "linked",
    },
  ],
  published_at: "2026-09-21T00:00:00.000Z",
};

export const ALAN_WANG_CARD: PublicCard = {
  schema: "hirehired.card.v1",
  slug: "alan-wang",
  full_name: "Alan Wang",
  headline: "Staff Software Engineer, Platform",
  location: "Singapore",
  summary:
    "Backend and platform engineer. Distributed systems, APIs, and developer tooling. Prefer roles with strong ownership of reliability and delivery.",
  skills: [
    "TypeScript",
    "Go",
    "Kubernetes",
    "PostgreSQL",
    "System design",
    "Platform engineering",
  ],
  github_url: "https://github.com/torvalds",
  linkedin_url: "https://www.linkedin.com/in/example",
  portfolio_url: "https://github.com/vercel/next.js",
  claims: [
    {
      id: "alan-claim-1",
      claim_type: "contribution",
      title: "Open source - sample project list on GitHub",
      evidence_url: "https://github.com/sindresorhus",
      status: "linked",
    },
    {
      id: "alan-claim-2",
      claim_type: "contribution",
      title: "Technical writing / engineering blog (sample)",
      evidence_url: "https://github.blog/",
      status: "linked",
    },
    {
      id: "alan-claim-3",
      claim_type: "link",
      title: "Portfolio site (sample)",
      evidence_url: "https://pages.github.com/",
      status: "linked",
    },
    {
      id: "alan-claim-4",
      claim_type: "link",
      title: "Public API design notes (sample)",
      evidence_url: "https://swagger.io/resources/open-api/",
      status: "linked",
    },
    {
      id: "alan-claim-5",
      claim_type: "employment",
      title: "Staff Engineer - platform team (sample)",
      status: "self_reported",
    },
    {
      id: "alan-claim-6",
      claim_type: "skill",
      title: "Kubernetes workloads and observability",
      evidence_url: "https://kubernetes.io/docs/home/",
      status: "linked",
    },
  ],
  published_at: "2026-09-21T00:00:00.000Z",
};

const SAMPLE_CARDS: Record<string, PublicCard> = {
  "kelly-grayson": KELLY_GRAYSON_CARD,
  "alan-wang": ALAN_WANG_CARD,
  // Old demo slug redirects to Kelly for bookmarks
  "john-doe": KELLY_GRAYSON_CARD,
};

export function getSampleCard(slug: string): PublicCard | null {
  return SAMPLE_CARDS[slug.toLowerCase()] || null;
}
