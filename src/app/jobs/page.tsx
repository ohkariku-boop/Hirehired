import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SaveJobButton } from "./save-button";

export default async function JobsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select(
      `
      id,
      title,
      location,
      is_remote,
      employment_type,
      salary_min,
      salary_max,
      salary_currency,
      apply_url,
      posted_at,
      skills,
      companies (
        id,
        name,
        logo_url
      )
    `
    )
    .eq("is_active", true)
    .order("posted_at", { ascending: false })
    .limit(50);

  // Fallback mock if table empty or not yet created
  const displayJobs =
    jobs && jobs.length > 0
      ? jobs
      : [
          {
            id: "mock-1",
            title: "Senior Software Engineer",
            location: "Remote",
            is_remote: true,
            employment_type: "Full-time",
            salary_min: 140000,
            salary_max: 180000,
            salary_currency: "USD",
            apply_url: "#",
            posted_at: new Date().toISOString(),
            skills: ["TypeScript", "React", "Node"],
            companies: { name: "Example Corp", logo_url: null },
          },
          {
            id: "mock-2",
            title: "Product Designer",
            location: "San Francisco, CA",
            is_remote: false,
            employment_type: "Full-time",
            salary_min: 120000,
            salary_max: 150000,
            salary_currency: "USD",
            apply_url: "#",
            posted_at: new Date().toISOString(),
            skills: ["Figma", "UI/UX"],
            companies: { name: "StartupXYZ", logo_url: null },
          },
        ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-lg text-slate-900 dark:text-white">
              Hirehired
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard/applications"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300"
                >
                  Applications
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Browse Jobs
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {jobs && jobs.length > 0
              ? `${jobs.length} active roles from company career pages`
              : "Showing sample data — run the schema and seed to load real jobs"}
          </p>
          {error && (
            <p className="mt-2 text-sm text-amber-600">
              Database not ready yet. Run supabase/schema.sql in the SQL Editor.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {displayJobs.map((job: any) => {
            const company = job.companies;
            const salary =
              job.salary_min && job.salary_max
                ? `$${(job.salary_min / 1000).toFixed(0)}k – $${(job.salary_max / 1000).toFixed(0)}k`
                : null;

            return (
              <div
                key={job.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {job.title}
                    </h2>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      {company?.name || "Company"} ·{" "}
                      {job.is_remote ? "Remote" : job.location || "—"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.employment_type && (
                        <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                          {job.employment_type}
                        </span>
                      )}
                      {salary && (
                        <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                          {salary}
                        </span>
                      )}
                      {job.posted_at && (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                          {new Date(job.posted_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {user && !String(job.id).startsWith("mock") && (
                      <SaveJobButton jobId={job.id} />
                    )}
                    <a
                      href={job.apply_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                    >
                      Apply
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
