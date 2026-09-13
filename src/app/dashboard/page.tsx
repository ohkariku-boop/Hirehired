import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: applicationCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

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
            <Link
              href="/jobs"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300"
            >
              Browse Jobs
            </Link>
            <Link
              href="/dashboard/applications"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300"
            >
              Applications
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {user.email}
        </p>

        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          <Link
            href="/jobs"
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
          >
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Browse Jobs
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Discover roles from company career pages
            </p>
          </Link>

          <Link
            href="/dashboard/applications"
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
          >
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Applications
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {applicationCount ?? 0} tracked
            </p>
          </Link>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Profile
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {profile?.headline || "Complete your profile soon"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
