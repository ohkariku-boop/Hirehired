import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* Hero — search-first, Cox-inspired clarity */}
        <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-accent/[0.04] blur-[100px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-[12px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Sourced from company career pages
              </p>

              <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.08] text-balance">
                Let’s find your
                <br />
                <span className="text-muted">next role.</span>
              </h1>

              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted">
                Openings posted directly by employers — often before they appear
                on LinkedIn or Indeed. Apply earlier. Compete with fewer people.
              </p>

              {/* Search-style CTA */}
              <form
                action="/jobs/"
                className="mt-8 flex flex-col sm:flex-row gap-2 max-w-xl"
              >
                <div className="flex-1 relative">
                  <input
                    type="search"
                    name="q"
                    placeholder="Role, skill, or company"
                    className="w-full h-12 rounded-full border border-border bg-card pl-5 pr-4 text-[14px] placeholder:text-muted/70 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-full bg-accent px-7 text-[14px] font-semibold text-background hover:bg-accent-dim transition-colors glow-accent"
                >
                  Search jobs
                </button>
              </form>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-muted">
                <span>Popular:</span>
                {["Software Engineer", "Product Designer", "Remote", "Data"].map(
                  (t) => (
                    <Link
                      key={t}
                      href="/jobs/"
                      className="hover:text-accent transition-colors underline-offset-2 hover:underline"
                    >
                      {t}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Stats strip */}
            <div className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-border pt-10">
              {[
                { value: "Direct", label: "Company career pages" },
                { value: "Earlier", label: "Than major boards" },
                { value: "Fewer", label: "Applicants per role" },
                { value: "Real", label: "Apply links, no spam" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[18px] font-semibold text-accent">{s.value}</p>
                  <p className="mt-1 text-[12px] text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured areas — inspired by Cox career areas */}
        <section className="border-t border-border py-16 sm:py-22">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider text-accent">
                  Explore
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                  Featured career areas
                </h2>
              </div>
              <Link
                href="/jobs/"
                className="hidden sm:inline text-[13px] text-muted hover:text-accent transition-colors"
              >
                View all roles →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Engineering & Product",
                  desc: "Backend, frontend, full-stack, platform, and product roles from product-led companies.",
                },
                {
                  title: "Design & Research",
                  desc: "Product design, brand, UX research, and design systems — posted on career sites first.",
                },
                {
                  title: "Data & AI",
                  desc: "Data science, ML engineering, analytics, and AI product roles with real scope.",
                },
                {
                  title: "Growth & Marketing",
                  desc: "Growth, content, brand, and performance roles at companies still hiring carefully.",
                },
                {
                  title: "Operations & People",
                  desc: "Ops, recruiting, customer success, and people roles that rarely hit Easy Apply.",
                },
                {
                  title: "Remote-first",
                  desc: "Roles explicitly open to remote or distributed teams, filtered for signal.",
                },
              ].map((area) => (
                <Link
                  key={area.title}
                  href="/jobs/"
                  className="group rounded-xl border border-border bg-card p-5 hover:border-accent/35 transition-colors"
                >
                  <h3 className="text-[15px] font-semibold group-hover:text-accent transition-colors">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {area.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-border py-16 sm:py-22 bg-surface/25">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-xl">
              <p className="text-[12px] font-medium uppercase tracking-wider text-accent">
                How it works
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                From company site to your shortlist
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "We watch the source",
                  body: "Career pages and ATS boards are monitored continuously. New postings appear here as soon as they go live.",
                },
                {
                  step: "02",
                  title: "You apply direct",
                  body: "Every listing links to the employer’s own application form. No middleman. No Easy Apply black hole.",
                },
                {
                  step: "03",
                  title: "Track what matters",
                  body: "Save roles, log applications, and keep one clean pipeline instead of a scattered spreadsheet.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <span className="font-mono text-[12px] text-accent">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-[16px] font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why it matters */}
        <section className="border-t border-border py-16 sm:py-22">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider text-accent">
                  Why Hirehired
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
                  The boards are crowded.
                  <br />
                  The best openings often aren’t.
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-muted">
                  Many strong roles live on company career pages for days before
                  they get aggregated. By the time they hit LinkedIn or Indeed,
                  hundreds of applications are already in. We close that gap.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Fewer applicants per role on average",
                    "Direct path to the hiring team’s own form",
                    "Fresher postings and higher reply potential",
                  ].map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-3 text-[14px]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent text-[11px]">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-muted">Typical board Easy Apply</span>
                    <span className="font-mono text-muted">200+ applicants</span>
                  </div>
                  <div className="h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full w-[90%] rounded-full bg-zinc-600" />
                  </div>
                  <div className="flex items-center justify-between text-[13px] pt-2">
                    <span className="text-muted">Direct career-page role</span>
                    <span className="font-mono text-accent">Often under 40</span>
                  </div>
                  <div className="h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full w-[28%] rounded-full bg-accent" />
                  </div>
                  <p className="pt-4 text-[13px] leading-relaxed text-muted border-t border-border">
                    Volume is not the goal. Getting in front of the right person
                    is.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sample roles */}
        <section className="border-t border-border py-16 sm:py-22 bg-surface/25">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider text-accent">
                  Open now
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                  Recent roles
                </h2>
              </div>
              <Link
                href="/jobs/"
                className="text-[13px] text-muted hover:text-accent transition-colors"
              >
                See all →
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  role: "Senior Backend Engineer",
                  company: "Lattice Systems",
                  meta: "Remote · $165–195k",
                  tag: "2h ago",
                },
                {
                  role: "Product Designer",
                  company: "Northstar Health",
                  meta: "NYC · $130–155k",
                  tag: "5h ago",
                },
                {
                  role: "ML Engineer",
                  company: "Axiom Robotics",
                  meta: "Remote · $155–190k",
                  tag: "1d ago",
                },
              ].map((job) => (
                <Link
                  key={job.role}
                  href="/jobs/"
                  className="group rounded-xl border border-border bg-card p-5 hover:border-accent/35 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[14px] font-medium leading-snug group-hover:text-accent transition-colors">
                        {job.role}
                      </p>
                      <p className="mt-1 text-[13px] text-muted">{job.company}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-surface px-2 py-0.5 text-[11px] text-muted">
                      {job.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-[12px] text-muted">{job.meta}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-16 sm:py-22">
          <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Ready for a quieter pipeline?
            </h2>
            <p className="mt-4 text-[15px] text-muted max-w-md mx-auto">
              Browse roles most candidates never see, or create an account to
              track applications in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/jobs/"
                className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-[14px] font-semibold text-background hover:bg-accent-dim transition-colors"
              >
                Explore jobs
              </Link>
              <Link
                href="/signup/"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-[14px] font-medium hover:bg-surface transition-colors"
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
