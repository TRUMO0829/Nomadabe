import { ok } from "@/lib/server/api";
import { getSiteSettings } from "@/lib/server/admin-store";

export const runtime = "nodejs";

export async function GET() {
  return ok({
    siteSettings: await getSiteSettings(),
  });
}
