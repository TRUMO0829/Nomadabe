import { ok } from "@/lib/server/api";

export const runtime = "nodejs";

export async function GET() {
  return ok({
    service: "nomadabe-web",
    status: "healthy",
    checkedAt: new Date().toISOString(),
  });
}
