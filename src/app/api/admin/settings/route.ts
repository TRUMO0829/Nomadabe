import { apiError, ok } from "@/lib/server/api";
import { getSiteSettings, updateSiteSettingsFromJson } from "@/lib/server/admin-store";
import { getAdminFromRequest } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!getAdminFromRequest(request)) {
    return apiError("UNAUTHORIZED", "Админ нэвтрэлт шаардлагатай.", 401);
  }

  return ok({
    siteSettings: await getSiteSettings(),
  });
}

export async function PUT(request: Request) {
  if (!getAdminFromRequest(request)) {
    return apiError("UNAUTHORIZED", "Админ нэвтрэлт шаардлагатай.", 401);
  }

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
