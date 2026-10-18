import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BEFORE_AFTER, GALLERY, type GalleryItem } from "../../data/content";
import { CloseIcon } from "../ui/Icons";
import Reveal from "../ui/Reveal";
import RevealImage from "../ui/RevealImage";
import SectionHeading from "../ui/SectionHeading";

const RATIO_CLASS: Record<GalleryItem["ratio"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "brass", label: "Brass" },
  { id: "copper", label: "Copper" },
  { id: "decorative", label: "Decorative" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export default function Gallery() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; caption: string } | null>(null);

  const items = filter === "all" ? GALLERY : GALLERY.filter((g) => g.category === filter);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-ivory py-28 text-charcoal lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="gallery-title"
            tone="dark"
            eyebrow="Our Work"
            title={
              <>
                The Difference Is in the <span className="italic text-bronze">Finish.</span>
              </>
            }
          >
            <p>Explore the craftsmanship behind brighter brass and copper surfaces.</p>
          </SectionHeading>
        </div>

        {/* Before & After */}
        <div className="mt-16">
          <p className="eyebrow mb-6 !text-bronze">Before &amp; After</p>
          <div className="grid gap-6 lg:grid-cols-2">
            {BEFORE_AFTER.map((item) => (
              <Reveal key={item.id}>
                <button
                  type="button"
                  onClick={() => setLightbox({ src: item.src, alt: item.alt, caption: item.caption })}
                  className="group relative block w-full overflow-hidden border border-charcoal/10 text-left focus-visible:outline-bronze"
                >
                  <RevealImage
                    src={item.src}
                    alt={item.alt}
                    className="aspect-[16/10] w-full transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-charcoal/80 px-5 py-4 text-sm text-ivory opacity-90 transition-opacity group-hover:opacity-100">
                    {item.caption}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-20 flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${
                filter === f.id
                  ? "bg-charcoal text-champagne"
                  : "border border-charcoal/20 text-charcoal/70 hover:border-bronze hover:text-bronze"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((item, index) => (
            <Reveal key={`${item.src}-${index}`} className="mb-5 break-inside-avoid">
              <button
                type="button"
                onClick={() => setLightbox({ src: item.src, alt: item.alt, caption: item.caption })}
                className="group relative block w-full overflow-hidden text-left focus-visible:outline-bronze"
              >
                <RevealImage
                  src={item.src}
                  alt={item.alt}
                  className={`${RATIO_CLASS[item.ratio]} w-full transition-transform duration-700 ease-luxe group-hover:scale-[1.04]`}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-charcoal/85 px-5 py-4 text-ivory opacity-0 transition-all duration-700 ease-luxe group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="eyebrow !text-[10px] !text-champagne">{item.caption}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/92 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label="Close image"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-champagne/40 text-ivory transition-colors hover:border-champagne hover:text-champagne"
              onClick={() => setLightbox(null)}
            >
              <CloseIcon size={20} />
            </button>
            <motion.figure
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="max-h-[90vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="max-h-[80vh] w-full object-contain"
              />
              <figcaption className="mt-4 text-center text-sm text-ivory/70">{lightbox.caption}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
