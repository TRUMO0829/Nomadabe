"use client";

import { useState, type ChangeEvent } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { createMediaUploadAction } from "../actions";
import { useUploadTracker } from "./admin-form";
import { buttonClass } from "./primitives";

/**
 * Admin file uploads go straight from the browser to Supabase Storage through
 * a one-time signed URL. Vercel rejects request bodies over 4.5 MB, so files
 * must never travel through a Server Action; the form only submits the
 * resulting public URLs in hidden inputs.
 */

export type MediaUploadKind = "hero-video" | "outbound-image" | "trip-image" | "team-image";

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/avif,image/gif";
export const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime";

const FILE_INPUT_CLASS =
  "block w-full text-xs text-[var(--foreground)] file:mr-2 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[var(--foreground)]/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 disabled:opacity-60";

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "done" }
  | { status: "error"; message: string };

async function uploadMedia(
  kind: MediaUploadKind,
  file: File,
  onProgress: (percent: number) => void
) {
  const signed = await createMediaUploadAction(kind, file.type, file.size);

  if (!signed.ok) {
    throw new Error(signed.error);
  }

  await putFile(signed.uploadUrl, signed.apiKey, file, onProgress);
  return signed.publicUrl;
}

function getUploadError(error: unknown) {
  return error instanceof Error ? error.message : "Файл байршуулж чадсангүй.";
}

function UploadStatus({ upload, doneText }: { upload: UploadState; doneText: string }) {
  return (
    <p role="status" className="mt-2 min-h-4 text-xs text-[var(--muted-foreground)]">
      {upload.status === "uploading" ? `Байршуулж байна… ${upload.progress}%` : null}
      {upload.status === "done" ? doneText : null}
      {upload.status === "error" ? (
        <span className="font-semibold text-red-700">{upload.message}</span>
      ) : null}
    </p>
  );
}

/** One image or video, submitted as a URL under `fieldName`. */
export function MediaSlot({
  kind,
  fieldName,
  label,
  initialSrc,
  accept = IMAGE_ACCEPT,
  hint,
  className,
  previewClassName = "h-28 w-full",
  allowClear = false,
  doneText = "Бэлэн. Одоо хадгалах товчийг дарна уу.",
}: {
  kind: MediaUploadKind;
  fieldName: string;
  label: string;
  initialSrc: string;
  accept?: string;
  hint?: string;
  className?: string;
  previewClassName?: string;
  allowClear?: boolean;
  doneText?: string;
}) {
  const trackUpload = useUploadTracker();
  const [src, setSrc] = useState(initialSrc);
  const [upload, setUpload] = useState<UploadState>({ status: "idle" });
  const inputId = `${fieldName}_file`;
  const isVideo = kind === "hero-video";

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    trackUpload(1);
    setUpload({ status: "uploading", progress: 0 });

    try {
      const url = await uploadMedia(kind, file, (progress) =>
        setUpload({ status: "uploading", progress })
      );
      setSrc(url);
      setUpload({ status: "done" });
    } catch (error) {
      setUpload({ status: "error", message: getUploadError(error) });
    } finally {
      input.value = "";
      trackUpload(-1);
    }
  }

  return (
    <div className={className}>
      <input type="hidden" name={fieldName} value={src} />
      <label
        htmlFor={inputId}
        className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted-foreground)]"
      >
        {label}
      </label>
      <div className="mt-2">
        {src ? (
          isVideo ? (
            <video
              key={src}
              src={src}
              muted
              playsInline
              controls
              className={`${previewClassName} rounded-md bg-black object-cover ring-1 ring-[var(--border)]`}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`${label} — одоогийн зураг`}
              className={`${previewClassName} rounded-md object-cover ring-1 ring-[var(--border)]`}
            />
          )
        ) : (
          <div
            className={`${previewClassName} flex items-center justify-center rounded-md bg-[var(--muted)] text-xs font-semibold text-[var(--muted-foreground)]`}
          >
            {isVideo ? "Бичлэг алга" : "Зураг алга"}
          </div>
        )}
      </div>
      <input
        id={inputId}
        type="file"
        accept={accept}
        disabled={upload.status === "uploading"}
        onChange={handleFile}
        className={`mt-3 ${FILE_INPUT_CLASS}`}
      />
      {hint ? <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">{hint}</p> : null}
      {allowClear && src ? (
        <button
          type="button"
          onClick={() => {
            setSrc("");
            setUpload({ status: "idle" });
          }}
          className={buttonClass({ variant: "ghost", size: "sm", className: "mt-2" })}
        >
          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
          Зургийг хасах
        </button>
      ) : null}
      <UploadStatus upload={upload} doneText={doneText} />
    </div>
  );
}

type GalleryItem = {
  key: string;
  src: string;
  upload: UploadState;
};

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * An ordered list of images. Every finished image is submitted as one
 * `fieldName` value, plus a marker telling the server the list was sent, so
 * removing every image really empties the gallery.
 */
export function GalleryField({
  kind,
  label,
  initialImages,
  altPrefix,
  hint,
  className,
  fieldName = "galleryImageUrl",
  markerName = "galleryImagesSubmitted",
}: {
  kind: MediaUploadKind;
  label: string;
  initialImages: string[];
  altPrefix: string;
  hint?: string;
  className?: string;
  fieldName?: string;
  markerName?: string;
}) {
  const trackUpload = useUploadTracker();
  const [items, setItems] = useState<GalleryItem[]>(() =>
    initialImages.map((src, index) => ({ key: `initial-${index}`, src, upload: { status: "idle" } }))
  );
  const addInputId = `${fieldName}_add`;

  function updateItem(key: string, patch: Partial<GalleryItem>) {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  async function uploadInto(key: string, file: File) {
    trackUpload(1);
    updateItem(key, { upload: { status: "uploading", progress: 0 } });

    try {
      const url = await uploadMedia(kind, file, (progress) =>
        updateItem(key, { upload: { status: "uploading", progress } })
      );
      updateItem(key, { src: url, upload: { status: "done" } });
    } catch (error) {
      updateItem(key, { upload: { status: "error", message: getUploadError(error) } });
    } finally {
      trackUpload(-1);
    }
  }

  function handleAdd(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = "";

    const added = files.map((file) => ({ file, key: newKey() }));
    setItems((current) => [
      ...current,
      ...added.map(({ key }) => ({ key, src: "", upload: { status: "uploading", progress: 0 } as const })),
    ]);
    added.forEach(({ file, key }) => void uploadInto(key, file));
  }

  function handleReplace(key: string, event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";

    if (file) {
      void uploadInto(key, file);
    }
  }

  function remove(key: string) {
    setItems((current) => current.filter((item) => item.key !== key));
  }

  return (
    <fieldset className={className}>
      <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        {label}
      </legend>
      <input type="hidden" name={markerName} value="1" />
      <div className="mt-2 rounded-md border border-dashed border-[var(--border)] bg-white p-4">
        {items.length > 0 ? (
          <ul className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item, index) => (
              <li
                key={item.key}
                className="rounded-md border border-[var(--border)] bg-[var(--background)] p-3"
              >
                {item.src ? (
                  <>
                    <input type="hidden" name={fieldName} value={item.src} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={`${altPrefix} — зураг ${index + 1}`}
                      className="h-28 w-full rounded-md object-cover ring-1 ring-[var(--border)]"
                    />
                  </>
                ) : (
                  <div className="flex h-28 w-full items-center justify-center rounded-md bg-[var(--muted)] text-xs font-semibold text-[var(--muted-foreground)]">
                    {item.upload.status === "error" ? "Байршуулж чадсангүй" : "Байршуулж байна…"}
                  </div>
                )}
                <label className="mt-3 block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                    Зураг {index + 1}-г солих
                  </span>
                  <input
                    type="file"
                    accept={IMAGE_ACCEPT}
                    disabled={item.upload.status === "uploading"}
                    onChange={(event) => handleReplace(item.key, event)}
                    className={`mt-1 ${FILE_INPUT_CLASS}`}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => remove(item.key)}
                  disabled={item.upload.status === "uploading"}
                  className={buttonClass({ variant: "ghost", size: "sm", className: "mt-2" })}
                >
                  <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                  Зураг {index + 1}-г хасах
                </button>
                <UploadStatus upload={item.upload} doneText="Бэлэн." />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-3 rounded-md bg-[var(--muted)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)]">
            Нэмэлт зураг ороогүй байна.
          </p>
        )}
        <label htmlFor={addInputId} className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--primary)]">
          <ImagePlus aria-hidden="true" className="h-4 w-4" />
          Шинэ зураг нэмэх
        </label>
        <input
          id={addInputId}
          type="file"
          accept={IMAGE_ACCEPT}
          multiple
          onChange={handleAdd}
          className={`mt-2 ${FILE_INPUT_CLASS}`}
        />
        {hint ? <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">{hint}</p> : null}
      </div>
    </fieldset>
  );
}

// XMLHttpRequest rather than fetch because only it reports upload progress.
function putFile(
  url: string,
  apiKey: string,
  file: File,
  onProgress: (percent: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("content-type", file.type);
    request.setRequestHeader("cache-control", "max-age=31536000");
    request.setRequestHeader("x-upsert", "false");

    if (apiKey) {
      request.setRequestHeader("apikey", apiKey);
    }

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
      } else {
        reject(new Error(`Файл байршуулж чадсангүй (${request.status}).`));
      }
    };
    request.onerror = () => reject(new Error("Сүлжээний алдаагаар файл байршуулалт тасарлаа."));
    request.send(file);
  });
}
