import { NextResponse } from "next/server";
import { apiError, rateLimitRequest } from "@/lib/server/api";
import { isAllowedAdminEmail } from "@/lib/server/admin-auth";
import {
  CUSTOMER_SESSION_COOKIE,
  loginCustomerWithPassword,
} from "@/lib/server/customer-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = await rateLimitRequest(request, "auth-login", {
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });

  if (limited) {
    return limited;
  }

  try {
    const payload = (await request.json()) as {
      email?: unknown;
      password?: unknown;
    };
    const { customer, session } = await loginCustomerWithPassword(payload);
    // A customer password must never mint an admin session. Admin access is
    // gated behind the emailed one-time code at /admin/login; issuing the admin
    // cookie here would reduce that second factor to a single password.
    // `adminRedirect` only points the UI at the admin sign-in page.
    const response = NextResponse.json({
      ok: true,
      data: { customer, adminRedirect: isAllowedAdminEmail(customer.email) },
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

  if (/invalid login credentials/i.test(message)) {
    return "И-мэйл эсвэл нууц үг буруу байна.";
  }

  if (/email not confirmed/i.test(message)) {
    return "И-мэйл баталгаажаагүй байна. И-мэйлээ шалгаад дахин оролдоно уу.";
  }

  if (/valid email and password/i.test(message)) {
    return "И-мэйл болон нууц үгээ зөв оруулна уу.";
  }

  if (/supabase/i.test(message)) {
    return "Нэвтрэх үйлчилгээ түр алдаатай байна. Дахин оролдоно уу.";
  }

  return message || "Нэвтэрч чадсангүй. Мэдээллээ шалгаад дахин оролдоно уу.";
}
