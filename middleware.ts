import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export function middleware(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return new NextResponse("Admin password is not configured.", {
      status: 503,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return unauthorized();
  }

  const credentials = atob(authorization.slice("Basic ".length));
  const separator = credentials.indexOf(":");
  const providedUsername = separator >= 0 ? credentials.slice(0, separator) : "";
  const providedPassword = separator >= 0 ? credentials.slice(separator + 1) : "";

  if (providedUsername !== username || providedPassword !== password) {
    return unauthorized();
  }

  return NextResponse.next();
}

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "www-authenticate": 'Basic realm="Nomadabe Admin"',
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
