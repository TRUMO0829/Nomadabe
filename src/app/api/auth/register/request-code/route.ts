import { apiError, ok, rateLimitRequest } from "@/lib/server/api";
import { requestCustomerRegistrationCode } from "@/lib/server/customer-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = await rateLimitRequest(request, "auth-register-code", {
    limit: 6,
    windowMs: 10 * 60 * 1000,
  });

  if (limited) {
    return limited;
  }

  try {
    const payload = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      password?: unknown;
    };
    const result = await requestCustomerRegistrationCode(payload);
    return ok(result);
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Баталгаажуулах код илгээж чадсангүй. Дахин оролдоно уу.";
}
