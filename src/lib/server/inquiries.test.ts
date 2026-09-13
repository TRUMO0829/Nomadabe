import { describe, expect, it } from "vitest";
import {
  filterInquiries,
  getInquiryStatusLabel,
  validateInquiry,
  type InquiryRecord,
} from "./inquiries";

function makeInquiry(overrides: Partial<InquiryRecord>): InquiryRecord {
  return {
    id: "1",
    name: "Бат",
    email: "bat@example.com",
    inquiryType: "custom",
    message: "Говь руу 5 хоногийн аялал төлөвлөж байна.",
    status: "new",
    createdAt: "2026-09-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("filterInquiries", () => {
  const inquiries = [
    makeInquiry({ id: "1", name: "Бат", email: "bat@example.com", status: "new" }),
    makeInquiry({ id: "2", name: "Сараа", email: "SARAA@Mail.mn", status: "contacted" }),
    makeInquiry({ id: "3", name: "Дорж", email: undefined, status: "closed" }),
  ];

  it("returns everything without filters", () => {
    expect(filterInquiries(inquiries, {})).toHaveLength(3);
  });

  it("matches name or email case-insensitively", () => {
    expect(filterInquiries(inquiries, { query: "saraa@mail" }).map((item) => item.id)).toEqual(["2"]);
    expect(filterInquiries(inquiries, { query: "дорж" }).map((item) => item.id)).toEqual(["3"]);
  });

  it("filters by status and ignores an unknown status", () => {
    expect(filterInquiries(inquiries, { status: "closed" }).map((item) => item.id)).toEqual(["3"]);
    expect(filterInquiries(inquiries, { status: "bogus" })).toHaveLength(3);
  });
});

describe("getInquiryStatusLabel", () => {
  it("translates known statuses and passes unknown ones through", () => {
    expect(getInquiryStatusLabel("contacted")).toBe("Холбогдсон");
    expect(getInquiryStatusLabel("other")).toBe("other");
  });
});

const validInquiry = {
  name: "Бат",
  email: "bat@example.com",
  inquiryType: "custom",
  message: "Говь руу 5 хоногийн аялал төлөвлөж байна.",
};

describe("validateInquiry", () => {
  it("accepts a complete inquiry", () => {
    const result = validateInquiry(validInquiry);

    expect(result.ok).toBe(true);
  });

  // The villa form sends inquiryType "villa"; before this was allowed, every
  // villa request failed with a 400 and the lead was lost.
  it("accepts villa requests", () => {
    const result = validateInquiry({ ...validInquiry, inquiryType: "villa" });

    expect(result.ok).toBe(true);
  });

  it("rejects an unknown inquiry type", () => {
    const result = validateInquiry({ ...validInquiry, inquiryType: "family-villa" });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errors.inquiryType).toBeDefined();
  });

  it("requires an email address", () => {
    const result = validateInquiry({ ...validInquiry, email: "" });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errors.email).toBeDefined();
  });

  it("rejects a malformed email address", () => {
    const result = validateInquiry({ ...validInquiry, email: "bat-at-example" });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errors.email).toBeDefined();
  });

  it("requires a message of at least 10 characters", () => {
    const result = validateInquiry({ ...validInquiry, message: "богино" });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errors.message).toBeDefined();
  });

  it("requires a name of at least 2 characters", () => {
    const result = validateInquiry({ ...validInquiry, name: "Б" });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errors.name).toBeDefined();
  });

  it("rejects a trip inquiry left as the general type", () => {
    const result = validateInquiry({
      ...validInquiry,
      inquiryType: "general",
      tripSlug: "gobi-seven-day-private-trip",
    });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errors.inquiryType).toBeDefined();
  });

  it("rejects a non-integer traveller count", () => {
    const result = validateInquiry({ ...validInquiry, travelers: 2.5 });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errors.travelers).toBeDefined();
  });

  it("accepts YYYY-MM and YYYY-MM-DD dates but nothing else", () => {
    expect(validateInquiry({ ...validInquiry, preferredDate: "2026-09" }).ok).toBe(true);
    expect(validateInquiry({ ...validInquiry, preferredDate: "2026-09-14" }).ok).toBe(true);
    expect(validateInquiry({ ...validInquiry, preferredDate: "9 сар" }).ok).toBe(false);
  });

  it("rejects a non-object body", () => {
    expect(validateInquiry("not an object").ok).toBe(false);
    expect(validateInquiry(null).ok).toBe(false);
    expect(validateInquiry([validInquiry]).ok).toBe(false);
  });
});
