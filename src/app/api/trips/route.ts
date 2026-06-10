import {
  getTripSummary,
  getTripsFromSearchParams,
  ok,
  sanitizeTrip,
} from "@/lib/server/api";
import { getTrips } from "@/lib/server/admin-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceTrips = await getTrips();
  const trips = getTripsFromSearchParams(searchParams, sourceTrips).map(sanitizeTrip);

  return ok({
    trips,
    count: trips.length,
    filters: {
      featured: searchParams.get("featured") ?? null,
      category: searchParams.get("category") ?? null,
      q: searchParams.get("q") ?? null,
    },
    summary: getTripSummary(sourceTrips),
  });
}
