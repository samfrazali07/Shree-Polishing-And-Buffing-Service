interface LogoProps {
  tone?: "light" | "dark";
  compact?: boolean;
  href?: string;
}

/** Custom text-based wordmark for Shree Polishing And Buffing Service. */
export default function Logo({ tone = "light", compact = false, href = "#top" }: LogoProps) {
  const main = tone === "light" ? "text-ivory" : "text-charcoal";
  const sub = tone === "light" ? "text-champagne" : "text-bronze";

  return (
    <a
      href={href}
      className="group inline-flex flex-col leading-none focus-visible:outline-champagne"
      aria-label="Shree Polishing And Buffing Service, back to top"
    >
      <span
        className={`font-serif font-medium tracking-[0.24em] transition-colors duration-500 ${main} ${
          compact ? "text-xl" : "text-2xl lg:text-[1.7rem]"
        }`}
      >
        SHREE
      </span>
      <span className={`mt-1.5 flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.34em] sm:text-[10px] ${sub}`}>
        <span className="h-px w-4 bg-current opacity-70" aria-hidden="true" />
        Polishing &amp; Buffing Service
      </span>
    </a>
  );
}
