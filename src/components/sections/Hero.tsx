import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRightIcon, ChevronDownIcon } from "../ui/Icons";

const HEADLINE = ["Bringing the", "Brilliance Back", "to Brass &", "Copper."];
const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-charcoal"
    >
      <motion.div
        className="absolute inset-x-0 -top-[6%] h-[118%]"
        style={reduce ? undefined : { y: imageY }}
        initial={reduce ? false : { scale: 1.08, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <img
          src="/images/hero-pitcher.png"
          alt="Freshly polished brass pitcher with glass panels on a luxury dining table"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
      </motion.div>
      <div className="absolute inset-0 bg-charcoal/60" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent"
        aria-hidden="true"
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.88, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: EASE }}
        className="absolute right-6 top-24 z-10 flex flex-col items-center gap-2 sm:right-8 sm:top-28 lg:right-10 lg:top-32"
      >
        <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-champagne bg-charcoal/60 p-1 shadow-2xl shadow-black/30 sm:h-24 sm:w-24">
          <img
            src="/images/aakash%20photo.jpeg"
            alt="Aakash, owner of Shree Polishing And Buffing Service"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="text-center text-ivory">
          <p className="font-serif text-base leading-none sm:text-lg">Aakash</p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-champagne">Owner</p>
        </div>
      </motion.div>

      <motion.div
        style={reduce ? undefined : { opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-7xl px-6 pb-28 pt-40 lg:px-10 lg:pb-36"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="eyebrow mb-8"
        >
          Brass &amp; Copper Polishing | Buffing | Metalware Restoration
        </motion.p>

        <h1
          id="hero-title"
          className="max-w-5xl text-[2.75rem] leading-[1.02] text-ivory sm:text-6xl lg:text-[5.5rem] xl:text-[6.25rem]"
        >
          {HEADLINE.map((word, i) => (
            <span key={word} className="mr-[0.22em] inline-block overflow-hidden pb-1 align-top">
              <motion.span
                className={`inline-block ${i === HEADLINE.length - 1 ? "italic text-champagne" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.35 + i * 0.1, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.9, ease: EASE }}
          className="mt-10 max-w-2xl text-base leading-relaxed text-ivory/80 sm:text-lg"
        >
          Professional polishing and buffing for brass and copper utensils, restoring their shine and presentation
          through careful metal finishing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.05, ease: EASE }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <a href="#contact" className="btn-primary">
            Request a Quote
            <ArrowRightIcon size={16} />
          </a>
          <a href="#gallery" className="btn-outline">
            Explore Our Craftsmanship
          </a>
        </motion.div>
      </motion.div>

      <a
        href="#about"
        aria-label="Scroll to about the company"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-ivory/60 transition-colors hover:text-champagne md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex"
        >
          <ChevronDownIcon size={18} />
        </motion.span>
      </a>
    </section>
  );
}
