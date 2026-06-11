import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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
        from: process.env.MAIL_FROM || "Nomadabe Travel <onboarding@resend.dev>",
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
  return readJsonFile<EmailLog[]>(EMAIL_LOG_FILE, []);
}

async function appendEmailLog(log: EmailLog) {
  const logs = await getEmailLogs();
  const nextLogs = [log, ...logs].slice(0, 200);
  await writeJsonFile(EMAIL_LOG_FILE, nextLogs);
  return log;
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
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function isNodeFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
