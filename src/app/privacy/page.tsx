import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-24 pb-20">
        <p className="text-sm text-muted">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          / Privacy Policy
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-base text-muted">Last updated: September 13, 2026</p>

        <div className="mt-10 space-y-8 text-[17px] leading-relaxed text-muted prose-headings:text-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. Who we are
            </h2>
            <p className="mt-2">
              Hirehired (“we”, “us”, “our”) operates the Hirehired website and
              related services. This Privacy Policy explains how we collect, use,
              store, and share information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. Information we collect
            </h2>
            <p className="mt-2">We may collect:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground/90">Account data</strong> —
                name, email address, password (hashed), and profile details you
                provide.
              </li>
              <li>
                <strong className="text-foreground/90">Usage data</strong> —
                pages viewed, searches, jobs saved or applied to, and approximate
                location derived from IP.
              </li>
              <li>
                <strong className="text-foreground/90">Device data</strong> —
                browser type, operating system, and similar technical information.
              </li>
              <li>
                <strong className="text-foreground/90">Communications</strong> —
                messages you send us (support, feedback).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. How we use your information
            </h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Provide, maintain, and improve the Hirehired service</li>
              <li>Create and manage your account</li>
              <li>Personalize job recommendations and alerts</li>
              <li>Communicate about your account or product updates</li>
              <li>Detect and prevent abuse, fraud, and security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Sharing of information
            </h2>
            <p className="mt-2">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                Service providers who help us operate the product (hosting,
                analytics, email) under strict contractual limits
              </li>
              <li>Employers only when you explicitly apply or share a profile</li>
              <li>Authorities when required by law or to protect rights and safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              5. Data retention
            </h2>
            <p className="mt-2">
              We retain account and application data for as long as your account
              is active or as needed to provide the service. You may request
              deletion of your account and associated personal data subject to
              legal retention requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              6. Security
            </h2>
            <p className="mt-2">
              We use industry-standard measures to protect your data, including
              encryption in transit and access controls. No method of transmission
              or storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              7. Your rights
            </h2>
            <p className="mt-2">
              Depending on your location, you may have rights to access, correct,
              delete, or export your personal data, or to object to certain
              processing. Contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              8. Cookies
            </h2>
            <p className="mt-2">
              We use cookies and similar technologies as described in our{" "}
              <Link href="/cookies/" className="text-accent hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              9. Changes
            </h2>
            <p className="mt-2">
              We may update this policy from time to time. Material changes will
              be reflected by an updated “Last updated” date and, where
              appropriate, additional notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              10. Contact
            </h2>
            <p className="mt-2">
              For privacy questions:{" "}
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
