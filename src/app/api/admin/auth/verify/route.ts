import { NextResponse } from "next/server";
import { apiError } from "@/lib/server/api";
import {
  ADMIN_SESSION_COOKIE,
  getAdminCookieOptions,
  verifyAdminLoginCode,
} from "@/lib/server/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { email?: unknown; code?: unknown };
    const session = await verifyAdminLoginCode(payload.email, payload.code);
    const response = NextResponse.json({
      ok: true,
      data: {
        admin: {
          email: session.payload.email,
        },
      },
    });

    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      session.token,
      getAdminCookieOptions(session.expiresAt)
    );

    return response;
  } catch (error) {
    return apiError(
      "BAD_REQUEST",
      error instanceof Error ? error.message : "Админ нэвтрэлт амжилтгүй боллоо.",
      400
    );
  }
}
