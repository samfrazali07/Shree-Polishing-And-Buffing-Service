import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { WHATSAPP_URL } from "../../config/site";
import { useAnyInView } from "../../hooks/useAnyInView";
import { ArrowUpIcon, WhatsAppIcon } from "../ui/Icons";

/**
 * Floating WhatsApp, back-to-top and enquire buttons.
 * They fade out whenever a form submit button is on screen so they never cover form controls.
 */
export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const formActionVisible = useAnyInView(["feedback-submit", "enquiry-submit"]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShowTop(window.scrollY > 700);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const hidden = formActionVisible;

  return (
    <>
      {/* Floating enquiry shortcut (desktop) */}
      <div
        className={`fixed bottom-6 left-6 z-40 hidden transition-all duration-500 md:block ${
          hidden ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
        }`}
      >
        <a
          href="#contact"
          className="group inline-flex items-center gap-3 border border-champagne/50 bg-charcoal/90 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ivory shadow-lg backdrop-blur transition-colors hover:border-champagne hover:text-champagne"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-champagne" aria-hidden="true" />
          Enquire Now
        </a>
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && !hidden && (
          <motion.a
            key="back-to-top"
            href="#top"
            aria-label="Back to top"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-24 right-5 z-40 inline-flex h-11 w-11 items-center justify-center border border-champagne/50 bg-charcoal/90 text-champagne shadow-lg backdrop-blur transition-colors hover:bg-champagne hover:text-charcoal focus-visible:outline-champagne md:bottom-28 md:right-6"
          >
            <ArrowUpIcon size={18} />
          </motion.a>
        )}
      </AnimatePresence>

      {/* WhatsApp click-to-chat */}
      <div
        className={`group fixed bottom-5 right-5 z-40 transition-all duration-500 md:bottom-6 md:right-6 ${
          hidden ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
        }`}
      >
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full top-1/2 mr-4 hidden -translate-y-1/2 whitespace-nowrap border border-champagne/30 bg-charcoal px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ivory opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 md:block"
        >
          Chat with us on WhatsApp
        </span>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp (opens in a new tab)"
          aria-describedby="whatsapp-tooltip-mobile"
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-champagne/60 bg-charcoal text-[#25D366] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:-translate-y-0.5 hover:scale-105 hover:border-champagne focus-visible:outline-champagne"
        >
          <WhatsAppIcon size={28} />
          <span className="sr-only" id="whatsapp-tooltip-mobile">
            Chat with us on WhatsApp
          </span>
        </a>
      </div>
    </>
  );
}
