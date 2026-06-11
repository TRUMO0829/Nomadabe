import { apiError, ok } from "@/lib/server/api";
import { getAdminFromRequest } from "@/lib/server/admin-auth";
import {
  deleteServiceById,
  getServices,
  upsertServiceFromJson,
} from "@/lib/server/admin-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  if (!getAdminFromRequest(request)) {
    return apiError("UNAUTHORIZED", "Админ нэвтрэлт шаардлагатай.", 401);
  }

  const { id } = await context.params;
  const service = (await getServices()).find((item) => item.id === id);

  if (!service) {
    return apiError("NOT_FOUND", "Service was not found.", 404);
  }

  return ok({ service });
}

export async function PUT(request: Request, context: RouteContext) {
  if (!getAdminFromRequest(request)) {
    return apiError("UNAUTHORIZED", "Админ нэвтрэлт шаардлагатай.", 401);
  }

  const { id } = await context.params;

  try {
    const service = await upsertServiceFromJson({
      ...(await request.json()),
      id,
    });

    return ok({ service });
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!getAdminFromRequest(request)) {
    return apiError("UNAUTHORIZED", "Админ нэвтрэлт шаардлагатай.", 401);
  }

  const { id } = await context.params;
  const existing = (await getServices()).find((service) => service.id === id);

  if (!existing) {
    return apiError("NOT_FOUND", "Service was not found.", 404);
  }

  try {
    const service = await upsertServiceFromJson({
      ...existing,
      ...(await request.json()),
      id,
    });

    return ok({ service });
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!getAdminFromRequest(request)) {
    return apiError("UNAUTHORIZED", "Админ нэвтрэлт шаардлагатай.", 401);
  }

  const { id } = await context.params;
  const exists = (await getServices()).some((service) => service.id === id);

  if (!exists) {
    return apiError("NOT_FOUND", "Service was not found.", 404);
  }

  await deleteServiceById(id);

  return ok({ id });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not update service.";
}
