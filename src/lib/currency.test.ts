import { describe, expect, it } from "vitest";
import { formatAmount, formatPrice, formatPriceString } from "./currency";

describe("formatAmount", () => {
  it("groups thousands", () => {
    expect(formatAmount(2990000)).toBe("2,990,000");
    expect(formatAmount(650000)).toBe("650,000");
    expect(formatAmount(999)).toBe("999");
    expect(formatAmount(1000)).toBe("1,000");
  });

  it("rounds and handles zero and negatives", () => {
    expect(formatAmount(1234.6)).toBe("1,235");
    expect(formatAmount(0)).toBe("0");
    expect(formatAmount(-1500)).toBe("-1,500");
  });

  it("does not throw on non-finite input", () => {
    expect(formatAmount(Number.NaN)).toBe("0");
    expect(formatAmount(Number.POSITIVE_INFINITY)).toBe("0");
  });

  // Grouping is done by hand precisely so server and browser agree; a locale
  // dependent result here would surface as a hydration error on every price.
  it("is independent of locale", () => {
    expect(formatPrice(2990000, "mn")).toBe(formatPrice(2990000, "ja"));
  });
});

describe("formatPrice", () => {
  it("appends the currency", () => {
    expect(formatPrice(2990000, "mn")).toBe("2,990,000 MNT");
    expect(formatPrice(1200, "en", "USD")).toBe("1,200 USD");
  });
});

describe("formatPriceString", () => {
  it("adds a localised per-night suffix", () => {
    expect(formatPriceString(280000, "mn")).toBe("280,000 MNT / хоног");
    expect(formatPriceString(280000, "en")).toBe("280,000 MNT / night");
    expect(formatPriceString(280000, "ja")).toBe("280,000 MNT / 泊");
  });
});
