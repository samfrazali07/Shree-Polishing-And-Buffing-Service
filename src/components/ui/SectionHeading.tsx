import type { ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  id?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  children?: ReactNode;
}

/** Consistent editorial heading block with an eyebrow label and gold rule. */
export default function SectionHeading({ eyebrow, title, id, align = "left", tone = "light", children }: SectionHeadingProps) {
  const alignClass = align === "center" ? "mx-auto text-center items-center" : "items-start";
  const titleColor = tone === "light" ? "text-ivory" : "text-charcoal";
  const bodyColor = tone === "light" ? "text-ivory/70" : "text-charcoal/70";

  return (
    <Reveal className={`flex max-w-3xl flex-col gap-6 ${alignClass}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className={`text-4xl leading-[1.1] sm:text-5xl lg:text-6xl ${titleColor}`}>
        {title}
      </h2>
      <div className="flex w-24 items-center">
        <span className="gold-rule" aria-hidden="true" />
      </div>
      {children && <div className={`text-base leading-relaxed sm:text-lg ${bodyColor}`}>{children}</div>}
    </Reveal>
  );
}
