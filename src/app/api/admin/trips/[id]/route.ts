import { apiError, ok } from "@/lib/server/api";
import { deleteTripById, getTrips, upsertTripFromJson } from "@/lib/server/admin-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const trip = (await getTrips()).find((item) => item.id === id);

  if (!trip) {
    return apiError("NOT_FOUND", "Trip was not found.", 404);
  }

  return ok({ trip });
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const trip = await upsertTripFromJson({
      ...(await request.json()),
      id,
    });

    return ok({ trip });
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = (await getTrips()).find((trip) => trip.id === id);

  if (!existing) {
    return apiError("NOT_FOUND", "Trip was not found.", 404);
  }

  try {
    const trip = await upsertTripFromJson({
      ...existing,
      ...(await request.json()),
      id,
    });

    return ok({ trip });
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const exists = (await getTrips()).some((trip) => trip.id === id);

  if (!exists) {
    return apiError("NOT_FOUND", "Trip was not found.", 404);
  }

  await deleteTripById(id);

  return ok({ id });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not update trip.";
}
