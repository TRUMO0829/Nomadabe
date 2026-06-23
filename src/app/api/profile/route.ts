import { apiError, ok } from "@/lib/server/api";
import { getTrips } from "@/lib/server/admin-store";
import { getCustomerFromRequest } from "@/lib/server/customer-auth";
import { getCustomerInquiries } from "@/lib/server/inquiries";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const customer = await getCustomerFromRequest(request);

  if (!customer) {
    return apiError("UNAUTHORIZED", "Please sign in to view your profile.", 401);
  }

  const [inquiries, trips] = await Promise.all([
    getCustomerInquiries({
      customerId: customer.id,
      email: customer.email,
    }),
    getTrips(),
  ]);
  const tripBySlug = new Map(trips.map((trip) => [trip.slug, trip]));

  return ok({
    customer,
    inquiries: inquiries.map((inquiry) => {
      const trip = inquiry.tripSlug ? tripBySlug.get(inquiry.tripSlug) : undefined;

      return {
        ...inquiry,
        tripTitle: trip?.title ?? inquiry.tripSlug ?? "Захиалгат аялал",
        tripImage: trip?.image ?? null,
        tripLocation: trip ? `${trip.location}, ${trip.country}` : null,
      };
    }),
    stats: {
      totalInquiries: inquiries.length,
      confirmed: inquiries.filter((inquiry) =>
        ["confirmed", "closed"].includes(inquiry.status)
      ).length,
      active: inquiries.filter((inquiry) =>
        ["new", "contacted"].includes(inquiry.status)
      ).length,
    },
  });
}
