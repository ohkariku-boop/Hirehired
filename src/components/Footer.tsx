import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-white font-bold text-sm">
                H
              </span>
              <span className="font-semibold tracking-tight text-[15px]">
                Hirehired
              </span>
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-muted max-w-xs">
              Jobs sourced directly from company career pages. Less noise.
              Higher signal.
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Product
            </h4>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li>
                <Link href="/jobs/" className="text-muted hover:text-foreground transition-colors">
                  Browse jobs
                </Link>
              </li>
              <li>
                <Link href="/#how" className="text-muted hover:text-foreground transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/signup/" className="text-muted hover:text-foreground transition-colors">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/about/" className="text-muted hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              For employers
            </h4>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li>
                <Link href="/about/" className="text-muted hover:text-foreground transition-colors">
                  Post a role
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Talent pipeline (soon)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Legal
            </h4>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li>
                <Link href="/privacy/" className="text-muted hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms/" className="text-muted hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies/" className="text-muted hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[13px] text-muted">
            © {new Date().getFullYear()} Hirehired. All rights reserved.
          </p>
          <p className="text-[13px] text-slate-400">
            Not affiliated with LinkedIn or Indeed.
          </p>
        </div>
      </div>
    </footer>
  );
}
