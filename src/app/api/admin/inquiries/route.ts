import { apiError, ok } from "@/lib/server/api";
import { getAdminFromRequest } from "@/lib/server/admin-auth";
import { getInquiries } from "@/lib/server/inquiries";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!getAdminFromRequest(request)) {
    return apiError("UNAUTHORIZED", "Админ нэвтрэлт шаардлагатай.", 401);
  }

  const inquiries = await getInquiries();

  return ok({
    inquiries,
    count: inquiries.length,
  });
}
