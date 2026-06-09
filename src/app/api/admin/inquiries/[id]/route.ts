import { apiError, ok } from "@/lib/server/api";
import { getInquiries, isInquiryStatus, updateInquiryStatus } from "@/lib/server/inquiries";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const inquiry = (await getInquiries()).find((item) => item.id === id);

  if (!inquiry) {
    return apiError("NOT_FOUND", "Inquiry was not found.", 404);
  }

  return ok({ inquiry });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = await request.json().catch(() => null);
  const status = isRecord(payload) && typeof payload.status === "string" ? payload.status : "";

  if (!isInquiryStatus(status)) {
    return apiError("BAD_REQUEST", "Invalid inquiry status.", 400, {
      status: "Use one of: new, contacted, confirmed, closed.",
    });
  }

  try {
    const inquiry = await updateInquiryStatus(id, status);
    return ok({ inquiry });
  } catch (error) {
    return apiError("NOT_FOUND", getErrorMessage(error), 404);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not update inquiry.";
}
