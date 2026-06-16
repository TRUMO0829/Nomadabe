import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  getSupabaseConfigurationErrorMessage,
  isSupabaseConfigured,
  supabaseRest,
} from "@/lib/server/supabase-rest";

export type EmailStatus = "sent" | "queued" | "failed";

export type EmailLog = {
  id: string;
  to: string;
  subject: string;
  body: string;
  status: EmailStatus;
  provider: "resend" | "local-log";
  createdAt: string;
  error?: string;
};

type EmailLogRow = {
  id: string;
  to_email: string;
  subject: string;
  body: string;
  status: EmailStatus;
  provider: "resend" | "local-log";
  error: string | null;
  created_at: string;
};

export type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const EMAIL_LOG_FILE = path.join(DATA_DIR, "email-log.json");

export async function sendEmail(input: SendEmailInput) {
  const normalized = normalizeEmail(input);

  if (!normalized.to || !normalized.subject || !normalized.body) {
    throw new Error("Email recipient, subject and body are required.");
  }

  const baseLog = {
    id: randomUUID(),
    ...normalized,
    createdAt: new Date().toISOString(),
  };

  if (!process.env.RESEND_API_KEY) {
    return appendEmailLog({
      ...baseLog,
      status: "queued",
      provider: "local-log",
    });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.EMAIL_FROM ||
          process.env.MAIL_FROM ||
          "Nomadabe Travel <onboarding@resend.dev>",
        to: normalized.to,
        subject: normalized.subject,
        text: normalized.body,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return appendEmailLog({
      ...baseLog,
      status: "sent",
      provider: "resend",
    });
  } catch (error) {
    return appendEmailLog({
      ...baseLog,
      status: "failed",
      provider: "resend",
      error: error instanceof Error ? error.message : "Email delivery failed.",
    });
  }
}

export async function sendEmailFromForm(formData: FormData) {
  return sendEmail({
    to: getFormString(formData, "to"),
    subject: getFormString(formData, "subject"),
    body: getFormString(formData, "body"),
  });
}

export async function getEmailLogs() {
  if (isSupabaseConfigured()) {
    const logs = await supabaseRest<EmailLogRow[]>("/email_logs?select=*&order=created_at.desc&limit=200");
    return logs.map(fromSupabaseEmailLog);
  }

  if (!canUseLocalJsonStore()) {
    throw new Error(getSupabaseConfigurationErrorMessage());
  }

  return readJsonFile<EmailLog[]>(EMAIL_LOG_FILE, []);
}

async function appendEmailLog(log: EmailLog) {
  if (isSupabaseConfigured()) {
    const [saved] = await supabaseRest<EmailLogRow[]>("/email_logs", {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify(toSupabaseEmailLog(log)),
    });
    return fromSupabaseEmailLog(saved);
  }

  assertLocalJsonStoreAllowed();
  const logs = await getEmailLogs();
  const nextLogs = [log, ...logs].slice(0, 200);
  await writeJsonFile(EMAIL_LOG_FILE, nextLogs);
  return log;
}

function toSupabaseEmailLog(log: EmailLog) {
  return {
    id: log.id,
    to_email: log.to,
    subject: log.subject,
    body: log.body,
    status: log.status,
    provider: log.provider,
    error: log.error ?? null,
    created_at: log.createdAt,
  };
}

function fromSupabaseEmailLog(row: EmailLogRow): EmailLog {
  return {
    id: row.id,
    to: row.to_email,
    subject: row.subject,
    body: row.body,
    status: row.status,
    provider: row.provider,
    createdAt: row.created_at,
    error: row.error ?? undefined,
  };
}

function canUseLocalJsonStore() {
  return process.env.NODE_ENV !== "production" || process.env.NOMADABE_ALLOW_FILE_STORAGE === "1";
}

function assertLocalJsonStoreAllowed() {
  if (!canUseLocalJsonStore()) {
    throw new Error(getSupabaseConfigurationErrorMessage());
  }
}

function normalizeEmail(input: SendEmailInput) {
  return {
    to: input.to.trim().toLowerCase(),
    subject: input.subject.trim(),
    body: input.body.trim(),
  };
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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

function isNodeFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
