import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./site.css";
import { business, siteUrl } from "@/lib/seo";

const base = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: "MobilityOne | Prosthetics & Orthotics in Gurugram",
    template: "%s | MobilityOne",
  },
  description: business.description,
  applicationName: business.name,
  keywords: [
    "prosthetics Gurugram",
    "orthotics Gurugram",
    "prosthetic limbs",
    "orthotic braces",
    "mobility solutions",
    "artificial limb fitting",
    "silicone prosthetics",
    "foot orthotics",
    "MobilityOne",
  ],
  authors: [{ name: business.name }],
  creator: business.name,
  publisher: business.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: business.name,
    locale: "en_IN",
    url: base,
    title: "MobilityOne | Prosthetics & Orthotics in Gurugram",
    description: business.description,
    images: [{ url: business.ogImage, width: 1200, height: 630, alt: "MobilityOne prosthetic and orthotic solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MobilityOne | Prosthetics & Orthotics in Gurugram",
    description: business.description,
    images: [business.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.svg" },
  category: "health",
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalBusiness",
      "@id": `${base}/#business`,
      name: business.name,
      legalName: business.legalName,
      description: business.description,
      url: base,
      telephone: business.phone,
      email: business.email,
      image: `${base}${business.ogImage}`,
      logo: `${base}${business.logo}`,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: business.streetAddress,
        addressLocality: business.addressLocality,
        addressRegion: business.addressRegion,
        addressCountry: business.addressCountry,
      },
      areaServed: { "@type": "City", name: "Gurugram" },
    },
    {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      name: business.name,
      url: base,
      publisher: { "@id": `${base}/#business` },
      inLanguage: "en-IN",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
