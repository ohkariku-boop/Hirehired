import type { PublicCard } from "@/lib/profile";

/** Demo virtual business card - always available at /c/john-doe */
export const JOHN_DOE_CARD: PublicCard = {
  schema: "hirehired.card.v1",
  slug: "john-doe",
  full_name: "John Doe",
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
      id: "sample-claim-1",
      claim_type: "employment",
      title: "Senior Compliance Manager - regional bank",
      status: "self_reported",
    },
    {
      id: "sample-claim-2",
      claim_type: "cert",
      title: "CAMS (sample claim)",
      status: "self_reported",
    },
    {
      id: "sample-claim-3",
      claim_type: "skill",
      title: "KYC quality assurance",
      evidence_url: "https://www.acams.org/",
      status: "linked",
    },
  ],
  published_at: "2026-09-21T00:00:00.000Z",
};

export function getSampleCard(slug: string): PublicCard | null {
  if (slug.toLowerCase() === "john-doe") return JOHN_DOE_CARD;
  return null;
}
