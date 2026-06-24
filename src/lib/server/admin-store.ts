import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ADVENTURES,
  TRAVEL_SERVICES,
  type Adventure,
  type AdventureItineraryStep,
  type AdventureTranslation,
  type AdventureTranslations,
  type TravelService,
} from "@/lib/adventures";
import { LANGUAGES, type CopyLocale } from "@/lib/i18n";
import {
  DEFAULT_ABOUT_SECTION,
  type AboutFaqItem,
  type AboutGalleryImage,
  type AboutLocaleContent,
  type AboutNavigationItem,
  type AboutSectionId,
  type AboutSectionSettings,
  type AboutStat,
  type AboutTextItem,
  type SiteSettings,
  type TeamMember,
} from "@/lib/site-settings";
import { getInquiries, type InquiryRecord } from "@/lib/server/inquiries";
import {
  getSupabaseConfigurationErrorMessage,
  getMissingSupabaseSchemaMessage,
  isMissingSupabaseTableError,
  isSupabaseConfigured,
  supabaseRest,
} from "@/lib/server/supabase-rest";
import { translateAdventure } from "@/lib/server/translate-trip";
import { isUploadedPoster, uploadTripPoster } from "@/lib/server/storage";

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
  translations?: Adventure["translations"];
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

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-founder",
    name: "N. Ariunbold",
    role: "Co-Founder, CEO",
    image: "",
    imageAlt: "N. Ariunbold",
    order: 1,
    isVisible: true,
  },
  {
    id: "team-travel-manager",
    name: "B. Bilguun",
    role: "Co-Founder, COO",
    image: "",
    imageAlt: "B. Bilguun",
    order: 2,
    isVisible: true,
  },
];

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroBadge: "★★★★★ 1,200+ аялагчийн үнэлгээ",
  heroTitle: "Аяллаа\nнүүдэлчин хэмнэлээр",
  heroSubtitle:
    "Монгол болон дэлхийн чиглэлүүдэд жижиг групп, бизнес, expo, амралтын аяллыг орон нутгийн мэдлэгтэй баг төлөвлөн зохион байгуулна.",
  heroImage:
    "https://images.unsplash.com/photo-1547531455-ccff21cdf2c4?w=2400&q=80&fit=crop&fm=webp",
  accentColor: "#e85d2c",
  heroTextColor: "#ffffff",
  heroOverlayOpacity: 0.72,
  teamMembers: DEFAULT_TEAM_MEMBERS,
  aboutSection: DEFAULT_ABOUT_SECTION,
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

export async function getTeamMembers() {
  return (await getAdminStore()).siteSettings.teamMembers;
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
  const parsed = parseTripFromFields(formFields(formData), store.trips);

  // A newly uploaded poster file takes precedence over any existing/URL image.
  const poster = formData.get("poster");
  if (isUploadedPoster(poster)) {
    parsed.image = await uploadTripPoster(poster);
  }

  return upsertTrip(parsed);
}

export async function upsertTripFromJson(payload: unknown) {
  const store = await getAdminStore();
  return upsertTrip(parseTripFromJson(payload, store.trips));
}

export async function upsertTrip(input: Adventure) {
  const store = await getAdminStore();
  const translatedInput = await translateAdventure(input);
  const existing = store.trips.some((trip) => trip.id === input.id);

  await saveAdminStore({
    ...store,
    trips: existing
      ? store.trips.map((trip) => (trip.id === input.id ? translatedInput : trip))
      : [translatedInput, ...store.trips],
  });

  return translatedInput;
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
  const settings: Partial<SiteSettings> = {};

  if (formData.has("heroBadge")) {
    settings.heroBadge = getFormString(formData, "heroBadge") || DEFAULT_SITE_SETTINGS.heroBadge;
  }

  if (formData.has("heroTitle")) {
    settings.heroTitle = getFormString(formData, "heroTitle") || DEFAULT_SITE_SETTINGS.heroTitle;
  }

  if (formData.has("heroSubtitle")) {
    settings.heroSubtitle =
      getFormString(formData, "heroSubtitle") || DEFAULT_SITE_SETTINGS.heroSubtitle;
  }

  if (formData.has("heroImage")) {
    settings.heroImage = getFormString(formData, "heroImage") || DEFAULT_SITE_SETTINGS.heroImage;
  }

  if (formData.has("accentColor")) {
    settings.accentColor =
      getFormString(formData, "accentColor") || DEFAULT_SITE_SETTINGS.accentColor;
  }

  if (formData.has("heroTextColor")) {
    settings.heroTextColor =
      getFormString(formData, "heroTextColor") || DEFAULT_SITE_SETTINGS.heroTextColor;
  }

  if (formData.has("heroOverlayOpacity")) {
    settings.heroOverlayOpacity = getNumberFromString(
      getFormString(formData, "heroOverlayOpacity"),
      DEFAULT_SITE_SETTINGS.heroOverlayOpacity
    );
  }

  if (formData.has("aboutSectionJson")) {
    const rawAboutSection = getFormString(formData, "aboutSectionJson");
    settings.aboutSection = rawAboutSection
      ? normalizeAboutSection(JSON.parse(rawAboutSection) as unknown)
      : DEFAULT_ABOUT_SECTION;
  }

  return updateSiteSettings(settings);
}

export async function updateSiteSettingsFromJson(payload: unknown) {
  return updateSiteSettings(parseSiteSettingsFromJson(payload));
}

export async function updateSiteSettings(siteSettings: Partial<SiteSettings>) {
  const store = await getAdminStore();
  const normalized = normalizeSiteSettings({
    ...store.siteSettings,
    ...siteSettings,
    teamMembers: siteSettings.teamMembers ?? store.siteSettings.teamMembers,
  });
  await saveAdminStore({
    ...store,
    siteSettings: normalized,
  });
  return normalized;
}

export async function upsertTeamMemberFromForm(formData: FormData) {
  return upsertTeamMember(parseTeamMemberFromFields(simpleFormFields(formData)));
}

export async function upsertTeamMember(input: TeamMember) {
  const store = await getAdminStore();
  const existing = store.siteSettings.teamMembers.some((member) => member.id === input.id);

  await saveAdminStore({
    ...store,
    siteSettings: normalizeSiteSettings({
      ...store.siteSettings,
      teamMembers: existing
        ? store.siteSettings.teamMembers.map((member) =>
            member.id === input.id ? input : member
          )
        : [...store.siteSettings.teamMembers, input],
    }),
  });

  return input;
}

export async function deleteTeamMemberById(id: string) {
  const store = await getAdminStore();
  await saveAdminStore({
    ...store,
    siteSettings: normalizeSiteSettings({
      ...store.siteSettings,
      teamMembers: store.siteSettings.teamMembers.filter((member) => member.id !== id),
    }),
  });
}

async function getSupabaseAdminStore() {
  const [tripRows, serviceRows, settingsRows] = await Promise.all([
    supabaseRest<AdminTripRow[]>("/admin_trips?select=*&order=sort_order.asc"),
    supabaseRest<AdminServiceRow[]>("/admin_services?select=*&order=sort_order.asc"),
    supabaseRest<SiteSettingsRow[]>("/site_settings?select=*&id=eq.default&limit=1"),
  ]);

  return normalizeStore({
    trips: tripRows.map((row) => ({
      ...row.payload,
      translations: row.payload.translations ?? row.translations,
    })),
    services: serviceRows.map((row) => row.payload),
    siteSettings: settingsRows[0]?.settings,
  });
}

async function saveSupabaseAdminStore(store: AdminStore) {
  // Upsert first so a failure never leaves the tables empty, then prune the
  // rows that no longer exist. This avoids the data-loss window of the old
  // delete-all-then-insert-all approach.
  await Promise.all([
    upsertSupabaseRows("/admin_trips", store.trips.map(toSupabaseTripRow)),
    upsertSupabaseRows("/admin_services", store.services.map(toSupabaseServiceRow)),
    upsertSupabaseSiteSettings(store.siteSettings),
  ]);

  await Promise.all([
    deleteSupabaseRowsNotIn("/admin_trips", store.trips.map((trip) => trip.id)),
    deleteSupabaseRowsNotIn("/admin_services", store.services.map((service) => service.id)),
  ]);
}

async function upsertSupabaseRows(path: string, rows: Array<{ id: string }>) {
  if (rows.length === 0) {
    return;
  }

  await supabaseRest<unknown[]>(path, {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: JSON.stringify(rows),
  });
}

async function deleteSupabaseRowsNotIn(path: string, ids: string[]) {
  if (ids.length === 0) {
    await supabaseRest<null>(`${path}?id=not.is.null`, { method: "DELETE" });
    return;
  }

  const list = ids.map((id) => `"${encodeURIComponent(id)}"`).join(",");
  await supabaseRest<null>(`${path}?id=not.in.(${list})`, { method: "DELETE" });
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
    translations: trip.translations ?? {},
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
    teamMembers: Array.isArray(payload.teamMembers)
      ? normalizeTeamMembers(payload.teamMembers)
      : undefined,
    aboutSection: isRecord(payload.aboutSection)
      ? normalizeAboutSection(payload.aboutSection)
      : undefined,
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

function normalizeSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
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
    teamMembers: normalizeTeamMembers(settings.teamMembers),
    aboutSection: normalizeAboutSection(settings.aboutSection),
  };
}

function normalizeAboutSection(input: unknown): AboutSectionSettings {
  const inputRecord = isRecord(input) ? input : {};
  const normalized = {} as AboutSectionSettings;

  for (const language of LANGUAGES) {
    const locale = language.code;
    const defaults = DEFAULT_ABOUT_SECTION[locale];
    const value = isRecord(inputRecord[locale]) ? inputRecord[locale] : {};

    normalized[locale] = normalizeAboutLocale(value, defaults);
  }

  return normalized;
}

function normalizeAboutLocale(
  value: Record<string, unknown>,
  defaults: AboutLocaleContent
): AboutLocaleContent {
  const who = isRecord(value.who) ? value.who : {};
  const values = isRecord(value.values) ? value.values : {};
  const team = isRecord(value.team) ? value.team : {};
  const work = isRecord(value.work) ? value.work : {};
  const cta = isRecord(value.cta) ? value.cta : {};
  const faq = isRecord(value.faq) ? value.faq : {};

  return {
    eyebrow: stringifyPayloadValue(value.eyebrow) || defaults.eyebrow,
    title: stringifyPayloadValue(value.title) || defaults.title,
    body: stringifyPayloadValue(value.body) || defaults.body,
    navigation: normalizeAboutNavigation(value.navigation, defaults.navigation),
    who: {
      label: stringifyPayloadValue(who.label) || defaults.who.label,
      text: stringifyPayloadValue(who.text) || defaults.who.text,
      order: getOptionalOrder(who.order, defaults.who.order),
      isVisible: getOptionalBoolean(who.isVisible, defaults.who.isVisible),
      stats: normalizeAboutStats(who.stats, defaults.who.stats),
    },
    values: {
      label: stringifyPayloadValue(values.label) || defaults.values.label,
      order: getOptionalOrder(values.order, defaults.values.order),
      isVisible: getOptionalBoolean(values.isVisible, defaults.values.isVisible),
      items: normalizeAboutTextItems(values.items, defaults.values.items),
    },
    team: {
      label: stringifyPayloadValue(team.label) || defaults.team.label,
      order: getOptionalOrder(team.order, defaults.team.order),
      isVisible: getOptionalBoolean(team.isVisible, defaults.team.isVisible),
    },
    work: {
      label: stringifyPayloadValue(work.label) || defaults.work.label,
      title: stringifyPayloadValue(work.title) || defaults.work.title,
      body: stringifyPayloadValue(work.body) || defaults.work.body,
      order: getOptionalOrder(work.order, defaults.work.order),
      isVisible: getOptionalBoolean(work.isVisible, defaults.work.isVisible),
      items: normalizeAboutTextItems(work.items, defaults.work.items),
    },
    gallery: normalizeAboutGallery(value.gallery, defaults.gallery),
    cta: {
      label: stringifyPayloadValue(cta.label) || defaults.cta.label,
      href: stringifyPayloadValue(cta.href) || defaults.cta.href,
      isVisible: getOptionalBoolean(cta.isVisible, defaults.cta.isVisible),
    },
    faq: {
      eyebrow: stringifyPayloadValue(faq.eyebrow) || defaults.faq.eyebrow,
      title: stringifyPayloadValue(faq.title) || defaults.faq.title,
      subtitle: stringifyPayloadValue(faq.subtitle) || defaults.faq.subtitle,
      order: getOptionalOrder(faq.order, defaults.faq.order),
      isVisible: getOptionalBoolean(faq.isVisible, defaults.faq.isVisible),
      items: normalizeFaqItems(faq.items, defaults.faq.items),
    },
  };
}

function normalizeAboutNavigation(
  value: unknown,
  defaults: AboutNavigationItem[]
): AboutNavigationItem[] {
  const defaultById = new Map(defaults.map((item) => [item.id, item]));
  const rawItems = Array.isArray(value) ? value : defaults;
  const seen = new Set<AboutSectionId>();
  const items = rawItems
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const id = getAboutSectionId(stringifyPayloadValue(item.id));
      const fallback = id ? defaultById.get(id) : undefined;

      if (!id || !fallback || seen.has(id)) {
        return null;
      }

      seen.add(id);

      return {
        id,
        label: stringifyPayloadValue(item.label) || fallback.label,
        order: getOptionalOrder(item.order, fallback.order),
        isVisible: getOptionalBoolean(item.isVisible, fallback.isVisible),
      } satisfies AboutNavigationItem;
    })
    .filter(Boolean) as AboutNavigationItem[];

  for (const fallback of defaults) {
    if (!seen.has(fallback.id)) {
      items.push(fallback);
    }
  }

  return sortOrderedItems(items);
}

function normalizeAboutStats(value: unknown, defaults: AboutStat[]): AboutStat[] {
  const rawItems = Array.isArray(value) ? value : defaults;
  const fallback = defaults[0];
  const items = rawItems
    .map((item, index) => {
      if (!isRecord(item)) {
        return null;
      }

      const fallbackItem = defaults[index] ?? fallback;
      const valueText = stringifyPayloadValue(item.value) || fallbackItem?.value;
      const label = stringifyPayloadValue(item.label) || fallbackItem?.label;

      if (!valueText || !label) {
        return null;
      }

      return {
        value: valueText,
        label,
        order: getOptionalOrder(item.order, fallbackItem?.order ?? index + 1),
        isVisible: getOptionalBoolean(item.isVisible, fallbackItem?.isVisible ?? true),
      } satisfies AboutStat;
    })
    .filter(Boolean) as AboutStat[];

  return sortOrderedItems(items.length > 0 ? items : defaults);
}

function normalizeAboutTextItems(value: unknown, defaults: AboutTextItem[]): AboutTextItem[] {
  const rawItems = Array.isArray(value) ? value : defaults;
  const fallback = defaults[0];
  const items = rawItems
    .map((item, index) => {
      if (!isRecord(item)) {
        return null;
      }

      const fallbackItem = defaults[index] ?? fallback;
      const title = stringifyPayloadValue(item.title) || fallbackItem?.title;
      const body = stringifyPayloadValue(item.body) || fallbackItem?.body;

      if (!title || !body) {
        return null;
      }

      return {
        title,
        body,
        order: getOptionalOrder(item.order, fallbackItem?.order ?? index + 1),
        isVisible: getOptionalBoolean(item.isVisible, fallbackItem?.isVisible ?? true),
      } satisfies AboutTextItem;
    })
    .filter(Boolean) as AboutTextItem[];

  return sortOrderedItems(items.length > 0 ? items : defaults);
}

function normalizeAboutGallery(value: unknown, defaults: AboutGalleryImage[]): AboutGalleryImage[] {
  const rawItems = Array.isArray(value) ? value : defaults;
  const items = rawItems
    .map((item, index) => {
      if (!isRecord(item)) {
        return null;
      }

      const fallbackItem = defaults[index];
      const src = stringifyPayloadValue(item.src) || fallbackItem?.src;
      const alt = stringifyPayloadValue(item.alt) || fallbackItem?.alt || "Nomadabe Travel route planning";
      const id =
        stringifyPayloadValue(item.id) ||
        slugify(stringifyPayloadValue(item.caption) || alt || `about-gallery-${index + 1}`) ||
        `about-gallery-${index + 1}`;

      if (!src) {
        return null;
      }

      return {
        id,
        src,
        alt,
        caption: stringifyPayloadValue(item.caption) || fallbackItem?.caption,
        order: getOptionalOrder(item.order, fallbackItem?.order ?? index + 1),
        isVisible: getOptionalBoolean(item.isVisible, fallbackItem?.isVisible ?? true),
      } satisfies AboutGalleryImage;
    })
    .filter(Boolean) as AboutGalleryImage[];

  return sortOrderedItems(items.length > 0 ? items : defaults);
}

function normalizeFaqItems(value: unknown, defaults: AboutFaqItem[]): AboutFaqItem[] {
  const rawItems = Array.isArray(value) ? value : defaults;
  const fallback = defaults[0];
  const items = rawItems
    .map((item, index) => {
      if (!isRecord(item)) {
        return null;
      }

      const fallbackItem = defaults[index] ?? fallback;
      const question = stringifyPayloadValue(item.question) || fallbackItem?.question;
      const answer = stringifyPayloadValue(item.answer) || fallbackItem?.answer;

      if (!question || !answer) {
        return null;
      }

      return {
        question,
        answer,
        order: getOptionalOrder(item.order, fallbackItem?.order ?? index + 1),
        isVisible: getOptionalBoolean(item.isVisible, fallbackItem?.isVisible ?? true),
      };
    })
    .filter(Boolean) as AboutFaqItem[];

  return sortOrderedItems(items.length > 0 ? items : defaults);
}

function normalizeTeamMembers(members: unknown): TeamMember[] {
  if (!Array.isArray(members)) {
    return DEFAULT_TEAM_MEMBERS;
  }

  const normalized = members
    .map((member) => {
      if (!isRecord(member)) {
        return null;
      }

      const name = stringifyPayloadValue(member.name);
      const role = stringifyPayloadValue(member.role);
      const image = stringifyPayloadValue(member.image);
      const imageAlt = stringifyPayloadValue(member.imageAlt);
      const bio = stringifyPayloadValue(member.bio);
      const id = stringifyPayloadValue(member.id) || slugify(name || role) || randomUUID();

      if (!name && !role && !image) {
        return null;
      }

      return {
        id,
        name: name || "Нэр оруулах",
        role: role || "Албан тушаал",
        image,
        imageAlt: imageAlt || name || role || undefined,
        ...(bio ? { bio } : {}),
        order: getOptionalOrder(member.order),
        isVisible: getOptionalBoolean(member.isVisible, true),
      } satisfies TeamMember;
    })
    .filter(Boolean) as TeamMember[];

  return sortOrderedItems(normalized.length > 0 ? normalized : DEFAULT_TEAM_MEMBERS);
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
    translations: parseTranslationsFromFields(fields, existing?.translations),
    itinerary: parseItineraryField(fields.get("itinerary"), existing?.itinerary),
  } satisfies Adventure;
}

function parseTranslationsFromFields(
  fields: FieldReader,
  existing?: AdventureTranslations
): AdventureTranslations | undefined {
  const translations: AdventureTranslations = { ...(existing ?? {}) };

  for (const language of LANGUAGES) {
    const locale = language.code;

    if (locale === "mn") {
      continue;
    }

    const translation: AdventureTranslation = {
      ...translations[locale],
      title: fields.get(translationFieldName(locale, "title")) || undefined,
      location: fields.get(translationFieldName(locale, "location")) || undefined,
      country: fields.get(translationFieldName(locale, "country")) || undefined,
      groupSize: fields.get(translationFieldName(locale, "groupSize")) || undefined,
      difficulty: fields.get(translationFieldName(locale, "difficulty")) || undefined,
      tags: getOptionalListFromString(fields.get(translationFieldName(locale, "tags"))),
      summary: fields.get(translationFieldName(locale, "summary")) || undefined,
      idealFor: getOptionalListFromString(fields.get(translationFieldName(locale, "idealFor"))),
      includes: getOptionalListFromString(fields.get(translationFieldName(locale, "includes"))),
      businessSupport: getOptionalListFromString(
        fields.get(translationFieldName(locale, "businessSupport"))
      ),
    };

    translations[locale] = cleanTranslation(translation);
  }

  return Object.keys(translations).length > 0 ? translations : undefined;
}

function cleanTranslation(translation: AdventureTranslation) {
  return Object.fromEntries(
    Object.entries(translation).filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value)
    )
  ) as AdventureTranslation;
}

function translationFieldName(locale: CopyLocale, key: keyof AdventureTranslation) {
  return `translation_${locale}_${key}`;
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

function parseTeamMemberFromFields(fields: FieldReader) {
  const name = fields.get("name");
  const role = fields.get("role");

  if (!name || !role) {
    throw new Error("Team member name and role are required.");
  }

  return {
    id: fields.get("id") || slugify(name) || randomUUID(),
    name,
    role,
    image: fields.get("image"),
    imageAlt: fields.get("imageAlt") || name,
    bio: fields.get("bio") || undefined,
    order: getOptionalOrder(fields.get("order")),
    isVisible: getOptionalBoolean(fields.get("isVisible"), true),
  } satisfies TeamMember;
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

function parseItineraryField(
  value: string,
  existing?: AdventureItineraryStep[]
): AdventureItineraryStep[] | undefined {
  // Empty field (e.g. no JS / never edited) keeps whatever was already saved.
  if (!value) {
    return existing;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return existing;
  }

  if (!Array.isArray(parsed)) {
    return existing;
  }

  const steps = parsed
    .filter(isRecord)
    .map((step, index) => {
      const title = typeof step.title === "string" ? step.title.trim() : "";
      const body = typeof step.body === "string" ? step.body.trim() : "";
      const items = Array.isArray(step.items)
        ? step.items
            .filter(isRecord)
            .map((item) => ({
              time:
                typeof item.time === "string" && item.time.trim() ? item.time.trim() : undefined,
              text: typeof item.text === "string" ? item.text.trim() : "",
            }))
            .filter((item) => item.text)
        : [];

      const result: AdventureItineraryStep = {
        day: typeof step.day === "string" && step.day.trim() ? step.day.trim() : `${index + 1}`,
        title,
      };

      if (items.length > 0) {
        result.items = items;
      }

      if (body) {
        result.body = body;
      }

      return result;
    })
    .filter((step) => step.title || (step.items && step.items.length > 0));

  return steps.length > 0 ? steps : undefined;
}

function getOptionalListFromString(value: string) {
  return value ? getListFromString(value, []) : undefined;
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

function getAboutSectionId(value: string): AboutSectionId | null {
  if (["who", "values", "team", "work"].includes(value)) {
    return value as AboutSectionId;
  }

  return null;
}

function getOptionalOrder(value: unknown, fallback?: number) {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  if (Number.isFinite(numericValue)) {
    return numericValue;
  }

  return fallback;
}

function getOptionalBoolean(value: unknown, fallback = true) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "on", "1", "yes"].includes(normalized)) {
      return true;
    }

    if (["false", "off", "0", "no"].includes(normalized)) {
      return false;
    }
  }

  return fallback;
}

function sortOrderedItems<T extends { order?: number }>(items: T[]) {
  return [...items].sort((left, right) => (left.order ?? 999) - (right.order ?? 999));
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
