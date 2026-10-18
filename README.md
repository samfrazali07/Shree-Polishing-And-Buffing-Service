# Shree Polishing And Buffing Service — Website

Premium corporate website for **Shree Polishing And Buffing Service**, built with React, TypeScript, Vite, Tailwind CSS v4 and Framer Motion. Designed & developed by **Teksqud**.

- Luxury charcoal / ivory / champagne-gold design system (`src/index.css`)
- Cinematic hero with parallax, staggered headline and scroll indicator
- Services, hospitality proposal, masonry gallery, "Why Choose Us"
- Google Reviews (official Places API, 3–5 stars only) with loading / empty / error / setup states
- Client feedback form and business enquiry form with validation, honeypot spam protection and server-side validation
- Moderation console at `/admin` (approve / reject / hide feedback)
- Floating WhatsApp click-to-chat button, enquire shortcut and back-to-top button
- Privacy policy page at `/privacy`
- Reduced-motion support, semantic HTML, keyboard-accessible forms, LocalBusiness JSON-LD, Open Graph, `robots.txt`, `sitemap.xml`

---

## 1. Verification status (read this first)

The supplied Google Business Profile reference could not be read during build, and no public listing could be matched to this business. The following was therefore **not** invented and must be confirmed by the business owner:

| Item | Status | Where to set it |
|---|---|---|
| Business name | Supplied by client | `src/config/site.ts` |
| WhatsApp / phone `+91 97840 49840` | Supplied by client (used everywhere) | `src/config/site.ts` |
| Service list | Generic categories matching the company name. **Confirm against the Google listing.** Material-specific services (marble, granite, metal, etc.) were intentionally not added. | `SERVICES` in `src/data/content.ts` |
| Email address | Not verified — hidden until configured | `VITE_BUSINESS_EMAIL` |
| Street address | Not verified — shows "to be confirmed" | `VITE_BUSINESS_ADDRESS` |
| Opening hours | Not verified — shows "to be confirmed" | `VITE_BUSINESS_HOURS` |
| Google Maps link | Hidden until configured | `VITE_GOOGLE_MAPS_URL` |
| Google Reviews link | Shown once configured | `VITE_GOOGLE_REVIEWS_URL` (also auto-used from the API) |
| Google Place ID | **Required** for live reviews | `GOOGLE_PLACE_ID` (server) |
| Company photographs | Not obtained — temporary, replaceable AI-generated images are used | `public/images/` |
| Social links | None verified — none displayed | — |
| Years of experience, awards, hotel partnerships, certifications | Not claimed | — |

The **before/after slider** and **gallery category filters** are not implemented because no genuine, permitted, matching before/after pairs or enough categorised company photographs were available. See section 7 to add them later.

---

## 2. Getting started

```bash
npm install
npm run dev        # local development at http://localhost:5173
npm run build      # production build -> dist/index.html (single file)
```

Copy `.env.example` to `.env` and fill in the values you need. Without them the site still builds and runs; the sections that depend on a backend show clear setup messages rather than pretending to work.

---

## 3. Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `VITE_BUSINESS_EMAIL` | Public | Email shown in the contact section and footer |
| `VITE_BUSINESS_ADDRESS` | Public | Address shown in contact section and footer |
| `VITE_BUSINESS_HOURS` | Public | Opening hours |
| `VITE_GOOGLE_MAPS_URL` | Public | Google Maps listing link |
| `VITE_GOOGLE_REVIEWS_URL` | Public | "Read Reviews on Google" link (fallback if the API does not return one) |
| `GOOGLE_PLACES_API_KEY` | **Server secret** | Google Places API (New) key |
| `GOOGLE_PLACE_ID` | Server | Place ID of the verified Google Business Profile |
| `SUPABASE_URL` | Server | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server secret** | Supabase service role key (bypasses RLS — never expose it) |
| `ADMIN_TOKEN` | **Server secret** | Long random token used to sign in at `/admin` |

Only variables prefixed with `VITE_` are embedded into the frontend. Secrets are read only inside `/api` functions.

---

## 4. Google Reviews (Places API)

The reviews are fetched server-side by `api/reviews.ts` using the **Places API (New)**:

1. **Find the Place ID.** Use Google's [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) and search for the exact business name and address as listed on Google. Confirm it is the verified Business Profile. Put it in `GOOGLE_PLACE_ID`.
2. **Enable the API.** In Google Cloud Console, create a project, enable **Places API (New)**, add billing, and create an API key.
3. **Restrict the key.** Restrict it to *Places API (New)* only. Store it as `GOOGLE_PLACES_API_KEY` in your hosting provider's environment variables. Never put it in a `VITE_` variable.
4. **Redeploy.** The Reviews section will then load live data.

Display rules implemented:

- Only **3, 4 and 5 star** reviews are returned to the site. 1 and 2 star reviews are removed server-side and again client-side.
- Original review text, author display name, star rating and relative date are passed through unmodified. Nothing is rewritten or fabricated.
- A visible "Read Reviews on Google" link is provided.
- Responses are cached at the edge for one hour (`Cache-Control: s-maxage=3600`). Review it against Google's current caching terms; Google restricts how long review content may be stored.
- **Limitation:** Google's API returns only a small selection of reviews (currently up to five per request) and does not guarantee that every review on the listing will appear. The site says so.
- No scraping of Google Maps is performed.

States: loading skeleton, empty state, error state with retry, and an explicit "Setup required" notice when keys are missing.

---

## 5. Feedback and enquiry storage (Supabase)

1. Create a Supabase project.
2. In the SQL editor, run:

```sql
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  company_name text,
  service_used text not null,
  rating smallint not null check (rating between 1 and 5),
  message text not null,
  consent_storage boolean not null default true,
  permission_to_publish boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','hidden')),
  created_at timestamptz not null default now(),
  moderated_at timestamptz
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  contact_person text not null,
  company_name text not null,
  business_email text not null,
  phone text not null,
  service_type text not null,
  project_location text not null,
  project_size text,
  site_visit_date date,
  project_details text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Keep both tables private. The server uses the service role key, which bypasses RLS.
alter table public.feedback enable row level security;
alter table public.enquiries enable row level security;
```

3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your environment variables.

Without these variables, the forms **do not pretend to save**. They display a clear "Setup required" message and suggest WhatsApp instead.

Spam and privacy measures:
- Honeypot field (hidden from people, rejected silently for bots).
- Full server-side validation with the same rules used in the browser (`src/lib/validation.ts`).
- Duplicate detection: an identical email + message within 10 minutes is not stored twice.
- Double-submit prevention on the client.
- Consent is required for storage; public display requires a separate, optional permission checkbox.
- Public feedback shows only first name and last initial. Email addresses are never exposed publicly.

Recommended addition for production: Cloudflare Turnstile or hCaptcha on both forms, and rate limiting at the hosting layer.

---

## 6. Moderation (`/admin`)

- Open `/admin`, enter `ADMIN_TOKEN`, and choose **Approve**, **Hide**, **Reject** or **Reset to pending**.
- Feedback appears on the website only when it is **approved** *and* the reviewer granted publish permission.
- Website feedback is filtered by rating separately from Google reviews, and is always labelled "Website feedback — not a Google review".
- Enquiries are viewed in the Supabase table editor for now.

If you deploy the site as a static bundle without the `/api` functions, `/admin` cannot reach the API.

---

## 7. Deployment

The project builds to a single self-contained `dist/index.html`. The `/api` folder contains Vercel-compatible Node.js serverless functions.

**Vercel (recommended)**

1. Import the repository. Build command: `npm run build`. Output directory: `dist`.
2. Add all server variables from section 3 under *Project → Settings → Environment Variables*.
3. Add a `vercel.json` in the project root so that the `/admin` and `/privacy` routes load the app:

```json
{
  "rewrites": [{ "source": "/(admin|privacy)", "destination": "/index.html" }]
}
```

4. Redeploy after changing any environment variable.

**Other hosts:** `/api/*` requires a Node.js-compatible serverless runtime. Adapt `api/*.ts` if you use Netlify or Cloudflare (the request/response helpers are in `server/lib/http.ts`).

**After deploying**, update the domain in:
- `index.html` (canonical, Open Graph URLs, and `og:image`)
- `public/sitemap.xml`
- `public/robots.txt`

---

## 8. Replacing the images

Temporary images live in `public/images/`:

| File | Used in |
|---|---|
| `hero.jpg` | Hero background (also the Open Graph image) |
| `about.jpg` | About section and gallery |
| `service-surface.jpg` | Service card and gallery |
| `service-restoration.jpg` | Service card and gallery (comparison) |
| `service-commercial.jpg` | Service card |
| `service-specialised.jpg` | Service card |
| `hospitality.jpg` | Hospitality section and gallery |
| `gallery-equipment.jpg`, `gallery-detail.jpg` | Gallery |

To replace an image:

1. Only use photographs the business owns, or has written permission to use. Do not hotlink Google search thumbnails.
2. Export at about **1600px** on the long edge, around 200–400 KB, as JPG or WebP (compress with Squoosh or similar).
3. Save it with the **same filename** in `public/images/`, or update the path in `src/data/content.ts` / the component.
4. Update the descriptive `alt` text in `src/data/content.ts` (or the component) to describe the real photo.
5. Update the gallery captions in `GALLERY` to match.

Recommended before/after workflow: use the same camera position and lighting for the "before" and "after" shots, store them as a pair, and then add a comparison slider component.

---

## 9. Editing content

- **Services:** `SERVICES` in `src/data/content.ts`. Keep only services confirmed on the Google listing.
- **Hospitality benefits / Why choose us:** `HOSPITALITY_BENEFITS` and `WHY_POINTS` in `src/data/content.ts`.
- **Business details and navigation:** `src/config/site.ts`.
- **WhatsApp message:** `WHATSAPP_MESSAGE` in `src/config/site.ts`. The link is built with `encodeURIComponent`, so the final URL is `https://wa.me/919784049840?text=…`.
- **Privacy policy:** `src/components/pages/PrivacyPage.tsx`. Have it reviewed by a qualified professional before publishing.

---

## 10. Project structure

```
api/                       Serverless functions (reviews, feedback, enquiry, admin)
server/lib/                Shared server helpers (HTTP utilities, Supabase client)
src/
  config/site.ts           Business details, WhatsApp link, navigation
  data/content.ts          Services, gallery, benefit copy
  lib/validation.ts        Shared validation (client and server)
  lib/api.ts               Typed fetch helpers
  lib/events.ts            "Enquire about this service" pre-fill event
  hooks/                   Scroll and visibility hooks
  components/
    layout/                Navbar, Footer, FloatingActions (WhatsApp, back-to-top)
    sections/              Hero, About, Services, Hospitality, Gallery, WhyChooseUs,
                           GoogleReviews, ClientFeedback, Feedback, Contact
    forms/                 FeedbackForm, EnquiryForm, Field
    ui/                    Logo, Icons, Reveal, RevealImage, SectionHeading, Stars
    admin/AdminPanel.tsx   Moderation console (/admin)
    pages/PrivacyPage.tsx  Privacy policy (/privacy)
public/                    Images, robots.txt, sitemap.xml
```

---

## 11. Accessibility, performance and SEO

- Semantic landmarks (`header`, `main`, `section[aria-labelledby]`, `footer`), skip link, visible focus rings.
- Forms use labels, `aria-invalid`, `aria-describedby`, inline error messages and focus management on error.
- Motion respects `prefers-reduced-motion` (Framer Motion `MotionConfig reducedMotion="user"` plus a CSS fallback).
- Images are lazy-loaded with explicit `sizes`, and the hero image is prioritised.
- Floating buttons hide while a form submit button is on screen, so they never cover form controls.
- LocalBusiness JSON-LD includes only verified information (name and phone). Add address, hours and URL to the JSON-LD in `index.html` once verified.

SEO search terms should match the real services. Do not promise search rankings.

---

## 12. Quality checklist before launch

- [ ] Confirm services, address, email, hours and Place ID against the verified Google Business Profile.
- [ ] Replace placeholder images with permitted company photographs and update alt text.
- [ ] Set all environment variables, then test the Reviews section, both forms, `/admin` and `/privacy`.
- [ ] Update canonical, Open Graph, sitemap and robots URLs to the production domain.
- [ ] Review the privacy policy with a qualified professional.
- [ ] Test on mobile, tablet and desktop, with keyboard only, and with reduced motion enabled.
