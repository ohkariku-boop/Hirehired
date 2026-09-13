import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import jobs from "@/data/jobs.json";

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

export default function JobsPage() {
  const sorted = [...jobs].sort(
    (a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime()
  );
  const apac = jobs.filter((j) => j.region === "APAC").length;
  const compliance = jobs.filter((j) => j.category === "Compliance").length;

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Header />

      <main className="flex-1 w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <h1 className="text-[22px] sm:text-[26px] font-bold tracking-tight">
                Open roles
              </h1>
              <p className="mt-1 text-[13px] text-neutral-500">
                {jobs.length} roles · {apac} APAC · {compliance} compliance/KYC
              </p>
            </div>
            <form action="/jobs/" className="flex gap-2 w-full sm:w-auto">
              <input
                type="search"
                name="q"
                placeholder="Filter…"
                className="h-9 flex-1 sm:w-48 rounded border border-neutral-300 px-3 text-[13px] focus:outline-none focus:border-blue-600"
              />
            </form>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none mb-1">
            {[
              `All ${jobs.length}`,
              `APAC ${apac}`,
              `Compliance ${compliance}`,
              "Engineering",
              "KYC/KYB",
              "Remote",
            ].map((f, i) => (
              <button
                key={f}
                className={`shrink-0 rounded px-2.5 py-1.5 text-[12px] font-medium whitespace-nowrap ${
                  i === 0
                    ? "bg-neutral-900 text-white"
                    : "border border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Dense list */}
          <div className="border border-neutral-200 rounded overflow-hidden divide-y divide-neutral-200">
            {sorted.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3 hover:bg-neutral-50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h2 className="text-[14px] font-medium">{job.title}</h2>
                    {job.region === "APAC" && (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        APAC
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    {job.company} · {job.location}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    <span className="text-[11px] text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5">
                      {job.level}
                    </span>
                    {job.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[11px] text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[12px] text-neutral-400">
                    {formatPosted(job.posted)}
                  </span>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center rounded bg-blue-700 px-3 text-[12px] font-semibold text-white hover:bg-blue-800"
                  >
                    Apply
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[12px] text-neutral-400 text-center">
            Updated daily · Always confirm on the employer site
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
