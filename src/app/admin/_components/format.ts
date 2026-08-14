import { isBuiltInTravelCategory, type Adventure, type BuiltInTravelCategory } from "@/lib/adventures";
import type { CopyLocale } from "@/lib/i18n";
import type { AdventureTranslation } from "@/lib/adventures";

export type CategoryOption = { value: string; label: string };

// Labels for the built-in categories. Admin-defined categories fall back to
// their raw value — see getCategoryLabel.
export const defaultCategoryLabels: Record<BuiltInTravelCategory, string> = {
  business: "Бизнес",
  festival: "Festival",
  leisure: "Амралт",
  custom: "Захиалгат",
};

export function getDateInputValue(value?: string) {
  if (!value) {
    return undefined;
  }

  if (/^\d{4}-\d{2}$/.test(value)) {
    return `${value}-01`;
  }

  return value;
}

export function translationFieldName(locale: Exclude<CopyLocale, "mn">, key: keyof AdventureTranslation) {
  return `translation_${locale}_${key}`;
}

export function getCategoryOptions(trips: Adventure[]): CategoryOption[] {
  const categories = new Map<string, string>();

  for (const [value, label] of Object.entries(defaultCategoryLabels)) {
    categories.set(value, label);
  }

  for (const trip of trips) {
    categories.set(trip.category, getCategoryLabel(trip.category));
  }

  return Array.from(categories, ([value, label]) => ({ value, label }));
}

export function getCategoryLabel(category: string) {
  return isBuiltInTravelCategory(category) ? defaultCategoryLabels[category] : category;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatRelativeDate(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));

  if (diffMinutes < 1) {
    return "Дөнгөж сая";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} минутын өмнө`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} цагийн өмнө`;
  }

  return formatDate(value);
}

export function formatStatusLabel(value: string) {
  const labels: Record<string, string> = {
    new: "Шинэ",
    contacted: "Холбогдсон",
    confirmed: "Баталгаажсан",
    closed: "Хаагдсан",
    sent: "Илгээгдсэн",
    queued: "Дараалалд",
    failed: "Амжилтгүй",
    trip: "Аялал",
    business: "Бизнес",
    festival: "Festival",
    expo: "Экспо",
    custom: "Захиалгат",
    general: "Ерөнхий",
    leisure: "Амралт",
  };

  return labels[value] ?? value;
}
