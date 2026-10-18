import { BUSINESS, NAV_LINKS, WHATSAPP_URL } from "../../config/site";
import { SERVICES } from "../../data/content";
import { ExternalIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "../ui/Icons";
import Logo from "../ui/Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  // Anchor links must point back to the home page when the footer is shown on another route (e.g. /privacy).
  const base = typeof window !== "undefined" && window.location.pathname !== "/" ? "/" : "";

  return (
    <footer className="bg-charcoal pt-20 text-ivory" role="contentinfo">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:px-10">
        <div className="flex flex-col gap-6">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-ivory/65">
            Professional polishing and buffing for brass and copper utensils and metalware — restoring shine and
            presentation for hospitality and commercial clients.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="eyebrow mb-6 !text-[10px]">Explore</h2>
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={`${base}${l.href}`} className="text-sm text-ivory/70 transition-colors hover:text-champagne">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow mb-6 !text-[10px]">Services</h2>
          <ul className="flex flex-col gap-3">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <a href={`${base}#services`} className="text-sm text-ivory/70 transition-colors hover:text-champagne">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow mb-6 !text-[10px]">Contact</h2>
          <ul className="flex flex-col gap-4 text-sm text-ivory/70">
            <li className="flex items-start gap-3">
              <PhoneIcon size={18} className="mt-0.5 shrink-0 text-champagne" />
              <a href={`tel:${BUSINESS.phoneHref}`} className="transition-colors hover:text-champagne">
                {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <WhatsAppIcon size={18} className="mt-0.5 shrink-0 text-champagne" />
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-champagne"
              >
                Chat on WhatsApp
              </a>
            </li>
            {BUSINESS.email && (
              <li className="flex items-start gap-3">
                <MailIcon size={18} className="mt-0.5 shrink-0 text-champagne" />
                <a href={`mailto:${BUSINESS.email}`} className="break-all transition-colors hover:text-champagne">
                  {BUSINESS.email}
                </a>
              </li>
            )}
            <li className="flex items-start gap-3">
              <MapPinIcon size={18} className="mt-0.5 shrink-0 text-champagne" />
              <span>{BUSINESS.address || "Address to be confirmed"}</span>
            </li>
            {BUSINESS.mapsUrl && (
              <li>
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-champagne transition-colors hover:text-champagne-light"
                >
                  View on Google Maps <ExternalIcon size={14} />
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-champagne/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-ivory/55 sm:flex-row lg:px-10">
          <p>
            &copy; {year} Shree Polishing And Buffing Service. All rights reserved.
          </p>
          <nav aria-label="Legal and feedback links" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="/privacy" className="transition-colors hover:text-champagne">
              Privacy Policy
            </a>
            <a href={`${base}#reviews`} className="transition-colors hover:text-champagne">
              Google Reviews
            </a>
            <a href={`${base}#feedback`} className="transition-colors hover:text-champagne">
              Share Feedback
            </a>
          </nav>
          <p className="tracking-wide">
            Designed &amp; Developed by <span className="font-serif text-sm italic text-champagne">Teksqud</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
