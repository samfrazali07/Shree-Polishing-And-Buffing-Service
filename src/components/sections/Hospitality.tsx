import { HOSPITALITY_APPLICATIONS, HOSPITALITY_BENEFITS } from "../../data/content";
import { WHATSAPP_HOTEL_URL } from "../../config/site";
import { ArrowRightIcon, WhatsAppIcon } from "../ui/Icons";
import Reveal from "../ui/Reveal";
import RevealImage from "../ui/RevealImage";
import SectionHeading from "../ui/SectionHeading";

export default function Hospitality() {
  return (
    <section id="hospitality" aria-labelledby="hospitality-title" className="relative overflow-hidden bg-charcoal py-28 lg:py-40">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden="true">
        <img
          src="/images/brass-copper-cookware.png"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal/80" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="flex flex-col gap-10 lg:col-span-5">
          <SectionHeading
            id="hospitality-title"
            eyebrow="Hospitality Solutions"
            title={
              <>
                Exceptional Metalware Deserves an{" "}
                <span className="italic text-champagne">Exceptional Finish.</span>
              </>
            }
          >
            <p>
              Professional brass and copper utensil polishing for hospitality businesses that value presentation,
              detail, and well-maintained metalware.
            </p>
          </SectionHeading>

          <div>
            <p className="eyebrow mb-4 !text-[10px]">Suitable applications</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {HOSPITALITY_APPLICATIONS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-ivory/75">
                  <span className="h-px w-4 bg-champagne/60" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#contact" className="btn-primary">
              Request a Hotel Service Quote
              <ArrowRightIcon size={16} />
            </a>
            <a
              href={WHATSAPP_HOTEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center gap-3"
            >
              <WhatsAppIcon size={18} className="text-[#25D366]" />
              Contact Us on WhatsApp
            </a>
          </div>

          <RevealImage
            src="/images/hero-pitcher.png"
            alt="Polished brass pitcher styled for luxury hospitality dining"
            className="group aspect-[16/11] w-full"
          />
        </div>

        <Reveal className="lg:col-span-7">
          <article
            aria-label="Hospitality polishing overview"
            className="relative h-full border border-champagne/25 bg-charcoal-soft/80 p-8 backdrop-blur-sm sm:p-12"
          >
            <span className="absolute inset-x-0 top-0 h-[3px] bg-champagne" aria-hidden="true" />

            <header className="flex flex-col gap-3 border-b border-champagne/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">For Hotels &amp; Hospitality Teams</p>
                <h3 className="mt-3 font-serif text-3xl text-ivory">
                  Presentation-Ready Metalware
                </h3>
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-ivory/45">Enquiry-based</p>
            </header>

            <ol className="mt-4 grid gap-x-12 sm:grid-cols-2">
              {HOSPITALITY_BENEFITS.map((benefit, i) => (
                <li key={benefit.title} className="flex gap-5 border-b border-champagne/10 py-7">
                  <span className="font-serif text-2xl text-champagne">0{i + 1}</span>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-sans text-[15px] font-semibold text-ivory">{benefit.title}</h4>
                    <p className="text-sm leading-relaxed text-ivory/60">{benefit.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-xs leading-relaxed text-ivory/50">
              Service scope and quotations are confirmed after discussing your metalware and requirements. We do not
              claim existing hotel partnerships unless independently verified.
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
