import FeedbackForm from "../forms/FeedbackForm";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import ClientFeedback from "./ClientFeedback";

export default function Feedback() {
  return (
    <section id="feedback" aria-labelledby="feedback-title" className="bg-ivory py-28 text-charcoal lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          id="feedback-title"
          tone="dark"
          eyebrow="Customer Feedback"
          title={
            <>
              Your Experience, <span className="italic text-bronze">Carefully Considered</span>
            </>
          }
        >
          <p>
            Tell us how we did. Every submission is read by our team, and nothing is published without moderation and
            your permission.
          </p>
        </SectionHeading>

        <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <ClientFeedback />
          </Reveal>

          <Reveal className="lg:col-span-7">
            <div className="border border-bronze/25 bg-ivory-deep/40 p-8 sm:p-12">
              <FeedbackForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
