import { motion, useReducedMotion } from "framer-motion";
import { SERVICES } from "../../data/content";
import { requestServiceEnquiry } from "../../lib/events";
import { ArrowRightIcon } from "../ui/Icons";
import RevealImage from "../ui/RevealImage";
import SectionHeading from "../ui/SectionHeading";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Services() {
  const reduce = useReducedMotion();

  return (
    <section id="services" aria-labelledby="services-title" className="bg-charcoal py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            id="services-title"
            eyebrow="Our Services"
            title={
              <>
                Specialist Finishing for
                <br />
                <span className="italic text-champagne">Brass &amp; Copper</span>
              </>
            }
          />
          <p className="max-w-sm text-sm leading-relaxed text-ivory/60 lg:pb-3">
            Professional polishing and buffing for utensils and metalware — from individual pieces to commercial
            bulk enquiries.
          </p>
        </div>

        <motion.div
          variants={container}
          initial={reduce ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-20 grid gap-px bg-champagne/15 sm:grid-cols-2 xl:grid-cols-3"
        >
          {SERVICES.map((service, index) => (
            <motion.article
              key={service.id}
              variants={card}
              className="group flex flex-col bg-charcoal transition-colors duration-700 hover:bg-charcoal-soft"
            >
              <div className="relative overflow-hidden">
                <RevealImage
                  src={service.image}
                  alt={service.alt}
                  className="aspect-[4/3] w-full transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
                  sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <span className="absolute left-5 top-5 font-serif text-sm tracking-[0.2em] text-champagne">
                  0{index + 1}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-7 lg:p-8">
                <h3 className="text-2xl leading-snug text-ivory transition-colors duration-500 group-hover:text-champagne lg:text-[1.55rem]">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-ivory/65">{service.description}</p>

                <button
                  type="button"
                  onClick={() => requestServiceEnquiry(service.formValue)}
                  className="mt-auto inline-flex items-center gap-3 self-start pt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne transition-colors hover:text-champagne-light focus-visible:outline-champagne"
                >
                  <span className="border-b border-champagne/50 pb-1 transition-colors group-hover:border-champagne">
                    Request a Quote
                  </span>
                  <ArrowRightIcon
                    size={16}
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
