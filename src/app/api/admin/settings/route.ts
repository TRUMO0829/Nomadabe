import { apiError, ok } from "@/lib/server/api";
import { getSiteSettings, updateSiteSettingsFromJson } from "@/lib/server/admin-store";

export const runtime = "nodejs";

export async function GET() {
  return ok({
    siteSettings: await getSiteSettings(),
  });
}

export async function PUT(request: Request) {
  try {
    const siteSettings = await updateSiteSettingsFromJson(await request.json());
    return ok({ siteSettings });
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not update site settings.";
}
