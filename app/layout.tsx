import type { Metadata } from "next";
import "./globals.css";
import "./site.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mobilityone-medical-marketplace.bronzyfinch3.chatgpt.site"),
  title: { default: "MobilityOne | Prosthetics & Orthotics in Gurugram", template: "%s | MobilityOne" },
  description: "Explore prosthetic limbs, orthotic braces and personalised mobility solutions at MobilityOne in Gurugram.",
  openGraph: { title: "MobilityOne", description: "Prosthetic, orthotic and personalised mobility solutions.", type: "website", images: ["/assets/products/category-lower-limb.webp"] },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
