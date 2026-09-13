import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* Hero — mobile-first portrait layout */}
        <section className="relative pt-20 pb-12 sm:pt-32 sm:pb-20 overflow-hidden hero-mesh">
          <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
            <div className="max-w-2xl">
              <p className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full bg-white border border-border px-3 py-1 text-[12px] sm:text-[13px] font-medium text-accent shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                From company career pages
              </p>

              <h1 className="text-[1.85rem] leading-[1.15] sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight sm:leading-[1.08] text-slate-900">
                Find the job{" "}
                <span className="text-accent">before everyone else.</span>
              </h1>

              <p className="mt-3 sm:mt-6 max-w-lg text-[14px] sm:text-[17px] leading-relaxed text-muted">
                Openings from employers first — often before LinkedIn or Indeed.
                Apply earlier with less competition.
              </p>

              {/* Search: single compact bar on mobile */}
              <form
                action="/jobs/"
                className="mt-6 sm:mt-9 flex items-stretch gap-2 max-w-xl"
              >
                <input
                  type="search"
                  name="q"
                  placeholder="KYC, engineer, Singapore…"
                  className="min-w-0 flex-1 h-11 sm:h-12 rounded-xl sm:rounded-2xl border border-border bg-white px-3.5 sm:px-5 text-[14px] sm:text-[15px] shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
                <button
                  type="submit"
                  className="shrink-0 h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-accent px-4 sm:px-7 text-[13px] sm:text-[15px] font-semibold text-white hover:bg-accent-hover transition-colors shadow-md shadow-indigo-500/20"
                >
                  Search
                </button>
              </form>

              {/* Popular as chips — no orphaned words */}
              <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[12px] text-slate-400 shrink-0">Popular</span>
                {["KYC", "KYB", "Senior Engineer", "Singapore", "Remote"].map(
                  (t) => (
                    <Link
                      key={t}
                      href="/jobs/"
                      className="inline-flex items-center rounded-full bg-white border border-border px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-accent hover:text-accent transition-colors"
                    >
                      {t}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Job previews — horizontal scroll on mobile, grid on desktop */}
            <div className="mt-10 sm:mt-16 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex sm:grid sm:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-none">
                {[
                  {
                    role: "Lead KYC Analyst",
                    company: "Circle",
                    meta: "Remote APAC · Senior",
                    tag: "KYC",
                    color: "bg-violet-50 text-violet-700",
                  },
                  {
                    role: "Senior Java – KYC Tech",
                    company: "Binance",
                    meta: "Remote Asia · Senior",
                    tag: "Eng",
                    color: "bg-indigo-50 text-indigo-600",
                  },
                  {
                    role: "Cloud Infrastructure",
                    company: "ClickHouse",
                    meta: "Singapore remote · Senior",
                    tag: "Infra",
                    color: "bg-emerald-50 text-emerald-700",
                  },
                ].map((job) => (
                  <Link
                    key={job.role}
                    href="/jobs/"
                    className="card-lift group snap-start shrink-0 w-[78vw] max-w-[280px] sm:w-auto sm:max-w-none rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[14px] sm:text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-accent transition-colors">
                          {job.role}
                        </p>
                        <p className="mt-1 text-[12px] sm:text-[13px] text-muted">
                          {job.company}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-medium ${job.color}`}
                      >
                        {job.tag}
                      </span>
                    </div>
                    <p className="mt-3 text-[12px] sm:text-[13px] text-slate-500">
                      {job.meta}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats — compact on mobile */}
        <section className="border-y border-border bg-white py-6 sm:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {[
              { value: "Direct", label: "Career pages" },
              { value: "Earlier", label: "Than big boards" },
              { value: "Fewer", label: "Applicants" },
              { value: "Real", label: "Apply links" },
            ].map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold text-accent tracking-tight">
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] sm:text-[13px] text-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Career areas */}
        <section className="py-12 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="mb-8 sm:mb-12">
              <p className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider text-accent">
                Explore
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Career areas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  title: "Compliance & KYC/KYB",
                  desc: "AML, due diligence, onboarding, and financial crime roles.",
                  accent: "from-violet-500 to-indigo-500",
                },
                {
                  title: "Engineering & Product",
                  desc: "Backend, frontend, platform, and product engineering.",
                  accent: "from-indigo-500 to-violet-500",
                },
                {
                  title: "Data & AI",
                  desc: "Data science, ML, analytics, and AI product roles.",
                  accent: "from-emerald-400 to-teal-500",
                },
                {
                  title: "Fintech & Crypto",
                  desc: "Payments, exchanges, and digital asset platforms.",
                  accent: "from-amber-400 to-orange-500",
                },
                {
                  title: "APAC roles",
                  desc: "Singapore, Hong Kong, and wider Asia-Pacific openings.",
                  accent: "from-sky-400 to-blue-500",
                },
                {
                  title: "Remote-first",
                  desc: "Roles open to remote or distributed teams.",
                  accent: "from-fuchsia-400 to-purple-500",
                },
              ].map((area) => (
                <Link
                  key={area.title}
                  href="/jobs/"
                  className="card-lift group relative overflow-hidden rounded-2xl border border-border bg-white p-4 sm:p-6 shadow-sm"
                >
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${area.accent} opacity-[0.12] blur-2xl rounded-full -mr-6 -mt-6`}
                  />
                  <h3 className="relative text-[15px] sm:text-[16px] font-semibold text-slate-900 group-hover:text-accent transition-colors">
                    {area.title}
                  </h3>
                  <p className="relative mt-1.5 sm:mt-2 text-[13px] sm:text-[14px] leading-relaxed text-muted">
                    {area.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-12 sm:py-24 bg-white border-y border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="max-w-xl mb-8 sm:mb-14">
              <p className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider text-accent">
                How it works
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
                From company site to your shortlist
              </h2>
            </div>

            <div className="grid gap-3 sm:gap-6 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "We watch the source",
                  body: "Career pages and ATS boards are monitored continuously. New postings appear here as they go live.",
                },
                {
                  step: "02",
                  title: "You apply direct",
                  body: "Every listing links to the employer’s own form. No middleman. No Easy Apply black hole.",
                },
                {
                  step: "03",
                  title: "Track what matters",
                  body: "Save roles and keep one clean pipeline instead of a scattered spreadsheet.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-border bg-background p-5 sm:p-7"
                >
                  <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-accent-soft text-accent text-[12px] sm:text-[13px] font-bold">
                    {item.step}
                  </span>
                  <h3 className="mt-3 sm:mt-5 text-[15px] sm:text-[17px] font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-[13px] sm:text-[14px] leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="py-12 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div>
                <p className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider text-accent">
                  Why Hirehired
                </p>
                <h2 className="mt-1.5 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
                  The boards are crowded. The best openings often aren’t.
                </h2>
                <p className="mt-4 text-[14px] sm:text-[16px] leading-relaxed text-muted">
                  Many strong roles live on company career pages before they get
                  aggregated. We surface them earlier — especially mid to senior
                  tech, compliance, KYC and KYB in APAC and global remote.
                </p>
                <ul className="mt-6 space-y-2.5 sm:space-y-3.5">
                  {[
                    "Fewer applicants per role on average",
                    "Direct path to the employer’s form",
                    "APAC-first + global senior roles",
                  ].map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2.5 text-[14px] sm:text-[15px] text-slate-700"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-success text-[11px] font-bold">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl sm:rounded-3xl border border-border bg-white p-5 sm:p-8 shadow-sm">
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between text-[13px] sm:text-[14px] mb-2">
                      <span className="text-muted">Typical Easy Apply</span>
                      <span className="font-semibold text-slate-500">200+</span>
                    </div>
                    <div className="h-2.5 sm:h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[92%] rounded-full bg-slate-300" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[13px] sm:text-[14px] mb-2">
                      <span className="text-muted">Career-page role</span>
                      <span className="font-semibold text-accent">Under 40</span>
                    </div>
                    <div className="h-2.5 sm:h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[28%] rounded-full bg-accent" />
                    </div>
                  </div>
                  <p className="pt-2 text-[13px] sm:text-[14px] leading-relaxed text-muted border-t border-border">
                    Volume isn’t the goal. Reaching the right person is.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-24 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 text-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-8 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Ready for a quieter pipeline?
            </h2>
            <p className="mt-3 sm:mt-4 text-[14px] sm:text-[16px] text-indigo-100 max-w-md mx-auto">
              Browse mid–senior tech and compliance roles most candidates never
              see.
            </p>
            <div className="mt-6 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
              <Link
                href="/jobs/"
                className="inline-flex h-11 sm:h-12 items-center justify-center rounded-xl sm:rounded-2xl bg-white px-6 text-[14px] sm:text-[15px] font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
              >
                Explore jobs
              </Link>
              <Link
                href="/signup/"
                className="inline-flex h-11 sm:h-12 items-center justify-center rounded-xl sm:rounded-2xl border border-white/30 bg-white/10 px-6 text-[14px] sm:text-[15px] font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Create account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
