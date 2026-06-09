import { apiError, ok } from "@/lib/server/api";
import { requestCustomerLoginCode } from "@/lib/server/customer-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { identifier?: unknown };
    const result = await requestCustomerLoginCode(payload.identifier);
    return ok(result);
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not send login code.";
}
