import type {
  Adventure,
  AdventureTranslation,
  AdventureTranslations,
} from "@/lib/adventures";
import { LANGUAGES, type CopyLocale } from "@/lib/i18n";

type LibreTranslateResponse = {
  translatedText?: string;
};

const TARGET_LOCALES = LANGUAGES.map((language) => language.code).filter(
  (locale): locale is Exclude<CopyLocale, "mn"> => locale !== "mn"
);

export async function translateAdventure(input: Adventure): Promise<Adventure> {
  const existingTranslations = input.translations ?? {};

  if (!isTripTranslationConfigured()) {
    return {
      ...input,
      translations: {
        ...existingTranslations,
        mn: toSourceTranslation(input),
      },
    };
  }

  const translatedLocales = await Promise.all(
    TARGET_LOCALES.map(
      async (locale) =>
        [locale, await translateAdventureToLocale(input, locale, existingTranslations[locale])] as const
    )
  );

  const translations: AdventureTranslations = {
    ...existingTranslations,
    mn: toSourceTranslation(input),
  };

  for (const [locale, translation] of translatedLocales) {
    translations[locale] = translation;
  }

  return {
    ...input,
    translations,
  };
}

export function isTripTranslationConfigured() {
  return Boolean(getLibreTranslateUrl());
}

async function translateAdventureToLocale(
  adventure: Adventure,
  locale: Exclude<CopyLocale, "mn">,
  existing?: AdventureTranslation
): Promise<AdventureTranslation> {
  // Translate every field concurrently so saving a trip doesn't block on a
  // long sequential chain of LibreTranslate calls.
  const [
    title,
    location,
    country,
    groupSize,
    difficulty,
    summary,
    tags,
    idealFor,
    includes,
    businessSupport,
  ] = await Promise.all([
    existing?.title ? Promise.resolve(existing.title) : translateText(adventure.title, locale),
    existing?.location ? Promise.resolve(existing.location) : translateText(adventure.location, locale),
    existing?.country ? Promise.resolve(existing.country) : translateText(adventure.country, locale),
    existing?.groupSize ? Promise.resolve(existing.groupSize) : translateText(adventure.groupSize, locale),
    existing?.difficulty ? Promise.resolve(existing.difficulty) : translateText(adventure.difficulty, locale),
    existing?.summary ? Promise.resolve(existing.summary) : translateText(adventure.summary, locale),
    existing?.tags?.length ? Promise.resolve(existing.tags) : translateList(adventure.tags, locale),
    existing?.idealFor?.length ? Promise.resolve(existing.idealFor) : translateList(adventure.idealFor, locale),
    existing?.includes?.length ? Promise.resolve(existing.includes) : translateList(adventure.includes, locale),
    existing?.businessSupport?.length
      ? Promise.resolve(existing.businessSupport)
      : translateList(adventure.businessSupport, locale),
  ]);

  return {
    title,
    location,
    country,
    groupSize,
    difficulty,
    tags,
    summary,
    idealFor,
    includes,
    businessSupport,
  };
}

function toSourceTranslation(adventure: Adventure): AdventureTranslation {
  return {
    title: adventure.title,
    location: adventure.location,
    country: adventure.country,
    groupSize: adventure.groupSize,
    difficulty: adventure.difficulty,
    tags: adventure.tags,
    summary: adventure.summary,
    idealFor: adventure.idealFor,
    includes: adventure.includes,
    businessSupport: adventure.businessSupport,
  };
}

async function translateList(values: string[], target: Exclude<CopyLocale, "mn">) {
  return Promise.all(values.map((value) => translateText(value, target)));
}

async function translateText(value: string, target: Exclude<CopyLocale, "mn">) {
  const text = value.trim();

  if (!text) {
    return "";
  }

  try {
    const response = await fetch(`${getLibreTranslateUrl()}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: process.env.LIBRETRANSLATE_SOURCE_LANG?.trim() || "mn",
        target,
        format: "text",
        ...(process.env.LIBRETRANSLATE_API_KEY
          ? { api_key: process.env.LIBRETRANSLATE_API_KEY.trim() }
          : {}),
      }),
    });

    if (!response.ok) {
      return text;
    }

    const result = (await response.json()) as LibreTranslateResponse;
    return result.translatedText?.trim() || text;
  } catch {
    return text;
  }
}

function getLibreTranslateUrl() {
  return (process.env.LIBRETRANSLATE_URL || process.env.TRANSLATE_API_URL || "")
    .trim()
    .replace(/\/$/, "");
}
