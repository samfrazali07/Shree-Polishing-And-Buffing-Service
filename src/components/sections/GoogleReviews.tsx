import { useEffect, useState, type ReactNode } from "react";
import { BUSINESS } from "../../config/site";
import { getJson } from "../../lib/api";
import { AlertIcon, ExternalIcon } from "../ui/Icons";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import Stars from "../ui/Stars";

export interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  relativeTime?: string;
  reviewUrl?: string;
}

interface ReviewsPayload {
  status: "ok" | "empty" | "not_configured" | "error";
  summary?: { rating?: number; userRatingCount?: number; googleMapsUri?: string };
  reviews?: GoogleReview[];
  message?: string;
}

type LoadState =
  | { phase: "loading" }
  | { phase: "done"; payload: ReviewsPayload }
  | { phase: "error"; message: string };

export default function GoogleReviews() {
  const [state, setState] = useState<LoadState>({ phase: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getJson<ReviewsPayload>("/api/reviews").then((res) => {
      if (!active) return;
      if (res.ok) setState({ phase: "done", payload: res.data });
      else setState({ phase: "error", message: res.error });
    });
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = () => {
    setState({ phase: "loading" });
    setAttempt((n) => n + 1);
  };

  const payload = state.phase === "done" ? state.payload : undefined;
  // Display policy: only 3, 4 and 5 star reviews. 1 and 2 star reviews are never shown.
  const reviews = (payload?.reviews ?? []).filter((r) => r.rating >= 3 && r.rating <= 5);
  const mapsLink = payload?.summary?.googleMapsUri || BUSINESS.googleReviewsUrl;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-charcoal-soft py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            id="reviews-title"
            eyebrow="Google Reviews"
            title={
              <>
                Reviews from <span className="italic text-champagne">Google</span>
              </>
            }
          />

          <Reveal className="flex flex-col items-start gap-5 lg:items-end">
            {payload?.summary?.rating && payload.summary.userRatingCount ? (
              <p className="flex items-center gap-3 text-sm text-ivory/70">
                <span className="font-serif text-3xl text-ivory">{payload.summary.rating.toFixed(1)}</span>
                <Stars rating={payload.summary.rating} size={14} />
                <span>{payload.summary.userRatingCount} Google ratings</span>
              </p>
            ) : null}

            {mapsLink ? (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline !px-6 !py-3.5"
              >
                Read Reviews on Google
                <ExternalIcon size={14} />
              </a>
            ) : (
              <p className="max-w-xs text-xs leading-relaxed text-ivory/50 lg:text-right">
                The &quot;Read Reviews on Google&quot; link appears once the Google Business Profile URL is configured.
              </p>
            )}
          </Reveal>
        </div>

        <div aria-live="polite" className="mt-16">
          {state.phase === "loading" && <LoadingCards />}

          {state.phase === "error" && (
            <StateBox
              icon
              title="Google reviews are unavailable right now"
              text="We could not load reviews at the moment. Please try again shortly, or read all reviews directly on Google."
            >
              <button type="button" onClick={retry} className="btn-outline !px-6 !py-3">
                Try again
              </button>
            </StateBox>
          )}

          {state.phase === "done" && payload?.status === "not_configured" && (
            <StateBox
              icon
              tone="warning"
              title="Setup required: Google Reviews are not connected"
              text="Add GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID to your deployment environment variables, then redeploy. See the README, section “Google Reviews API”."
            />
          )}

          {state.phase === "done" && payload?.status !== "not_configured" && reviews.length === 0 && (
            <StateBox
              title="No reviews to display yet"
              text="There are no 3 to 5 star Google reviews available to show at the moment. Visit our Google listing to see the latest feedback."
            />
          )}

          {state.phase === "done" && reviews.length > 0 && (
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review, i) => (
                <Reveal as="li" key={review.id || `${review.author}-${i}`} delay={(i % 3) * 0.08}>
                  <article className="card-surface flex h-full flex-col gap-6 p-8 transition-colors duration-700 hover:border-champagne/40">
                    <div className="flex items-center justify-between gap-4">
                      <Stars rating={review.rating} label={`Rated ${review.rating} out of 5 stars on Google`} />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/45">Google review</span>
                    </div>
                    <blockquote className="flex-1">
                      <p className="whitespace-pre-line font-serif text-xl leading-relaxed text-ivory/90">
                        {review.text ? `“${review.text}”` : "Rated without written comments."}
                      </p>
                    </blockquote>
                    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-champagne/15 pt-5 text-sm">
                      <div>
                        <p className="font-medium text-ivory">{review.author}</p>
                        {review.relativeTime && <p className="text-xs text-ivory/50">{review.relativeTime}</p>}
                      </div>
                      {review.reviewUrl && (
                        <a
                          href={review.reviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-champagne transition-colors hover:text-champagne-light"
                        >
                          View on Google <ExternalIcon size={12} />
                        </a>
                      )}
                    </footer>
                  </article>
                </Reveal>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-12 max-w-3xl text-xs leading-relaxed text-ivory/45">
          Reviews are displayed as provided by Google, with the original text, reviewer name, rating and date. Only 3 to
          5 star reviews are shown. Google makes a limited selection of reviews available through its API, so not every
          review on the Google listing may appear here.
        </p>
      </div>
    </section>
  );
}

function LoadingCards() {
  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading Google reviews">
      {[0, 1, 2].map((i) => (
        <li key={i} className="card-surface h-64 animate-pulse p-8">
          <div className="h-3 w-24 bg-champagne/20" />
          <div className="mt-8 space-y-3">
            <div className="h-3 w-full bg-ivory/10" />
            <div className="h-3 w-11/12 bg-ivory/10" />
            <div className="h-3 w-3/4 bg-ivory/10" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function StateBox({
  title,
  text,
  children,
  icon = false,
  tone = "neutral",
}: {
  title: string;
  text: string;
  children?: ReactNode;
  icon?: boolean;
  tone?: "neutral" | "warning";
}) {
  const border = tone === "warning" ? "border-champagne/60" : "border-champagne/15";
  return (
    <div className={`card-surface flex flex-col items-start gap-5 border ${border} p-8 md:p-12`} role="status">
      {icon && <AlertIcon size={28} className="text-champagne" />}
      <div className="space-y-3">
        <h3 className="text-2xl text-ivory">{title}</h3>
        <p className="max-w-2xl text-sm leading-relaxed text-ivory/65">{text}</p>
      </div>
      {children}
    </div>
  );
}
