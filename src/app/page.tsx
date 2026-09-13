import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import jobs from "@/data/jobs.json";

function formatPosted(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diff <= 0) return "Today";
    if (diff === 1) return "1d ago";
    if (diff < 7) return `${diff}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function Home() {
  const featured = [...jobs]
    .sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero — full width, tight */}
        <section className="w-full border-b border-neutral-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7">
                <p className="text-[12px] font-medium text-blue-700 mb-3 tracking-wide uppercase">
                  Career pages · APAC + global
                </p>
                <h1 className="text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem] font-bold tracking-tight leading-[1.1]">
                  Mid–senior roles in tech,
                  <br className="hidden sm:block" />{" "}
                  compliance, KYC & KYB.
                </h1>
                <p className="mt-4 text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed max-w-xl">
                  Listings pulled from employer career sites—often before they
                  flood LinkedIn. Focused on APAC, with selected global remote roles.
                </p>

                <form action="/jobs/" className="mt-6 flex gap-2 max-w-lg">
                  <input
                    type="search"
                    name="q"
                    placeholder="Search KYC, engineer, Singapore…"
                    className="min-w-0 flex-1 h-10 rounded border border-neutral-300 bg-white px-3 text-[14px] placeholder:text-neutral-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    className="h-10 shrink-0 rounded bg-blue-700 px-4 text-[13px] font-semibold text-white hover:bg-blue-800"
                  >
                    Search
                  </button>
                </form>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["KYC", "KYB", "AML", "Senior Engineer", "Singapore", "Remote"].map(
                    (t) => (
                      <Link
                        key={t}
                        href="/jobs/"
                        className="rounded border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[12px] text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                      >
                        {t}
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Side stats — dense */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                {[
                  { k: "Focus", v: "Tech + Compliance" },
                  { k: "Level", v: "Mid → Staff" },
                  { k: "Regions", v: "APAC first" },
                  { k: "Source", v: "Employer sites" },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="rounded border border-neutral-200 bg-neutral-50 px-4 py-3"
                  >
                    <p className="text-[11px] uppercase tracking-wide text-neutral-400">
                      {s.k}
                    </p>
                    <p className="mt-1 text-[14px] font-semibold">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Live roles strip — full width table-like */}
        <section className="w-full border-b border-neutral-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-semibold">Latest openings</h2>
              <Link
                href="/jobs/"
                className="text-[13px] font-medium text-blue-700 hover:text-blue-800"
              >
                View all →
              </Link>
            </div>

            <div className="border border-neutral-200 rounded overflow-hidden divide-y divide-neutral-200">
              {featured.map((job) => (
                <a
                  key={job.id}
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-3 sm:px-4 py-3 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-medium truncate">
                        {job.title}
                      </span>
                      {job.region === "APAC" && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          APAC
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-neutral-500 mt-0.5 truncate">
                      {job.company} · {job.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-neutral-500 shrink-0">
                    <span className="hidden sm:inline">{job.level}</span>
                    <span>{formatPosted(job.posted)}</span>
                    <span className="text-blue-700 font-medium">Apply</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* How — tight 3 col */}
        <section id="how" className="w-full border-b border-neutral-200 bg-neutral-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
            <h2 className="text-[15px] font-semibold mb-6">How it works</h2>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  n: "1",
                  t: "Source monitoring",
                  d: "We track employer career pages and ATS feeds for new mid–senior roles.",
                },
                {
                  n: "2",
                  t: "Direct apply",
                  d: "Every link goes to the company’s own form—not a third-party black hole.",
                },
                {
                  n: "3",
                  t: "APAC + global",
                  d: "Priority on Singapore, HK, and Asia remote, plus selected worldwide roles.",
                },
              ].map((s) => (
                <div key={s.n} className="bg-white border border-neutral-200 rounded p-4">
                  <span className="text-[12px] font-bold text-blue-700">{s.n}</span>
                  <h3 className="mt-2 text-[14px] font-semibold">{s.t}</h3>
                  <p className="mt-1 text-[13px] text-neutral-500 leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories — dense links */}
        <section className="w-full border-b border-neutral-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
            <h2 className="text-[15px] font-semibold mb-4">Browse by focus</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                "KYC / KYB",
                "AML / Compliance",
                "Backend / Infra",
                "Fintech eng",
                "Singapore",
                "Remote APAC",
              ].map((c) => (
                <Link
                  key={c}
                  href="/jobs/"
                  className="border border-neutral-200 rounded px-3 py-3 text-[13px] font-medium text-center hover:border-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="w-full bg-neutral-900 text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-semibold">
                {jobs.length}+ roles tracked
              </h2>
              <p className="mt-1 text-[13px] text-neutral-400">
                Refreshed daily from public boards and career pages.
              </p>
            </div>
            <Link
              href="/jobs/"
              className="inline-flex h-10 items-center justify-center rounded bg-white px-5 text-[13px] font-semibold text-neutral-900 hover:bg-neutral-100 shrink-0"
            >
              Browse all jobs
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
