import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const statusColors: Record<string, string> = {
  saved: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  applied: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  interviewing: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  offered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  withdrawn: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: applications } = await supabase
    .from("applications")
    .select(
      `
      id,
      status,
      notes,
      applied_at,
      created_at,
      jobs (
        id,
        title,
        location,
        is_remote,
        apply_url,
        companies (
          name
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-lg text-slate-900 dark:text-white">
              Hirehired
            </span>
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            + Find more jobs
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Your Applications
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Track every role you save or apply to.
        </p>

        <div className="mt-8 space-y-4">
          {!applications || applications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                No applications yet.
              </p>
              <Link
                href="/jobs"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Browse jobs
              </Link>
            </div>
          ) : (
            applications.map((app: any) => {
              const job = app.jobs;
              const company = job?.companies;
              return (
                <div
                  key={app.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {job?.title || "Unknown role"}
                      </h2>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        {company?.name || "Company"} ·{" "}
                        {job?.is_remote ? "Remote" : job?.location || "—"}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium capitalize ${
                            statusColors[app.status] || statusColors.saved
                          }`}
                        >
                          {app.status}
                        </span>
                        {app.applied_at && (
                          <span className="text-xs text-slate-500">
                            Applied{" "}
                            {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {job?.apply_url && (
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        View posting
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
