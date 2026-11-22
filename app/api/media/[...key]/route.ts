import { database } from "@/lib/server-data";

// Media now lives in Vercel Blob (public CDN URLs are stored in media_assets.url).
// This route keeps legacy `/api/media/<key>` links working by redirecting to the
// stored Blob URL.
export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const pathname = key.join("/");
  try {
    const row = await database()
      .prepare("SELECT url FROM media_assets WHERE key=?")
      .bind(pathname)
      .first<{ url: string }>();
    if (!row?.url) return new Response("Not found", { status: 404 });
    return Response.redirect(row.url, 308);
  } catch {
    return new Response("Media unavailable", { status: 503 });
  }
}
