import { StarIcon } from "./Icons";

interface StarsProps {
  rating: number;
  size?: number;
  label?: string;
}

/** Accessible 5-star display. Filled stars use the champagne accent. */
export default function Stars({ rating, size = 16, label }: StarsProps) {
  const filled = Math.round(rating);

  return (
    <span role="img" aria-label={label ?? `Rated ${rating} out of 5 stars`} className="inline-flex gap-0.5 text-champagne">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon
          key={n}
          size={size}
          className={n <= filled ? "fill-current" : "text-champagne/30"}
        />
      ))}
    </span>
  );
}
