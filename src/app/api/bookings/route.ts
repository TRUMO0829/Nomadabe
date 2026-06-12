import { apiError, ok } from "@/lib/server/api";
import { getTrips } from "@/lib/server/admin-store";
import { getCustomerFromRequest } from "@/lib/server/customer-auth";
import { saveInquiry, validateInquiry } from "@/lib/server/inquiries";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const customer = await getCustomerFromRequest(request);

    if (!customer) {
      return apiError("UNAUTHORIZED", "Please sign in with email before booking.", 401);
    }

    const tripSlug = getTripSlug(payload);

    if (!tripSlug) {
      return apiError("BAD_REQUEST", "Trip slug is required.", 400);
    }

    const trip = (await getTrips()).find((item) => item.slug === tripSlug);

    if (!trip) {
      return apiError("BAD_REQUEST", "Selected trip was not found.", 400);
    }

    const validation = validateInquiry({
      ...asRecord(payload),
      email: getString(asRecord(payload).email) || customer.email || "",
      customerId: customer.id,
      tripSlug,
      inquiryType: "trip",
    });

    if (!validation.ok) {
      return apiError("BAD_REQUEST", "Please check the booking fields.", 400, validation.errors);
    }

    const inquiry = await saveInquiry(validation.value);

    return ok(
      {
        booking: {
          id: inquiry.id,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
          trip: {
            slug: trip.slug,
            title: trip.title,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

function getTripSlug(payload: unknown) {
  const value = asRecord(payload).tripSlug;
  return typeof value === "string" ? value.trim() : "";
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(payload: unknown): Record<string, unknown> {
  return typeof payload === "object" && payload !== null && !Array.isArray(payload)
    ? (payload as Record<string, unknown>)
    : {};
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not create booking.";
}
