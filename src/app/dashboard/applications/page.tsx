import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-5 sm:px-8 pt-28 pb-20">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Applications
        </h1>
        <p className="mt-3 text-muted">
          Application tracking is available in the full app with Supabase connected.
        </p>
        <Link
          href="/jobs/"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-accent px-5 text-[13px] font-semibold text-white hover:bg-accent-hover"
        >
          Browse jobs
        </Link>
      </main>
      <Footer />
    </div>
  );
}
