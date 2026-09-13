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

type FilterId =
  | "all"
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

  const [filter, setFilter] = useState<FilterId>(
    ["all", "apac", "singapore", "mid", "senior", "director", "remote", "permanent", "contract"].includes(initialFilter)
      ? initialFilter
      : "all"
  );
  const [query, setQuery] = useState(initialQ);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const f = (searchParams.get("filter") as FilterId) || "all";
    setQuery(q);
    if (["all", "apac", "singapore", "mid", "senior", "director", "remote", "permanent", "contract"].includes(f)) {
      setFilter(f);
    }
  }, [searchParams]);

  const counts = useMemo(() => {
    return {
      all: jobs.length,
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

  const chips: { id: FilterId; label: string }[] = [
    { id: "all", label: `All ${counts.all}` },
    { id: "apac", label: `APAC ${counts.apac}` },
    { id: "singapore", label: `Singapore ${counts.singapore}` },
    { id: "mid", label: `Mid ${counts.mid}` },
    { id: "senior", label: `Senior ${counts.senior}` },
    { id: "director", label: `Director ${counts.director}` },
    { id: "remote", label: `Remote ${counts.remote}` },
    { id: "permanent", label: `Permanent ${counts.permanent}` },
    { id: "contract", label: `Contract ${counts.contract}` },
  ];

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
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-neutral-500 text-base">
            No roles match this filter.
          </p>
        ) : (
          filtered.map((job) => (
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

      <p className="mt-4 text-sm text-neutral-400 text-center">
        Updated daily · Always confirm on the employer site
      </p>
    </div>
  );
}
