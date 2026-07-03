import { apiError, ok } from "@/lib/server/api";
import { getCustomerFromRequest } from "@/lib/server/customer-auth";
import { deleteCustomerInquiry } from "@/lib/server/inquiries";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  const customer = await getCustomerFromRequest(request);

  if (!customer) {
    return apiError("UNAUTHORIZED", "Please sign in to delete this trip request.", 401);
  }

  const { id } = await context.params;

  try {
    const inquiry = await deleteCustomerInquiry({
      id,
      customerId: customer.id,
      email: customer.email,
    });

    return ok({ inquiry });
  } catch (error) {
    const message = getErrorMessage(error);

    return apiError(
      message.includes("pending") ? "BAD_REQUEST" : "NOT_FOUND",
      message,
      message.includes("pending") ? 400 : 404
    );
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not delete trip request.";
}
