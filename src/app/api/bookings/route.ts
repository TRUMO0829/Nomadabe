import { apiError, ok, rateLimitRequest } from "@/lib/server/api";
import { getTrips } from "@/lib/server/admin-store";
import { getCustomerFromRequest } from "@/lib/server/customer-auth";
import { saveInquiry, validateInquiry } from "@/lib/server/inquiries";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = await rateLimitRequest(request, "bookings", {
    limit: 12,
    windowMs: 10 * 60 * 1000,
  });

  if (limited) {
    return limited;
  }

  try {
    const payload = await request.json();
    const customer = await getCustomerFromRequest(request);

    if (!customer) {
      return apiError("UNAUTHORIZED", "Аялал захиалахын тулд эхлээд нэвтэрнэ үү.", 401);
    }

    const tripSlug = getTripSlug(payload);

    if (!tripSlug) {
      return apiError("BAD_REQUEST", "Trip slug is required.", 400);
    }

    const tripTitle = getString(asRecord(payload).tripTitle);
    const trip = (await getTrips()).find((item) => item.slug === tripSlug);

    if (!trip && !tripTitle) {
      return apiError("BAD_REQUEST", "Сонгосон аялал олдсонгүй.", 400);
    }

    const validation = validateInquiry({
      ...asRecord(payload),
      email: getString(asRecord(payload).email) || customer.email || "",
      customerId: customer.id,
      tripSlug,
      inquiryType: "trip",
    });

    if (!validation.ok) {
      return apiError("BAD_REQUEST", "Захиалгын мэдээллээ шалгана уу.", 400, validation.errors);
    }

    const inquiry = await saveInquiry(validation.value);

    return ok(
      {
        booking: {
          id: inquiry.id,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
          trip: {
            slug: trip?.slug ?? tripSlug,
            title: trip?.title ?? tripTitle,
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
