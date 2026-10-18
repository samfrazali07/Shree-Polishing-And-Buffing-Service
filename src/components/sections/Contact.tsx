import { BUSINESS, HOURS_NOTE, OPENING_HOURS, WHATSAPP_URL } from "../../config/site";
import {
  ClockIcon,
  ExternalIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "../ui/Icons";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import EnquiryForm from "../forms/EnquiryForm";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-ivory-deep py-28 text-charcoal lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:grid-cols-12 lg:px-10">
        <div className="flex flex-col gap-12 lg:col-span-5">
          <SectionHeading
            id="contact-title"
            tone="dark"
            eyebrow="Contact Us"
            title={
              <>
                Let&apos;s Discuss Your <span className="italic text-bronze">Polishing Requirements.</span>
              </>
            }
          >
            <p>
              Share details about your brass or copper metalware and we will respond with next steps. For a quick
              commercial enquiry, WhatsApp is the fastest route.
            </p>
          </SectionHeading>

          {/* Visit or Contact Us — address & hours */}
          <Reveal>
            <div className="border border-bronze/25 bg-ivory p-7 sm:p-8">
              <h3 className="font-serif text-2xl text-charcoal">Visit or Contact Us</h3>

              <div className="mt-6 flex items-start gap-4">
                <MapPinIcon size={20} className="mt-1 shrink-0 text-bronze" />
                <div>
                  <p className="eyebrow !text-[10px] !text-bronze">Address</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-charcoal/85">{BUSINESS.address}</p>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-4">
                <ClockIcon size={20} className="mt-1 shrink-0 text-bronze" />
                <div className="w-full">
                  <p className="eyebrow !text-[10px] !text-bronze">Opening Hours</p>
                  <table className="mt-3 w-full text-sm">
                    <caption className="sr-only">Weekly business opening hours</caption>
                    <tbody>
                      {OPENING_HOURS.map((row) => (
                        <tr key={row.day} className="border-b border-charcoal/8">
                          <th scope="row" className="py-2.5 pr-4 text-left font-medium text-charcoal">
                            {row.day}
                          </th>
                          <td className="py-2.5 text-right text-charcoal/70">{row.hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-3 text-xs leading-relaxed text-charcoal/55">{HOURS_NOTE}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !bg-charcoal !text-ivory hover:!text-champagne"
                >
                  Get Directions
                  <ExternalIcon size={14} />
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 border border-charcoal/25 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal transition-colors hover:border-bronze hover:text-bronze"
                >
                  <WhatsAppIcon size={18} className="text-[#25D366]" />
                  WhatsApp
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
              <li className="flex flex-wrap items-center justify-between gap-4 py-6">
                <div className="flex items-start gap-4">
                  <PhoneIcon size={20} className="mt-1 shrink-0 text-bronze" />
                  <div>
                    <p className="eyebrow !text-[10px] !text-bronze">Phone</p>
                    <a
                      href={`tel:${BUSINESS.phoneHref}`}
                      className="mt-1 block font-serif text-2xl text-charcoal transition-colors hover:text-bronze"
                    >
                      {BUSINESS.phoneDisplay}
                    </a>
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-4 py-6">
                <WhatsAppIcon size={20} className="mt-1 shrink-0 text-[#25D366]" />
                <div>
                  <p className="eyebrow !text-[10px] !text-bronze">WhatsApp</p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-2 font-serif text-2xl text-charcoal transition-colors hover:text-bronze"
                  >
                    {BUSINESS.phoneDisplay}
                    <ExternalIcon size={14} className="opacity-60" />
                  </a>
                  <p className="mt-1 text-xs text-charcoal/55">
                    Opens WhatsApp on your phone or WhatsApp Web on desktop.
                  </p>
                </div>
              </li>

              {BUSINESS.email ? (
                <li className="flex items-start gap-4 py-6">
                  <MailIcon size={20} className="mt-1 shrink-0 text-bronze" />
                  <div>
                    <p className="eyebrow !text-[10px] !text-bronze">Email</p>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="mt-1 block break-all font-serif text-xl text-charcoal transition-colors hover:text-bronze"
                    >
                      {BUSINESS.email}
                    </a>
                  </div>
                </li>
              ) : null}
            </ul>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7">
          <div className="border border-bronze/25 bg-ivory p-8 shadow-[0_40px_80px_-60px_rgba(13,13,13,0.5)] sm:p-12">
            <EnquiryForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
