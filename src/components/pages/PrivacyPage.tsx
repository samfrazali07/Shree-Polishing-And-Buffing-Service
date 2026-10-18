import { BUSINESS } from "../../config/site";
import Footer from "../layout/Footer";
import Logo from "../ui/Logo";

/**
 * Privacy policy page (route: /privacy).
 * This is a practical starting point for the data the website collects.
 * Have it reviewed by a qualified professional for your jurisdiction before publishing.
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <header className="border-b border-champagne/15 bg-charcoal/95">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
          <Logo compact href="/" />
          <a href="/" className="text-[11px] font-medium uppercase tracking-[0.2em] text-champagne hover:text-champagne-light">
            Back to home
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-6 text-5xl leading-tight">Privacy Policy</h1>
        <div className="gold-rule mt-8" aria-hidden="true" />

        <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-ivory/75">
          <section className="space-y-3">
            <h2 className="font-serif text-3xl text-ivory">Who we are</h2>
            <p>
              This website is operated by {BUSINESS.name}. You can contact us by phone or WhatsApp at{" "}
              {BUSINESS.phoneDisplay}
              {BUSINESS.email ? ` or by email at ${BUSINESS.email}` : ""}.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-3xl text-ivory">Information we collect</h2>
            <p>
              We only collect the details you choose to send us through our forms: for feedback, your name, email
              address, optional shop or company name, the service used, your rating and your message; for business
              enquiries, the contact person, company name, business email, phone number, service required, project
              location, optional quantity and preferred date, and additional requirements.
            </p>
            <p>
              We do not use advertising trackers on this website. WhatsApp links open a conversation in WhatsApp,
              which is governed by WhatsApp&apos;s own privacy policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-3xl text-ivory">How we use your information</h2>
            <p>
              We use your information to respond to your enquiry or feedback and to discuss quotations or service details
              you request. Feedback is shown publicly only after moderation and only if you gave explicit permission on
              the form. Your name is shortened to first name and last initial when published.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-3xl text-ivory">Google reviews</h2>
            <p>
              Google reviews displayed on this website are retrieved from the Google Places API and remain subject to
              Google&apos;s terms and policies. They are not written by us and are not edited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-3xl text-ivory">Retention and your rights</h2>
            <p>
              We keep enquiry and feedback records only for as long as needed to handle the matter and keep relevant
              business records. You may ask us to access, correct or delete your information at any time by contacting
              us using the details above.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-3xl text-ivory">Changes to this policy</h2>
            <p>We may update this policy from time to time. The latest version will always be published on this page.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
