/**
 * Centralised SEO configuration. The production URL is resolved from the
 * environment so it stays correct across local dev, Vercel previews and
 * production — no hard-coded domain.
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL   (set this to your real domain, e.g. https://mobilityone.in)
 *   2. VERCEL_PROJECT_PRODUCTION_URL  (Vercel's stable production domain)
 *   3. VERCEL_URL             (per-deployment preview URL)
 *   4. http://localhost:3000  (local dev fallback)
 */
function normalize(url: string): string {
  const withProtocol = /^https?:\/\//.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, "");
}

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return normalize(explicit);
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return normalize(prod);
  const preview = process.env.VERCEL_URL;
  if (preview) return normalize(preview);
  return "http://localhost:3000";
}

/** Static business facts used by metadata and JSON-LD structured data. */
export const business = {
  name: "MobilityOne",
  legalName: "MobilityOne — Prosthetics & Orthotics",
  description:
    "MobilityOne provides prosthetic limbs, orthotic braces and personalised mobility solutions with consultation-led fitting in Gurugram, Haryana.",
  phone: "+91 78381 07505",
  whatsapp: "917838107505",
  email: "sikandarsingh175@gmail.com",
  streetAddress: "H. No. 501, Gali No-4/1A, Ganpati Nagar, Ghari Harsaru",
  addressLocality: "Gurugram",
  addressRegion: "Haryana",
  addressCountry: "IN",
  logo: "/favicon.svg",
  ogImage: "/assets/products/category-lower-limb.webp",
} as const;
