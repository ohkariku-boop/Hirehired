import Link from "next/link";
import { asset } from "@/lib/base-path";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-[15px]">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-block mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/logo.png")}
                alt="Hirehired"
                width={120}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-neutral-500 leading-relaxed max-w-[240px] text-base">
              Jobs from career pages, ATS boards, and selected job feeds.
            </p>
          </div>
          <div>
            <p className="font-semibold text-neutral-900 mb-3">Product</p>
            <ul className="space-y-2 text-neutral-500">
              <li><Link href="/jobs/" className="hover:text-neutral-900">Browse jobs</Link></li>
              <li><Link href="/profile/" className="hover:text-neutral-900">Your profile</Link></li>
              <li><Link href="/#how" className="hover:text-neutral-900">How it works</Link></li>
              <li><Link href="/about/" className="hover:text-neutral-900">About</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-neutral-900 mb-3">Legal</p>
            <ul className="space-y-2 text-neutral-500">
              <li><Link href="/privacy/" className="hover:text-neutral-900">Privacy</Link></li>
              <li><Link href="/terms/" className="hover:text-neutral-900">Terms</Link></li>
              <li><Link href="/cookies/" className="hover:text-neutral-900">Cookies</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-neutral-900 mb-3">For employers</p>
            <ul className="space-y-2 text-neutral-500">
              <li><Link href="/about/" className="hover:text-neutral-900">Post a role</Link></li>
              <li><span className="text-neutral-400">Coming soon</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between gap-2 text-sm text-neutral-400">
          <p>© {new Date().getFullYear()} Hirehired</p>
          <p>Not affiliated with LinkedIn or Indeed</p>
        </div>
      </div>
    </footer>
  );
}
