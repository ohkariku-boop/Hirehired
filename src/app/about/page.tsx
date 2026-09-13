import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-24 pb-20">
        <p className="text-sm text-muted">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          / About
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          About Hirehired
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-muted">
          Hirehired exists for one reason: most job boards are saturated, and
          many of the better openings never get the attention they deserve
          because they live on company career pages first.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          We surface those roles earlier — directly from employer sites and ATS
          systems — so candidates can apply with higher signal and less noise,
          and employers can reach people who actually want the work.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">For candidates</h2>
            <p className="mt-2 text-base leading-relaxed text-muted">
              Discover openings before the crowd, apply on the employer’s own
              form, and keep a clean application tracker.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">For employers</h2>
            <p className="mt-2 text-base leading-relaxed text-muted">
              Reach candidates who care about fit, not just volume. Employer
              tools are expanding — get in touch if you want early access.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/jobs/"
            className="inline-flex h-10 items-center rounded-full bg-accent px-5 text-base font-semibold text-background hover:bg-accent-dim transition-colors"
          >
            Browse jobs
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
