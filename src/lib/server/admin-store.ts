import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ADVENTURES, TRAVEL_SERVICES, type Adventure, type TravelService } from "@/lib/adventures";
import type { SiteSettings } from "@/lib/site-settings";
import { getInquiries, type InquiryRecord } from "@/lib/server/inquiries";
import {
  getSupabaseConfigurationErrorMessage,
  getMissingSupabaseSchemaMessage,
  isMissingSupabaseTableError,
  isSupabaseConfigured,
  supabaseRest,
} from "@/lib/server/supabase-rest";

export type AdminStore = {
  trips: Adventure[];
  services: TravelService[];
  siteSettings: SiteSettings;
};

export type TripBookingStat = {
  tripSlug: string;
  count: number;
};

type AdminTripRow = {
  id: string;
  slug: string;
  payload: Adventure;
  sort_order: number;
};

type AdminServiceRow = {
  id: string;
  payload: TravelService;
  sort_order: number;
};

type SiteSettingsRow = {
  id: string;
  settings: SiteSettings;
};

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "admin-store.json");

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroBadge: "★★★★★ 1,200+ аялагчийн үнэлгээ",
  heroTitle: "Аяллаа\nнүүдэлчин хэмнэлээр.",
  heroSubtitle:
    "Монгол болон дэлхийн чиглэлүүдэд жижиг групп, бизнес, expo, амралтын аяллыг орон нутгийн мэдлэгтэй баг төлөвлөн зохион байгуулна.",
  heroImage:
    "https://images.unsplash.com/photo-1547531455-ccff21cdf2c4?w=2400&q=80&auto=format&fit=crop",
  accentColor: "#e85d2c",
  heroTextColor: "#ffffff",
  heroOverlayOpacity: 0.72,
};

export async function getAdminStore() {
  if (isSupabaseConfigured()) {
    try {
      return await getSupabaseAdminStore();
    } catch (error) {
      if (isMissingSupabaseTableError(error)) {
        return normalizeStore({});
      }

      throw error;
    }
  }

  if (!canUseLocalJsonStore()) {
    throw new Error(getSupabaseConfigurationErrorMessage());
  }

  try {
    const raw = await readFile(STORE_FILE, "utf8");
    return normalizeStore(JSON.parse(raw) as Partial<AdminStore>);
  } catch (error) {
    if (isNodeFileError(error) && error.code === "ENOENT") {
      return normalizeStore({});
    }

    throw error;
  }
}

export async function saveAdminStore(store: AdminStore) {
  if (isSupabaseConfigured()) {
    try {
      await saveSupabaseAdminStore(normalizeStore(store));
    } catch (error) {
      if (isMissingSupabaseTableError(error)) {
        throw new Error(getMissingSupabaseSchemaMessage());
      }

      throw error;
    }
    return;
  }

  assertLocalJsonStoreAllowed();
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_FILE, `${JSON.stringify(normalizeStore(store), null, 2)}\n`, "utf8");
}

export async function getTrips() {
  return (await getAdminStore()).trips;
}

export async function getServices() {
  return (await getAdminStore()).services;
}

export async function getSiteSettings() {
  return (await getAdminStore()).siteSettings;
}

export async function getAdminDashboardData() {
  const [store, inquiries] = await Promise.all([getAdminStore(), getInquiries()]);

  return {
    ...store,
    inquiries,
    bookingStats: getBookingStats(inquiries),
  };
}

export async function upsertTripFromForm(formData: FormData) {
  const store = await getAdminStore();
  return upsertTrip(parseTripFromFields(formFields(formData), store.trips));
}

export async function upsertTripFromJson(payload: unknown) {
  const store = await getAdminStore();
  return upsertTrip(parseTripFromJson(payload, store.trips));
}

export async function upsertTrip(input: Adventure) {
  const store = await getAdminStore();
  const existing = store.trips.some((trip) => trip.id === input.id);

  await saveAdminStore({
    ...store,
    trips: existing
      ? store.trips.map((trip) => (trip.id === input.id ? input : trip))
      : [input, ...store.trips],
  });

  return input;
}

export async function deleteTripById(id: string) {
  const store = await getAdminStore();
  await saveAdminStore({
    ...store,
    trips: store.trips.filter((trip) => trip.id !== id),
  });
}

export async function upsertServiceFromForm(formData: FormData) {
  return upsertService(parseServiceFromFields(simpleFormFields(formData)));
}

export async function upsertServiceFromJson(payload: unknown) {
  return upsertService(parseServiceFromJson(payload));
}

export async function upsertService(input: TravelService) {
  const store = await getAdminStore();
  const existing = store.services.some((service) => service.id === input.id);

  await saveAdminStore({
    ...store,
    services: existing
      ? store.services.map((service) => (service.id === input.id ? input : service))
      : [input, ...store.services],
  });

  return input;
}

export async function deleteServiceById(id: string) {
  const store = await getAdminStore();
  await saveAdminStore({
    ...store,
    services: store.services.filter((service) => service.id !== id),
  });
}

export async function updateSiteSettingsFromForm(formData: FormData) {
  return updateSiteSettings({
    heroBadge: getFormString(formData, "heroBadge") || DEFAULT_SITE_SETTINGS.heroBadge,
    heroTitle: getFormString(formData, "heroTitle") || DEFAULT_SITE_SETTINGS.heroTitle,
    heroSubtitle: getFormString(formData, "heroSubtitle") || DEFAULT_SITE_SETTINGS.heroSubtitle,
    heroImage: getFormString(formData, "heroImage") || DEFAULT_SITE_SETTINGS.heroImage,
    accentColor: getFormString(formData, "accentColor") || DEFAULT_SITE_SETTINGS.accentColor,
    heroTextColor: getFormString(formData, "heroTextColor") || DEFAULT_SITE_SETTINGS.heroTextColor,
    heroOverlayOpacity: getNumberFromString(
      getFormString(formData, "heroOverlayOpacity"),
      DEFAULT_SITE_SETTINGS.heroOverlayOpacity
    ),
  });
}

export async function updateSiteSettingsFromJson(payload: unknown) {
  return updateSiteSettings(parseSiteSettingsFromJson(payload));
}

export async function updateSiteSettings(siteSettings: SiteSettings) {
  const store = await getAdminStore();
  const normalized = normalizeSiteSettings(siteSettings);
  await saveAdminStore({
    ...store,
    siteSettings: normalized,
  });
  return normalized;
}

async function getSupabaseAdminStore() {
  const [tripRows, serviceRows, settingsRows] = await Promise.all([
    supabaseRest<AdminTripRow[]>("/admin_trips?select=*&order=sort_order.asc"),
    supabaseRest<AdminServiceRow[]>("/admin_services?select=*&order=sort_order.asc"),
    supabaseRest<SiteSettingsRow[]>("/site_settings?select=*&id=eq.default&limit=1"),
  ]);

  return normalizeStore({
    trips: tripRows.map((row) => row.payload),
    services: serviceRows.map((row) => row.payload),
    siteSettings: settingsRows[0]?.settings,
  });
}

async function saveSupabaseAdminStore(store: AdminStore) {
  await Promise.all([
    supabaseRest<null>("/admin_trips?id=not.is.null", { method: "DELETE" }),
    supabaseRest<null>("/admin_services?id=not.is.null", { method: "DELETE" }),
    upsertSupabaseSiteSettings(store.siteSettings),
  ]);

  await Promise.all([
    store.trips.length > 0
      ? supabaseRest<AdminTripRow[]>("/admin_trips", {
          method: "POST",
          prefer: "return=representation",
          body: JSON.stringify(store.trips.map(toSupabaseTripRow)),
        })
      : Promise.resolve([]),
    store.services.length > 0
      ? supabaseRest<AdminServiceRow[]>("/admin_services", {
          method: "POST",
          prefer: "return=representation",
          body: JSON.stringify(store.services.map(toSupabaseServiceRow)),
        })
      : Promise.resolve([]),
  ]);
}

async function upsertSupabaseSiteSettings(siteSettings: SiteSettings) {
  await supabaseRest<SiteSettingsRow[]>("/site_settings", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: JSON.stringify({
      id: "default",
      settings: siteSettings,
    }),
  });
}

function toSupabaseTripRow(trip: Adventure, index: number) {
  return {
    id: trip.id,
    slug: trip.slug,
    payload: trip,
    sort_order: index,
  };
}

function toSupabaseServiceRow(service: TravelService, index: number) {
  return {
    id: service.id,
    payload: service,
    sort_order: index,
  };
}

export function getBookingCount(bookingStats: TripBookingStat[], slug: string) {
  return bookingStats.find((stat) => stat.tripSlug === slug)?.count ?? 0;
}

export function parseTripFromJson(payload: unknown, existingTrips: Adventure[]) {
  if (!isRecord(payload)) {
    throw new Error("Trip payload must be an object.");
  }

  return parseTripFromFields(
    {
      get: (key) => stringifyPayloadValue(payload[key]),
      has: (key) => Object.prototype.hasOwnProperty.call(payload, key),
    },
    existingTrips
  );
}

export function parseServiceFromJson(payload: unknown) {
  if (!isRecord(payload)) {
    throw new Error("Service payload must be an object.");
  }

  return parseServiceFromFields({
    get: (key) => stringifyPayloadValue(payload[key]),
  });
}

export function parseSiteSettingsFromJson(payload: unknown) {
  if (!isRecord(payload)) {
    throw new Error("Site settings payload must be an object.");
  }

  return normalizeSiteSettings({
    heroBadge: stringifyPayloadValue(payload.heroBadge),
    heroTitle: stringifyPayloadValue(payload.heroTitle),
    heroSubtitle: stringifyPayloadValue(payload.heroSubtitle),
    heroImage: stringifyPayloadValue(payload.heroImage),
    accentColor: stringifyPayloadValue(payload.accentColor),
    heroTextColor: stringifyPayloadValue(payload.heroTextColor),
    heroOverlayOpacity: getNumberFromString(
      stringifyPayloadValue(payload.heroOverlayOpacity),
      DEFAULT_SITE_SETTINGS.heroOverlayOpacity
    ),
  });
}

function normalizeStore(store: Partial<AdminStore>): AdminStore {
  return {
    trips: Array.isArray(store.trips) && store.trips.length > 0 ? store.trips : ADVENTURES,
    services:
      Array.isArray(store.services) && store.services.length > 0 ? store.services : TRAVEL_SERVICES,
    siteSettings: normalizeSiteSettings(store.siteSettings ?? DEFAULT_SITE_SETTINGS),
  };
}

function normalizeSiteSettings(settings: Partial<SiteSettings>) {
  return {
    heroBadge: settings.heroBadge || DEFAULT_SITE_SETTINGS.heroBadge,
    heroTitle: settings.heroTitle || DEFAULT_SITE_SETTINGS.heroTitle,
    heroSubtitle: settings.heroSubtitle || DEFAULT_SITE_SETTINGS.heroSubtitle,
    heroImage: settings.heroImage || DEFAULT_SITE_SETTINGS.heroImage,
    accentColor: settings.accentColor || DEFAULT_SITE_SETTINGS.accentColor,
    heroTextColor: settings.heroTextColor || DEFAULT_SITE_SETTINGS.heroTextColor,
    heroOverlayOpacity:
      typeof settings.heroOverlayOpacity === "number"
        ? Math.min(0.9, Math.max(0.2, settings.heroOverlayOpacity))
        : DEFAULT_SITE_SETTINGS.heroOverlayOpacity,
  };
}

function getBookingStats(inquiries: InquiryRecord[]) {
  const counts = new Map<string, number>();

  for (const inquiry of inquiries) {
    if (inquiry.tripSlug) {
      counts.set(inquiry.tripSlug, (counts.get(inquiry.tripSlug) ?? 0) + 1);
    }
  }

  return Array.from(counts, ([tripSlug, count]) => ({ tripSlug, count }));
}

type FieldReader = {
  get: (key: string) => string;
  has?: (key: string) => boolean;
};

function parseTripFromFields(fields: FieldReader, existingTrips: Adventure[]) {
  const id = fields.get("id") || randomUUID();
  const title = fields.get("title");
  const slug = slugify(fields.get("slug") || title);
  const existing = existingTrips.find((trip) => trip.id === id);

  if (!title || !slug) {
    throw new Error("Trip title and slug are required.");
  }

  return {
    id,
    slug,
    title,
    location: fields.get("location") || existing?.location || "Захиалгат",
    country: fields.get("country") || existing?.country || "Захиалгат",
    days: getNumberFromString(fields.get("days"), existing?.days ?? 5),
    groupSize: fields.get("groupSize") || existing?.groupSize || "Flexible",
    difficulty: getDifficulty(fields.get("difficulty") || existing?.difficulty || "Easy"),
    price: getNumberFromString(fields.get("price"), existing?.price ?? 0),
    currency: fields.get("currency") || existing?.currency || "MNT",
    image: fields.get("image") || existing?.image || DEFAULT_SITE_SETTINGS.heroImage,
    tags: getListFromString(fields.get("tags"), existing?.tags ?? ["Захиалгат"]),
    rating: getNumberFromString(fields.get("rating"), existing?.rating ?? 4.8),
    reviews: getNumberFromString(fields.get("reviews"), existing?.reviews ?? 0),
    category: getCategory(fields.get("categoryCustom") || fields.get("category") || existing?.category || "custom"),
    summary: fields.get("summary") || existing?.summary || "Захиалгат аяллын хөтөлбөр.",
    idealFor: getListFromString(fields.get("idealFor"), existing?.idealFor ?? []),
    includes: getListFromString(fields.get("includes"), existing?.includes ?? []),
    businessSupport: getListFromString(fields.get("businessSupport"), existing?.businessSupport ?? []),
    nextDeparture: fields.get("nextDeparture") || undefined,
    featured: fields.has?.("featured")
      ? ["true", "on", "1", "yes"].includes(fields.get("featured").toLowerCase())
      : existing?.featured ?? false,
  } satisfies Adventure;
}

function parseServiceFromFields(fields: FieldReader) {
  const title = fields.get("title");

  if (!title) {
    throw new Error("Service title is required.");
  }

  return {
    id: fields.get("id") || slugify(title) || randomUUID(),
    title,
    description: fields.get("description"),
    highlights: getListFromString(fields.get("highlights"), []),
  } satisfies TravelService;
}

function formFields(formData: FormData): FieldReader {
  return {
    get: (key) => getFormString(formData, key),
    has: (key) => (key === "featured" ? true : formData.has(key)),
  };
}

function simpleFormFields(formData: FormData): FieldReader {
  return {
    get: (key) => getFormString(formData, key),
  };
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumberFromString(value: string, fallback: number) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getListFromString(value: string, fallback: string[]) {
  if (!value) {
    return fallback;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getDifficulty(value: string): Adventure["difficulty"] {
  if (["Easy", "Moderate", "Challenging", "Tough"].includes(value)) {
    return value as Adventure["difficulty"];
  }

  return "Easy";
}

function getCategory(value: string): Adventure["category"] {
  return value.trim() || "custom";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stringifyPayloadValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function canUseLocalJsonStore() {
  return process.env.NODE_ENV !== "production" || process.env.NOMADABE_ALLOW_FILE_STORAGE === "1";
}

function assertLocalJsonStoreAllowed() {
  if (!canUseLocalJsonStore()) {
    throw new Error(getSupabaseConfigurationErrorMessage());
  }
}

function isNodeFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
