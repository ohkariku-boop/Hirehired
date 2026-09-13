import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-white font-bold text-sm shadow-sm shadow-indigo-500/25">
            H
          </span>
          <span className="font-semibold tracking-tight text-[15px] text-foreground">
            Hirehired
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[14px] text-muted font-medium">
          <Link href="/jobs/" className="hover:text-foreground transition-colors">
            Jobs
          </Link>
          <Link href="/#how" className="hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="/about/" className="hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login/"
            className="hidden sm:inline text-[14px] font-medium text-muted hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup/"
            className="inline-flex h-9 items-center rounded-full bg-accent px-5 text-[13px] font-semibold text-white hover:bg-accent-hover transition-colors shadow-sm shadow-indigo-500/20"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
