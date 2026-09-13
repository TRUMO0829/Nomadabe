type ImageQualityOptions = {
  width?: number;
  quality?: number;
};

/**
 * next/image can only optimise hosts listed in next.config's remotePatterns.
 * Trip and profile photos are admin-entered, so anything outside those hosts
 * is served as-is (`unoptimized`) instead of throwing at render time.
 */
export function canOptimizeImage(src: string) {
  if (src.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(src);

    return (
      url.hostname === "images.unsplash.com" ||
      (url.hostname.endsWith(".supabase.co") &&
        url.pathname.startsWith("/storage/v1/object/public/"))
    );
  } catch {
    return false;
  }
}

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
