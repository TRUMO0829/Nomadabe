import { NextResponse } from "next/server";
import { apiError } from "@/lib/server/api";
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
    const response = NextResponse.json({
      ok: true,
      data: { customer, emailVerificationRequired },
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

    return response;
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not register.";
}
