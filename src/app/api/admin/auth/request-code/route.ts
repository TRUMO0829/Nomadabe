import { apiError, ok } from "@/lib/server/api";
import { requestAdminLoginCode } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
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
