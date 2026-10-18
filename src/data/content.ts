/**
 * Website copy and media references.
 * Gallery and service images use photographs supplied for this project
 * under public/images/.
 */

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  /** Value pre-selected in the enquiry form when "Request a Quote" is clicked. */
  formValue: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "brass-polishing",
    title: "Brass Utensil Polishing",
    description:
      "Professional polishing and buffing of brass utensils to improve their shine and appearance.",
    image: "/images/brass-thali.png",
    alt: "Highly polished brass thali set with bowls and cutlery",
    formValue: "Brass Utensil Polishing",
  },
  {
    id: "copper-polishing",
    title: "Copper Utensil Polishing",
    description:
      "Careful finishing of copper vessels and utensils to restore their visual appeal.",
    image: "/images/brass-copper-cookware.png",
    alt: "Polished copper and brass cookware jars and saucepan",
    formValue: "Copper Utensil Polishing",
  },
  {
    id: "tarnish-removal",
    title: "Tarnish and Oxidation Removal",
    description:
      "Cleaning and treatment of darkened or tarnished metal surfaces using appropriate methods.",
    image: "/images/before-after-vessel.png",
    alt: "Before and after of a tarnished brass vessel restored to a bright finish",
    formValue: "Tarnish and Oxidation Removal",
  },
  {
    id: "metalware-restoration",
    title: "Metalware Restoration",
    description:
      "Improving the appearance of suitable older utensils and metal objects through polishing and finishing.",
    image: "/images/brass-kadhai.png",
    alt: "Mirror-polished brass kadhai with lid in a dining setting",
    formValue: "Metalware Restoration",
  },
  {
    id: "bulk-polishing",
    title: "Bulk Utensil Polishing",
    description:
      "A service enquiry option for hotels, restaurants, utensil dealers, manufacturers, and commercial customers.",
    image: "/images/utensil-collage.png",
    alt: "Collection of polished brass thali, vessels, spice box and copper pots",
    formValue: "Bulk Utensil Polishing",
  },
  {
    id: "decorative-items",
    title: "Decorative Brass and Copper Items",
    description:
      "Polishing suitable decorative objects such as candle stands, jars, and other metalware.",
    image: "/images/decorative-flutes.png",
    alt: "Polished silver and gold-toned decorative metal flutes",
    formValue: "Decorative Brass and Copper Items",
  },
];

export const SERVICE_FORM_OPTIONS = [...SERVICES.map((s) => s.formValue), "Other / Not Sure"];

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  category: "brass" | "copper" | "decorative" | "process";
  ratio: "portrait" | "square" | "landscape";
}

export const GALLERY: GalleryItem[] = [
  {
    src: "/images/hero-pitcher.png",
    alt: "Polished brass and glass pitcher on a luxury dining table",
    caption: "Decorative brass pitcher",
    category: "decorative",
    ratio: "portrait",
  },
  {
    src: "/images/brass-copper-cookware.png",
    alt: "Hammered brass and copper jars with polished copper saucepan",
    caption: "Brass & copper cookware",
    category: "copper",
    ratio: "landscape",
  },
  {
    src: "/images/brass-kadhai.png",
    alt: "Polished brass kadhai with lid beside a flower vase",
    caption: "Brass kadhai",
    category: "brass",
    ratio: "square",
  },
  {
    src: "/images/brass-thali.png",
    alt: "Complete polished brass thali dining set with bowls and cutlery",
    caption: "Brass thali set",
    category: "brass",
    ratio: "square",
  },
  {
    src: "/images/decorative-flutes.png",
    alt: "Pair of polished two-tone metal flutes on red velvet",
    caption: "Decorative metalware",
    category: "decorative",
    ratio: "portrait",
  },
  {
    src: "/images/brass-deities.png",
    alt: "Collection of polished brass Dashavatara statues",
    caption: "Decorative brass figurines",
    category: "decorative",
    ratio: "landscape",
  },
  {
    src: "/images/utensil-collage.png",
    alt: "Polished brass thali, storage vessels, spice box and copper pots",
    caption: "Traditional utensils",
    category: "brass",
    ratio: "landscape",
  },
];

export interface BeforeAfterItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

/** Genuine before-and-after comparison photographs (already labelled in-image). */
export const BEFORE_AFTER: BeforeAfterItem[] = [
  {
    id: "candleholders",
    src: "/images/before-after-candleholders.png",
    alt: "Before and after polishing of two metal candle holders — dull tarnish versus bright brass shine",
    caption: "Candle holders restored to a reflective brass finish",
  },
  {
    id: "vessel",
    src: "/images/before-after-vessel.png",
    alt: "Before and after polishing of a traditional metal vessel — oxidised surface versus mirror brass finish",
    caption: "Traditional vessel brought back to brilliance",
  },
];

export const HOSPITALITY_APPLICATIONS = [
  "Hotel restaurants",
  "Luxury dining environments",
  "Banquet facilities",
  "Hospitality display areas",
  "Traditional serving vessels",
  "Decorative metalware",
];

export const HOSPITALITY_BENEFITS = [
  {
    title: "Professional Polishing & Finishing",
    text: "Careful buffing and finishing that restores shine and presentation to suitable brass and copper items.",
  },
  {
    title: "Attention to Detail",
    text: "Each piece is assessed for condition so the finishing approach matches the metalware.",
  },
  {
    title: "Bulk Quantity Enquiries",
    text: "Hotels, restaurants and commercial buyers can enquire about larger polishing requirements.",
  },
  {
    title: "Project-Specific Quotations",
    text: "Quotations are prepared after discussing metalware type, quantity and required finish.",
  },
  {
    title: "Requirements Discussed in Advance",
    text: "Service scope, timing and expectations are clarified before work begins.",
  },
  {
    title: "Focus on Presentation",
    text: "Finished metalware that supports the visual standard expected in hospitality settings.",
  },
];

export const WHY_POINTS = [
  {
    icon: "target" as const,
    title: "Attention to Detail",
    text: "Each utensil is reviewed so polishing is suited to its condition and material.",
  },
  {
    icon: "layers" as const,
    title: "Metal-Specific Finishing",
    text: "Focused on brass and copper utensils and related metalware — not a generic cleaning service.",
  },
  {
    icon: "wrench" as const,
    title: "Careful Polishing Process",
    text: "Controlled buffing and finishing aimed at restoring shine without unnecessary claims.",
  },
  {
    icon: "building" as const,
    title: "Commercial Enquiries Welcome",
    text: "Hotels, restaurants, dealers and manufacturers can discuss bulk polishing needs.",
  },
  {
    icon: "shield" as const,
    title: "Individual and Bulk Requirements",
    text: "Enquiries are welcomed for single pieces or larger quantities of suitable items.",
  },
  {
    icon: "message" as const,
    title: "Focus on Presentation and Quality",
    text: "The goal is a cleaner, brighter finish that supports how your metalware is presented.",
  },
];
