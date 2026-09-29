import type { HirehiredProfile } from "@/lib/profile";

/**
 * Sample paid customer profile seeded from Eu Joe See resume (demo matching).
 * Used when local profile is empty so % match works out of the box for this demo.
 */
export const SAMPLE_PROFILE_EU_JOE_SEE: HirehiredProfile = {
  schema: "hirehired.profile.v1",
  full_name: "Eu Joe See",
  headline:
    "Technology & Digital Transformation Leader | Insurance & Financial Services | Executive Governance",
  location: "Singapore",
  summary:
    "Technology and digital transformation executive with 22+ years leading enterprise IT, cloud, and business transformation programmes for regulated Insurance and Financial Services organisations across ASEAN (Singapore, Malaysia, Hong Kong, Indonesia, Philippines, Cambodia). Proven track record driving digital transformation, cloud migration, AI-enabled automation, and core platform modernisation, with full P&L ownership for technology portfolios. Established and scaled a regional PMO across five markets, led enterprise-wide cloud and CI/CD adoption, and run technology governance under MAS, BNM, HKMA, OJK, BSP, and NBC oversight.",
  skills: [
    "Digital transformation",
    "Cloud migration",
    "AWS",
    "Azure",
    "GCP",
    "CI/CD",
    "DevOps",
    "PMO",
    "Program management",
    "Project management",
    "IT governance",
    "Technology risk",
    "ITIL",
    "ITSM",
    "ServiceNow",
    "FinOps",
    "Insurance",
    "Financial services",
    "MAS TRM",
    "BNM TRM",
    "Agile",
    "SAFe",
    "Power BI",
    "Enterprise architecture",
    "Service delivery",
    "CTO",
    "Chief of Staff",
  ],
  github_url: "",
  linkedin_url: "https://linkedin.com/in/ejsee",
  portfolio_url: "",
  preferred_locations: ["Singapore", "APAC", "ASEAN", "Remote"],
  open_to: ["permanent"],
  claims: [
    {
      id: "ejs-1",
      claim_type: "employment",
      title: "Chief of Staff & Interim CTO - VALSEA",
      status: "self_reported",
    },
    {
      id: "ejs-2",
      claim_type: "employment",
      title: "Head of Regional IT PMO - Etiqa Insurance (ASEAN)",
      status: "self_reported",
    },
    {
      id: "ejs-3",
      claim_type: "employment",
      title: "Director of Service Delivery - Unify Cloud LLC",
      status: "self_reported",
    },
    {
      id: "ejs-4",
      claim_type: "skill",
      title: "Regional digital transformation and core insurance platform delivery",
      status: "self_reported",
    },
    {
      id: "ejs-5",
      claim_type: "skill",
      title: "Technology risk reporting to MAS, BNM, OJK, HKMA",
      status: "self_reported",
    },
  ],
  share_enabled: false,
  public_slug: "eu-joe-see",
};
