import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "./db";
import { auditLog, media, pages, siteSettings } from "./db/schema";

/**
 * Uploaded files live in a folder on the server (aaPanel deployment; no object storage). The folder
 * must survive deploys: point MEDIA_DIR at a path outside the app directory (or a Docker volume).
 */
// The folder lives outside the build: file access below is marked turbopackIgnore so the standalone
// output does not trace (and copy) the whole project.
export const MEDIA_DIR = path.resolve(
  /* turbopackIgnore: true */ process.env.MEDIA_DIR || path.join(/* turbopackIgnore: true */ process.cwd(), "storage", "media"),
);
export const MEDIA_URL_PREFIX = "/media/";
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

// SVG is left out on purpose: it can carry scripts and would need sanitising.
export const MEDIA_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};
const EXT_BY_TYPE: Record<string, string> = Object.fromEntries(Object.entries(MEDIA_TYPES).map(([e, t]) => [t, e]));

export class MediaTypeError extends Error {}
export class MediaSizeError extends Error {}

export const mediaUrl = (key: string) => MEDIA_URL_PREFIX + key;

/** Reads width and height from the file header (PNG, JPEG, GIF, WebP); null when unknown. */
export function imageSize(buf: Buffer): { width: number; height: number } | null {
  if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (buf.length >= 10 && buf.toString("ascii", 0, 3) === "GIF") return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  if (buf.length >= 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  }
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      // Start-of-frame markers carry the size (C0–CF except C4, C8, CC).
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  }
  return null;
}

/** Checks the real file signature, not just the declared type. */
function sniff(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf.readUInt32BE(0) === 0x89504e47) return "image/png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.toString("ascii", 0, 3) === "GIF") return "image/gif";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (buf.toString("ascii", 4, 12) === "ftypavif") return "image/avif";
  return null;
}

export async function saveUpload(file: File, altText: string, actorId: string) {
  if (file.size > MAX_UPLOAD_BYTES) throw new MediaSizeError();
  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniff(buf);
  if (!type || !EXT_BY_TYPE[type]) throw new MediaTypeError();
  const now = new Date();
  const key = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${EXT_BY_TYPE[type]}`;
  const target = path.join(/* turbopackIgnore: true */ MEDIA_DIR, key);
  await mkdir(/* turbopackIgnore: true */ path.dirname(target), { recursive: true });
  await writeFile(/* turbopackIgnore: true */ target, buf, { flag: "wx" });
  const size = imageSize(buf);
  try {
    const [row] = await db
      .insert(media)
      .values({ key, altText: altText.trim().slice(0, 300) || null, width: size?.width, height: size?.height, size: buf.length, uploadedById: actorId })
      .returning({ id: media.id });
    await db.insert(auditLog).values({ userId: actorId, action: "upload_media", targetType: "media", targetId: row.id, after: { key, name: file.name } });
    return { id: row.id, key };
  } catch (error) {
    await rm(/* turbopackIgnore: true */ target, { force: true });
    throw error;
  }
}

/** Resolves a public key to a file inside MEDIA_DIR; anything that escapes the folder is rejected. */
export async function readMediaFile(key: string) {
  if (!/^\d{4}\/\d{2}\/[0-9a-f-]{36}\.(png|jpg|webp|gif|avif)$/.test(key)) return null;
  const file = path.join(/* turbopackIgnore: true */ MEDIA_DIR, key);
  if (!file.startsWith(MEDIA_DIR + path.sep)) return null;
  try {
    const [data, info] = await Promise.all([readFile(/* turbopackIgnore: true */ file), stat(/* turbopackIgnore: true */ file)]);
    return { data, type: MEDIA_TYPES[key.split(".").pop()!], modified: info.mtime };
  } catch {
    return null;
  }
}

/* ---------------- Admin (the caller checks authorization) ---------------- */

export async function listMedia({ search, page = 0, pageSize = 60 }: { search?: string; page?: number; pageSize?: number }) {
  const where = search ? or(ilike(media.altText, `%${search}%`), ilike(media.key, `%${search}%`)) : undefined;
  const [rows, [total]] = await Promise.all([
    db.select().from(media).where(where).orderBy(desc(media.createdAt)).limit(pageSize).offset(page * pageSize),
    db.select({ n: count() }).from(media).where(where),
  ]);
  return { rows, total: total.n };
}

/** Where each file is referenced: page drafts and published versions, and site settings. */
export async function mediaUsage(keys: string[]) {
  const usage: Record<string, string[]> = Object.fromEntries(keys.map((k) => [k, []]));
  if (!keys.length) return usage;
  const [pageRows, settings] = await Promise.all([
    db
      .select({ title: pages.title, locale: pages.locale, text: sql<string>`${pages.draftBlocks}::text || coalesce(${pages.publishedBlocks}::text, '')` })
      .from(pages),
    db.select({ text: sql<string>`${siteSettings.settings}::text || ${siteSettings.translations}::text` }).from(siteSettings),
  ]);
  for (const k of keys) {
    for (const p of pageRows) if (p.text.includes(k)) usage[k].push(`${p.title} (${p.locale.toUpperCase()})`);
    if (settings.some((s) => s.text.includes(k))) usage[k].push("Site ayarları");
  }
  return usage;
}

export async function updateAltText(id: string, altText: string, actorId: string) {
  await db.update(media).set({ altText: altText.trim().slice(0, 300) || null }).where(eq(media.id, id));
  await db.insert(auditLog).values({ userId: actorId, action: "update_media", targetType: "media", targetId: id });
}

export async function deleteMedia(ids: string[], actorId: string) {
  const rows = await db.delete(media).where(inArray(media.id, ids)).returning({ id: media.id, key: media.key });
  await Promise.all(rows.map((r) => rm(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ MEDIA_DIR, r.key), { force: true })));
  if (rows.length)
    await db.insert(auditLog).values(rows.map((r) => ({ userId: actorId, action: "delete_media", targetType: "media", targetId: r.id, before: { key: r.key } })));
  return rows.length;
}

export async function mediaKeys(ids: string[]) {
  return (await db.select({ key: media.key }).from(media).where(inArray(media.id, ids))).map((r) => r.key);
}

export async function getMediaKey(id: string) {
  const [r] = await db.select({ key: media.key }).from(media).where(and(eq(media.id, id)));
  return r?.key ?? null;
}
