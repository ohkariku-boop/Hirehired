import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-[13px]">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-700 text-white text-[10px] font-bold">H</span>
              <span className="font-semibold text-[13px]">Hirehired</span>
            </div>
            <p className="text-neutral-500 leading-relaxed max-w-[220px]">
              Jobs from company career pages. APAC-first tech, compliance, KYC & KYB.
            </p>
          </div>
          <div>
            <p className="font-semibold text-neutral-900 mb-3">Product</p>
            <ul className="space-y-2 text-neutral-500">
              <li><Link href="/jobs/" className="hover:text-neutral-900">Browse jobs</Link></li>
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
            <p className="font-semibold text-neutral-900 mb-3">Focus</p>
            <ul className="space-y-2 text-neutral-500">
              <li>KYC / KYB</li>
              <li>Compliance</li>
              <li>Senior tech · APAC</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between gap-2 text-[12px] text-neutral-400">
          <p>© {new Date().getFullYear()} Hirehired</p>
          <p>Not affiliated with LinkedIn or Indeed</p>
        </div>
      </div>
    </footer>
  );
}
