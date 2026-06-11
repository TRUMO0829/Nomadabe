import { apiError, ok } from "@/lib/server/api";
import { getAdminDashboardData } from "@/lib/server/admin-store";
import { getAdminFromRequest } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!getAdminFromRequest(request)) {
    return apiError("UNAUTHORIZED", "Админ нэвтрэлт шаардлагатай.", 401);
  }

  const data = await getAdminDashboardData();

  return ok({
    trips: data.trips.length,
    services: data.services.length,
    inquiries: data.inquiries.length,
    bookingStats: data.bookingStats,
    siteSettings: data.siteSettings,
  });
}
