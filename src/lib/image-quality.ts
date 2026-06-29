type ImageQualityOptions = {
  width?: number;
  quality?: number;
};

export function getHighResolutionImageUrl(
  src: string,
  { width = 3200, quality = 90 }: ImageQualityOptions = {},
) {
  if (!src) return src;

  try {
    const url = new URL(src);

    if (url.hostname === "images.unsplash.com") {
      url.searchParams.set("w", String(width));
      url.searchParams.set("q", String(quality));

      if (!url.searchParams.has("fit")) {
        url.searchParams.set("fit", "crop");
      }

      if (!url.searchParams.has("fm") && !url.searchParams.has("auto")) {
        url.searchParams.set("fm", "webp");
      }

      return url.toString();
    }
  } catch {
    return src;
  }

  return src;
}
