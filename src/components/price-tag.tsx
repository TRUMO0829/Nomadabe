"use client";

import { useLanguage } from "./language-provider";
import { formatPrice } from "@/lib/currency";

const ON_REQUEST: Record<string, string> = {
  mn: "Үнэ тохиролцоно",
  en: "Price on request",
  zh: "价格面议",
  ja: "料金応相談",
  ko: "가격 문의",
};

/** Reactive price that converts an MNT amount into the active language's currency. */
export function PriceTag({ mnt }: { mnt: number }) {
  const { contentLocale } = useLanguage();
  if (!Number.isFinite(mnt) || mnt <= 0) {
    return <>{ON_REQUEST[contentLocale] ?? ON_REQUEST.mn}</>;
  }
  return <>{formatPrice(mnt, contentLocale)}</>;
}
