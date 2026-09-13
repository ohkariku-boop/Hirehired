"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
    /compliance|aml|kyc|kyb|sanctions|fraud|regulatory|cdd|edd|financial crime/.test(blob)
  );
}

function isTech(j: Job) {
  if (isCompliance(j)) return false;
  const blob = `${j.title} ${j.category}`.toLowerCase();
  return (
    j.category === "Engineering" ||
    j.category === "Data" ||
    /engineer|software|developer|devops|sre|platform|infra|backend|frontend|full[- ]?stack|machine learning|data scien|mlops|security engineer/.test(
      blob
    )
  );
}

type FilterId =
  | "all"
  | "tech"
  | "compliance"
  | "apac"
  | "singapore"
  | "mid"
  | "senior"
  | "director"
  | "remote"
  | "permanent"
  | "contract";

export function JobsBoard({ jobs }: { jobs: Job[] }) {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const initialFilter = (searchParams.get("filter") as FilterId) || "all";

  const validFilters: FilterId[] = [
    "all",
    "tech",
    "compliance",
    "apac",
    "singapore",
    "mid",
    "senior",
    "director",
    "remote",
    "permanent",
    "contract",
  ];

  const [filter, setFilter] = useState<FilterId>(
    validFilters.includes(initialFilter) ? initialFilter : "all"
  );
  const [query, setQuery] = useState(initialQ);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const f = (searchParams.get("filter") as FilterId) || "all";
    setQuery(q);
    if (validFilters.includes(f)) setFilter(f);
  }, [searchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  const counts = useMemo(() => {
    return {
      all: jobs.length,
      tech: jobs.filter(isTech).length,
      compliance: jobs.filter(isCompliance).length,
      apac: jobs.filter((j) => j.region === "APAC").length,
      singapore: jobs.filter((j) => /singapore/i.test(j.location)).length,
      mid: jobs.filter((j) => /^mid$/i.test(j.level)).length,
      senior: jobs.filter((j) => /senior|staff|principal|lead/i.test(j.level)).length,
      director: jobs.filter((j) => /director|vp|head/i.test(j.level)).length,
      remote: jobs.filter((j) => /remote/i.test(j.location)).length,
      permanent: jobs.filter((j) => /permanent|full[- ]?time/i.test(j.type)).length,
      contract: jobs.filter((j) => /contract|freelance|temp/i.test(j.type)).length,
    };
  }, [jobs]);

  const filtered = useMemo(() => {
    let list = [...jobs];
    switch (filter) {
      case "tech":
        list = list.filter(isTech);
        break;
      case "compliance":
        list = list.filter(isCompliance);
        break;
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
        list = list.filter((j) => /senior|staff|principal|lead/i.test(j.level));
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
  }, [jobs, filter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageJobs = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const chips: { id: FilterId; label: string }[] = [
    { id: "all", label: `All ${counts.all}` },
    { id: "tech", label: `Tech ${counts.tech}` },
    { id: "compliance", label: `Compliance ${counts.compliance}` },
    { id: "apac", label: `APAC ${counts.apac}` },
    { id: "singapore", label: `Singapore ${counts.singapore}` },
    { id: "mid", label: `Mid ${counts.mid}` },
    { id: "senior", label: `Senior ${counts.senior}` },
    { id: "director", label: `Director ${counts.director}` },
    { id: "remote", label: `Remote ${counts.remote}` },
    { id: "permanent", label: `Permanent ${counts.permanent}` },
    { id: "contract", label: `Contract ${counts.contract}` },
  ];

  function goToPage(p: number) {
    const next = Math.max(1, Math.min(p, totalPages));
    setPage(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Compact page numbers: 1 … 4 5 6 … N
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Open roles
          </h1>
          <p className="mt-1 text-base text-neutral-500">
            {filtered.length} shown
            {filter !== "all" || query ? ` of ${jobs.length}` : ""}
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

      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mb-2">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`shrink-0 rounded px-3 py-2 text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${
              filter === c.id
                ? "bg-neutral-900 text-white"
                : "border border-neutral-200 text-neutral-600 hover:border-neutral-400"
            }`}
          >
            {c.label}
          </button>
        ))}
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
