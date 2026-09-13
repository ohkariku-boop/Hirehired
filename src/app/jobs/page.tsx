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
  const remote = jobs.filter((j) => /remote/i.test(j.location)).length;

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Header />

      <main className="flex-1 w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Open roles
              </h1>
              <p className="mt-1 text-base text-neutral-500">
                {jobs.length} roles · {apac} APAC · {remote} remote
              </p>
            </div>
            <form action="/jobs/" className="flex gap-2 w-full sm:w-auto">
              <input
                type="search"
                name="q"
                placeholder="Filter…"
                className="h-11 flex-1 sm:w-48 rounded border border-neutral-300 px-3 text-base focus:outline-none focus:border-blue-600"
              />
            </form>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none mb-1">
            {[
              `All ${jobs.length}`,
              `APAC ${apac}`,
              `Remote ${remote}`,
              "Engineering",
              "Product",
              "Full-time",
            ].map((f, i) => (
              <button
                key={f}
                className={`shrink-0 rounded px-2.5 py-1.5 text-lg font-medium whitespace-nowrap ${
                  i === 0
                    ? "bg-neutral-900 text-white"
                    : "border border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="border border-neutral-200 rounded overflow-hidden divide-y divide-neutral-200">
            {sorted.map((job) => (
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
                  <p className="text-lg text-neutral-500 mt-0.5">
                    {job.company} · {job.location}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    <span className="text-sm text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5">
                      {job.level}
                    </span>
                    {job.tags.slice(0, 3).map((t) => (
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
                  <span className="text-lg text-neutral-400">
                    {formatPosted(job.posted)}
                  </span>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center rounded bg-blue-700 px-3 text-lg font-semibold text-white hover:bg-blue-800"
                  >
                    Apply
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-lg text-neutral-400 text-center">
            Updated daily · Always confirm on the employer site
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
