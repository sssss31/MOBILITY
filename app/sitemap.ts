import type { MetadataRoute } from "next";
import { defaultProducts } from "@/lib/default-data";
import { database } from "@/lib/server-data";
import { siteUrl } from "@/lib/seo";

// Generated per-request so the sitemap reflects live published products
// and never calls the database during `next build`.
export const dynamic = "force-dynamic";

const STATIC_PAGES = [
  "",
  "products",
  "categories",
  "about",
  "consultation",
  "contact",
  "faqs",
  "blog",
  "privacy-policy",
  "terms",
  "shipping-returns",
];

/** Live published product slugs, falling back to the seeded defaults. */
async function productSlugs(): Promise<string[]> {
  try {
    const result = await database()
      .prepare("SELECT slug FROM products WHERE published = 1 ORDER BY display_order")
      .all<{ slug: string }>();
    const slugs = (result.results ?? []).map((r) => r.slug).filter(Boolean);
    if (slugs.length) return slugs;
  } catch {
    // DB unavailable (e.g. during build without env) — fall back to defaults.
  }
  return defaultProducts.map((p) => p[0]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const slugs = await productSlugs();

  const pages: MetadataRoute.Sitemap = STATIC_PAGES.map((route) => ({
    url: `${base}/${route}${route ? "/" : ""}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));

  const products: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/products/${slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...pages, ...products];
}
