import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-24 pb-20">
        <p className="text-[12px] text-muted">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          / Terms of Service
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-[13px] text-muted">Last updated: September 13, 2026</p>

        <div className="mt-10 space-y-8 text-[14px] leading-relaxed text-muted">
          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              1. Acceptance of terms
            </h2>
            <p className="mt-2">
              By accessing or using Hirehired, you agree to these Terms of
              Service and our Privacy Policy. If you do not agree, do not use
              the service.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              2. Description of service
            </h2>
            <p className="mt-2">
              Hirehired provides tools to discover job opportunities sourced
              primarily from employer career pages and related systems, and to
              track applications. We are not an employer for roles listed on
              the platform unless explicitly stated. Job content is provided by
              third parties; we do not guarantee accuracy, availability, or
              outcomes of any application.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              3. Accounts
            </h2>
            <p className="mt-2">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activity under your account. You
              must provide accurate information and keep it updated. We may
              suspend or terminate accounts that violate these terms or pose a
              risk to the service or other users.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              4. Acceptable use
            </h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Scrape, crawl, or bulk-export data beyond normal use</li>
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Interfere with the operation or security of the service</li>
              <li>Use the service for spam, harassment, or illegal activity</li>
              <li>Attempt to reverse engineer or circumvent access controls</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              5. Job listings and applications
            </h2>
            <p className="mt-2">
              Listings are aggregated or submitted by employers and may change
              or be removed without notice. Applying through Hirehired does not
              create an employment relationship with us. Employers are solely
              responsible for their hiring decisions and compliance with
              applicable employment laws.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              6. Intellectual property
            </h2>
            <p className="mt-2">
              The Hirehired name, logo, interface, and original content are
              owned by us or our licensors. You may not copy, modify, or
              distribute our materials without prior written permission, except
              as allowed by fair use or applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              7. Disclaimers
            </h2>
            <p className="mt-2">
              The service is provided “as is” without warranties of any kind,
              express or implied, including fitness for a particular purpose and
              non-infringement. We do not warrant that the service will be
              uninterrupted, error-free, or free of harmful components.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              8. Limitation of liability
            </h2>
            <p className="mt-2">
              To the maximum extent permitted by law, Hirehired and its
              operators shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of
              profits, data, or opportunities arising from your use of the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              9. Indemnification
            </h2>
            <p className="mt-2">
              You agree to indemnify and hold harmless Hirehired from claims
              arising out of your use of the service, your content, or your
              violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              10. Changes and termination
            </h2>
            <p className="mt-2">
              We may modify these terms or discontinue the service at any time.
              Continued use after changes constitutes acceptance. We may
              terminate or suspend access for any reason, including breach of
              these terms.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              11. Governing law
            </h2>
            <p className="mt-2">
              These terms are governed by the laws applicable in the jurisdiction
              in which Hirehired operates, without regard to conflict-of-law
              principles. Disputes shall be resolved in the courts of that
              jurisdiction unless mandatory consumer protections require
              otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-foreground">
              12. Contact
            </h2>
            <p className="mt-2">
              Questions about these terms:{" "}
              <a
                href="mailto:legal@hirehired.com"
                className="text-accent hover:underline"
              >
                legal@hirehired.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
