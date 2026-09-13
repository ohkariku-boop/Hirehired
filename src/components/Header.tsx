import Link from "next/link";

export function Header({ solid = false }: { solid?: boolean }) {
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b border-border/60 ${
        solid ? "bg-background" : "bg-background/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-background font-bold text-sm tracking-tight">
            H
          </span>
          <span className="font-semibold tracking-tight text-[15px]">
            Hirehired
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-[13px] text-muted">
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
            className="hidden sm:inline text-[13px] text-muted hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup/"
            className="inline-flex h-8 items-center rounded-full bg-accent px-4 text-[13px] font-semibold text-background hover:bg-accent-dim transition-colors"
          >
            Get access
          </Link>
        </div>
      </div>
    </header>
  );
}
