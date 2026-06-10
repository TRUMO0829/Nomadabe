import { ok } from "@/lib/server/api";
import { getAdminDashboardData } from "@/lib/server/admin-store";

export const runtime = "nodejs";

export async function GET() {
  const data = await getAdminDashboardData();

  return ok({
    trips: data.trips.length,
    services: data.services.length,
    inquiries: data.inquiries.length,
    bookingStats: data.bookingStats,
    siteSettings: data.siteSettings,
  });
}
