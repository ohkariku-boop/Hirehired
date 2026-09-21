import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import jobs from "@/data/jobs.json";
import { withBase } from "@/lib/base-path";

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
        <section className="w-full border-b border-neutral-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-center">
                <p className="text-base sm:text-lg font-medium text-blue-700 mb-3 tracking-wide uppercase">
                  Experienced hires
                </p>
                <h1 className="text-[2.35rem] sm:text-[3.25rem] lg:text-[3.5rem] font-bold tracking-tight leading-[1.1]">
                  Jobs from career pages, ATS boards,
                  <br className="hidden sm:block" />{" "}
                  and selected feeds.
                </h1>
                <p className="mt-4 text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-xl">
                  Focused on mid, senior, and director-level roles. Jobs from company
                  career pages, ATS boards, and selected job feeds in one place. Apply
                  opens the listing we found. Hirehired does not take the application.
                </p>

                <form action={withBase("/jobs/")} className="mt-6 flex gap-2 max-w-lg">
                  <input
                    type="search"
                    name="q"
                    placeholder="Role, skill, or company"
                    className="min-w-0 flex-1 h-12 rounded border border-neutral-300 bg-white px-3 text-[17px] placeholder:text-neutral-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    className="h-12 shrink-0 rounded bg-blue-700 px-5 text-base font-semibold text-white hover:bg-blue-800"
                  >
                    Search
                  </button>
                </form>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { label: "Tech", href: "/jobs/?track=tech" },
                    { label: "Compliance", href: "/jobs/?track=compliance" },
                    { label: "Remote", href: "/jobs/?filter=remote" },
                    { label: "Singapore", href: "/jobs/?filter=singapore" },
                    { label: "Senior", href: "/jobs/?filter=senior" },
                    { label: "Permanent", href: "/jobs/?filter=permanent" },
                    { label: "Contract", href: "/jobs/?filter=contract" },
                  ].map((t) => (
                    <Link
                      key={t.label}
                      href={t.href}
                      className="rounded border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-base text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 grid-rows-3 gap-3 sm:gap-4 h-full min-h-[280px] lg:min-h-0">
                {[
                  { k: "Source", v: "Career pages" },
                  { k: "Apply", v: "On their site" },
                  { k: "Focus", v: "Experienced tech and compliance" },
                  { k: "Update", v: "Daily refresh" },
                  { k: "Regions", v: "Global and APAC" },
                  { k: "Age", v: "Last 7 to 30 days" },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="flex flex-col justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-4 sm:px-5 py-5 sm:py-6"
                  >
                    <p className="text-sm sm:text-base uppercase tracking-wide text-neutral-400 font-medium">
                      {s.k}
                    </p>
                    <p className="mt-2 text-lg sm:text-xl font-semibold text-neutral-900 leading-snug">
                      {s.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full border-b border-neutral-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent jobs</h2>
              <Link
                href="/jobs/"
                className="text-base font-medium text-blue-700 hover:text-blue-800"
              >
                View all
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
                      <span className="text-[17px] font-medium truncate">
                        {job.title}
                      </span>
                      {job.region === "APAC" && (
                        <span className="text-xs font-semibold uppercase tracking-wide text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          APAC
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-neutral-500 mt-0.5 truncate">
                      {job.company} · {job.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-lg text-neutral-500 shrink-0">
                    <span className="hidden sm:inline">{job.level}</span>
                    <span>{formatPosted(job.posted)}</span>
                    <span className="text-blue-700 font-medium">Apply</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="w-full border-b border-neutral-200 bg-neutral-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
            <h2 className="text-lg font-semibold mb-6">How it works</h2>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  n: "1",
                  t: "We collect listings",
                  d: "Company career pages, ATS boards, and selected job feeds, updated regularly.",
                },
                {
                  n: "2",
                  t: "You filter and search",
                  d: "Tech or compliance, experienced level, location, permanent or contract, and how recent the post is.",
                },
                {
                  n: "3",
                  t: "You apply on their site",
                  d: "Apply opens the listing we found. Hirehired does not take the application.",
                },
              ].map((s) => (
                <div key={s.n} className="bg-white border border-neutral-200 rounded p-4">
                  <span className="text-lg font-bold text-blue-700">{s.n}</span>
                  <h3 className="mt-2 text-[17px] font-semibold">{s.t}</h3>
                  <p className="mt-1 text-base text-neutral-500 leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full border-b border-neutral-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
            <h2 className="text-lg font-semibold mb-4">Browse by focus</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                "Engineering",
                "Product",
                "Design",
                "Data",
                "Operations",
                "Remote",
              ].map((c) => (
                <Link
                  key={c}
                  href="/jobs/"
                  className="border border-neutral-200 rounded px-3 py-3 text-base font-medium text-center hover:border-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full bg-neutral-900 text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-2xl font-semibold">
                {jobs.length}+ roles tracked
              </h2>
              <p className="mt-1 text-base text-neutral-400">
                Refreshed daily from career pages, ATS boards, and selected feeds.
              </p>
            </div>
            <Link
              href="/jobs/"
              className="inline-flex h-11 items-center justify-center rounded bg-white px-5 text-base font-semibold text-neutral-900 hover:bg-neutral-100 shrink-0"
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
