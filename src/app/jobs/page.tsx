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
      <Header solid />

      <main className="mx-auto max-w-6xl px-5 sm:px-8 pt-24 pb-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Open roles
          </h1>
          <p className="mt-2 text-[15px] text-muted max-w-xl">
            Roles sourced from company career pages. Apply direct. Sample
            listings shown for this preview.
          </p>
        </div>

        {/* Simple filters strip */}
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", "Remote", "Engineering", "Design", "Data"].map((f, i) => (
            <button
              key={f}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                i === 0
                  ? "bg-accent text-background"
                  : "border border-border text-muted hover:text-foreground hover:border-border"
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
              className="group rounded-xl border border-border bg-card p-5 sm:p-6 hover:border-accent/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-[16px] font-semibold leading-snug group-hover:text-accent transition-colors">
                    {job.title}
                  </h2>
                  <p className="mt-1 text-[14px] text-muted">
                    {job.company} · {job.location}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] text-muted">
                      {job.type}
                    </span>
                    <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] text-accent">
                      {job.salary}
                    </span>
                    <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] text-muted">
                      {job.posted}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-muted/80 border border-border/80 rounded px-1.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="shrink-0 inline-flex h-9 items-center justify-center rounded-full bg-accent px-5 text-[13px] font-semibold text-background hover:bg-accent-dim transition-colors">
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
