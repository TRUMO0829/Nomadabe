import { NextResponse } from "next/server";
import { apiError, rateLimitRequest } from "@/lib/server/api";
import {
  createAdminSession,
  getAdminCookieOptions,
  isAllowedAdminEmail,
  ADMIN_SESSION_COOKIE,
} from "@/lib/server/admin-auth";
import {
  CUSTOMER_SESSION_COOKIE,
  verifyCustomerRegistrationCode,
} from "@/lib/server/customer-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = await rateLimitRequest(request, "auth-register-verify", {
    limit: 8,
    windowMs: 10 * 60 * 1000,
  });

  if (limited) {
    return limited;
  }

  try {
    const payload = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      code?: unknown;
      password?: unknown;
    };
    const { customer, session } = await verifyCustomerRegistrationCode(payload);
    const adminSession =
      customer && isAllowedAdminEmail(customer.email)
        ? createAdminSession(customer.email)
        : null;
    const response = NextResponse.json({
      ok: true,
      data: { customer, adminRedirect: Boolean(adminSession) },
    });

    response.cookies.set(CUSTOMER_SESSION_COOKIE, session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(session.expiresAt),
    });

    if (adminSession) {
      response.cookies.set(
        ADMIN_SESSION_COOKIE,
        adminSession.token,
        getAdminCookieOptions(adminSession.expiresAt)
      );
    }

    return response;
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

function getErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (/already registered|already exists|user already/i.test(message)) {
    return "Энэ и-мэйлээр бүртгэл үүссэн байна. Нэвтрэх хэсгээр орно уу.";
  }

  return message || "Бүртгэл баталгаажуулж чадсангүй. Мэдээллээ шалгаад дахин оролдоно уу.";
}
