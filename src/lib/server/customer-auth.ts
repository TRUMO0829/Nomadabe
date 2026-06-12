import { randomInt, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sendEmail } from "@/lib/server/mail";
import {
  getSupabaseAnonKey,
  getSupabaseError,
  getSupabaseUrl,
  isSupabaseConfigured,
  supabaseRest,
} from "@/lib/server/supabase-rest";

export type Customer = {
  id: string;
  email: string;
  name?: string;
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
  return raw.toLowerCase();
}

export function isValidIdentifier(identifier: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
}

export async function requestCustomerLoginCode(identifierValue: unknown) {
  const identifier = normalizeIdentifier(identifierValue);

  if (!isValidIdentifier(identifier)) {
    throw new Error("Valid email address is required.");
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

  const delivery = "email";
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

  return {
    identifier,
    delivery,
    expiresAt: record.expiresAt,
    devCode: process.env.NODE_ENV === "production" ? undefined : code,
  };
}

export async function getCustomers() {
  if (isSupabaseConfigured()) {
    const customers = await supabaseRest<SupabaseProfile[]>(
      "/profiles?select=*&order=updated_at.desc"
    );
    return customers.map(fromSupabaseProfile);
  }

  const customers = await readJsonFile<Customer[]>(CUSTOMERS_FILE, []);
  return customers.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function registerCustomerWithPassword(payload: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
}) {
  const email = normalizeIdentifier(payload.email);
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!isValidIdentifier(email)) {
    throw new Error("Valid email address is required.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  if (isSupabaseConfigured()) {
    const authUser = await createSupabaseAuthUser({ email, password, name });
    const customer = await upsertSupabaseProfile({
      id: authUser.id,
      email,
      name,
    });
    const session = await loginCustomerWithPassword({ email, password });
    return { customer, session: session.session };
  }

  const now = new Date().toISOString();
  const customers = await readJsonFile<Customer[]>(CUSTOMERS_FILE, []);
  const existing = customers.find((customer) => customer.email === email);
  const customer: Customer = existing
    ? { ...existing, name: name || existing.name, updatedAt: now }
    : { id: randomUUID(), email, name: name || undefined, createdAt: now, updatedAt: now };

  await writeJsonFile(
    CUSTOMERS_FILE,
    existing
      ? customers.map((item) => (item.id === customer.id ? customer : item))
      : [customer, ...customers]
  );

  const session = await createLocalSession(customer.id);
  return { customer, session };
}

export async function loginCustomerWithPassword(payload: {
  email?: unknown;
  password?: unknown;
}) {
  const email = normalizeIdentifier(payload.email);
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!isValidIdentifier(email) || !password) {
    throw new Error("Valid email and password are required.");
  }

  if (isSupabaseConfigured()) {
    const authSession = await signInSupabaseWithPassword({ email, password });
    const user = authSession.user;
    const customer = await upsertSupabaseProfile({
      id: user.id,
      email: user.email ?? email,
      name: getUserName(user),
    });

    return {
      customer,
      session: {
        token: authSession.access_token,
        customerId: customer.id,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + authSession.expires_in * 1000).toISOString(),
      },
    };
  }

  const customers = await readJsonFile<Customer[]>(CUSTOMERS_FILE, []);
  const customer = customers.find((item) => item.email === email);

  if (!customer) {
    throw new Error("Account was not found.");
  }

  return { customer, session: await createLocalSession(customer.id) };
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
  const existing = customers.find((customer) => customer.email === identifier);
  const customer: Customer = existing
    ? {
        ...existing,
        updatedAt: now.toISOString(),
      }
    : {
        id: randomUUID(),
        email: identifier,
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

  const session = await createLocalSession(customer.id);

  return { customer, session };
}

export async function getCustomerFromRequest(request: Request) {
  const token = getCookie(request.headers.get("cookie") ?? "", CUSTOMER_SESSION_COOKIE);

  if (!token) {
    return null;
  }

  if (isSupabaseConfigured()) {
    const user = await getSupabaseUser(token);

    if (!user) {
      return null;
    }

    return upsertSupabaseProfile({
      id: user.id,
      email: user.email ?? "",
      name: getUserName(user),
    });
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
  if (isSupabaseConfigured()) {
    return;
  }

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
    return false;
  }

  return true;
}

async function createLocalSession(customerId: string) {
  const now = new Date();
  const session: CustomerSession = {
    token: `${randomUUID()}${randomUUID()}`,
    customerId,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
  };
  const sessions = await readJsonFile<CustomerSession[]>(SESSIONS_FILE, []);
  await writeJsonFile(SESSIONS_FILE, [session, ...sessions].slice(0, 500));
  return session;
}

type SupabaseProfile = {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
};

type SupabaseAuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

type SupabasePasswordSession = {
  access_token: string;
  expires_in: number;
  user: SupabaseAuthUser;
};

async function createSupabaseAuthUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}) {
  const supabaseUrl = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase Auth is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: name ? { name } : {},
    }),
  });

  if (!response.ok) {
    throw new Error(await getSupabaseError(response));
  }

  return (await response.json()) as SupabaseAuthUser;
}

async function signInSupabaseWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase password login is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await getSupabaseError(response));
  }

  return (await response.json()) as SupabasePasswordSession;
}

async function getSupabaseUser(token: string) {
  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SupabaseAuthUser;
}

async function upsertSupabaseProfile({
  id,
  email,
  name,
}: {
  id: string;
  email: string;
  name?: string;
}) {
  const [profile] = await supabaseRest<SupabaseProfile[]>("/profiles", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: JSON.stringify({
      id,
      email,
      name: name || null,
      updated_at: new Date().toISOString(),
    }),
  });
  return fromSupabaseProfile(profile);
}

function fromSupabaseProfile(profile: SupabaseProfile): Customer {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name ?? undefined,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

function getUserName(user: SupabaseAuthUser) {
  const name = user.user_metadata?.name;
  return typeof name === "string" ? name : undefined;
}
