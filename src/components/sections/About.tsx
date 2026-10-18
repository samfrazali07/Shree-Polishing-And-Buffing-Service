import { CheckIcon, ArrowRightIcon } from "../ui/Icons";
import RevealImage from "../ui/RevealImage";
import SectionHeading from "../ui/SectionHeading";

const HIGHLIGHTS = [
  "Restoring the appearance of tarnished brass and copper metalware",
  "Improving surface shine and presentation through careful finishing",
  "Helping suitable utensils look well-maintained for everyday or commercial use",
  "Polishing services for individual pieces or bulk commercial enquiries",
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-ivory py-28 text-charcoal lg:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
        <div className="group lg:col-span-6">
          <RevealImage
            src="/images/brass-kadhai.png"
            alt="Mirror-polished brass kadhai with lid in a hospitality dining setting"
            className="aspect-[4/5] w-full"
          />
        </div>

        <div className="lg:col-span-6">
          <SectionHeading
            id="about-title"
            tone="dark"
            eyebrow="About Us"
            title={
              <>
                Craftsmanship That Restores
                <br />
                the <span className="italic text-bronze">Beauty of Metal.</span>
              </>
            }
          >
            <p>
              Shree Polishing And Buffing Service focuses on polishing and buffing brass and copper utensils and
              related metalware. Our work is about careful metal finishing — bringing back shine, clarity and
              presentation to pieces that have dulled with use or time.
            </p>
            <p className="mt-5">
              Whether you manage hospitality metalware, supply utensils commercially, or care for traditional
              brass and copper pieces, we discuss your requirements and recommend a suitable polishing approach.
            </p>
          </SectionHeading>

          <ul className="mt-10 flex flex-col gap-4 border-t border-charcoal/10 pt-8">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-4 text-[15px] text-charcoal/80">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-bronze/50 text-bronze">
                  <CheckIcon size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <a href="#contact" className="btn-primary mt-10 !bg-charcoal !text-ivory hover:!text-champagne">
            Discuss Your Requirements
            <ArrowRightIcon size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
