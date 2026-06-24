import { randomUUID } from "node:crypto";
import {
  getSupabaseConfigurationErrorMessage,
  getSupabaseError,
  getSupabaseServiceKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/server/supabase-rest";

const POSTER_BUCKET = "trip-posters";
const MAX_POSTER_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

let bucketEnsured = false;

/**
 * Upload a trip poster image to Supabase Storage and return its public URL.
 * Throws a user-facing (Mongolian) error if the file is invalid or storage
 * is not configured.
 */
export async function uploadTripPoster(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error(getSupabaseConfigurationErrorMessage());
  }

  if (file.size === 0) {
    throw new Error("Постер файл хоосон байна.");
  }

  if (file.size > MAX_POSTER_BYTES) {
    throw new Error("Постер зураг 8MB-аас бага байх ёстой.");
  }

  if (file.type && !ALLOWED_MIME.includes(file.type)) {
    throw new Error("Зөвхөн зураг (JPG, PNG, WEBP, AVIF, GIF) оруулна уу.");
  }

  await ensurePosterBucket();

  const supabaseUrl = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();
  const objectPath = `${randomUUID()}.${extensionFor(file)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${POSTER_BUCKET}/${objectPath}`,
    {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": file.type || "application/octet-stream",
        "cache-control": "31536000",
        "x-upsert": "true",
      },
      body: bytes,
    }
  );

  if (!response.ok) {
    throw new Error(await getSupabaseError(response));
  }

  return `${supabaseUrl}/storage/v1/object/public/${POSTER_BUCKET}/${objectPath}`;
}

async function ensurePosterBucket() {
  if (bucketEnsured) {
    return;
  }

  const supabaseUrl = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();

  const existing = await fetch(`${supabaseUrl}/storage/v1/bucket/${POSTER_BUCKET}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });

  if (existing.ok) {
    bucketEnsured = true;
    return;
  }

  const created = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: POSTER_BUCKET,
      name: POSTER_BUCKET,
      public: true,
      file_size_limit: MAX_POSTER_BYTES,
      allowed_mime_types: ALLOWED_MIME,
    }),
  });

  // 200 created, or 400 when the bucket already exists (race) — both are fine.
  if (created.ok || created.status === 400 || created.status === 409) {
    bucketEnsured = true;
    return;
  }

  throw new Error(await getSupabaseError(created));
}

function extensionFor(file: File) {
  const fromType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
  };

  if (file.type && fromType[file.type]) {
    return fromType[file.type];
  }

  const dot = file.name.lastIndexOf(".");
  const ext = dot >= 0 ? file.name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  return ext || "jpg";
}

export function isUploadedPoster(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}
