import type {
  Adventure,
  AdventureItineraryStep,
  AdventureTranslation,
  AdventureTranslations,
} from "@/lib/adventures";
import { LANGUAGES, type CopyLocale } from "@/lib/i18n";
import { parseJsonFromModelText, runReplicateText } from "@/lib/server/replicate";

/**
 * The two jobs the admin can hand to a model: draft a day-by-day programme
 * for a trip, and translate a trip into the site's other four languages.
 *
 * Both go through Replicate (see replicate.ts) and both return plain data —
 * nothing here writes to the store. Whatever comes back is validated against
 * the same shapes the admin forms produce, because a model's JSON is input,
 * not truth.
 */

const TARGET_LOCALES = LANGUAGES.map((language) => language.code).filter(
  (locale): locale is Exclude<CopyLocale, "mn"> => locale !== "mn"
);

const LOCALE_NAMES: Record<Exclude<CopyLocale, "mn">, string> = {
  en: "English",
  zh: "Simplified Chinese (简体中文)",
  ja: "Japanese (日本語)",
  ko: "Korean (한국어)",
};

// ─────────────────────────── itinerary ───────────────────────────

const ITINERARY_SYSTEM = [
  "You write day-by-day travel itineraries for a Mongolian tour operator.",
  "You reply with JSON only — no prose, no markdown fence, no commentary.",
  "All human-readable text you produce must be in Mongolian (Cyrillic).",
].join(" ");

const STRUCTURE_EXAMPLE = JSON.stringify([
  {
    day: "1",
    title: "Өдрийн гарчиг",
    items: [{ time: "09:00", text: "Үйл ажиллагааны тайлбар" }],
  },
]);

/**
 * With `source` — usually rows pasted out of a Google Sheet — the model only
 * restructures what it was given. Without it, it drafts a programme from the
 * trip's own fields.
 */
export async function generateItinerary(
  trip: Adventure,
  source = ""
): Promise<AdventureItineraryStep[]> {
  const days = Math.max(1, Math.min(30, Math.round(trip.days) || 1));
  const pasted = source.trim();

  const context = [
    `Тур: "${trip.title}"`,
    `Чиглэл: ${trip.location}, ${trip.country}`,
    `Хугацаа: ${days} өдөр`,
    trip.summary ? `Товч тайлбар: ${trip.summary}` : "",
  ].filter(Boolean);

  const instruction = pasted
    ? [
        "",
        "Доорх нь хүснэгтээс хуулсан аяллын хуваарь:",
        "-----",
        pasted.slice(0, 12000),
        "-----",
        "",
        "Үүнийг доорх JSON бүтцэд хөрвүүлнэ үү.",
        "ЗӨВХӨН дээрх текстэд байгаа мэдээллийг ашигла — шинэ өдөр, шинэ үйл",
        "ажиллагаа, байхгүй цаг зохиож нэмэхгүй. Баганын дараалал ямар ч байж",
        "болно; өдөр, цаг, тайлбарыг нь өөрөө ялгаж ойлгоорой.",
        "Цагийг эх хэвээр нь үлдээ (жишээ: 09:00, 22:30-23:00).",
      ]
    : [
        "",
        `Энэ аяллын ${days} өдрийн хөтөлбөрийг бичнэ үү.`,
        "Өдөр бүрд 3-5 цагийн хуваарьтай үйл ажиллагаа оруул.",
      ];

  const prompt = [
    ...context,
    ...instruction,
    "",
    "Яг энэ JSON бүтцээр буцаа (өөр юу ч бичихгүй):",
    STRUCTURE_EXAMPLE,
  ].join("\n");

  const text = await runReplicateText({
    system: ITINERARY_SYSTEM,
    prompt,
    // A pasted multi-day schedule can be long, and the reply repeats all of it.
    maxTokens: pasted ? 6000 : 3000,
  });

  const steps = normalizeItinerary(parseJsonFromModelText(text));

  if (steps.length === 0) {
    throw new Error("Загвар хөтөлбөр үүсгэсэнгүй. Дахин оролдоно уу.");
  }

  return steps;
}

function normalizeItinerary(parsed: unknown): AdventureItineraryStep[] {
  const list = Array.isArray(parsed)
    ? parsed
    : isRecord(parsed) && Array.isArray(parsed.itinerary)
      ? parsed.itinerary
      : [];

  return list
    .filter(isRecord)
    .map((step, index) => {
      const items = Array.isArray(step.items)
        ? step.items
            .filter(isRecord)
            .map((item) => ({
              time: text(item.time) || undefined,
              text: text(item.text),
            }))
            .filter((item) => item.text)
        : [];

      const result: AdventureItineraryStep = {
        day: text(step.day) || `${index + 1}`,
        title: text(step.title),
      };

      if (items.length > 0) {
        result.items = items;
      }

      const body = text(step.body);

      if (body) {
        result.body = body;
      }

      return result;
    })
    .filter((step) => step.title || (step.items && step.items.length > 0));
}

// ─────────────────────────── translation ───────────────────────────

const TRANSLATION_SYSTEM = [
  "You translate travel listings for a Mongolian tour operator.",
  "You reply with JSON only — no prose, no markdown fence, no commentary.",
  "Keep proper nouns, brand names and place names recognisable.",
  "Preserve the meaning exactly; do not add marketing copy that is not in the source.",
].join(" ");

/** The fields the admin's translation editor exposes, in one place. */
const TEXT_FIELDS = ["title", "location", "country", "groupSize", "difficulty", "summary"] as const;
const LIST_FIELDS = ["tags", "idealFor", "includes", "businessSupport"] as const;

export async function generateTranslations(trip: Adventure): Promise<AdventureTranslations> {
  const source: Record<string, unknown> = {};

  for (const field of TEXT_FIELDS) {
    const value = text(trip[field]);
    if (value) source[field] = value;
  }

  for (const field of LIST_FIELDS) {
    const list = Array.isArray(trip[field]) ? trip[field].map(text).filter(Boolean) : [];
    if (list.length > 0) source[field] = list;
  }

  if (Object.keys(source).length === 0) {
    throw new Error("Орчуулах текст олдсонгүй. Эхлээд аяллын мэдээллийг бөглөнө үү.");
  }

  const targets = TARGET_LOCALES.map((locale) => `"${locale}" (${LOCALE_NAMES[locale]})`).join(", ");

  const prompt = [
    "Доорх монгол хэл дээрх аяллын мэдээллийг дараах хэл рүү орчуулна уу:",
    targets,
    "",
    "Эх мэдээлэл (JSON):",
    JSON.stringify(source, null, 2),
    "",
    "Хариултыг яг энэ бүтцээр буцаа — түлхүүр бүр дээрх эх бүтэцтэй ижил байна:",
    JSON.stringify({
      en: { title: "…", summary: "…", tags: ["…"] },
      zh: { title: "…", summary: "…", tags: ["…"] },
      ja: { title: "…", summary: "…", tags: ["…"] },
      ko: { title: "…", summary: "…", tags: ["…"] },
    }),
  ].join("\n");

  const generated = await runReplicateText({
    system: TRANSLATION_SYSTEM,
    prompt,
    maxTokens: 3000,
  });

  const parsed = parseJsonFromModelText(generated);

  if (!isRecord(parsed)) {
    throw new Error("Загвар орчуулгын JSON буцаасангүй.");
  }

  const translations: AdventureTranslations = {};
  let filled = 0;

  for (const locale of TARGET_LOCALES) {
    const value = parsed[locale];

    if (!isRecord(value)) {
      continue;
    }

    const translation: AdventureTranslation = {};

    for (const field of TEXT_FIELDS) {
      const translated = text(value[field]);
      if (translated) translation[field] = translated;
    }

    for (const field of LIST_FIELDS) {
      const list = Array.isArray(value[field]) ? value[field].map(text).filter(Boolean) : [];
      if (list.length > 0) translation[field] = list;
    }

    if (Object.keys(translation).length > 0) {
      translations[locale] = translation;
      filled += 1;
    }
  }

  if (filled === 0) {
    throw new Error("Загвар нэг ч хэл рүү орчуулсангүй. Дахин оролдоно уу.");
  }

  return translations;
}

// ─────────────────────────── helpers ───────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
