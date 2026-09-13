import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-5 sm:px-8 pt-28 pb-20">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-3 text-muted max-w-md">
          Full authentication and application tracking require the live Supabase
          environment. This preview shows the design system.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/jobs/"
            className="inline-flex h-10 items-center rounded-full bg-accent px-5 text-[13px] font-semibold text-white hover:bg-accent-hover"
          >
            View jobs
          </Link>
          <Link
            href="/login/"
            className="inline-flex h-10 items-center rounded-full border border-border px-5 text-[13px] font-medium"
          >
            Sign in
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
