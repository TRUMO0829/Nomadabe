import type { Locale } from "./i18n";

// Prices are authored in MNT. These are approximate MNT-per-1-unit rates used to
// display the equivalent in each locale's home currency when the language changes.
const MNT_PER_UNIT: Record<Locale, number> = {
  mn: 1,
  en: 3450, // USD
  zh: 480, // CNY
  ja: 23, // JPY
  ko: 2.5, // KRW
};

type CurrencyMeta = { code: string; symbol: string; position: "before" | "after" };

const CURRENCY: Record<Locale, CurrencyMeta> = {
  mn: { code: "MNT", symbol: "₮", position: "after" },
  en: { code: "USD", symbol: "$", position: "before" },
  zh: { code: "CNY", symbol: "¥", position: "before" },
  ja: { code: "JPY", symbol: "¥", position: "before" },
  ko: { code: "KRW", symbol: "₩", position: "before" },
};

const PER_NIGHT: Record<Locale, string> = {
  mn: "хоног",
  en: "night",
  zh: "晚",
  ja: "泊",
  ko: "박",
};

export function getCurrencyMeta(locale: Locale): CurrencyMeta {
  return CURRENCY[locale] ?? CURRENCY.mn;
}

/** Convert an MNT amount into the locale's home currency (rounded whole number). */
export function convertFromMnt(mnt: number, locale: Locale): number {
  const rate = MNT_PER_UNIT[locale] ?? 1;
  return Math.round(mnt / rate);
}

/** Format an MNT amount as a price string in the locale's home currency. */
export function formatPrice(mnt: number, locale: Locale): string {
  if (!Number.isFinite(mnt) || mnt <= 0) return "";
  const meta = getCurrencyMeta(locale);
  const value = convertFromMnt(mnt, locale).toLocaleString("en-US");
  return meta.position === "before" ? `${meta.symbol}${value}` : `${value}${meta.symbol}`;
}

/** Parse the leading number out of an authored MNT price string (e.g. "280,000 MNT / хоног"). */
export function parseMntAmount(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

/** Convert an authored MNT price string, localizing a trailing per-night suffix. */
export function formatPriceString(price: string, locale: Locale): string {
  const amount = parseMntAmount(price);
  if (amount <= 0) return price;
  const hasPerNight = /хоног|night|晚|泊|박/.test(price);
  const suffix = hasPerNight ? ` / ${PER_NIGHT[locale] ?? PER_NIGHT.mn}` : "";
  return `${formatPrice(amount, locale)}${suffix}`;
}
