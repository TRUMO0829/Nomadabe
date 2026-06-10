import { randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type InquiryType = "trip" | "business" | "expo" | "custom" | "general";
export type InquiryStatus = "new" | "contacted" | "confirmed" | "closed";

export type InquiryInput = {
  name: string;
  email?: string;
  phone?: string;
  customerId?: string;
  tripSlug?: string;
  inquiryType: InquiryType;
  travelers?: number;
  preferredDate?: string;
  message: string;
};

export type InquiryRecord = InquiryInput & {
  id: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt?: string;
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
  const customerId = asTrimmedString(payload.customerId);
  const tripSlug = asTrimmedString(payload.tripSlug);
  const message = asTrimmedString(payload.message);
  const inquiryType = asTrimmedString(payload.inquiryType) || "general";
  const travelers = asOptionalPositiveInteger(payload.travelers);
  const preferredDate = asTrimmedString(payload.preferredDate);

  if (!name || name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email address is invalid.";
  }

  if (!email && !phone) {
    errors.contact = "Email or phone number is required.";
  }

  if (!isInquiryType(inquiryType)) {
    errors.inquiryType = "Use one of: trip, business, expo, custom, general.";
  }

  if (tripSlug && inquiryType === "general") {
    errors.inquiryType = "Trip inquiries must use inquiryType trip, business, expo, or custom.";
  }

  if (payload.travelers !== undefined && travelers === undefined) {
    errors.travelers = "Travelers must be a positive whole number.";
  }

  if (preferredDate && !/^\d{4}-\d{2}(-\d{2})?$/.test(preferredDate)) {
    errors.preferredDate = "Preferred date must be YYYY-MM or YYYY-MM-DD.";
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
      email: email || undefined,
      phone: phone || undefined,
      customerId: customerId || undefined,
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
  const inquiries = await getInquiries();

  return {
    count: inquiries.length,
    lastInquiryAt: inquiries[0]?.createdAt ?? null,
  };
}

export async function getInquiries() {
  try {
    const file = await readFile(INQUIRIES_FILE, "utf8");
    const records = file
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as InquiryRecord);

    return records.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  } catch (error) {
    if (isNodeFileError(error) && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  if (!isInquiryStatus(status)) {
    throw new Error("Invalid inquiry status.");
  }

  const inquiries = await getInquiries();
  let updated: InquiryRecord | undefined;
  const nextInquiries = inquiries.map((inquiry) => {
    if (inquiry.id !== id) {
      return inquiry;
    }

    updated = {
      ...inquiry,
      status,
      updatedAt: new Date().toISOString(),
    };

    return updated;
  });

  if (!updated) {
    throw new Error("Inquiry was not found.");
  }

  await writeInquiries(nextInquiries);
  return updated;
}

export function isInquiryStatus(value: string): value is InquiryStatus {
  return ["new", "contacted", "confirmed", "closed"].includes(value);
}

async function writeInquiries(inquiries: InquiryRecord[]) {
  await mkdir(DATA_DIR, { recursive: true });
  const sorted = [...inquiries].sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  const content = sorted.map((inquiry) => JSON.stringify(inquiry)).join("\n");
  await writeFile(INQUIRIES_FILE, content ? `${content}\n` : "", "utf8");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalPositiveInteger(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isInteger(numberValue) && numberValue >= 1 ? numberValue : undefined;
}

function isInquiryType(value: string): value is InquiryType {
  return ["trip", "business", "expo", "custom", "general"].includes(value);
}

function isNodeFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
