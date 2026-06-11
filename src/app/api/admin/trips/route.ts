import { apiError, ok } from "@/lib/server/api";
import { getTrips, upsertTripFromJson } from "@/lib/server/admin-store";
import { getAdminFromRequest } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!getAdminFromRequest(request)) {
    return apiError("UNAUTHORIZED", "Админ нэвтрэлт шаардлагатай.", 401);
  }

  const trips = await getTrips();

  return ok({
    trips,
    count: trips.length,
  });
}

export async function POST(request: Request) {
  if (!getAdminFromRequest(request)) {
    return apiError("UNAUTHORIZED", "Админ нэвтрэлт шаардлагатай.", 401);
  }

  try {
    const trip = await upsertTripFromJson(await request.json());
    return ok({ trip }, { status: 201 });
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not save trip.";
}
