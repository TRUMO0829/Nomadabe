import { apiError, ok } from "@/lib/server/api";
import { getTrips } from "@/lib/server/admin-store";
import { saveInquiry, validateInquiry } from "@/lib/server/inquiries";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const tripSlug = getTripSlug(payload);

    if (tripSlug) {
      const exists = (await getTrips()).some((trip) => trip.slug === tripSlug);

      if (!exists) {
        return apiError("BAD_REQUEST", "Selected trip was not found.", 400);
      }
    }

    const validation = validateInquiry(payload);

    if (!validation.ok) {
      return apiError("BAD_REQUEST", "Please check the inquiry fields.", 400, validation.errors);
    }

    const inquiry = await saveInquiry(validation.value);
    return ok({ inquiry }, { status: 201 });
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

function getTripSlug(payload: unknown) {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return "";
  }

  const value = (payload as Record<string, unknown>).tripSlug;
  return typeof value === "string" ? value.trim() : "";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not save inquiry.";
}
