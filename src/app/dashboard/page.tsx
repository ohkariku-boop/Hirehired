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
        <p className="mt-3 text-neutral-600 max-w-lg text-base leading-relaxed">
          Strategy A: discovery first. Build an exportable profile with honest
          claims, then browse direct employer roles.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/profile/"
            className="inline-flex h-10 items-center rounded bg-blue-700 px-5 text-[15px] font-semibold text-white hover:bg-blue-800"
          >
            Your profile
          </Link>
          <Link
            href="/jobs/"
            className="inline-flex h-10 items-center rounded border border-neutral-300 px-5 text-[15px] font-medium hover:border-neutral-500"
          >
            View jobs
          </Link>
          <Link
            href="/login/"
            className="inline-flex h-10 items-center rounded border border-neutral-200 px-5 text-[15px] font-medium text-neutral-600"
          >
            Sign in
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
