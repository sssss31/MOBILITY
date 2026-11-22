import { del, put } from "@vercel/blob";
import { audit, clean, database, handleError, HttpError, json, makeId, now, requireAdmin } from "@/lib/server-data";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);

function assertStorageConfigured() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new HttpError(503, "Media storage is not configured");
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    assertStorageConfigured();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new HttpError(400, "Image file is required");
    if (!allowed.has(file.type)) throw new HttpError(400, "Only JPG, PNG, WebP and SVG are supported");
    if (file.size > 5_000_000) throw new HttpError(400, "Images must be 5 MB or smaller");
    const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
    const key = `media/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safe}`;
    const blob = await put(key, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
      cacheControlMaxAge: 31536000,
    });
    const id = makeId("media");
    const alt = clean(form.get("altText"), 300);
    await database()
      .prepare(
        "INSERT INTO media_assets (id,key,url,filename,content_type,size,alt_text,uploaded_by,created_at) VALUES (?,?,?,?,?,?,?,?,?)"
      )
      .bind(id, blob.pathname, blob.url, file.name, file.type, file.size, alt, admin.userId, now())
      .run();
    await audit(admin, "upload", "media", id, { key: blob.pathname, size: file.size });
    return json({ ok: true, id, key: blob.pathname, url: blob.url }, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin(request);
    assertStorageConfigured();
    const id = new URL(request.url).searchParams.get("id") || "";
    const row = await database()
      .prepare("SELECT key,url FROM media_assets WHERE id=?")
      .bind(id)
      .first<{ key: string; url: string }>();
    if (!row) throw new HttpError(404, "Media item not found");
    try {
      await del(row.url);
    } catch {
      // Blob may already be gone; still remove the DB row below.
    }
    await database().prepare("DELETE FROM media_assets WHERE id=?").bind(id).run();
    await audit(admin, "delete", "media", id, { key: row.key });
    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
