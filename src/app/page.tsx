import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-background font-bold text-sm tracking-tight">
              H
            </span>
            <span className="font-semibold tracking-tight text-[15px]">
              Hirehired
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-8 text-[13px] text-muted">
            <Link href="/jobs/" className="hover:text-foreground transition-colors">
              Jobs
            </Link>
            <Link href="#how" className="hover:text-foreground transition-colors">
              How it works
            </Link>
            <Link href="#why" className="hover:text-foreground transition-colors">
              Why
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login/"
              className="hidden sm:inline text-[13px] text-muted hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup/"
              className="inline-flex h-8 items-center rounded-full bg-accent px-4 text-[13px] font-semibold text-background hover:bg-accent-dim transition-colors"
            >
              Get access
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-[12px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Direct from company career pages
              </p>

              <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight leading-[1.08] text-balance">
                Jobs that never
                <br />
                <span className="text-muted">make it to LinkedIn.</span>
              </h1>

              <p className="mt-6 max-w-lg text-[16px] sm:text-[17px] leading-relaxed text-muted">
                Most roles are filled before they hit the big boards. We surface
                openings straight from employer career sites — earlier, quieter,
                higher signal.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/jobs/"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-[14px] font-semibold text-background hover:bg-accent-dim transition-colors glow-accent"
                >
                  Browse open roles
                </Link>
                <Link
                  href="#how"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-transparent px-6 text-[14px] font-medium text-foreground hover:bg-surface transition-colors"
                >
                  See how it works
                </Link>
              </div>
            </div>

            {/* Floating job cards preview */}
            <div className="mt-16 sm:mt-20 grid gap-3 sm:grid-cols-3 max-w-4xl">
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
                <div
                  key={job.role}
                  className="group rounded-xl border border-border bg-card/80 p-4 hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[14px] font-medium leading-snug">
                        {job.role}
                      </p>
                      <p className="mt-1 text-[13px] text-muted">{job.company}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-surface px-2 py-0.5 text-[11px] text-muted">
                      {job.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-[12px] text-muted">{job.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-border py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-xl">
              <p className="text-[12px] font-medium uppercase tracking-wider text-accent">
                How it works
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
                Less noise. More signal.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                We monitor company career pages and ATS boards continuously.
                You see roles when they appear — not after hundreds of applicants
                have already flooded in.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "We watch the source",
                  body: "Career pages and ATS systems are checked in near real-time. New postings surface here first.",
                },
                {
                  step: "02",
                  title: "You apply direct",
                  body: "Every listing links to the employer’s own form. No middleman, no Easy Apply black hole.",
                },
                {
                  step: "03",
                  title: "Track what matters",
                  body: "Save roles, mark applications, and keep a clean pipeline instead of a scattered spreadsheet.",
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

        {/* Why */}
        <section id="why" className="border-t border-border py-20 sm:py-28 bg-surface/40">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider text-accent">
                  The problem
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
                  The boards are saturated.
                  <br />
                  The best roles aren’t.
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-muted">
                  LinkedIn and Indeed are where everyone applies. Company career
                  pages are where many of the stronger, less-contested roles
                  live — often for days before they get aggregated. Hirehired
                  closes that gap.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Fewer applicants per role",
                    "Direct path to the hiring team",
                    "Fresher postings, higher reply rates",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-3 text-[14px]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent text-[11px]">
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
                    <span className="text-muted">Typical LinkedIn Easy Apply</span>
                    <span className="font-mono text-muted">~200+ applicants</span>
                  </div>
                  <div className="h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full w-[92%] rounded-full bg-zinc-600" />
                  </div>
                  <div className="flex items-center justify-between text-[13px] pt-2">
                    <span className="text-muted">Direct career page role</span>
                    <span className="font-mono text-accent">Often &lt; 40</span>
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

        {/* CTA */}
        <section className="border-t border-border py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Ready for a quieter pipeline?
            </h2>
            <p className="mt-4 text-[15px] text-muted max-w-md mx-auto">
              Browse roles that most candidates never see, or create an account
              to start tracking applications.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-background font-bold text-[11px]">
              H
            </span>
            <span className="text-[13px] font-medium">Hirehired</span>
          </div>
          <p className="text-[12px] text-muted">
            © {new Date().getFullYear()} · Built for people who want the role, not the noise.
          </p>
        </div>
      </footer>
    </div>
  );
}
