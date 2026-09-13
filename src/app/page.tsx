import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white">
                Hirehired
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/jobs"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
              >
                Browse Jobs
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Find jobs not on LinkedIn & Indeed
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                The smarter way to{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  hire & get hired
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Discover hidden jobs directly from company career pages.
                Apply with higher signal, less competition, and better results.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/jobs"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/25"
                >
                  Browse Hidden Jobs
                </Link>
                <Link
                  href="/for-employers"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-3.5 text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  I&apos;m Hiring
                </Link>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                { label: "Direct company jobs", value: "Coming soon" },
                { label: "Less competition", value: "Higher reply rates" },
                { label: "Real-time alerts", value: "Be first" },
                { label: "AI matching", value: "Smarter fits" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Why Hirehired?
              </h2>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
                Built for candidates tired of black-hole applications and employers who want better signal.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Jobs from company sites",
                  description:
                    "We surface roles posted directly on employer career pages — often before they hit the big boards and attract hundreds of applicants.",
                },
                {
                  title: "Higher conversion focus",
                  description:
                    "Tools designed to improve your interview rate: smarter matching, tailored materials, and application tracking that actually helps.",
                },
                {
                  title: "Two-sided platform",
                  description:
                    "Candidates find better opportunities. Employers get higher-quality applicants with less noise. One platform for both sides.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ready to try a better job search?
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Early access is opening soon. Join the waitlist or start exploring.
            </p>
            <div className="mt-8">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/25"
              >
                Explore Jobs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Hirehired
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Hirehired. Built for better hiring.
          </p>
        </div>
      </footer>
    </div>
  );
}
