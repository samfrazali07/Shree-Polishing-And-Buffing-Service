import type { ApiHandler } from "../server/lib/http";

/**
 * GET /api/reviews
 *
 * Retrieves the business's reviews from the official Google Places API (New).
 * - Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID as server-side environment variables.
 * - Returns only 3, 4 and 5 star reviews. 1 and 2 star reviews are removed here.
 * - Review text, author name, rating and relative date are passed through unchanged.
 *
 * Google limits which reviews the API returns (a small selection), so not every review
 * on the Google listing will appear. Keep caching within Google's current API terms.
 */

interface GooglePlaceReview {
  name?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  googleMapsUri?: string;
}

interface GooglePlaceResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: GooglePlaceReview[];
}

const FIELD_MASK = ["rating", "userRatingCount", "googleMapsUri", "reviews"].join(",");

const handler: ApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ status: "error", error: "Method not allowed." });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();

  if (!apiKey || !placeId) {
    return res.status(200).json({
      status: "not_configured",
      reviews: [],
      message: "Google Places API key or Place ID is not configured.",
    });
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return res.status(502).json({
        status: "error",
        reviews: [],
        error: "Google reviews are temporarily unavailable.",
      });
    }

    const data = (await response.json()) as GooglePlaceResponse;

    const reviews = (data.reviews ?? [])
      .filter((r) => typeof r.rating === "number" && r.rating >= 3 && r.rating <= 5)
      .map((r, index) => ({
        id: r.name ?? `review-${index}`,
        author: r.authorAttribution?.displayName ?? "Google user",
        authorUrl: r.authorAttribution?.uri ?? null,
        rating: r.rating as number,
        // Keep the original-language text when Google provides it.
        text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
        relativeTime: r.relativePublishTimeDescription ?? "",
        reviewUrl: r.googleMapsUri ?? data.googleMapsUri ?? null,
      }));

    // Reviews are cached briefly at the edge to limit API calls. Adjust per Google's current caching terms.
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

    return res.status(200).json({
      status: reviews.length > 0 ? "ok" : "empty",
      summary: {
        rating: data.rating ?? null,
        userRatingCount: data.userRatingCount ?? null,
        googleMapsUri: data.googleMapsUri ?? null,
      },
      reviews,
    });
  } catch {
    return res.status(502).json({
      status: "error",
      reviews: [],
      error: "Google reviews are temporarily unavailable.",
    });
  }
};

export default handler;
