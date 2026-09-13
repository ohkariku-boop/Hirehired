import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden hero-mesh">
          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-white border border-border px-3.5 py-1.5 text-[13px] font-medium text-accent shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Sourced from company career pages
              </p>

              <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08] text-balance text-slate-900">
                Find the job
                <br />
                <span className="text-accent">before everyone else.</span>
              </h1>

              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-muted">
                Openings posted directly by employers — often days before they
                hit LinkedIn or Indeed. Apply earlier. Compete with fewer people.
              </p>

              <form
                action="/jobs/"
                className="mt-9 flex flex-col sm:flex-row gap-3 max-w-xl"
              >
                <input
                  type="search"
                  name="q"
                  placeholder="Role, skill, or company"
                  className="flex-1 h-13 rounded-2xl border border-border bg-white px-5 text-[15px] shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  style={{ height: "3.25rem" }}
                />
                <button
                  type="submit"
                  className="h-13 shrink-0 rounded-2xl bg-accent px-8 text-[15px] font-semibold text-white hover:bg-accent-hover transition-colors shadow-lg shadow-indigo-500/25"
                  style={{ height: "3.25rem" }}
                >
                  Search jobs
                </button>
              </form>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-muted">
                <span className="text-slate-400">Popular:</span>
                {["Software Engineer", "Product Designer", "Remote", "Data"].map(
                  (t) => (
                    <Link
                      key={t}
                      href="/jobs/"
                      className="font-medium text-slate-600 hover:text-accent transition-colors"
                    >
                      {t}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Floating job previews */}
            <div className="mt-16 sm:mt-20 grid gap-4 sm:grid-cols-3">
              {[
                {
                  role: "Senior Backend Engineer",
                  company: "Lattice Systems",
                  meta: "Remote · $165–195k",
                  tag: "2h ago",
                  color: "bg-indigo-50 text-indigo-600",
                },
                {
                  role: "Product Designer",
                  company: "Northstar Health",
                  meta: "NYC · $130–155k",
                  tag: "5h ago",
                  color: "bg-orange-50 text-orange-600",
                },
                {
                  role: "ML Engineer",
                  company: "Axiom Robotics",
                  meta: "Remote · $155–190k",
                  tag: "1d ago",
                  color: "bg-emerald-50 text-emerald-600",
                },
              ].map((job) => (
                <Link
                  key={job.role}
                  href="/jobs/"
                  className="card-lift group rounded-2xl border border-border bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-accent transition-colors">
                        {job.role}
                      </p>
                      <p className="mt-1 text-[13px] text-muted">{job.company}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${job.color}`}
                    >
                      {job.tag}
                    </span>
                  </div>
                  <p className="mt-4 text-[13px] text-slate-500">{job.meta}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-white py-10">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: "Direct", label: "Company career pages", icon: "◎" },
              { value: "Earlier", label: "Than major boards", icon: "↑" },
              { value: "Fewer", label: "Applicants per role", icon: "◇" },
              { value: "Real", label: "Apply links, no spam", icon: "✓" },
            ].map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <p className="text-2xl font-bold text-accent tracking-tight">
                  {s.value}
                </p>
                <p className="mt-1 text-[13px] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Career areas */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wider text-accent">
                  Explore
                </p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                  Career areas
                </h2>
              </div>
              <Link
                href="/jobs/"
                className="hidden sm:inline text-[14px] font-semibold text-accent hover:text-accent-hover"
              >
                View all roles →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Engineering & Product",
                  desc: "Backend, frontend, full-stack, platform, and product roles.",
                  accent: "from-indigo-500 to-violet-500",
                },
                {
                  title: "Design & Research",
                  desc: "Product design, brand, UX research, and design systems.",
                  accent: "from-orange-400 to-rose-500",
                },
                {
                  title: "Data & AI",
                  desc: "Data science, ML engineering, analytics, and AI product.",
                  accent: "from-emerald-400 to-teal-500",
                },
                {
                  title: "Growth & Marketing",
                  desc: "Growth, content, brand, and performance marketing.",
                  accent: "from-amber-400 to-orange-500",
                },
                {
                  title: "Operations & People",
                  desc: "Ops, recruiting, customer success, and people teams.",
                  accent: "from-sky-400 to-blue-500",
                },
                {
                  title: "Remote-first",
                  desc: "Roles open to remote or distributed teams worldwide.",
                  accent: "from-fuchsia-400 to-purple-500",
                },
              ].map((area) => (
                <Link
                  key={area.title}
                  href="/jobs/"
                  className="card-lift group relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm"
                >
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${area.accent} opacity-[0.12] blur-2xl rounded-full -mr-8 -mt-8`}
                  />
                  <h3 className="relative text-[16px] font-semibold text-slate-900 group-hover:text-accent transition-colors">
                    {area.title}
                  </h3>
                  <p className="relative mt-2 text-[14px] leading-relaxed text-muted">
                    {area.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-20 sm:py-24 bg-white border-y border-border">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-xl mb-14">
              <p className="text-[13px] font-semibold uppercase tracking-wider text-accent">
                How it works
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                From company site to your shortlist
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "We watch the source",
                  body: "Career pages and ATS boards are monitored continuously. New postings appear here as soon as they go live.",
                },
                {
                  step: "02",
                  title: "You apply direct",
                  body: "Every listing links to the employer’s own form. No middleman. No Easy Apply black hole.",
                },
                {
                  step: "03",
                  title: "Track what matters",
                  body: "Save roles, log applications, and keep one clean pipeline instead of a scattered spreadsheet.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-border bg-background p-7"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent text-[13px] font-bold">
                    {item.step}
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wider text-accent">
                  Why Hirehired
                </p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
                  The boards are crowded.
                  <br />
                  The best openings often aren’t.
                </h2>
                <p className="mt-5 text-[16px] leading-relaxed text-muted">
                  Many strong roles live on company career pages for days before
                  they get aggregated. By the time they hit LinkedIn or Indeed,
                  hundreds of applications are already in.
                </p>
                <ul className="mt-8 space-y-3.5">
                  {[
                    "Fewer applicants per role on average",
                    "Direct path to the hiring team’s own form",
                    "Fresher postings and higher reply potential",
                  ].map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-3 text-[15px] text-slate-700"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-success text-[12px] font-bold">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between text-[14px] mb-2">
                      <span className="text-muted">Typical board Easy Apply</span>
                      <span className="font-semibold text-slate-500">
                        200+ applicants
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[92%] rounded-full bg-slate-300" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[14px] mb-2">
                      <span className="text-muted">Direct career-page role</span>
                      <span className="font-semibold text-accent">
                        Often under 40
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[28%] rounded-full bg-accent" />
                    </div>
                  </div>
                  <p className="pt-2 text-[14px] leading-relaxed text-muted border-t border-border">
                    Volume is not the goal. Getting in front of the right person
                    is.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 text-white">
          <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready for a quieter pipeline?
            </h2>
            <p className="mt-4 text-[16px] text-indigo-100 max-w-md mx-auto">
              Browse roles most candidates never see, or create an account to
              track applications in one place.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/jobs/"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-7 text-[15px] font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Explore jobs
              </Link>
              <Link
                href="/signup/"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-7 text-[15px] font-semibold text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
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
