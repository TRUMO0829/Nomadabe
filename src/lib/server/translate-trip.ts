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

  const translations: AdventureTranslations = {
    ...existingTranslations,
    mn: toSourceTranslation(input),
  };

  for (const locale of TARGET_LOCALES) {
    translations[locale] = await translateAdventureToLocale(
      input,
      locale,
      existingTranslations[locale]
    );
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
  return {
    title: existing?.title || (await translateText(adventure.title, locale)),
    location: existing?.location || (await translateText(adventure.location, locale)),
    country: existing?.country || (await translateText(adventure.country, locale)),
    groupSize: existing?.groupSize || (await translateText(adventure.groupSize, locale)),
    difficulty: existing?.difficulty || (await translateText(adventure.difficulty, locale)),
    tags: existing?.tags?.length ? existing.tags : await translateList(adventure.tags, locale),
    summary: existing?.summary || (await translateText(adventure.summary, locale)),
    idealFor: existing?.idealFor?.length
      ? existing.idealFor
      : await translateList(adventure.idealFor, locale),
    includes: existing?.includes?.length
      ? existing.includes
      : await translateList(adventure.includes, locale),
    businessSupport: existing?.businessSupport?.length
      ? existing.businessSupport
      : await translateList(adventure.businessSupport, locale),
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
  const translated: string[] = [];

  for (const value of values) {
    translated.push(await translateText(value, target));
  }

  return translated;
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
