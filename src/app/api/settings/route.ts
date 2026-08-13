import { ok } from "@/lib/server/api";
import { getSiteReviews, getSiteSettings } from "@/lib/server/admin-store";
import { getPublicReviews } from "@/lib/site-settings";

export const runtime = "nodejs";

export async function GET() {
  const [siteSettings, reviews] = await Promise.all([getSiteSettings(), getSiteReviews()]);

  return ok({
    // This endpoint is public, so unapproved reviews must not leak through it.
    siteSettings: {
      ...siteSettings,
      reviews: getPublicReviews(reviews),
    },
  });
}
