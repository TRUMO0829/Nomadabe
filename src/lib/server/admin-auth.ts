import { createHmac, randomInt, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sendEmail } from "@/lib/server/mail";
import {
  getSupabaseConfigurationErrorMessage,
  getMissingSupabaseSchemaMessage,
  isMissingSupabaseTableError,
  isSupabaseConfigured,
  supabaseRest,
} from "@/lib/server/supabase-rest";

type AdminCode = {
  id: string;
  email: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
};

type AdminCodeRow = {
  id: string;
  email: string;
  code: string;
  created_at: string;
  expires_at: string;
  used_at: string | null;
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
    id: randomUUID(),
    email,
    code,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CODE_TTL_MS).toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      await createSupabaseAdminCode(record);
    } catch (error) {
      if (isMissingSupabaseTableError(error)) {
        throw new Error(getMissingSupabaseSchemaMessage());
      }

      throw error;
    }
  } else {
    assertLocalJsonStoreAllowed();
    const codes = await readJsonFile<AdminCode[]>(ADMIN_CODES_FILE, []);
    await writeJsonFile(ADMIN_CODES_FILE, [...codes, record].slice(-100));
  }

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

  const now = Date.now();
  let match: AdminCode | null;

  if (isSupabaseConfigured()) {
    try {
      match = await findSupabaseAdminCode(email, code, new Date(now).toISOString());
    } catch (error) {
      if (isMissingSupabaseTableError(error)) {
        throw new Error(getMissingSupabaseSchemaMessage());
      }

      throw error;
    }
  } else {
    match = await findLocalAdminCode(email, code, now);
  }

  if (!match) {
    throw new Error("Код буруу эсвэл хугацаа дууссан байна.");
  }

  if (isSupabaseConfigured()) {
    try {
      await markSupabaseAdminCodeUsed(match.id, new Date(now).toISOString());
    } catch (error) {
      if (isMissingSupabaseTableError(error)) {
        throw new Error(getMissingSupabaseSchemaMessage());
      }

      throw error;
    }
  } else {
    assertLocalJsonStoreAllowed();
    const codes = await readJsonFile<AdminCode[]>(ADMIN_CODES_FILE, []);
    await writeJsonFile(
      ADMIN_CODES_FILE,
      codes.map((item) =>
        item.email === match.email && item.code === match.code && item.createdAt === match.createdAt
          ? { ...item, usedAt: new Date(now).toISOString() }
          : item
      )
    );
  }

  return createAdminSession(email);
}

async function createSupabaseAdminCode(record: AdminCode) {
  await supabaseRest<AdminCodeRow[]>("/admin_auth_codes", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify({
      id: record.id,
      email: record.email,
      code: record.code,
      created_at: record.createdAt,
      expires_at: record.expiresAt,
      used_at: record.usedAt ?? null,
    }),
  });
}

async function findSupabaseAdminCode(email: string, code: string, now: string) {
  const [row] = await supabaseRest<AdminCodeRow[]>(
    `/admin_auth_codes?select=*&email=eq.${encodeURIComponent(email)}&code=eq.${encodeURIComponent(
      code
    )}&used_at=is.null&expires_at=gt.${encodeURIComponent(now)}&order=created_at.desc&limit=1`
  );

  return row ? fromSupabaseAdminCode(row) : null;
}

async function markSupabaseAdminCodeUsed(id: string, usedAt: string) {
  await supabaseRest<AdminCodeRow[]>(`/admin_auth_codes?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    prefer: "return=representation",
    body: JSON.stringify({ used_at: usedAt }),
  });
}

async function findLocalAdminCode(email: string, code: string, now: number) {
  assertLocalJsonStoreAllowed();
  const codes = await readJsonFile<AdminCode[]>(ADMIN_CODES_FILE, []);
  return (
    [...codes]
      .reverse()
      .find(
        (item) =>
          item.email === email &&
          item.code === code &&
          !item.usedAt &&
          new Date(item.expiresAt).getTime() > now
      ) ?? null
  );
}

function fromSupabaseAdminCode(row: AdminCodeRow): AdminCode {
  return {
    id: row.id,
    email: row.email,
    code: row.code,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    usedAt: row.used_at ?? undefined,
  };
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
  assertLocalJsonStoreAllowed();
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function canUseLocalJsonStore() {
  return process.env.NODE_ENV !== "production" || process.env.NOMADABE_ALLOW_FILE_STORAGE === "1";
}

function assertLocalJsonStoreAllowed() {
  if (!canUseLocalJsonStore()) {
    throw new Error(getSupabaseConfigurationErrorMessage());
  }
}

function isNodeFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
