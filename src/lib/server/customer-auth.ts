import { randomInt, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sendEmail } from "@/lib/server/mail";
import {
  getSupabaseAnonKey,
  getSupabaseConfigurationErrorMessage,
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

type PasswordResetCode = {
  id: string;
  email: string;
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
const PASSWORD_RESET_CODES_FILE = path.join(DATA_DIR, "password-reset-codes.json");
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
    throw new Error("Зөв и-мэйл хаяг оруулна уу.");
  }

  assertLocalJsonStoreAllowed();
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

  assertLocalJsonStoreAllowed();
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
    throw new Error("Зөв и-мэйл хаяг оруулна уу.");
  }

  if (password.length < 8) {
    throw new Error("Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой.");
  }

  if (isSupabaseConfigured()) {
    const signUpResult = await createConfirmedSupabaseUser({ email, password, name });
    const customer = await upsertSupabaseProfile({
      id: signUpResult.user.id,
      email: signUpResult.user.email ?? email,
      name,
    });
    const authSession = await signInSupabaseWithPassword({ email, password });

    return {
      customer,
      session: {
        token: authSession.access_token,
        customerId: customer.id,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + authSession.expires_in * 1000).toISOString(),
      },
      emailVerificationRequired: false,
    };
  }

  assertLocalJsonStoreAllowed();
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
  return { customer, session, emailVerificationRequired: false };
}

export async function loginCustomerWithPassword(payload: {
  email?: unknown;
  password?: unknown;
}) {
  const email = normalizeIdentifier(payload.email);
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!isValidIdentifier(email) || !password) {
    throw new Error("И-мэйл болон нууц үгээ зөв оруулна уу.");
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

  assertLocalJsonStoreAllowed();
  const customers = await readJsonFile<Customer[]>(CUSTOMERS_FILE, []);
  const customer = customers.find((item) => item.email === email);

  if (!customer) {
    throw new Error("Энэ и-мэйлээр бүртгэл олдсонгүй.");
  }

  return { customer, session: await createLocalSession(customer.id) };
}

export async function requestCustomerPasswordReset(emailValue: unknown) {
  const email = normalizeIdentifier(emailValue);

  if (!isValidIdentifier(email)) {
    throw new Error("Зөв и-мэйл хаяг оруулна уу.");
  }

  const now = new Date();
  const record: PasswordResetCode = {
    id: randomUUID(),
    email,
    code: String(randomInt(100000, 1000000)),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CODE_TTL_MS).toISOString(),
  };

  if (isSupabaseConfigured()) {
    const profile = await findSupabaseProfileByEmail(email);

    if (!profile) {
      return {
        email,
        expiresAt: record.expiresAt,
        devCode: undefined,
      };
    }

    await createSupabasePasswordResetCode(record);
  } else {
    assertLocalJsonStoreAllowed();
    const codes = await readJsonFile<PasswordResetCode[]>(PASSWORD_RESET_CODES_FILE, []);
    await writeJsonFile(PASSWORD_RESET_CODES_FILE, [...codes, record].slice(-100));
  }

  await sendEmail({
    to: email,
    subject: "Nomadabe нууц үг сэргээх код",
    body: `Таны Nomadabe Travel нууц үг сэргээх код: ${record.code}. Энэ код 10 минутын дараа хүчингүй болно.`,
  });

  return {
    email,
    expiresAt: record.expiresAt,
    devCode: process.env.NODE_ENV === "production" ? undefined : record.code,
  };
}

export async function resetCustomerPassword(payload: {
  email?: unknown;
  code?: unknown;
  password?: unknown;
}) {
  const email = normalizeIdentifier(payload.email);
  const code = typeof payload.code === "string" ? payload.code.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!isValidIdentifier(email) || !/^\d{6}$/.test(code)) {
    throw new Error("И-мэйл болон 6 оронтой кодоо зөв оруулна уу.");
  }

  if (password.length < 8) {
    throw new Error("Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой.");
  }

  const now = new Date().toISOString();
  const match = isSupabaseConfigured()
    ? await findSupabasePasswordResetCode(email, code, now)
    : await findLocalPasswordResetCode(email, code, Date.now());

  if (!match) {
    throw new Error("Код буруу эсвэл хугацаа дууссан байна.");
  }

  if (isSupabaseConfigured()) {
    const profile = await findSupabaseProfileByEmail(email);

    if (!profile) {
      throw new Error("Энэ и-мэйлээр бүртгэл олдсонгүй.");
    }

    await updateSupabaseUserPassword(profile.id, password);
    await markSupabasePasswordResetCodeUsed(match.id, now);
    const authSession = await signInSupabaseWithPassword({ email, password });

    return {
      customer: fromSupabaseProfile(profile),
      session: {
        token: authSession.access_token,
        customerId: profile.id,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + authSession.expires_in * 1000).toISOString(),
      },
    };
  }

  assertLocalJsonStoreAllowed();
  const codes = await readJsonFile<PasswordResetCode[]>(PASSWORD_RESET_CODES_FILE, []);
  await writeJsonFile(
    PASSWORD_RESET_CODES_FILE,
    codes.map((item) =>
      item.email === match.email && item.code === match.code && item.createdAt === match.createdAt
        ? { ...item, usedAt: now }
        : item
    )
  );

  const customers = await readJsonFile<Customer[]>(CUSTOMERS_FILE, []);
  const customer = customers.find((item) => item.email === email);

  if (!customer) {
    throw new Error("Энэ и-мэйлээр бүртгэл олдсонгүй.");
  }

  return { customer, session: await createLocalSession(customer.id) };
}

export async function verifyCustomerLoginCode(identifierValue: unknown, codeValue: unknown) {
  const identifier = normalizeIdentifier(identifierValue);
  const code = typeof codeValue === "string" ? codeValue.trim() : "";

  if (!isValidIdentifier(identifier) || !/^\d{6}$/.test(code)) {
    throw new Error("И-мэйл болон 6 оронтой кодоо зөв оруулна уу.");
  }

  assertLocalJsonStoreAllowed();
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
    throw new Error("Код буруу эсвэл хугацаа дууссан байна.");
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

  if (!canUseLocalJsonStore()) {
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
  if (isSupabaseConfigured()) {
    return;
  }

  if (!canUseLocalJsonStore()) {
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
  assertLocalJsonStoreAllowed();
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function canUseLocalJsonStore() {
  return process.env.NODE_ENV !== "production" || process.env.NOMADABE_ALLOW_FILE_AUTH === "1";
}

function assertLocalJsonStoreAllowed() {
  if (!canUseLocalJsonStore()) {
    throw new Error(getSupabaseConfigurationErrorMessage());
  }
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
  assertLocalJsonStoreAllowed();
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

type SupabaseSignUpResponse = {
  user: SupabaseAuthUser | null;
  session: SupabasePasswordSession | null;
};

type SupabaseAdminCreateUserResponse = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

type PasswordResetCodeRow = {
  id: string;
  email: string;
  code: string;
  created_at: string;
  expires_at: string;
  used_at: string | null;
};

async function createConfirmedSupabaseUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}) {
  const supabaseUrl = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? process.env.SUPABASE_SERVICE_KEY?.trim() ?? "";

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Бүртгэлийн үйлчилгээ тохируулагдаагүй байна.");
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

  const user = (await response.json()) as SupabaseAdminCreateUserResponse;

  return {
    user: {
      id: user.id,
      email: user.email ?? email,
      user_metadata: user.user_metadata,
    },
    session: null,
  } satisfies SupabaseSignUpResponse;
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
    throw new Error("Нэвтрэх үйлчилгээ тохируулагдаагүй байна.");
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

async function findSupabaseProfileByEmail(email: string) {
  const [profile] = await supabaseRest<SupabaseProfile[]>(
    `/profiles?select=*&email=eq.${encodeURIComponent(email)}&limit=1`
  );

  return profile ? profile : null;
}

async function createSupabasePasswordResetCode(record: PasswordResetCode) {
  await supabaseRest<PasswordResetCodeRow[]>("/password_reset_codes", {
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

async function findSupabasePasswordResetCode(email: string, code: string, now: string) {
  const [row] = await supabaseRest<PasswordResetCodeRow[]>(
    `/password_reset_codes?select=*&email=eq.${encodeURIComponent(email)}&code=eq.${encodeURIComponent(
      code
    )}&used_at=is.null&expires_at=gt.${encodeURIComponent(now)}&order=created_at.desc&limit=1`
  );

  return row ? fromSupabasePasswordResetCode(row) : null;
}

async function markSupabasePasswordResetCodeUsed(id: string, usedAt: string) {
  await supabaseRest<PasswordResetCodeRow[]>(
    `/password_reset_codes?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: JSON.stringify({ used_at: usedAt }),
    }
  );
}

async function updateSupabaseUserPassword(userId: string, password: string) {
  const supabaseUrl = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? process.env.SUPABASE_SERVICE_KEY?.trim() ?? "";

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Нууц үг сэргээх үйлчилгээ тохируулагдаагүй байна.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw new Error(await getSupabaseError(response));
  }
}

async function findLocalPasswordResetCode(email: string, code: string, now: number) {
  assertLocalJsonStoreAllowed();
  const codes = await readJsonFile<PasswordResetCode[]>(PASSWORD_RESET_CODES_FILE, []);
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

function fromSupabasePasswordResetCode(row: PasswordResetCodeRow): PasswordResetCode {
  return {
    id: row.id,
    email: row.email,
    code: row.code,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    usedAt: row.used_at ?? undefined,
  };
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
