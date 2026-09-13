import Link from "next/link";

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-background font-bold text-sm">
              H
            </span>
            <span className="font-semibold text-[15px]">Hirehired</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Applications</h1>
        <p className="mt-3 text-muted">
          Application tracking is available in the full app with Supabase connected.
        </p>
        <Link
          href="/jobs/"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-accent px-5 text-[13px] font-semibold text-background"
        >
          Browse jobs
        </Link>
      </main>
    </div>
  );
}
