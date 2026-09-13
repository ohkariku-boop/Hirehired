import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="flex h-12 sm:h-14 items-center justify-between px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-700 text-white text-[11px] font-bold">
            H
          </span>
          <span className="text-[14px] font-semibold tracking-tight">Hirehired</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[13px] text-neutral-600">
          <Link href="/jobs/" className="hover:text-neutral-900">Jobs</Link>
          <Link href="/#how" className="hover:text-neutral-900">How it works</Link>
          <Link href="/about/" className="hover:text-neutral-900">About</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/jobs/" className="md:hidden text-[13px] text-neutral-600 px-1">Jobs</Link>
          <Link href="/login/" className="hidden sm:inline text-[13px] text-neutral-600 hover:text-neutral-900">Sign in</Link>
          <Link href="/signup/" className="inline-flex h-8 items-center rounded bg-blue-700 px-3 text-[12px] font-semibold text-white hover:bg-blue-800">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
