import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import jobs from "@/data/jobs.json";

function formatPosted(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Today";
    if (diff === 1) return "1 day ago";
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function JobsPage() {
  const apacJobs = jobs.filter((j) => j.region === "APAC");
  const globalJobs = jobs.filter((j) => j.region === "Global");
  const sorted = [...jobs].sort(
    (a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime()
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-6xl px-4 sm:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Open roles
          </h1>
          <p className="mt-2 text-[14px] sm:text-[16px] text-muted max-w-xl">
            Mid to senior roles in tech, compliance, KYC & KYB — APAC-first,
            plus selected global openings. Sourced from company career pages.
          </p>
          <p className="mt-2 text-[13px] text-slate-400">
            {jobs.length} roles · {apacJobs.length} APAC · {globalJobs.length}{" "}
            global
          </p>
        </div>

        {/* Filters — horizontal scroll on mobile */}
        <div className="mb-6 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            {[
              { label: "All", count: jobs.length },
              { label: "APAC", count: apacJobs.length },
              { label: "Compliance", count: jobs.filter((j) => j.category === "Compliance").length },
              { label: "Engineering", count: jobs.filter((j) => j.category === "Engineering").length },
              { label: "KYC / KYB", count: jobs.filter((j) => j.tags.some((t) => /KYC|KYB/i.test(t))).length },
              { label: "Remote", count: jobs.filter((j) => /remote/i.test(j.location)).length },
            ].map((f, i) => (
              <button
                key={f.label}
                className={`snap-start shrink-0 rounded-full px-3.5 sm:px-4 py-2 text-[12px] sm:text-[13px] font-semibold transition-colors whitespace-nowrap ${
                  i === 0
                    ? "bg-accent text-white shadow-sm shadow-indigo-500/20"
                    : "bg-white border border-border text-muted hover:text-foreground"
                }`}
              >
                {f.label}
                <span className="ml-1.5 opacity-70">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {sorted.map((job) => (
            <article
              key={job.id}
              className="card-lift group rounded-2xl border border-border bg-white p-4 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {job.region === "APAC" && (
                        <span className="rounded-full bg-violet-50 text-violet-700 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold">
                          APAC
                        </span>
                      )}
                      <span className="rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium">
                        {job.level}
                      </span>
                      <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium">
                        {formatPosted(job.posted)}
                      </span>
                    </div>
                    <h2 className="text-[15px] sm:text-[17px] font-semibold leading-snug text-slate-900 group-hover:text-accent transition-colors">
                      {job.title}
                    </h2>
                    <p className="mt-1 text-[13px] sm:text-[14px] text-muted">
                      {job.company} · {job.location}
                    </p>
                  </div>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex h-9 sm:h-10 items-center justify-center rounded-full bg-accent px-4 sm:px-5 text-[12px] sm:text-[13px] font-semibold text-white hover:bg-accent-hover transition-colors shadow-sm shadow-indigo-500/20"
                  >
                    Apply
                  </a>
                </div>

                <p className="text-[13px] leading-relaxed text-slate-500 line-clamp-2 hidden sm:block">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] sm:text-[12px] font-medium text-slate-600">
                    {job.type}
                  </span>
                  {job.salary && job.salary !== "Competitive" && (
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] sm:text-[12px] font-medium text-accent">
                      {job.salary}
                    </span>
                  )}
                  {job.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] sm:text-[12px] text-slate-500 border border-border rounded-md px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-[13px] text-slate-400">
          Listings refresh daily from company career pages and public boards.
          Always verify on the employer site before applying.
        </p>
      </main>

      <Footer />
    </div>
  );
}
