import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true, data: { signedOut: true } });

  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
