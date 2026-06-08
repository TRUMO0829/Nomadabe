import { randomUUID } from "node:crypto";
import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";

export type InquiryType = "trip" | "business" | "expo" | "custom" | "general";

export type InquiryInput = {
  name: string;
  email: string;
  phone?: string;
  tripSlug?: string;
  inquiryType: InquiryType;
  travelers?: number;
  preferredDate?: string;
  message: string;
};

export type InquiryRecord = InquiryInput & {
  id: string;
  status: "new";
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.jsonl");

export function validateInquiry(payload: unknown) {
  const errors: Record<string, string> = {};

  if (!isRecord(payload)) {
    return {
      ok: false as const,
      errors: { body: "Request body must be a JSON object." },
    };
  }

  const name = asTrimmedString(payload.name);
  const email = asTrimmedString(payload.email);
  const phone = asTrimmedString(payload.phone);
  const tripSlug = asTrimmedString(payload.tripSlug);
  const message = asTrimmedString(payload.message);
  const inquiryType = asTrimmedString(payload.inquiryType) || "general";
  const travelers = asOptionalPositiveInteger(payload.travelers);
  const preferredDate = asTrimmedString(payload.preferredDate);

  if (!name || name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Valid email is required.";
  }

  if (!isInquiryType(inquiryType)) {
    errors.inquiryType = "Use one of: trip, business, expo, custom, general.";
  }

  if (payload.travelers !== undefined && travelers === undefined) {
    errors.travelers = "Travelers must be a positive whole number.";
  }

  if (!message || message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false as const, errors };
  }

  return {
    ok: true as const,
    value: {
      name,
      email,
      phone: phone || undefined,
      tripSlug: tripSlug || undefined,
      inquiryType: inquiryType as InquiryType,
      travelers,
      preferredDate: preferredDate || undefined,
      message,
    },
  };
}

export async function saveInquiry(input: InquiryInput) {
  await mkdir(DATA_DIR, { recursive: true });

  const record: InquiryRecord = {
    ...input,
    id: randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
  };

  await appendFile(INQUIRIES_FILE, `${JSON.stringify(record)}\n`, "utf8");

  return record;
}

export async function getInquiryStats() {
  try {
    const file = await readFile(INQUIRIES_FILE, "utf8");
    const lines = file.split("\n").filter(Boolean);
    const lastLine = lines.at(-1);
    const lastRecord = lastLine ? (JSON.parse(lastLine) as InquiryRecord) : null;

    return {
      count: lines.length,
      lastInquiryAt: lastRecord?.createdAt ?? null,
    };
  } catch (error) {
    if (isNodeFileError(error) && error.code === "ENOENT") {
      return {
        count: 0,
        lastInquiryAt: null,
      };
    }

    throw error;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNodeFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalPositiveInteger(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(numberValue) || numberValue < 1) {
    return undefined;
  }

  return numberValue;
}

function isInquiryType(value: string): value is InquiryType {
  return ["trip", "business", "expo", "custom", "general"].includes(value);
}
