import { apiError, ok } from "@/lib/server/api";
import { getServices, upsertServiceFromJson } from "@/lib/server/admin-store";

export const runtime = "nodejs";

export async function GET() {
  const services = await getServices();

  return ok({
    services,
    count: services.length,
  });
}

export async function POST(request: Request) {
  try {
    const service = await upsertServiceFromJson(await request.json());
    return ok({ service }, { status: 201 });
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not save service.";
}
