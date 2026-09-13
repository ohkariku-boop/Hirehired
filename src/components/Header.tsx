import Link from "next/link";
import { asset } from "@/lib/base-path";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo.png")}
            alt="Hirehired"
            width={120}
            height={48}
            className="h-9 sm:h-10 w-auto object-contain"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[15px] text-neutral-600">
          <Link href="/jobs/" className="hover:text-neutral-900">Jobs</Link>
          <Link href="/#how" className="hover:text-neutral-900">How it works</Link>
          <Link href="/about/" className="hover:text-neutral-900">About</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/jobs/" className="md:hidden text-[15px] text-neutral-600 px-1">Jobs</Link>
          <Link href="/login/" className="hidden sm:inline text-[15px] text-neutral-600 hover:text-neutral-900">Sign in</Link>
          <Link href="/signup/" className="inline-flex h-10 items-center rounded bg-blue-700 px-3.5 text-[15px] font-semibold text-white hover:bg-blue-800">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
