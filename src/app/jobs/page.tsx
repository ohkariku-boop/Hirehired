import Link from "next/link";

const mockJobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Example Corp",
    location: "Remote",
    type: "Full-time",
    posted: "2 hours ago",
    salary: "$140k – $180k",
  },
  {
    id: "2",
    title: "Product Designer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    type: "Full-time",
    posted: "5 hours ago",
    salary: "$120k – $150k",
  },
  {
    id: "3",
    title: "Account Executive",
    company: "GrowthCo",
    location: "New York, NY / Remote",
    type: "Full-time",
    posted: "1 day ago",
    salary: "$90k – $130k + commission",
  },
];

export default function JobsPage() {
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
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300"
          >
            ← Back to home
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Browse Jobs
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Mock data for now. Real company career page jobs coming next.
          </p>
        </div>

        <div className="space-y-4">
          {mockJobs.map((job) => (
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
                    {job.company} · {job.location}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {job.type}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      {job.salary}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      {job.posted}
                    </span>
                  </div>
                </div>
                <button className="shrink-0 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition">
                  View / Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
