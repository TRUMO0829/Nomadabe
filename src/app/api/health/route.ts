import { ok } from "@/lib/server/api";
import { getAdminStore } from "@/lib/server/admin-store";

export const runtime = "nodejs";

export async function GET() {
  const store = await getAdminStore();

  return ok({
    status: "ok",
    timestamp: new Date().toISOString(),
    storage: {
      trips: store.trips.length,
      services: store.services.length,
      siteSettings: Boolean(store.siteSettings),
    },
  });
}
