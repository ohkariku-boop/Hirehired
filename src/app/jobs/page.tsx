import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const sampleJobs = [
  {
    id: "1",
    title: "Senior Backend Engineer",
    company: "Lattice Systems",
    location: "Remote",
    type: "Full-time",
    salary: "$165k – $195k",
    posted: "2 hours ago",
    tags: ["Go", "Postgres", "Kubernetes"],
  },
  {
    id: "2",
    title: "Product Designer",
    company: "Northstar Health",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130k – $155k",
    posted: "5 hours ago",
    tags: ["Figma", "Design Systems"],
  },
  {
    id: "3",
    title: "ML Engineer – Perception",
    company: "Axiom Robotics",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$155k – $190k",
    posted: "1 day ago",
    tags: ["PyTorch", "Computer Vision"],
  },
  {
    id: "4",
    title: "Full-Stack Engineer",
    company: "Pixel Labs",
    location: "Remote",
    type: "Full-time",
    salary: "$130k – $170k",
    posted: "1 day ago",
    tags: ["TypeScript", "React", "Node"],
  },
  {
    id: "5",
    title: "Staff Platform Engineer",
    company: "Lattice Systems",
    location: "San Francisco / Remote",
    type: "Full-time",
    salary: "$190k – $230k",
    posted: "2 days ago",
    tags: ["Infrastructure", "AWS", "Terraform"],
  },
  {
    id: "6",
    title: "Growth Marketing Lead",
    company: "Northstar Health",
    location: "Remote",
    type: "Full-time",
    salary: "$120k – $150k",
    posted: "2 days ago",
    tags: ["Growth", "B2B", "Content"],
  },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-6xl px-5 sm:px-8 pt-28 pb-20">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Open roles
          </h1>
          <p className="mt-2 text-[16px] text-muted max-w-xl">
            Roles sourced from company career pages. Apply direct.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {["All", "Remote", "Engineering", "Design", "Data"].map((f, i) => (
            <button
              key={f}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                i === 0
                  ? "bg-accent text-white shadow-sm shadow-indigo-500/20"
                  : "bg-white border border-border text-muted hover:text-foreground hover:border-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {sampleJobs.map((job) => (
            <article
              key={job.id}
              className="card-lift group rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-[17px] font-semibold leading-snug text-slate-900 group-hover:text-accent transition-colors">
                    {job.title}
                  </h2>
                  <p className="mt-1 text-[14px] text-muted">
                    {job.company} · {job.location}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-surface px-2.5 py-0.5 text-[12px] font-medium text-slate-600">
                      {job.type}
                    </span>
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-medium text-accent">
                      {job.salary}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12px] font-medium text-emerald-700">
                      {job.posted}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[12px] text-slate-500 border border-border rounded-md px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="shrink-0 inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 text-[13px] font-semibold text-white hover:bg-accent-hover transition-colors shadow-sm shadow-indigo-500/20">
                  View role
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
