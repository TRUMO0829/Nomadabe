import { randomUUID } from "node:crypto";
import {
  getSupabaseAnonKey,
  getSupabaseConfigurationErrorMessage,
  getSupabaseError,
  getSupabaseServiceKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/server/supabase-rest";

const POSTER_BUCKET = "trip-posters";
const HERO_VIDEO_BUCKET = "hero-videos";
const REVIEW_IMAGE_BUCKET = "review-images";
const MAX_POSTER_BYTES = 8 * 1024 * 1024; // 8 MB
const MAX_HERO_VIDEO_BYTES = 120 * 1024 * 1024; // 120 MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const ALLOWED_VIDEO_MIME = ["video/mp4", "video/webm", "video/quicktime"];
const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

const IMAGE_UPLOAD = {
  bucket: POSTER_BUCKET,
  maxBytes: MAX_POSTER_BYTES,
  allowedMimeTypes: ALLOWED_MIME,
  tooLarge: "Зураг 8MB-аас бага байх ёстой.",
  wrongType: "Зөвхөн зураг (JPG, PNG, WEBP, AVIF, GIF) оруулна уу.",
} as const;

// Every admin upload goes browser -> Storage through one of these kinds. The
// image kinds share the public trip-posters bucket; the kind only decides the
// size/type limits, so adding a kind never needs a new bucket.
const SIGNED_UPLOAD_KINDS = {
  "hero-video": {
    bucket: HERO_VIDEO_BUCKET,
    maxBytes: MAX_HERO_VIDEO_BYTES,
    allowedMimeTypes: ALLOWED_VIDEO_MIME,
    tooLarge: "Нүүр хуудасны бичлэг 120MB-аас бага байх ёстой.",
    wrongType: "Зөвхөн MP4, WEBM эсвэл MOV бичлэг оруулна уу.",
  },
  "outbound-image": IMAGE_UPLOAD,
  "trip-image": IMAGE_UPLOAD,
  "team-image": IMAGE_UPLOAD,
} as const;

export type SignedUploadKind = keyof typeof SIGNED_UPLOAD_KINDS;

let posterBucketEnsured = false;
let heroVideoBucketEnsured = false;
let reviewImageBucketEnsured = false;

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

  await ensureStorageBucket({
    allowedMimeTypes: ALLOWED_MIME,
    bucket: POSTER_BUCKET,
    maxBytes: MAX_POSTER_BYTES,
  });

  return uploadPublicObject(POSTER_BUCKET, file);
}

export async function uploadReviewImage(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error(getSupabaseConfigurationErrorMessage());
  }

  if (file.size === 0) {
    throw new Error("Сэтгэгдлийн зураг хоосон байна.");
  }

  if (file.size > MAX_POSTER_BYTES) {
    throw new Error("Сэтгэгдлийн зураг 8MB-аас бага байх ёстой.");
  }

  if (file.type && !ALLOWED_MIME.includes(file.type)) {
    throw new Error("Зөвхөн зураг (JPG, PNG, WEBP, AVIF, GIF) оруулна уу.");
  }

  await ensureStorageBucket({
    allowedMimeTypes: ALLOWED_MIME,
    bucket: REVIEW_IMAGE_BUCKET,
    maxBytes: MAX_POSTER_BYTES,
  });

  return uploadPublicObject(REVIEW_IMAGE_BUCKET, file);
}

export async function uploadHeroVideo(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error(getSupabaseConfigurationErrorMessage());
  }

  if (file.size === 0) {
    throw new Error("Бичлэг файл хоосон байна.");
  }

  if (file.size > MAX_HERO_VIDEO_BYTES) {
    throw new Error("Нүүр хуудасны бичлэг 120MB-аас бага байх ёстой.");
  }

  if (file.type && !ALLOWED_VIDEO_MIME.includes(file.type)) {
    throw new Error("Зөвхөн MP4, WEBM эсвэл MOV бичлэг оруулна уу.");
  }

  await ensureStorageBucket({
    allowedMimeTypes: ALLOWED_VIDEO_MIME,
    bucket: HERO_VIDEO_BUCKET,
    maxBytes: MAX_HERO_VIDEO_BYTES,
  });

  return uploadPublicObject(HERO_VIDEO_BUCKET, file);
}

/**
 * Hand the browser a one-time URL to upload a file straight to Supabase
 * Storage. Vercel caps a request body at 4.5 MB, so real videos can't pass
 * through a Server Action; the file goes browser -> Storage and only its
 * public URL is submitted with the form.
 */
export async function createSignedUpload(kind: string, contentType: string, size: number) {
  if (!isSupabaseConfigured()) {
    throw new Error(getSupabaseConfigurationErrorMessage());
  }

  if (!Object.hasOwn(SIGNED_UPLOAD_KINDS, kind)) {
    throw new Error("Файл хуулах төрөл буруу байна.");
  }

  const config = SIGNED_UPLOAD_KINDS[kind as SignedUploadKind];
  const allowedMimeTypes: readonly string[] = config.allowedMimeTypes;

  if (!Number.isFinite(size) || size <= 0) {
    throw new Error("Файл хоосон байна.");
  }

  if (size > config.maxBytes) {
    throw new Error(config.tooLarge);
  }

  if (!allowedMimeTypes.includes(contentType)) {
    throw new Error(config.wrongType);
  }

  await ensureStorageBucket({
    allowedMimeTypes: [...allowedMimeTypes],
    bucket: config.bucket,
    maxBytes: config.maxBytes,
  });

  const supabaseUrl = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();
  const objectPath = `${randomUUID()}.${EXTENSION_BY_TYPE[contentType]}`;

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/upload/sign/${config.bucket}/${objectPath}`,
    {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    }
  );

  if (!response.ok) {
    throw new Error(await getSupabaseError(response));
  }

  const data = (await response.json()) as { url?: unknown };

  if (typeof data.url !== "string" || !data.url.includes("token=")) {
    throw new Error("Файл хуулах холбоос үүсгэж чадсангүй.");
  }

  return {
    uploadUrl: `${supabaseUrl}/storage/v1${data.url}`,
    publicUrl: `${supabaseUrl}/storage/v1/object/public/${config.bucket}/${objectPath}`,
    apiKey: getSupabaseAnonKey() || "",
  };
}

async function uploadPublicObject(bucket: string, file: File) {
  const supabaseUrl = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();
  const objectPath = `${randomUUID()}.${extensionFor(file)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": file.type || "application/octet-stream",
      "cache-control": "31536000",
      "x-upsert": "true",
    },
    body: bytes,
  });

  if (!response.ok) {
    throw new Error(await getSupabaseError(response));
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
}

async function ensureStorageBucket({
  allowedMimeTypes,
  bucket,
  maxBytes,
}: {
  allowedMimeTypes: string[];
  bucket: string;
  maxBytes: number;
}) {
  if (bucket === POSTER_BUCKET && posterBucketEnsured) {
    return;
  }

  if (bucket === HERO_VIDEO_BUCKET && heroVideoBucketEnsured) {
    return;
  }

  if (bucket === REVIEW_IMAGE_BUCKET && reviewImageBucketEnsured) {
    return;
  }

  const supabaseUrl = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();

  const existing = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucket}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });

  if (existing.ok) {
    markBucketEnsured(bucket);
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
      id: bucket,
      name: bucket,
      public: true,
      file_size_limit: maxBytes,
      allowed_mime_types: allowedMimeTypes,
    }),
  });

  // 200 created, or 400 when the bucket already exists (race) — both are fine.
  if (created.ok || created.status === 400 || created.status === 409) {
    markBucketEnsured(bucket);
    return;
  }

  throw new Error(await getSupabaseError(created));
}

function markBucketEnsured(bucket: string) {
  if (bucket === POSTER_BUCKET) {
    posterBucketEnsured = true;
  }

  if (bucket === HERO_VIDEO_BUCKET) {
    heroVideoBucketEnsured = true;
  }

  if (bucket === REVIEW_IMAGE_BUCKET) {
    reviewImageBucketEnsured = true;
  }
}

function extensionFor(file: File) {
  if (file.type && EXTENSION_BY_TYPE[file.type]) {
    return EXTENSION_BY_TYPE[file.type];
  }

  const dot = file.name.lastIndexOf(".");
  const ext = dot >= 0 ? file.name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  return ext || "jpg";
}

export function isUploadedPoster(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

export function isUploadedHeroVideo(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

export function isUploadedReviewImage(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}
