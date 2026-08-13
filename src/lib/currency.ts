import type { CopyLocale } from "./i18n";

export const DEFAULT_CURRENCY = "MNT";

// Every locale we ship groups thousands with a comma, so grouping is done by
// hand instead of Intl.NumberFormat. Node and the browser can ship different
// ICU data, and a mismatch here would surface as a React hydration error on
// every price on the page.
const GROUP_SEPARATOR = ",";

const PER_NIGHT_SUFFIX: Record<CopyLocale, string> = {
  mn: "хоног",
  en: "night",
  zh: "晚",
  ja: "泊",
  ko: "박",
};

export function formatAmount(amount: number) {
  if (!Number.isFinite(amount)) {
    return "0";
  }

  const digits = Math.round(Math.abs(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEPARATOR);

  return amount < 0 ? `-${digits}` : digits;
}

/** A one-off total, e.g. a trip package price: `2,990,000 MNT`. */
export function formatPrice(
  amount: number,
  _locale: CopyLocale,
  currency: string = DEFAULT_CURRENCY
) {
  return `${formatAmount(amount)} ${currency}`;
}

/** A nightly rate, e.g. a villa: `280,000 MNT / хоног`. */
export function formatPriceString(
  amount: number,
  locale: CopyLocale,
  currency: string = DEFAULT_CURRENCY
) {
  const suffix = PER_NIGHT_SUFFIX[locale] ?? PER_NIGHT_SUFFIX.mn;
  return `${formatPrice(amount, locale, currency)} / ${suffix}`;
}
