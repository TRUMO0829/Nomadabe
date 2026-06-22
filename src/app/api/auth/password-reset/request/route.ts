import { apiError, ok, rateLimitRequest } from "@/lib/server/api";
import { requestCustomerPasswordReset } from "@/lib/server/customer-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = rateLimitRequest(request, "password-reset-request", {
    limit: 4,
    windowMs: 15 * 60 * 1000,
  });

  if (limited) {
    return limited;
  }

  try {
    const payload = (await request.json()) as { email?: unknown };
    const result = await requestCustomerPasswordReset(payload.email);
    return ok(result);
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

function getErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (/valid email|зөв и-мэйл/i.test(message)) {
    return "Зөв и-мэйл хаяг оруулна уу.";
  }

  if (/supabase|database|schema|relation|table/i.test(message)) {
    return "Нууц үг сэргээх үйлчилгээ түр алдаатай байна. Дахин оролдоно уу.";
  }

  return message || "Нууц үг сэргээх код илгээж чадсангүй.";
}
