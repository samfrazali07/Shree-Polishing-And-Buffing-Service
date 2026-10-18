import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "../../config/site";
import { useScrolled } from "../../hooks/useScrolled";
import { CloseIcon, MenuIcon } from "../ui/Icons";
import Logo from "../ui/Logo";

export default function Navbar() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);

  // Close the mobile menu with Escape and when the viewport grows to desktop size.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-luxe ${
        scrolled || open
          ? `border-b border-champagne/15 bg-charcoal/95 py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] ${
              open ? "" : "backdrop-blur-md"
            }`
          : "bg-transparent py-6"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Logo compact={scrolled} />

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ivory/80 transition-colors duration-300 hover:text-champagne focus-visible:text-champagne"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-champagne transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#contact" className="btn-primary hidden !px-6 !py-3 md:inline-flex">
            Request a Business Enquiry
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-champagne/40 text-ivory transition-colors hover:border-champagne hover:text-champagne lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 overflow-y-auto bg-charcoal px-6 pb-10 pt-28 lg:hidden"
          >
            <ul className="flex flex-col divide-y divide-champagne/10">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 font-serif text-3xl text-ivory transition-colors hover:text-champagne"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#contact" onClick={() => setOpen(false)} className="btn-primary mt-8 w-full">
              Request a Business Enquiry
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
