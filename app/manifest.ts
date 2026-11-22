import type { MetadataRoute } from "next";
import { business } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${business.name} | Prosthetics & Orthotics`,
    short_name: business.name,
    description: business.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
