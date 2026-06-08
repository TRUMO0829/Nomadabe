import {
  apiError,
  getTripsFromSearchParams,
  isTravelCategory,
  ok,
  sanitizeTrip,
} from "@/lib/server/api";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (category && !isTravelCategory(category)) {
    return apiError("BAD_REQUEST", "Unknown trip category.", 400, {
      category: "Use one of: business, expo, leisure, custom.",
    });
  }

  const trips = getTripsFromSearchParams(searchParams).map(sanitizeTrip);

  return ok({
    trips,
    count: trips.length,
    filters: {
      category: category ?? null,
      featured: searchParams.get("featured") ?? null,
      q: searchParams.get("q") ?? null,
    },
  });
}
