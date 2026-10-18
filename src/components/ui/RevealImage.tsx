import { motion, useReducedMotion } from "framer-motion";

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
}

/**
 * Lazy-loaded image with a smooth scroll reveal. The reveal runs both ways
 * (when scrolling down and back up) so images always settle into their normal
 * appearance. The inner image zooms gently on hover.
 */
export default function RevealImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: RevealImageProps) {
  const reduce = useReducedMotion();

  return (
    <div className={`relative overflow-hidden bg-graphite ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        sizes={sizes}
        initial={reduce ? false : { scale: 1.1, opacity: 0.35 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full w-full object-cover transition-[scale] duration-[1400ms] ease-luxe group-hover:scale-105 ${imgClassName}`}
      />
    </div>
  );
}
