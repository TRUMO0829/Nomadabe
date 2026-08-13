/**
 * Canonical origin for absolute URLs (sitemap, robots, OpenGraph images).
 *
 * NEXT_PUBLIC_SITE_URL wins so preview and production can differ. Vercel sets
 * VERCEL_PROJECT_PRODUCTION_URL on every deployment of a project, which keeps
 * preview builds pointing at the real domain instead of localhost.
 */
export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  return "http://localhost:3000";
}

export function absoluteUrl(path: string) {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
