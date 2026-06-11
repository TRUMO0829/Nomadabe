import { createHmac, randomInt } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sendEmail } from "@/lib/server/mail";

type AdminCode = {
  email: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
};

export type AdminSessionPayload = {
  email: string;
  exp: number;
};

export const ADMIN_SESSION_COOKIE = "nomadabe_admin_session";

const DATA_DIR = path.join(process.cwd(), "data");
const ADMIN_CODES_FILE = path.join(DATA_DIR, "admin-auth-codes.json");
const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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

export async function requestAdminLoginCode(emailValue: unknown) {
  const email = normalizeAdminEmail(emailValue);

  if (!isValidEmail(email)) {
    throw new Error("Зөв и-мэйл хаяг оруулна уу.");
  }

  if (!isAllowedAdminEmail(email)) {
    throw new Error("Энэ и-мэйл админ эрхгүй байна.");
  }

  const now = new Date();
  const code = String(randomInt(100000, 1000000));
  const record: AdminCode = {
    email,
    code,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CODE_TTL_MS).toISOString(),
  };
  const codes = await readJsonFile<AdminCode[]>(ADMIN_CODES_FILE, []);

  await writeJsonFile(ADMIN_CODES_FILE, [...codes, record].slice(-100));
  await sendEmail({
    to: email,
    subject: "Nomadabe админ нэвтрэх код",
    body: `Таны Nomadabe админ нэвтрэх код: ${code}. Энэ код 10 минутын дараа хүчингүй болно.`,
  });

  return {
    email,
    expiresAt: record.expiresAt,
    devCode: process.env.NODE_ENV === "production" ? undefined : code,
  };
}

export async function verifyAdminLoginCode(emailValue: unknown, codeValue: unknown) {
  const email = normalizeAdminEmail(emailValue);
  const code = typeof codeValue === "string" ? codeValue.trim() : "";

  if (!isAllowedAdminEmail(email) || !/^\d{6}$/.test(code)) {
    throw new Error("И-мэйл эсвэл код буруу байна.");
  }

  const codes = await readJsonFile<AdminCode[]>(ADMIN_CODES_FILE, []);
  const now = Date.now();
  const match = [...codes]
    .reverse()
    .find(
      (item) =>
        item.email === email &&
        item.code === code &&
        !item.usedAt &&
        new Date(item.expiresAt).getTime() > now
    );

  if (!match) {
    throw new Error("Код буруу эсвэл хугацаа дууссан байна.");
  }

  await writeJsonFile(
    ADMIN_CODES_FILE,
    codes.map((item) =>
      item.email === match.email && item.code === match.code && item.createdAt === match.createdAt
        ? { ...item, usedAt: new Date(now).toISOString() }
        : item
    )
  );

  return createAdminSession(email);
}

export function createAdminSession(email: string) {
  const payload: AdminSessionPayload = {
    email: normalizeAdminEmail(email),
    exp: Date.now() + SESSION_TTL_MS,
  };
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = signValue(body);

  return {
    token: `${body}.${signature}`,
    payload,
    expiresAt: new Date(payload.exp),
  };
}

export function verifyAdminSession(token: string | undefined | null) {
  if (!token) {
    return null;
  }

  const [body, signature] = token.split(".");
  if (!body || !signature || signValue(body) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as AdminSessionPayload;

    if (!payload.email || payload.exp < Date.now() || !isAllowedAdminEmail(payload.email)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getAdminFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.slice(ADMIN_SESSION_COOKIE.length + 1);

  return verifyAdminSession(token);
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

function signValue(value: string) {
  return createHmac("sha256", getAdminSessionSecret()).update(value).digest("base64url");
}

function getAdminSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "nomadabe-local-admin-session-secret"
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

async function readJsonFile<T>(filePath: string, fallback: T) {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch (error) {
    if (isNodeFileError(error) && error.code === "ENOENT") {
      return fallback;
    }

    throw error;
  }
}

async function writeJsonFile<T>(filePath: string, value: T) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function isNodeFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
