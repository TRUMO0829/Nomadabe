import { TRAVEL_SERVICES } from "@/lib/adventures";
import { ok } from "@/lib/server/api";

export const runtime = "nodejs";

export async function GET() {
  return ok({
    services: TRAVEL_SERVICES,
  });
}
