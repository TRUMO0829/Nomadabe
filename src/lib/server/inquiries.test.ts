import { describe, expect, it } from "vitest";
import { validateInquiry } from "./inquiries";

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
