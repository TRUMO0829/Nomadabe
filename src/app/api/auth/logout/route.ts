import { NextResponse } from "next/server";
import {
  CUSTOMER_SESSION_COOKIE,
  getCookie,
  revokeCustomerSession,
} from "@/lib/server/customer-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = getCookie(request.headers.get("cookie") ?? "", CUSTOMER_SESSION_COOKIE);

  if (token) {
    await revokeCustomerSession(token);
  }

  const response = NextResponse.json({ ok: true, data: { signedOut: true } });
  response.cookies.set(CUSTOMER_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
