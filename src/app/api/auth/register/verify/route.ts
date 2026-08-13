import { NextResponse } from "next/server";
import { apiError, rateLimitRequest } from "@/lib/server/api";
import { isAllowedAdminEmail } from "@/lib/server/admin-auth";
import {
  CUSTOMER_SESSION_COOKIE,
  normalizeIdentifier,
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

    // Cap attempts per address too, not just per IP.
    const perEmail = await rateLimitRequest(request, "auth-register-verify-email", {
      limit: 8,
      windowMs: 10 * 60 * 1000,
      identifier: normalizeIdentifier(payload.email),
    });

    if (perEmail) {
      return perEmail;
    }

    const { customer, session } = await verifyCustomerRegistrationCode(payload);
    // Registering with an allow-listed address does not grant admin access —
    // that still requires the one-time code flow at /admin/login.
    const response = NextResponse.json({
      ok: true,
      data: {
        customer,
        adminRedirect: Boolean(customer && isAllowedAdminEmail(customer.email)),
      },
    });

    response.cookies.set(CUSTOMER_SESSION_COOKIE, session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(session.expiresAt),
    });

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
