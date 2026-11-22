import Script from "next/script";

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * The public site is rendered by /public/app.js, which takes over the #app
 * container. We render a lightweight skeleton on the server (good for first
 * paint and crawlers) but hand #app to React as an opaque, uncontrolled node
 * via dangerouslySetInnerHTML + suppressHydrationWarning, so React never
 * regenerates it and fights app.js's DOM. app.js is loaded afterInteractive
 * so it runs once, after hydration — eliminating the render race.
 */
export function SiteShell({ title, description }: { title: string; description: string }) {
  const skeleton = `<main id="main" class="page-hero"><div class="container"><span class="eyebrow">MobilityOne</span><h1>${esc(title)}</h1><p class="lead">${esc(description)}</p></div></main>`;
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div id="app" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: skeleton }} />
      <div id="toast" className="toast" role="status" aria-live="polite" />
      <Script src="/app.js" strategy="afterInteractive" />
    </>
  );
}
