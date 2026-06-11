import { randomInt, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sendEmail } from "@/lib/server/mail";

export type Customer = {
  id: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
};

type AuthCode = {
  id: string;
  identifier: string;
  code: string;
  expiresAt: string;
  createdAt: string;
  usedAt?: string;
};

type CustomerSession = {
  token: string;
  customerId: string;
  expiresAt: string;
  createdAt: string;
};

export const CUSTOMER_SESSION_COOKIE = "nomadabe_customer_session";

const DATA_DIR = path.join(process.cwd(), "data");
const CUSTOMERS_FILE = path.join(DATA_DIR, "customers.json");
const AUTH_CODES_FILE = path.join(DATA_DIR, "auth-codes.json");
const SESSIONS_FILE = path.join(DATA_DIR, "customer-sessions.json");
const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function normalizeIdentifier(value: unknown) {
  const raw = typeof value === "string" ? value.trim() : "";

  if (!raw) {
    return "";
  }

  if (raw.includes("@")) {
    return raw.toLowerCase();
  }

  const phone = raw.replace(/[^\d+]/g, "");
  return phone.startsWith("+") ? phone : phone.replace(/\+/g, "");
}

export function getIdentifierType(identifier: string) {
  return identifier.includes("@") ? "email" : "phone";
}

export function isValidIdentifier(identifier: string) {
  if (identifier.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  }

  return /^\+?\d{6,15}$/.test(identifier);
}

export async function requestCustomerLoginCode(identifierValue: unknown) {
  const identifier = normalizeIdentifier(identifierValue);

  if (!isValidIdentifier(identifier)) {
    throw new Error("Valid email or phone number is required.");
  }

  const codes = await readJsonFile<AuthCode[]>(AUTH_CODES_FILE, []);
  const code = String(randomInt(100000, 1000000));
  const now = new Date();
  const record: AuthCode = {
    id: randomUUID(),
    identifier,
    code,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CODE_TTL_MS).toISOString(),
  };

  await writeJsonFile(AUTH_CODES_FILE, [...codes, record].slice(-100));

  const delivery = getIdentifierType(identifier);
  const n8nDelivered = await sendVerificationCodeToN8n({
    identifier,
    delivery,
    code,
    expiresAt: record.expiresAt,
  });

  if (!n8nDelivered && delivery === "email") {
    await sendEmail({
      to: identifier,
      subject: "Nomadabe нэвтрэх код",
      body: `Таны Nomadabe Travel нэвтрэх код: ${code}. Энэ код 10 минутын дараа хүчингүй болно.`,
    });
  }

  if (!n8nDelivered && delivery === "phone" && process.env.NODE_ENV === "production") {
    throw new Error("Phone verification delivery is not configured.");
  }

  return {
    identifier,
    delivery,
    expiresAt: record.expiresAt,
    devCode: process.env.NODE_ENV === "production" ? undefined : code,
  };
}

export async function getCustomers() {
  const customers = await readJsonFile<Customer[]>(CUSTOMERS_FILE, []);
  return customers.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function verifyCustomerLoginCode(identifierValue: unknown, codeValue: unknown) {
  const identifier = normalizeIdentifier(identifierValue);
  const code = typeof codeValue === "string" ? codeValue.trim() : "";

  if (!isValidIdentifier(identifier) || !/^\d{6}$/.test(code)) {
    throw new Error("Valid identifier and 6-digit code are required.");
  }

  const codes = await readJsonFile<AuthCode[]>(AUTH_CODES_FILE, []);
  const now = new Date();
  const match = [...codes]
    .reverse()
    .find(
      (item) =>
        item.identifier === identifier &&
        item.code === code &&
        !item.usedAt &&
        new Date(item.expiresAt).getTime() > now.getTime()
    );

  if (!match) {
    throw new Error("Code is invalid or expired.");
  }

  const customers = await readJsonFile<Customer[]>(CUSTOMERS_FILE, []);
  const existing = customers.find((customer) =>
    identifier.includes("@") ? customer.email === identifier : customer.phone === identifier
  );
  const customer: Customer = existing
    ? {
        ...existing,
        updatedAt: now.toISOString(),
      }
    : {
        id: randomUUID(),
        ...(identifier.includes("@") ? { email: identifier } : { phone: identifier }),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

  await writeJsonFile(
    CUSTOMERS_FILE,
    existing
      ? customers.map((item) => (item.id === customer.id ? customer : item))
      : [customer, ...customers]
  );
  await writeJsonFile(
    AUTH_CODES_FILE,
    codes.map((item) => (item.id === match.id ? { ...item, usedAt: now.toISOString() } : item))
  );

  const session: CustomerSession = {
    token: `${randomUUID()}${randomUUID()}`,
    customerId: customer.id,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
  };
  const sessions = await readJsonFile<CustomerSession[]>(SESSIONS_FILE, []);
  await writeJsonFile(SESSIONS_FILE, [session, ...sessions].slice(0, 500));

  return { customer, session };
}

export async function getCustomerFromRequest(request: Request) {
  const token = getCookie(request.headers.get("cookie") ?? "", CUSTOMER_SESSION_COOKIE);

  if (!token) {
    return null;
  }

  const [sessions, customers] = await Promise.all([
    readJsonFile<CustomerSession[]>(SESSIONS_FILE, []),
    readJsonFile<Customer[]>(CUSTOMERS_FILE, []),
  ]);
  const session = sessions.find(
    (item) => item.token === token && new Date(item.expiresAt).getTime() > Date.now()
  );

  if (!session) {
    return null;
  }

  return customers.find((customer) => customer.id === session.customerId) ?? null;
}

export async function revokeCustomerSession(token: string) {
  const sessions = await readJsonFile<CustomerSession[]>(SESSIONS_FILE, []);
  await writeJsonFile(
    SESSIONS_FILE,
    sessions.filter((session) => session.token !== token)
  );
}

export function getCookie(cookieHeader: string, name: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
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

async function sendVerificationCodeToN8n({
  identifier,
  delivery,
  code,
  expiresAt,
}: {
  identifier: string;
  delivery: "email" | "phone";
  code: string;
  expiresAt: string;
}) {
  const webhookUrl = process.env.N8N_VERIFICATION_WEBHOOK_URL;

  if (!webhookUrl) {
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.N8N_VERIFICATION_WEBHOOK_SECRET
        ? { "x-nomadabe-secret": process.env.N8N_VERIFICATION_WEBHOOK_SECRET }
        : {}),
    },
    body: JSON.stringify({
      source: "nomadabe",
      identifier,
      delivery,
      email: delivery === "email" ? identifier : undefined,
      phone: delivery === "phone" ? identifier : undefined,
      code,
      expiresAt,
      message: `Таны Nomadabe Travel нэвтрэх код: ${code}. Энэ код 10 минутын дараа хүчингүй болно.`,
    }),
  });

  if (!response.ok) {
    throw new Error(`n8n verification webhook failed: ${response.status}`);
  }

  return true;
}
