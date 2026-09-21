import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-24 pb-20">
        <p className="text-sm text-muted">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          / Cookie Policy
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Cookie Policy
        </h1>
        <p className="mt-2 text-base text-muted">Last updated: September 13, 2026</p>

        <div className="mt-10 space-y-8 text-[17px] leading-relaxed text-muted">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. What are cookies?
            </h2>
            <p className="mt-2">
              Cookies are small text files stored on your device when you visit
              a website. They help the site remember your preferences, keep you
              signed in, and understand how the product is used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. How we use cookies
            </h2>
            <p className="mt-2">Hirehired uses cookies and similar technologies for:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground/90">Essential</strong>  - 
                authentication, security, and core functionality. These are
                required for the service to work.
              </li>
              <li>
                <strong className="text-foreground/90">Preferences</strong>  - 
                remembering settings such as theme or saved filters.
              </li>
              <li>
                <strong className="text-foreground/90">Analytics</strong>  - 
                understanding traffic and feature usage so we can improve the
                product (aggregated and where possible anonymized).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. Managing cookies
            </h2>
            <p className="mt-2">
              You can control cookies through your browser settings. Blocking
              essential cookies may prevent sign-in or other core features from
              working. Third-party analytics tools, if used, may offer their own
              opt-out mechanisms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Updates
            </h2>
            <p className="mt-2">
              We may update this Cookie Policy as our practices change. The
              “Last updated” date at the top will reflect the latest version.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              5. More information
            </h2>
            <p className="mt-2">
              For how we handle personal data more broadly, see our{" "}
              <Link href="/privacy/" className="text-accent hover:underline">
                Privacy Policy
              </Link>
              . Questions:{" "}
              <a
                href="mailto:privacy@hirehired.com"
                className="text-accent hover:underline"
              >
                privacy@hirehired.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
