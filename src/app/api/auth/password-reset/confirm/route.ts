import { NextResponse } from "next/server";
import { apiError } from "@/lib/server/api";
import {
  CUSTOMER_SESSION_COOKIE,
  resetCustomerPassword,
} from "@/lib/server/customer-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      email?: unknown;
      code?: unknown;
      password?: unknown;
    };
    const { customer, session } = await resetCustomerPassword(payload);
    const response = NextResponse.json({
      ok: true,
      data: { customer },
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

  if (/password|нууц үг/i.test(message) && /8|тэмдэгт|least|characters/i.test(message)) {
    return "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой.";
  }

  if (/code|код|expired|хугацаа/i.test(message)) {
    return "Код буруу эсвэл хугацаа дууссан байна.";
  }

  if (/not found|олдсонгүй/i.test(message)) {
    return "Энэ и-мэйлээр бүртгэл олдсонгүй.";
  }

  if (/supabase|database|auth/i.test(message)) {
    return "Нууц үг сэргээх үйлчилгээ түр алдаатай байна. Дахин оролдоно уу.";
  }

  return message || "Нууц үг шинэчилж чадсангүй.";
}
