import { useEffect, useMemo, useState } from "react";
import { getJson } from "../../lib/api";
import Reveal from "../ui/Reveal";
import Stars from "../ui/Stars";

export interface PublishedFeedback {
  id: string;
  displayName: string;
  companyName: string | null;
  serviceUsed: string;
  rating: number;
  message: string;
  createdAt: string;
}

interface FeedbackPayload {
  configured: boolean;
  items: PublishedFeedback[];
}

const RATING_FILTERS = [
  { value: 0, label: "All" },
  { value: 5, label: "5 ★" },
  { value: 4, label: "4 ★" },
  { value: 3, label: "3 ★" },
  { value: 2, label: "2 ★" },
  { value: 1, label: "1 ★" },
] as const;

/**
 * Feedback submitted through this website, shown only after moderation and with
 * the reviewer's permission. Kept visually and logically separate from Google reviews.
 */
export default function ClientFeedback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);
  const [items, setItems] = useState<PublishedFeedback[]>([]);
  const [filter, setFilter] = useState<number>(0);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getJson<FeedbackPayload>("/api/feedback").then((res) => {
      if (!active) return;
      if (res.ok) {
        setItems(res.data.items ?? []);
        setConfigured(res.data.configured !== false);
        setError(null);
      } else {
        setError(res.error);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [attempt]);

  const visible = useMemo(
    () => (filter === 0 ? items : items.filter((i) => i.rating === filter)),
    [items, filter],
  );

  const retry = () => {
    setLoading(true);
    setError(null);
    setAttempt((n) => n + 1);
  };

  return (
    <div>
      <Reveal className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-3xl text-charcoal">Client Feedback</h3>
          <p className="text-sm leading-relaxed text-charcoal/60">
            Feedback shared through this website. It is published only after moderation and with the reviewer&apos;s
            permission, and is not a Google review.
          </p>
        </div>

        <div role="group" aria-label="Filter feedback by rating" className="flex flex-wrap gap-2">
          {RATING_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
                filter === f.value
                  ? "border-bronze bg-bronze text-ivory"
                  : "border-charcoal/20 text-charcoal/70 hover:border-bronze hover:text-bronze"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div aria-live="polite" className="mt-8">
        {loading && (
          <ul className="space-y-4" aria-label="Loading feedback">
            {[0, 1].map((i) => (
              <li key={i} className="h-28 animate-pulse border border-charcoal/10 bg-charcoal/[0.03]" />
            ))}
          </ul>
        )}

        {!loading && error && (
          <div className="border border-charcoal/15 p-6" role="status">
            <p className="text-sm text-charcoal/70">Published feedback could not be loaded right now.</p>
            <button type="button" onClick={retry} className="btn-outline-dark mt-4 !px-5 !py-2.5">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && !configured && (
          <div className="border border-bronze/50 p-6" role="status">
            <p className="text-sm leading-relaxed text-charcoal/75">
              <strong className="font-semibold">Setup required:</strong> feedback storage is not connected yet, so
              published feedback cannot be displayed. Add the Supabase variables described in the README.
            </p>
          </div>
        )}

        {!loading && !error && configured && visible.length === 0 && (
          <div className="border border-charcoal/15 p-6" role="status">
            <p className="text-sm leading-relaxed text-charcoal/65">
              {items.length === 0
                ? "No published feedback yet. Be the first to share your experience using the form."
                : "No published feedback matches this rating filter."}
            </p>
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <ul className="max-h-[560px] space-y-4 overflow-y-auto pr-2">
            {visible.map((item) => (
              <li key={item.id} className="border border-charcoal/10 bg-ivory p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Stars rating={item.rating} size={14} label={`Rated ${item.rating} out of 5 stars`} />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-bronze">Website feedback</span>
                </div>
                <p className="mt-4 whitespace-pre-line font-serif text-lg leading-relaxed text-charcoal">
                  “{item.message}”
                </p>
                <p className="mt-4 text-xs text-charcoal/55">
                  <span className="font-medium text-charcoal/75">{item.displayName}</span>
                  {item.companyName ? `, ${item.companyName}` : ""} · {item.serviceUsed} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
