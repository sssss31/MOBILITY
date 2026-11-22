import type { MetadataRoute } from "next";
import { defaultProducts } from "@/lib/default-data";
export default function sitemap():MetadataRoute.Sitemap{const base="https://mobilityone-medical-marketplace.bronzyfinch3.chatgpt.site",routes=["","products","categories","about","consultation","contact","faqs","blog","privacy-policy","terms","shipping-returns",...defaultProducts.map(p=>`products/${p[0]}`)];return routes.map(route=>({url:`${base}/${route}${route?"/":""}`,changeFrequency:route.startsWith("products")?"weekly":"monthly",priority:route===""?1:route.startsWith("products")?.8:.6}))}
