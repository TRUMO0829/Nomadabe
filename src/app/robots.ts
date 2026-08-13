import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin pages and the JSON API have no search value and should not be
      // crawled; /profile is per-user and behind a session.
      disallow: ["/admin", "/admin/", "/api/", "/profile"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
