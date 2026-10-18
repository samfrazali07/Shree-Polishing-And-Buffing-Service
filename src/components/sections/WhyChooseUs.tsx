import { WHY_POINTS } from "../../data/content";
import { featureIcons } from "../ui/Icons";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

export default function WhyChooseUs() {
  return (
    <section id="why-us" aria-labelledby="why-title" className="bg-ivory py-28 text-charcoal lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          id="why-title"
          tone="dark"
          align="center"
          eyebrow="Why Choose Us"
          title={
            <>
              Built on Care, <span className="italic text-bronze">Judged by the Finish</span>
            </>
          }
        >
          <p>
            What you can expect when you work with us: careful assessment, skilled workmanship and direct, honest
            communication.
          </p>
        </SectionHeading>

        <ul className="mt-20 grid gap-px bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_POINTS.map((point, i) => {
            const Icon = featureIcons[point.icon];
            return (
              <Reveal key={point.title} as="li" delay={(i % 3) * 0.08} className="group bg-ivory">
                <div className="flex h-full flex-col gap-6 p-8 transition-colors duration-700 hover:bg-ivory-deep lg:p-10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-bronze/40 text-bronze transition-all duration-700 group-hover:border-bronze group-hover:bg-charcoal group-hover:text-champagne">
                    <Icon size={24} />
                  </span>
                  <h3 className="text-2xl leading-snug text-charcoal">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-charcoal/65">{point.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
