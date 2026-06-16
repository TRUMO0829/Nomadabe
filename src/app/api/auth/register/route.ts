import { NextResponse } from "next/server";
import { apiError } from "@/lib/server/api";
import {
  createAdminSession,
  getAdminCookieOptions,
  isAllowedAdminEmail,
  ADMIN_SESSION_COOKIE,
} from "@/lib/server/admin-auth";
import {
  CUSTOMER_SESSION_COOKIE,
  registerCustomerWithPassword,
} from "@/lib/server/customer-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      password?: unknown;
    };
    const { customer, session, emailVerificationRequired } =
      await registerCustomerWithPassword(payload);
    const adminSession = customer && isAllowedAdminEmail(customer.email)
      ? createAdminSession(customer.email)
      : null;
    const response = NextResponse.json({
      ok: true,
      data: {
        customer,
        emailVerificationRequired,
        adminRedirect: Boolean(adminSession),
      },
    });

    if (session) {
      response.cookies.set(CUSTOMER_SESSION_COOKIE, session.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(session.expiresAt),
      });
    }

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

  if (/password/i.test(message) && /8|characters|least/i.test(message)) {
    return "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой.";
  }

  if (/valid email/i.test(message)) {
    return "Зөв и-мэйл хаяг оруулна уу.";
  }

  if (/supabase|database|auth/i.test(message)) {
    return "Бүртгэлийн үйлчилгээ түр алдаатай байна. Дахин оролдоно уу.";
  }

  return message || "Бүртгэл үүсгэж чадсангүй. Мэдээллээ шалгаад дахин оролдоно уу.";
}
