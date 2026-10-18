/**
 * Central business configuration — verified details only.
 *
 * VERIFIED:
 *  - Business name: Shree Polishing And Buffing Service
 *  - WhatsApp / phone: +91 97840 49840
 *  - Address: E 329, Jhilaya House Gali, No. 1, Old Amer Road, Jaipur, Rajasthan 302002
 *  - Hours: Open 24 hours, every day (listing may vary on special occasions)
 *
 * OPTIONAL (set in .env when confirmed):
 *  - VITE_BUSINESS_EMAIL
 *  - VITE_GOOGLE_REVIEWS_URL
 */

const env = import.meta.env;
const read = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export const BUSINESS = {
  name: "Shree Polishing And Buffing Service",
  shortName: "Shree Polishing",
  tagline: "Bringing the Brilliance Back to Brass & Copper.",
  phoneDisplay: "+91 97840 49840",
  phoneHref: "+919784049840",
  whatsappNumber: "919784049840",
  email: read(env.VITE_BUSINESS_EMAIL),
  address:
    read(env.VITE_BUSINESS_ADDRESS) ||
    "E 329, Jhilaya House Gali, No. 1, Old Amer Road, Jaipur, Rajasthan 302002, India",
  mapsUrl:
    read(env.VITE_GOOGLE_MAPS_URL) ||
    "https://www.google.com/maps/search/?api=1&query=E%20329%20Jhilaya%20House%20Gali%20No.%201%20Old%20Amer%20Rd%20Jaipur%20Rajasthan%20302002",
  googleReviewsUrl: read(env.VITE_GOOGLE_REVIEWS_URL),
  /** Single-line summary for compact UI. Full table lives in OPENING_HOURS. */
  hours: read(env.VITE_BUSINESS_HOURS) || "Open 24 hours, every day",
} as const;

/** Weekly hours — update in one place only. */
export const OPENING_HOURS = [
  { day: "Sunday", hours: "Open 24 hours" },
  { day: "Monday", hours: "Open 24 hours" },
  { day: "Tuesday", hours: "Open 24 hours" },
  { day: "Wednesday", hours: "Open 24 hours" },
  { day: "Thursday", hours: "Open 24 hours" },
  { day: "Friday", hours: "Open 24 hours" },
  { day: "Saturday", hours: "Open 24 hours" },
] as const;

export const HOURS_NOTE =
  "Business hours may vary on special occasions. Please contact us to confirm availability.";

export const WHATSAPP_MESSAGE =
  "Hello Shree Polishing And Buffing Service, I would like to enquire about your brass and copper utensil polishing services. Please share your service details and quotation.";

export const WHATSAPP_HOTEL_MESSAGE =
  "Hello Shree Polishing And Buffing Service, we represent a hotel and would like to discuss bulk brass and copper utensil polishing requirements. Please contact us with more details.";

export const WHATSAPP_URL = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const WHATSAPP_HOTEL_URL = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(WHATSAPP_HOTEL_MESSAGE)}`;

export const NAV_LINKS = [
  { href: "#about", label: "About Us" },
  { href: "#services", label: "Our Services" },
  { href: "#gallery", label: "Our Work" },
  { href: "#hospitality", label: "Hospitality Solutions" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact Us" },
] as const;
