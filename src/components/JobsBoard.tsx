"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ratingsData from "@/data/company-ratings.json";

type RatingEntry = { rating: number; reviews?: number; glassdoorId?: string };

const RATING_MAP: Record<string, RatingEntry> = Object.fromEntries(
  Object.entries(
    (ratingsData as { ratings: Record<string, RatingEntry> }).ratings || {}
  ).map(([k, v]) => [k.toLowerCase(), v])
);

function getCompanyRating(company: string): RatingEntry | null {
  if (!company) return null;
  const key = company.trim().toLowerCase();
  if (RATING_MAP[key]) return RATING_MAP[key];
  // fuzzy: company starts with known key or vice versa
  for (const [k, v] of Object.entries(RATING_MAP)) {
    if (key === k || key.startsWith(k + " ") || k.startsWith(key)) return v;
  }
  return null;
}


export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  region: string;
  type: string;
  level: string;
  salary: string;
  posted: string;
  tags: string[];
  category: string;
  applyUrl: string;
  source: string;
  description?: string;
};

const PAGE_SIZE = 20;
type AgeDays = 7 | 14 | 30;
const AGE_OPTIONS: AgeDays[] = [7, 14, 30];

function isRecentJob(posted: string, maxDays: number) {
  if (!posted) return false;
  const t = new Date(posted).getTime();
  if (Number.isNaN(t)) return false;
  const age = Date.now() - t;
  if (age < 0) return true;
  return age <= maxDays * 86400000;
}


function companySearchSlug(name: string) {
  return encodeURIComponent(name.trim());
}

/** Outbound company research links (no scraping — search pages only). */
function glassdoorSearchUrl(company: string) {
  const entry = getCompanyRating(company);
  if (entry?.glassdoorId) {
    const slug = company.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `https://www.glassdoor.com/Reviews/${slug}-Reviews-E${entry.glassdoorId}.htm`;
  }
  return `https://www.glassdoor.com/Search/results.htm?keyword=${companySearchSlug(company)}`;
}


function formatPosted(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diff <= 0) return "Today";
    if (diff === 1) return "1d";
    if (diff < 14) return `${diff}d`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function isCompliance(j: Job) {
  const blob = `${j.title} ${j.category} ${(j.tags || []).join(" ")}`.toLowerCase();
  return (
    j.category === "Compliance" ||
    /compliance|aml|kyc|kyb|sanctions|fraud|regulatory|cdd|edd|financial.?crime|fincrime|bsa|ofac|transaction.?monitoring|anti-?money|money.?laundering|mlro|due.?diligence|credit.?risk|conduct.?risk|operational.?risk|enterprise.?risk|grc|governance.?risk|investigations/.test(
      blob
    )
  );
}

function isTech(j: Job) {
  if (isCompliance(j)) return false;
  const blob = `${j.title} ${j.category} ${(j.tags || []).join(" ")}`.toLowerCase();
  return (
    j.category === "Engineering" ||
    j.category === "Data" ||
    j.category === "Product" ||
    j.category === "Program" ||
    j.category === "IT" ||
    /engineer|engineering|software|developer|devops|sre|platform|infra|infrastructure|backend|frontend|full[- ]?stack|machine.?learning|data.?scien|mlops|security.?engineer|architect|product.?manager|product.?owner|product.?lead|product.?director|head of product|project.?manager|program.?manager|portfolio.?manager|technical.?program|\btpm\b|it.?manager|it.?director|head of it|cio\b|cto\b|it.?governance|it.?strategy|it.?operations|solutions.?architect|enterprise.?architect|scrum.?master|delivery.?manager|qa.?engineer|quality.?assurance|test.?engineer|site.?reliability|platform.?engineer|cyber.?security|info.?sec|information.?security|devsecops|agile.?coach/.test(
      blob
    )
  );
}

type TrackId = "all" | "tech" | "compliance";
type SubFilterId =
  | "all"
  | "apac"
  | "singapore"
  | "mid"
  | "senior"
  | "director"
  | "remote"
  | "permanent"
  | "contract";

const TRACKS: TrackId[] = ["all", "tech", "compliance"];
const SUBS: SubFilterId[] = [
  "all",
  "apac",
  "singapore",
  "mid",
  "senior",
  "director",
  "remote",
  "permanent",
  "contract",
];

export function JobsBoard({ jobs }: { jobs: Job[] }) {
  const searchParams = useSearchParams();

  const initialTrack = (searchParams.get("track") as TrackId) ||
    (searchParams.get("filter") === "tech" || searchParams.get("filter") === "compliance"
      ? (searchParams.get("filter") as TrackId)
      : "all");
  const initialSub = ((): SubFilterId => {
    const f = searchParams.get("filter") as SubFilterId | "tech" | "compliance" | null;
    if (f && SUBS.includes(f as SubFilterId)) return f as SubFilterId;
    const s = searchParams.get("sub") as SubFilterId | null;
    if (s && SUBS.includes(s)) return s;
    return "all";
  })();
  const initialQ = searchParams.get("q") || "";
  const ageParam = parseInt(searchParams.get("age") || "30", 10);
  const initialAge: AgeDays = AGE_OPTIONS.includes(ageParam as AgeDays)
    ? (ageParam as AgeDays)
    : 30;

  const [track, setTrack] = useState<TrackId>(
    TRACKS.includes(initialTrack) ? initialTrack : "all"
  );
  const [sub, setSub] = useState<SubFilterId>(
    SUBS.includes(initialSub) ? initialSub : "all"
  );
  const [query, setQuery] = useState(initialQ);
  const [ageDays, setAgeDays] = useState<AgeDays>(initialAge);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = (searchParams.get("track") as TrackId) ||
      (["tech", "compliance"].includes(searchParams.get("filter") || "")
        ? (searchParams.get("filter") as TrackId)
        : "all");
    const f = searchParams.get("filter");
    const sParam = searchParams.get("sub") as SubFilterId | null;
    let s: SubFilterId = "all";
    if (sParam && SUBS.includes(sParam)) s = sParam;
    else if (f && SUBS.includes(f as SubFilterId)) s = f as SubFilterId;

    if (TRACKS.includes(t)) setTrack(t);
    setSub(s);
    setQuery(searchParams.get("q") || "");
    const a = parseInt(searchParams.get("age") || "30", 10);
    if (AGE_OPTIONS.includes(a as AgeDays)) setAgeDays(a as AgeDays);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [track, sub, query, ageDays]);

  // Base pool by main track
  const recentJobs = useMemo(
    () => jobs.filter((j) => isRecentJob(j.posted, ageDays)),
    [jobs, ageDays]
  );

  const byTrack = useMemo(() => {
    if (track === "tech") return recentJobs.filter(isTech);
    if (track === "compliance") return recentJobs.filter(isCompliance);
    return recentJobs;
  }, [recentJobs, track]);


  const ageCounts = useMemo(() => {
    return {
      7: jobs.filter((j) => isRecentJob(j.posted, 7)).length,
      14: jobs.filter((j) => isRecentJob(j.posted, 14)).length,
      30: jobs.filter((j) => isRecentJob(j.posted, 30)).length,
    };
  }, [jobs]);

  const trackCounts = useMemo(
    () => ({
      all: recentJobs.length,
      tech: recentJobs.filter(isTech).length,
      compliance: recentJobs.filter(isCompliance).length,
    }),
    [recentJobs]
  );

  // Counts for sub-filters within current track
  const subCounts = useMemo(() => {
    const pool = byTrack;
    return {
      all: pool.length,
      apac: pool.filter((j) => j.region === "APAC").length,
      singapore: pool.filter((j) => /singapore/i.test(j.location)).length,
      mid: pool.filter((j) => /^mid$/i.test(j.level)).length,
      senior: pool.filter((j) =>
        /senior|staff|principal|lead/i.test(j.level)
      ).length,
      director: pool.filter((j) => /director|vp|head/i.test(j.level)).length,
      remote: pool.filter((j) => /remote/i.test(j.location)).length,
      permanent: pool.filter((j) =>
        /permanent|full[- ]?time/i.test(j.type)
      ).length,
      contract: pool.filter((j) =>
        /contract|freelance|temp/i.test(j.type)
      ).length,
    };
  }, [byTrack]);

  const filtered = useMemo(() => {
    let list = [...byTrack];
    switch (sub) {
      case "apac":
        list = list.filter((j) => j.region === "APAC");
        break;
      case "singapore":
        list = list.filter((j) => /singapore/i.test(j.location));
        break;
      case "mid":
        list = list.filter((j) => /^mid$/i.test(j.level));
        break;
      case "senior":
        list = list.filter((j) =>
          /senior|staff|principal|lead/i.test(j.level)
        );
        break;
      case "director":
        list = list.filter((j) => /director|vp|head/i.test(j.level));
        break;
      case "remote":
        list = list.filter((j) => /remote/i.test(j.location));
        break;
      case "permanent":
        list = list.filter((j) => /permanent|full[- ]?time/i.test(j.type));
        break;
      case "contract":
        list = list.filter((j) => /contract|freelance|temp/i.test(j.type));
        break;
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.category?.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list.sort(
      (a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime()
    );
  }, [byTrack, sub, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageJobs = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const trackChips: { id: TrackId; label: string }[] = [
    { id: "all", label: `All ${trackCounts.all}` },
    { id: "tech", label: `Tech ${trackCounts.tech}` },
    { id: "compliance", label: `Compliance ${trackCounts.compliance}` },
  ];

  const subChips: { id: SubFilterId; label: string }[] = [
    { id: "all", label: `All ${subCounts.all}` },
    { id: "apac", label: `APAC ${subCounts.apac}` },
    { id: "singapore", label: `Singapore ${subCounts.singapore}` },
    { id: "mid", label: `Mid ${subCounts.mid}` },
    { id: "senior", label: `Senior ${subCounts.senior}` },
    { id: "director", label: `Director ${subCounts.director}` },
    { id: "remote", label: `Remote ${subCounts.remote}` },
    { id: "permanent", label: `Permanent ${subCounts.permanent}` },
    { id: "contract", label: `Contract ${subCounts.contract}` },
  ];

  function goToPage(p: number) {
    const next = Math.max(1, Math.min(p, totalPages));
    setPage(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const pageNumbers = useMemo(() => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const trackLabel =
    track === "tech" ? "Tech" : track === "compliance" ? "Compliance" : "All";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Open roles
          </h1>
          <p className="mt-1 text-base text-neutral-500">
            {filtered.length} shown · last {ageDays}d
            {track !== "all" || sub !== "all" || query
              ? ` · ${trackLabel}${sub !== "all" ? ` · ${sub}` : ""}`
              : ""}
            {filtered.length > PAGE_SIZE
              ? ` · page ${currentPage} of ${totalPages}`
              : ""}
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, company…"
          className="h-11 w-full sm:w-56 rounded border border-neutral-300 px-3 text-base focus:outline-none focus:border-blue-600"
        />
      </div>


      {/* Posted within */}
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">
          Posted within
        </p>
        <div className="flex gap-2 flex-wrap">
          {AGE_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setAgeDays(d)}
              className={`rounded-lg px-4 py-2 text-sm sm:text-base font-semibold whitespace-nowrap transition-colors ${
                ageDays === d
                  ? "bg-blue-700 text-white"
                  : "border border-neutral-200 text-neutral-700 hover:border-blue-400 hover:text-blue-800"
              }`}
            >
              {d} days
              <span className={`ml-1.5 font-medium ${ageDays === d ? "text-blue-100" : "text-neutral-400"}`}>
                {ageCounts[d]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary: Tech / Compliance */}
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">
          Track
        </p>
        <div className="flex gap-2 flex-wrap">
          {trackChips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setTrack(c.id);
                setSub("all");
              }}
              className={`rounded-lg px-4 py-2.5 text-base font-semibold whitespace-nowrap transition-colors ${
                track === c.id
                  ? "bg-blue-700 text-white"
                  : "border border-neutral-200 text-neutral-700 hover:border-blue-400 hover:text-blue-800"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary: refine within track */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">
          Filter within {trackLabel}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {subChips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSub(c.id)}
              className={`shrink-0 rounded px-3 py-2 text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${
                sub === c.id
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 text-neutral-600 hover:border-neutral-400"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-neutral-200 rounded overflow-hidden divide-y divide-neutral-200">
        {pageJobs.length === 0 ? (
          <p className="px-4 py-8 text-center text-neutral-500 text-base">
            No roles match this filter.
          </p>
        ) : (
          pageJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3 hover:bg-neutral-50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2 className="text-[17px] font-medium">{job.title}</h2>
                  {job.region === "APAC" && (
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      APAC
                    </span>
                  )}
                  {isCompliance(job) && (
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                      Compliance
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {job.company} · {job.location}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-500">
                  <a
                    href={glassdoorSearchUrl(job.company)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-blue-700 hover:underline"
                    title={`Glassdoor reviews for ${job.company}`}
                  >
                    {(() => {
                      const r = getCompanyRating(job.company);
                      if (r) {
                        return (
                          <>
                            <span className="font-semibold text-amber-700">
                              ★ {r.rating.toFixed(1)}
                            </span>
                            <span className="text-neutral-400">Glassdoor</span>
                            {r.reviews ? (
                              <span className="text-neutral-400">
                                ({r.reviews.toLocaleString()} reviews)
                              </span>
                            ) : null}
                          </>
                        );
                      }
                      return <span>Glassdoor reviews</span>;
                    })()}
                  </a>
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <span className="text-sm text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5">
                    {job.level}
                  </span>
                  <span className="text-sm text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5">
                    {/full[- ]?time/i.test(job.type) ? "Permanent" : job.type}
                  </span>
                  {job.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-sm text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm text-neutral-400">
                  {formatPosted(job.posted)}
                </span>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center rounded bg-blue-700 px-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Apply
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-10 px-3 rounded border border-neutral-200 text-sm font-medium text-neutral-700 hover:border-neutral-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pageNumbers.map((p, i) =>
            p === "…" ? (
              <span key={`e-${i}`} className="px-2 text-neutral-400">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                className={`h-10 min-w-10 px-2 rounded text-sm font-medium ${
                  p === currentPage
                    ? "bg-neutral-900 text-white"
                    : "border border-neutral-200 text-neutral-700 hover:border-neutral-400"
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-10 px-3 rounded border border-neutral-200 text-sm font-medium text-neutral-700 hover:border-neutral-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <p className="mt-4 text-sm text-neutral-400 text-center">
        Updated daily · Always confirm on the employer site
      </p>
    </div>
  );
}
