import { apiError, ok, rateLimitRequest } from "@/lib/server/api";
import { requestAdminLoginCode } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = await rateLimitRequest(request, "admin-request-code", {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (limited) {
    return limited;
  }

  try {
    const payload = (await request.json()) as { email?: unknown };
    return ok(await requestAdminLoginCode(payload.email));
  } catch (error) {
    return apiError(
      "BAD_REQUEST",
      error instanceof Error ? error.message : "Админ код илгээж чадсангүй.",
      400
    );
  }
}
