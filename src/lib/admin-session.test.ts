import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createAdminSessionToken,
  isAllowedAdminEmail,
  verifyAdminSessionToken,
} from "./admin-session";

const ADMIN_EMAIL = "admin@nomadabe.mn";

beforeEach(() => {
  process.env.ADMIN_EMAILS = `${ADMIN_EMAIL}, second@nomadabe.mn`;
  process.env.ADMIN_SESSION_SECRET = "test-secret-value-long-enough";
  process.env.ADMIN_SESSION_VERSION = "1";
});

afterEach(() => {
  delete process.env.ADMIN_EMAILS;
  delete process.env.ADMIN_SESSION_SECRET;
  delete process.env.ADMIN_SESSION_VERSION;
});

describe("isAllowedAdminEmail", () => {
  it("matches allow-listed addresses regardless of case and spacing", () => {
    expect(isAllowedAdminEmail(" Admin@Nomadabe.MN ")).toBe(true);
    expect(isAllowedAdminEmail("second@nomadabe.mn")).toBe(true);
  });

  it("rejects addresses that are not listed", () => {
    expect(isAllowedAdminEmail("someone@example.com")).toBe(false);
  });

  it("rejects everything when the allow-list is empty", () => {
    process.env.ADMIN_EMAILS = "";
    expect(isAllowedAdminEmail(ADMIN_EMAIL)).toBe(false);
  });
});

describe("admin session tokens", () => {
  it("round-trips a signed session", async () => {
    const { token } = await createAdminSessionToken(ADMIN_EMAIL);
    const payload = await verifyAdminSessionToken(token);

    expect(payload?.email).toBe(ADMIN_EMAIL);
  });

  it("rejects a tampered payload", async () => {
    const { token } = await createAdminSessionToken(ADMIN_EMAIL);
    const [, signature] = token.split(".");
    const forgedBody = Buffer.from(
      JSON.stringify({ email: "attacker@example.com", exp: Date.now() + 60_000, v: "1" })
    ).toString("base64url");

    expect(await verifyAdminSessionToken(`${forgedBody}.${signature}`)).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const { token } = await createAdminSessionToken(ADMIN_EMAIL);
    process.env.ADMIN_SESSION_SECRET = "a-completely-different-secret";

    expect(await verifyAdminSessionToken(token)).toBeNull();
  });

  it("rejects a session for an address removed from the allow-list", async () => {
    const { token } = await createAdminSessionToken(ADMIN_EMAIL);
    process.env.ADMIN_EMAILS = "someone-else@nomadabe.mn";

    expect(await verifyAdminSessionToken(token)).toBeNull();
  });

  // Bumping ADMIN_SESSION_VERSION is how a stolen session is revoked before its
  // seven day expiry.
  it("rejects a session issued under an earlier session version", async () => {
    const { token } = await createAdminSessionToken(ADMIN_EMAIL);
    process.env.ADMIN_SESSION_VERSION = "2";

    expect(await verifyAdminSessionToken(token)).toBeNull();
  });

  it("rejects malformed and missing tokens", async () => {
    expect(await verifyAdminSessionToken(undefined)).toBeNull();
    expect(await verifyAdminSessionToken("")).toBeNull();
    expect(await verifyAdminSessionToken("no-dot-separator")).toBeNull();
    expect(await verifyAdminSessionToken("not-base64.also-not-base64")).toBeNull();
  });
});
