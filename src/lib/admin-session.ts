/**
 * Admin session token format, shared by the Edge middleware and the Node server
 * code. It is deliberately dependency-free and uses Web Crypto only, because
 * middleware runs on the Edge runtime where node:crypto is unavailable.
 *
 * Previously middleware.ts and lib/server/admin-auth.ts each carried their own
 * copy of the signing and verification logic; changing one and forgetting the
 * other would have silently weakened the check.
 */

export const ADMIN_SESSION_COOKIE = "nomadabe_admin_session";
export const ADMIN_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type AdminSessionPayload = {
  email: string;
  exp: number;
  /**
   * Session generation. Bumping ADMIN_SESSION_VERSION in the environment
   * invalidates every token that was issued before the bump, which is how an
   * admin session can be revoked before it expires.
   */
  v?: string;
};

export function normalizeAdminEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((email) => normalizeAdminEmail(email))
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string) {
  const allowed = getAllowedAdminEmails();
  return allowed.length > 0 && allowed.includes(normalizeAdminEmail(email));
}

export function getAdminSessionVersion() {
  return process.env.ADMIN_SESSION_VERSION?.trim() || "1";
}

export function getAdminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim();

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_SESSION_SECRET тохируулаагүй байна. Vercel Project Settings > Environment Variables дээр санамсаргүй урт утга нэмээд redeploy хийнэ үү."
    );
  }

  return "nomadabe-local-admin-session-secret";
}

export async function createAdminSessionToken(email: string) {
  const payload: AdminSessionPayload = {
    email: normalizeAdminEmail(email),
    exp: Date.now() + ADMIN_SESSION_TTL_MS,
    v: getAdminSessionVersion(),
  };
  const body = base64UrlEncode(JSON.stringify(payload));

  return {
    token: `${body}.${await signValue(body)}`,
    payload,
    expiresAt: new Date(payload.exp),
  };
}

export async function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) {
    return null;
  }

  const [body, signature] = token.split(".");

  if (!body || !signature) {
    return null;
  }

  if (!timingSafeEqual(signature, await signValue(body))) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as AdminSessionPayload;

    if (!payload.email || !payload.exp || payload.exp < Date.now()) {
      return null;
    }

    if ((payload.v ?? "1") !== getAdminSessionVersion()) {
      return null;
    }

    if (!isAllowedAdminEmail(payload.email)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getAdminCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

export function readAdminSessionCookie(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.slice(ADMIN_SESSION_COOKIE.length + 1);
}

async function signValue(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getAdminSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));

  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

function base64UrlEncode(value: string) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function base64UrlEncodeBytes(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  return new TextDecoder().decode(
    Uint8Array.from(atob(padded), (character) => character.charCodeAt(0))
  );
}
