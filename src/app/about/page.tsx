import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-24 pb-20">
        <p className="text-sm text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Home
          </Link>{" "}
          / About
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          About Hirehired
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-neutral-600">
          Big job boards are crowded. A lot of roles still show up first on the
          company career page or ATS. Hirehired collects those listings so you
          can browse them in one place.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600">
          Apply goes to the employer site. We do not run a separate application
          form for them.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 p-5">
            <h2 className="text-lg font-semibold">For candidates</h2>
            <p className="mt-2 text-base leading-relaxed text-neutral-600">
              Search tech and compliance roles, filter by age and location, then
              open the employer listing to apply.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 p-5">
            <h2 className="text-lg font-semibold">For employers</h2>
            <p className="mt-2 text-base leading-relaxed text-neutral-600">
              If you want to post or sync roles here, contact us. Employer tools
              are still limited.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/jobs/"
            className="inline-flex h-10 items-center rounded bg-blue-700 px-5 text-base font-semibold text-white hover:bg-blue-800"
          >
            Browse jobs
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
