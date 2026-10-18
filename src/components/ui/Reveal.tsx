import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article";
}

/** Fade-up reveal on scroll. Plays once and respects reduced-motion preferences. */
export default function Reveal({ children, delay = 0, y = 28, className = "", as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = as === "li" ? motion.li : as === "article" ? motion.article : motion.div;

  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
