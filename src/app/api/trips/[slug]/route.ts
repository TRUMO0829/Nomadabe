import { apiError, ok, sanitizeTrip } from "@/lib/server/api";
import { getTrips } from "@/lib/server/admin-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const trip = (await getTrips()).find((adventure) => adventure.slug === slug);

  if (!trip) {
    return apiError("NOT_FOUND", "Trip was not found.", 404);
  }

  return ok({
    trip: sanitizeTrip(trip),
  });
}
