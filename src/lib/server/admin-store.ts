import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ADVENTURES,
  TRAVEL_SERVICES,
  normalizeAdventureImage,
  type Adventure,
  type AdventureItineraryStep,
  type AdventureTranslation,
  type AdventureTranslations,
  type TravelService,
} from "@/lib/adventures";
import { LANGUAGES, type CopyLocale } from "@/lib/i18n";
import {
  DEFAULT_ABOUT_SECTION,
  DEFAULT_STAYS,
  type StayOption,
  type AboutFaqItem,
  type AboutGalleryImage,
  type AboutLocaleContent,
  type AboutNavigationItem,
  type AboutSectionId,
  type AboutSectionSettings,
  type AboutStat,
  type AboutTextItem,
  type SiteSettings,
  type SiteReview,
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
import {
  isUploadedHeroVideo,
  isUploadedPoster,
  isUploadedReviewImage,
  uploadHeroVideo,
  uploadReviewImage,
  uploadTripPoster,
} from "@/lib/server/storage";

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

const DEFAULT_REVIEWS: SiteReview[] = [
  {
    id: "review-nomin-canton",
    name: "ÐÐ¾Ð¼Ð¸Ð½",
    location: "Ulaanbaatar",
    trip: "Canton Fair - 7 Ó©Ð´Ó©Ñ",
    message:
      "ÐÐ½Ñ ÑÐ´Ð°Ð° Canton Fair-Ð´ ÑÐ²ÑÐ°Ð½ Ð±Ð¾Ð»Ð¾ÑÐ¾Ð¾Ñ Ð±Ò¯ÑÑÐ³ÑÐ», Ð¿Ð°Ð²Ð¸Ð»ÑÐ¾Ð½, ÑÑÐ»Ð·Ð°Ð»ÑÑÐ½ ÑÐ°Ð³ Ð±Ò¯Ð³Ð´Ð¸Ð¹Ð³ Ð½Ñ ÑÑÑÐ´ÑÐ¸Ð»Ð¶ ÑÑÐ³ÑÑÐ»Ð¶ Ó©Ð³ÑÓ©Ð½ Ð½Ñ ÑÐ°Ð¼Ð³Ð¸Ð¹Ð½ Ð¸Ñ ÑÑÑÑÐ³ Ð±Ð¾Ð»ÑÐ¾Ð½.",
    rating: 5,
    createdAt: "2026-01-12T00:00:00.000Z",
  },
  {
    id: "review-temuulen-shanghai",
    name: "Ð¢ÑÐ¼Ò¯Ò¯Ð»ÑÐ½",
    location: "Ulaanbaatar",
    trip: "Ð¨Ð°Ð½ÑÐ°Ð¹ Ð±Ð¸Ð·Ð½ÐµÑ Ð°ÑÐ»Ð°Ð» - 5 Ó©Ð´Ó©Ñ",
    message:
      "ÐÐ¸ÑÐ»ÑÐ³ ÑÐ¾Ð¹ÑÐ»Ð¾ÑÐ¾Ð´ Ð±ÑÑÐ´Ð°Ð», ÑÐ¾ÑÐ¾Ð»Ñ, Ð´Ð°ÑÐ°Ð°Ð³Ð¸Ð¹Ð½ Ó©Ð´ÑÐ¸Ð¹Ð½ Ð¼Ð°ÑÑÑÑÑÑÐ³ ÑÑÑÐ´Ð°Ð½ Ó©Ó©ÑÑÐ¸Ð»Ð¶ Ó©Ð³ÑÓ©Ð½. ÐÐ¶Ð»ÑÐ½ ÑÑÐ»Ð·Ð°Ð»ÑÑÑÐ´Ð°Ð° Ð°Ð»Ð´Ð°Ð»Ð³Ò¯Ð¹ Ð°Ð¼Ð¶ÑÑÐ»ÑÐ°Ð½.",
    rating: 5,
    createdAt: "2026-01-18T00:00:00.000Z",
  },
  {
    id: "review-saruul-jeju",
    name: "Ð¡Ð°ÑÑÑÐ»",
    location: "Ulaanbaatar",
    trip: "ÐÑÐ¶Ò¯ Ð³ÑÑ Ð±Ò¯Ð»Ð¸Ð¹Ð½ Ð°ÑÐ»Ð°Ð» - 6 Ó©Ð´Ó©Ñ",
    message:
      "Ð¥Ò¯Ò¯ÑÐ´Ò¯Ò¯Ð´ÑÑÐ¹ ÑÐ²ÑÐ°Ð½ Ð±Ð¾Ð»Ð¾ÑÐ¾Ð¾Ñ ÑÓ©ÑÓ©Ð»Ð±Ó©Ñ Ð½Ñ ÑÑÑ ÑÐ°ÑÑÑ Ð±Ð¸Ñ, Ð±ÑÑÐ´Ð°Ð» Ð½Ñ Ð´Ð°Ð»Ð°Ð¹Ð´ Ð¾Ð¹Ñ Ð±Ð°Ð¹ÑÐ°Ð½ Ð½Ñ ÑÐ°Ð°Ð»Ð°Ð³Ð´ÑÐ°Ð½. Ó¨Ð´Ó©Ñ Ð±Ò¯ÑÐ¸Ð¹Ð½ Ð¼ÑÐ´ÑÑÐ»ÑÐ» ÑÐ¾Ð´Ð¾ÑÑÐ¾Ð¹ Ð¸ÑÐ´ÑÐ³ Ð±Ð°Ð¹ÑÐ°Ð½.",
    rating: 5,
    createdAt: "2026-02-02T00:00:00.000Z",
  },
];

const DEFAULT_OUTBOUND_TRIP_IMAGES: Record<string, string> = {
  zhangjiajie:
    "https://images.unsplash.com/photo-1561031454-4f1331bd2a34?w=2400&q=90&auto=format&fit=crop",
  shanghai:
    "https://images.unsplash.com/photo-1748078096261-5eff2aee113f?w=2400&q=90&auto=format&fit=crop",
  japan:
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=2400&q=90&auto=format&fit=crop",
  jeju:
    "https://images.unsplash.com/photo-1667971286457-144269b0e4d8?w=2400&q=90&auto=format&fit=crop",
  turkey:
    "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=2400&q=90&auto=format&fit=crop",
  taiwan:
    "https://images.unsplash.com/photo-1748104433499-3d492d0337cb?w=2400&q=90&auto=format&fit=crop",
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroBadge: "âââââ 1,200+ Ð°ÑÐ»Ð°Ð³ÑÐ¸Ð¹Ð½ Ò¯Ð½ÑÐ»Ð³ÑÑ",
  heroTitle: "ÐÐ°ÑÐ°Ð°Ð³Ð¸Ð¹Ð½ ÑÒ¯Ð²ÑÐ¸Ð½Ð´ Ð°ÑÐ».",
  heroSubtitle:
    "ÐÐ¾Ð½Ð³Ð¾Ð» Ð±Ð¾Ð»Ð¾Ð½ Ð´ÑÐ»ÑÐ¸Ð¹Ð½ ÑÐ¸Ð³Ð»ÑÐ»Ò¯Ò¯Ð´ÑÐ´ Ð¶Ð¸Ð¶Ð¸Ð³ Ð³ÑÑÐ¿Ð¿, Ð±Ð¸Ð·Ð½ÐµÑ, expo, Ð°Ð¼ÑÐ°Ð»ÑÑÐ½ Ð°ÑÐ»Ð»ÑÐ³ Ð¾ÑÐ¾Ð½ Ð½ÑÑÐ³Ð¸Ð¹Ð½ Ð¼ÑÐ´Ð»ÑÐ³ÑÑÐ¹ Ð±Ð°Ð³ ÑÓ©Ð»Ó©Ð²Ð»Ó©Ð½ Ð·Ð¾ÑÐ¸Ð¾Ð½ Ð±Ð°Ð¹Ð³ÑÑÐ»Ð½Ð°.",
  heroImage:
    "https://images.unsplash.com/photo-1547531455-ccff21cdf2c4?w=2400&q=90&fit=crop&fm=webp",
  heroVideos: [
    "/hero/web/hero1-1080.mp4",
    "/hero/web/hero2-1080.mp4",
    "/hero/web/hero3-1080.mp4",
    "/hero/web/hero4-1080.mp4",
  ],
  outboundTripImages: DEFAULT_OUTBOUND_TRIP_IMAGES,
  accentColor: "#e85d2c",
  heroTextColor: "#ffffff",
  heroOverlayOpacity: 0.72,
  teamMembers: DEFAULT_TEAM_MEMBERS,
  reviews: DEFAULT_REVIEWS,
  stays: DEFAULT_STAYS,
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
    // Reads must never crash a public page when storage isn't configured
    // (e.g. a Preview deploy missing Supabase env) â fall back to defaults.
    // Saving still fails loudly via saveAdminStore.
    return normalizeStore({});
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

  parsed.galleryImages = await getGalleryImagesFromForm(formData, parsed.galleryImages);

  return upsertTrip(parsed);
}

async function getGalleryImagesFromForm(formData: FormData, fallbackImages: string[]) {
  // Current URLs are submitted as hidden fields so admins replace images via local uploads only.
  const currentUrls = formData
    .getAll("galleryImageUrl")
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);

  const nextImages = await Promise.all(
    currentUrls.map(async (url, index) => {
      if (formData.has(`galleryImageRemove_${index}`)) {
        return "";
      }

      const replacement = formData.get(`galleryImageReplacement_${index}`);
      return isUploadedPoster(replacement) ? uploadTripPoster(replacement) : url;
    })
  );

  const addedImages = await Promise.all(
    formData.getAll("galleryImagesAdd").filter(isUploadedPoster).map(uploadTripPoster)
  );

  const legacyUploads = await Promise.all(
    formData.getAll("galleryImagesUpload").filter(isUploadedPoster).map(uploadTripPoster)
  );

  if (currentUrls.length === 0 && addedImages.length === 0 && legacyUploads.length === 0) {
    return fallbackImages;
  }

  return Array.from(
    new Set([...nextImages, ...addedImages, ...legacyUploads].map((image) => image.trim()).filter(Boolean))
  );
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
    settings.heroTitle =
      normalizeHeroTitle(getFormString(formData, "heroTitle")) || DEFAULT_SITE_SETTINGS.heroTitle;
  }

  if (formData.has("heroSubtitle")) {
    settings.heroSubtitle =
      getFormString(formData, "heroSubtitle") || DEFAULT_SITE_SETTINGS.heroSubtitle;
  }

  if (
    formData.has("heroImage") ||
    formData.has("heroImagePreset") ||
    formData.has("heroImageCustom")
  ) {
    settings.heroImage =
      getFormString(formData, "heroImageCustom") ||
      getFormString(formData, "heroImagePreset") ||
      getFormString(formData, "heroImage") ||
      DEFAULT_SITE_SETTINGS.heroImage;
  }

  if (formData.has("heroVideos")) {
    settings.heroVideos = getVideoListFromString(
      getFormString(formData, "heroVideos"),
      DEFAULT_SITE_SETTINGS.heroVideos
    );
  }

  const heroVideos = [...DEFAULT_SITE_SETTINGS.heroVideos];
  let hasHeroVideoUploads = false;

  for (let index = 0; index < DEFAULT_SITE_SETTINGS.heroVideos.length; index += 1) {
    const currentFieldName = `heroVideo_${index}`;
    const uploadFieldName = `heroVideoUpload_${index}`;

    if (formData.has(currentFieldName) || formData.has(uploadFieldName)) {
      hasHeroVideoUploads = true;
      const uploaded = formData.get(uploadFieldName);
      heroVideos[index] = isUploadedHeroVideo(uploaded)
        ? await uploadHeroVideo(uploaded)
        : getFormString(formData, currentFieldName) || DEFAULT_SITE_SETTINGS.heroVideos[index];
    }
  }

  if (hasHeroVideoUploads) {
    settings.heroVideos = normalizeHeroVideos(heroVideos);
  }

  const outboundTripImages: Record<string, string> = {};
  let hasOutboundTripImages = false;

  for (const key of Object.keys(DEFAULT_OUTBOUND_TRIP_IMAGES)) {
    const fieldName = `outboundTripImage_${key}`;
    const uploadFieldName = `outboundTripImageUpload_${key}`;

    if (formData.has(fieldName) || formData.has(uploadFieldName)) {
      hasOutboundTripImages = true;
      const uploaded = formData.get(uploadFieldName);
      outboundTripImages[key] = isUploadedPoster(uploaded)
        ? await uploadTripPoster(uploaded)
        : getFormString(formData, fieldName) || DEFAULT_OUTBOUND_TRIP_IMAGES[key];
    }
  }

  if (hasOutboundTripImages) {
    settings.outboundTripImages = outboundTripImages;
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

export async function upsertStaysFromForm(formData: FormData) {
  const store = await getAdminStore();
  const current = store.siteSettings.stays;
  const count = Number(formData.get("stayCount")) || current.length;
  const next: StayOption[] = [];

  for (let i = 0; i < count; i += 1) {
    const base = current[i];
    const str = (key: string) => {
      const value = formData.get(`stay_${i}_${key}`);
      return typeof value === "string" ? value.trim() : "";
    };

    const images: string[] = [];
    for (let j = 0; j < 3; j += 1) {
      const replacement = formData.get(`stay_${i}_imageReplace_${j}`);
      if (isUploadedPoster(replacement)) {
        images.push(await uploadTripPoster(replacement));
        continue;
      }
      const url = str(`imageUrl_${j}`);
      if (url) images.push(url);
    }

    next.push({
      id: str("id") || base?.id || `villa-${i + 1}`,
      title: str("title") || base?.title || "",
      type: str("type") || base?.type || "Вилла",
      nights: Number(str("nights")) || base?.nights || 0,
      price: str("price") || base?.price || "",
      guests: Number(str("guests")) || base?.guests || 0,
      rooms: Number(str("rooms")) || base?.rooms || 0,
      location: str("location") || base?.location || "",
      summary: str("summary") || base?.summary || "",
      images: images.length > 0 ? images : base?.images ?? [],
    });
  }

  return updateSiteSettings({ stays: next });
}

export async function updateSiteSettings(siteSettings: Partial<SiteSettings>) {
  const store = await getAdminStore();
  const normalized = normalizeSiteSettings({
    ...store.siteSettings,
    ...siteSettings,
    teamMembers: siteSettings.teamMembers ?? store.siteSettings.teamMembers,
    reviews: siteSettings.reviews ?? store.siteSettings.reviews,
    stays: siteSettings.stays ?? store.siteSettings.stays,
  });
  await saveAdminStore({
    ...store,
    siteSettings: normalized,
  });
  return normalized;
}

export async function addSiteReviewFromForm(formData: FormData) {
  const name = getFormString(formData, "name");
  const message = getFormString(formData, "message");

  if (name.length < 2) {
    throw new Error("ÐÑÑÑÑ 2-Ð¾Ð¾Ñ Ð´ÑÑÑ ÑÑÐ¼Ð´ÑÐ³ÑÑÑÑ Ð¾ÑÑÑÐ»Ð½Ð° ÑÑ.");
  }

  if (message.length < 8) {
    throw new Error("Ð¡ÑÑÐ³ÑÐ³Ð´Ð»ÑÑ Ð°ÑÐ°Ð¹ Ð´ÑÐ»Ð³ÑÑÑÐ½Ð³Ò¯Ð¹ Ð±Ð¸ÑÐ½Ñ Ò¯Ò¯.");
  }

  const uploadedImage = formData.get("image");
  const imageUrl = isUploadedReviewImage(uploadedImage)
    ? await uploadReviewImage(uploadedImage)
    : undefined;

  const review: SiteReview = {
    id: randomUUID(),
    name,
    location: getFormString(formData, "location") || undefined,
    trip: getFormString(formData, "trip") || undefined,
    message,
    rating: Math.min(5, Math.max(1, getNumberFromString(getFormString(formData, "rating"), 5))),
    imageUrl,
    createdAt: new Date().toISOString(),
  };

  const store = await getAdminStore();
  const reviews = [review, ...store.siteSettings.reviews].slice(0, 36);
  await updateSiteSettings({ reviews });

  return review;
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
    heroVideos: parseHeroVideosPayload(payload.heroVideos),
    outboundTripImages: normalizeOutboundTripImages(payload.outboundTripImages),
    accentColor: stringifyPayloadValue(payload.accentColor),
    heroTextColor: stringifyPayloadValue(payload.heroTextColor),
    heroOverlayOpacity: getNumberFromString(
      stringifyPayloadValue(payload.heroOverlayOpacity),
      DEFAULT_SITE_SETTINGS.heroOverlayOpacity
    ),
    teamMembers: Array.isArray(payload.teamMembers)
      ? normalizeTeamMembers(payload.teamMembers)
      : undefined,
    reviews: Array.isArray(payload.reviews) ? normalizeReviews(payload.reviews) : undefined,
    // About content is code-managed (the CMS editor was removed), so any legacy
    // value stored in Supabase is ignored â always fall back to DEFAULT_ABOUT_SECTION.
    aboutSection: undefined,
  });
}

function normalizeStore(store: Partial<AdminStore>): AdminStore {
  return {
    trips: (Array.isArray(store.trips) && store.trips.length > 0 ? store.trips : ADVENTURES).map(
      normalizeAdventureImage
    ),
    services:
      Array.isArray(store.services) && store.services.length > 0 ? store.services : TRAVEL_SERVICES,
    siteSettings: normalizeSiteSettings(store.siteSettings ?? DEFAULT_SITE_SETTINGS),
  };
}

function normalizeStays(input: unknown): StayOption[] {
  if (!Array.isArray(input) || input.length === 0) return DEFAULT_STAYS;
  const cleaned = input
    .filter((s): s is Record<string, unknown> => isRecord(s) && typeof s.id === "string")
    .map((s) => ({
      id: String(s.id),
      title: String(s.title ?? ""),
      type: String(s.type ?? "Вилла"),
      nights: Number(s.nights) || 0,
      price: String(s.price ?? ""),
      guests: Number(s.guests) || 0,
      rooms: Number(s.rooms) || 0,
      location: String(s.location ?? ""),
      summary: String(s.summary ?? ""),
      images: Array.isArray(s.images) ? s.images.map(String).filter(Boolean) : [],
    }));
  return cleaned.length > 0 ? cleaned : DEFAULT_STAYS;
}

function normalizeSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  return {
    heroBadge: settings.heroBadge || DEFAULT_SITE_SETTINGS.heroBadge,
    heroTitle: normalizeHeroTitle(settings.heroTitle || DEFAULT_SITE_SETTINGS.heroTitle),
    heroSubtitle: settings.heroSubtitle || DEFAULT_SITE_SETTINGS.heroSubtitle,
    heroImage: settings.heroImage || DEFAULT_SITE_SETTINGS.heroImage,
    heroVideos: normalizeHeroVideos(settings.heroVideos),
    outboundTripImages: normalizeOutboundTripImages(settings.outboundTripImages),
    accentColor: settings.accentColor || DEFAULT_SITE_SETTINGS.accentColor,
    heroTextColor: settings.heroTextColor || DEFAULT_SITE_SETTINGS.heroTextColor,
    heroOverlayOpacity:
      typeof settings.heroOverlayOpacity === "number"
        ? Math.min(0.9, Math.max(0.2, settings.heroOverlayOpacity))
        : DEFAULT_SITE_SETTINGS.heroOverlayOpacity,
    teamMembers: normalizeTeamMembers(settings.teamMembers),
    reviews: normalizeReviews(settings.reviews),
    stays: normalizeStays(settings.stays),
    aboutSection: normalizeAboutSection(settings.aboutSection),
  };
}

function normalizeReviews(value: unknown): SiteReview[] {
  if (!Array.isArray(value)) {
    return DEFAULT_REVIEWS;
  }

  const reviews = value
    .map((item): SiteReview | null => {
      if (!isRecord(item)) return null;

      const name = stringifyPayloadValue(item.name);
      const message = stringifyPayloadValue(item.message);

      if (!name || !message) return null;

      return {
        id: stringifyPayloadValue(item.id) || randomUUID(),
        name,
        location: stringifyPayloadValue(item.location) || undefined,
        trip: stringifyPayloadValue(item.trip) || undefined,
        message,
        rating: Math.min(5, Math.max(1, getNumberFromString(stringifyPayloadValue(item.rating), 5))),
        imageUrl: stringifyPayloadValue(item.imageUrl) || undefined,
        createdAt: stringifyPayloadValue(item.createdAt) || new Date().toISOString(),
      } satisfies SiteReview;
    })
    .filter((item): item is SiteReview => Boolean(item));

  return reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
}

function parseHeroVideosPayload(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return getVideoListFromString(value, DEFAULT_SITE_SETTINGS.heroVideos);
  }

  return undefined;
}

function normalizeHeroVideos(value: unknown) {
  if (!Array.isArray(value)) {
    return DEFAULT_SITE_SETTINGS.heroVideos;
  }

  const videos = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);

  return videos.length > 0 ? videos : DEFAULT_SITE_SETTINGS.heroVideos;
}

function normalizeOutboundTripImages(value: unknown): Record<string, string> {
  const normalized = { ...DEFAULT_OUTBOUND_TRIP_IMAGES };

  if (!isRecord(value)) {
    return normalized;
  }

  for (const key of Object.keys(normalized)) {
    const image = stringifyPayloadValue(value[key]);

    if (image) {
      normalized[key] = image;
    }
  }

  return normalized;
}

const STALE_ABOUT_DEFAULT_TEXT = new Set([
  "Connecting Mongolia with the world",
  "Nomadabe Travel Ð½Ñ Ð±Ð¸Ð·Ð½ÐµÑ Ð°ÑÐ»Ð°Ð», Ð¾Ð»Ð¾Ð½ ÑÐ»ÑÑÐ½ Ò¯Ð·ÑÑÐ³ÑÐ»ÑÐ½ (expo), ÑÓ©ÑÓ©Ð»Ð±Ó©ÑÑÑÐ¹ Ð°Ð¼ÑÐ°Ð»Ñ Ð·ÑÐ³Ð°Ð°Ð»Ð³Ð° Ð±Ð¾Ð»Ð¾Ð½ ÑÓ©Ð»Ó©Ó©Ñ Ð°ÑÐ»Ð»ÑÐ³ Ð¼ÑÑÐ³ÑÐ¶Ð»Ð¸Ð¹Ð½ ÑÒ¯Ð²ÑÐ¸Ð½Ð´ Ð·Ð¾ÑÐ¸Ð¾Ð½ Ð±Ð°Ð¹Ð³ÑÑÐ»Ð´Ð°Ð³ Ð°ÑÐ»Ð»ÑÐ½ ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸. Ð£Ð»Ð°Ð°Ð½Ð±Ð°Ð°ÑÐ°Ñ ÑÐ¾ÑÐ¾Ð´ ÑÓ©Ð²ÑÑÐ¹, 10,000 Ð³Ð°ÑÑÐ¹ Ð°ÑÐ»Ð°Ð³ÑÐ¸Ð¹Ð½ Ð°ÑÐ»Ð»ÑÐ³ Ð°Ð¼Ð¶Ð¸Ð»ÑÑÐ°Ð¹ Ð·Ð¾ÑÐ¸Ð¾Ð½ Ð±Ð°Ð¹Ð³ÑÑÐ»ÑÐ°Ð½ ÑÑÑÑÐ»Ð°Ð³Ð°ÑÐ°Ð¹.",
  "Nomadabe Travel Ð½Ñ Ð·Ó©Ð²ÑÓ©Ð½ Ð°ÑÐ»Ð°Ð» Ð·Ð¾ÑÐ¸Ð¾Ð½ Ð±Ð°Ð¹Ð³ÑÑÐ»Ð°ÑÐ°Ð°Ñ Ð³Ð°Ð´Ð½Ð° Ð±Ð¸Ð·Ð½ÐµÑ Ð·Ð¾ÑÐ¸Ð»Ð³Ð¾ÑÐ¾Ð¹ Ð°ÑÐ»Ð°Ð³ÑÐ´Ð°Ð´ Ð·Ð¾ÑÐ¸ÑÐ»ÑÐ°Ð½ Ð·Ó©Ð²Ð»Ó©Ð³Ó©Ó©, Ð»Ð¾Ð³Ð¸ÑÑÐ¸Ðº, ÑÑÐ´Ð°Ð»Ð´Ð°Ð½ Ð°Ð²Ð°Ð»Ñ, Ð±Ò¯ÑÑÑÐ³Ð´ÑÑÒ¯Ò¯Ð½ ÑÑÐ´Ð°Ð»Ð³Ð°Ð°, Ð¾Ð»Ð¾Ð½ ÑÐ»ÑÑÐ½ Ò¯Ð·ÑÑÐ³ÑÐ»ÑÐ½Ð³Ð¸Ð¹Ð½ Ð´ÑÐ¼Ð¶Ð»ÑÐ³Ð¸Ð¹Ð³ Ð½ÑÐ³ Ð´Ð¾Ñ Ò¯Ð·Ò¯Ò¯Ð»Ð´ÑÐ³. ÐÐ¸Ð» Ð±Ò¯Ñ 2,000 Ð³Ð°ÑÑÐ¹ Ð°ÑÐ»Ð°Ð³ÑÐ¸Ð¹Ð³ ÑÒ¯Ð»ÑÑÐ½ Ð°Ð²Ñ, Ð±Ð¸Ð·Ð½ÐµÑ Ð±Ð¾Ð»Ð¾Ð½ Ð°Ð¼ÑÐ°Ð»ÑÑÐ½ Ð°ÑÐ»Ð»ÑÐ³ Ð±Ð¾Ð´Ð¸Ñ Ð·Ð¾ÑÐ¸Ð¾Ð½ Ð±Ð°Ð¹Ð³ÑÑÐ»Ð°Ð»ÑÑÐ°Ð¹ ÑÐ¾Ð»Ð±Ð¾Ð´Ð¾Ð³.",
  "ÐÓ©Ð²ÑÓ©Ð½ Ð°ÑÐ»Ð°Ð» Ð±Ð¸Ñ â Ð±Ð¸Ð·Ð½ÐµÑÐ¸Ð¹Ð½ ÑÐ¸Ð¹Ð´ÑÐ»",
  "ÐÑÐ»Ð»ÑÐ½ ÑÐ²ÑÐ°Ð´ Ð±Ð°ÑÐ°Ð° Ð±Ò¯ÑÑÑÐ³Ð´ÑÑÒ¯Ò¯Ð½ ÑÑÐ´Ð»Ð°Ñ, Ò¯Ð¹Ð»Ð´Ð²ÑÑÐ»ÑÐ³Ñ, Ð½Ð¸Ð¹Ð»Ò¯Ò¯Ð»ÑÐ³ÑÑÑÐ¹ ÑÐ¾Ð»Ð±Ð¾Ð³Ð´Ð¾Ñ, Ð¸Ð¼Ð¿Ð¾ÑÑ, Ð±Ð¾ÑÐ»ÑÑÐ»Ð°Ð»Ñ, ÑÐ°Ð½ÑÒ¯Ò¯Ð¶Ð¸Ð»Ñ, Ð»Ð¾Ð³Ð¸ÑÑÐ¸ÐºÐ¸Ð¹Ð½ Ð±Ð¾Ð´Ð¸Ñ Ð·Ó©Ð²Ð»Ó©Ð³Ó©Ó© Ð°Ð²Ð°Ñ Ð±Ð¾Ð»Ð¾Ð¼Ð¶Ð¸Ð¹Ð³ Ð¾Ð»Ð³Ð¾Ð½Ð¾.",
  "ÐÐ¸ÑÐ»ÑÐ³, Ð±ÑÑÐ´Ð°Ð», eSIM/Ð´Ð°ÑÐ° SIM, Ð´Ð°Ð°ÑÐ³Ð°Ð», Ð¾ÑÑÑÑÐ»Ð°Ð³Ñ, ÑÓ©ÑÓ©Ñ, Ð±Ð¸Ð·Ð½ÐµÑ Ð·Ó©Ð²Ð»Ó©Ð³Ó©Ó©, ÑÑÑÐ²ÑÑ Ð»Ð¾Ð³Ð¸ÑÑÐ¸ÐºÐ¸Ð¹Ð³ Ð½ÑÐ³ Ð±Ð°Ð³ÑÐ°Ð´ Ð±Ð°Ð³ÑÐ°Ð°ÑÐ°Ð½ ÑÑÐ» Ð°ÑÐ»Ð°Ð³Ñ Ð·Ó©Ð²ÑÓ©Ð½ ÑÒ¯Ð½ÑÑÑ Ò¯Ò¯ÑÑÑÐ´ Ð³Ð°ÑÐ°ÑÐ°Ð´ ÑÐ°Ð½Ð³Ð°Ð»ÑÑÐ°Ð¹.",
  "Canton Fair, SNEC PV+, SIAL Shanghai Ð·ÑÑÑÐ³ Ð´ÑÐ»ÑÐ¸Ð¹Ð½ ÑÐ¾Ð¼Ð¾Ð¾ÑÐ¾Ð½ Ò¯Ð·ÑÑÐ³ÑÐ»ÑÐ½Ð´ Ð¾ÑÐ¾Ð»ÑÐ¾Ð¶, ÑÐ¸Ð½Ñ Ð±Ò¯ÑÑÑÐ³Ð´ÑÑÒ¯Ò¯Ð½, Ð½Ð¸Ð¹Ð»Ò¯Ò¯Ð»ÑÐ³Ñ, ÑÒ¯Ð½ÑÐ»ÑÐ»Ð¸Ð¹Ð½ Ð±Ð¾Ð»Ð¾Ð¼Ð¶Ð¸Ð¹Ð³ Ð½ÑÑÐ½Ñ.",
  "ÐÑÐ»Ð°Ð», Ð±Ð¸Ð·Ð½ÐµÑ Ð·Ó©Ð²Ð»Ó©Ð³Ó©Ó©, ÑÑÐ´Ð°Ð»Ð´Ð°Ð½ Ð°Ð²Ð°Ð»Ñ, Ð»Ð¾Ð³Ð¸ÑÑÐ¸Ðº, Ð¾ÑÑÑÑÐ»Ð³Ð°, ÑÓ©ÑÓ©ÑÐ¸Ð¹Ð½ Ð´ÑÐ¼Ð¶Ð»ÑÐ³Ð¸Ð¹Ð³ ÑÑÑÐ³ÑÐ»ÑÑÐ¹, Ð½Ð°Ð¹Ð´Ð²Ð°ÑÑÐ°Ð¹ Ð±Ð°Ð³ Ð½ÑÐ³ Ð´Ð¾Ñ ÑÐ°ÑÐ¸ÑÑÐ½Ð°.",
  "ÐÐ¸Ð·Ð½ÐµÑ, expo, Ð°Ð¼ÑÐ°Ð»Ñ, ÑÓ©Ð»Ó©Ó©Ñ Ð°ÑÐ»Ð»ÑÐ³ Ð½ÑÐ³ Ð´Ð¾Ñ.",
  "ÐÐ¸Ð´ Ð±Ð¸Ð·Ð½ÐµÑ Ð°ÑÐ»Ð°Ð», Ð¾Ð»Ð¾Ð½ ÑÐ»ÑÑÐ½ Ò¯Ð·ÑÑÐ³ÑÐ»ÑÐ½ (expo), ÑÓ©ÑÓ©Ð»Ð±Ó©ÑÑÑÐ¹ Ð°Ð¼ÑÐ°Ð»Ñ Ð·ÑÐ³Ð°Ð°Ð»Ð³Ð° Ð±Ð¾Ð»Ð¾Ð½ ÑÓ©Ð»Ó©Ó©Ñ Ð°ÑÐ»Ð»ÑÐ³ ÑÓ©Ð»Ó©Ð²Ð»Ó©Ð¶, Ð·Ó©Ð²Ð»Ó©Ð³Ó©Ó©, Ð¾ÑÑÑÑÐ»Ð³Ð°, ÑÓ©ÑÓ©Ñ, Ð»Ð¾Ð³Ð¸ÑÑÐ¸ÐºÐ¸Ð¹Ð½ Ð´ÑÐ¼Ð¶Ð»ÑÐ³ÑÑÐ¹Ð³ÑÑÑ Ð±Ð¾Ð´Ð¸ÑÐ¾Ð¾Ñ Ð³Ò¯Ð¹ÑÑÑÐ³ÑÐ´ÑÐ³.",
  "ÐÐ¼Ð¿Ð¾ÑÑ ÑÑÐ»Ò¯Ò¯Ð»ÑÑ, Ð±Ð¸Ð·Ð½ÐµÑÑÑ Ó©ÑÐ³Ó©Ð¶Ò¯Ò¯Ð»ÑÑ, ÑÐ¸Ð½Ñ Ð±Ð°ÑÐ°Ð° Ð±Ò¯ÑÑÑÐ³Ð´ÑÑÒ¯Ò¯Ð½, Ò¯Ð¹Ð»Ð´Ð²ÑÑÐ»ÑÐ³Ñ, Ð½Ð¸Ð¹Ð»Ò¯Ò¯Ð»ÑÐ³Ñ ÑÑÐ´Ð»Ð°Ñ Ð·Ð¾ÑÐ¸Ð»Ð³Ð¾ÑÐ¾Ð¹ Ð°ÑÐ»Ð°Ð» â Ð±Ð¸Ð·Ð½ÐµÑ Ð·Ó©Ð²Ð»Ó©Ð³Ó©Ó©, know-how-ÑÐ¾Ð¹ ÑÐ°Ð¼Ñ.",
  "Canton Fair, SNEC PV+ 2026, SIAL Shanghai Ð·ÑÑÑÐ³ Ð¾Ð»Ð¾Ð½ ÑÐ»ÑÑÐ½ Ò¯Ð·ÑÑÐ³ÑÐ»ÑÐ½, ÑÑÐ´Ð°Ð»Ð´Ð°Ð°Ð½Ñ event-Ð´ Ð¾ÑÐ¾Ð»ÑÐ¾Ñ Ð°ÑÐ»Ð»ÑÐ½ Ð±Ð°Ð³Ñ.",
  "Ð£ÑÑÐ´ÑÐ¸Ð»Ð°Ð½ ÑÓ©Ð»Ó©Ð²Ð»Ó©ÑÓ©Ð½, Ð¾Ð¹Ð»Ð³Ð¾Ð¼Ð¶ÑÐ¾Ð¹ Ð¼Ð°ÑÑÑÑÑ, Ð·Ð¾ÑÐ¸Ð¾Ð½ Ð±Ð°Ð¹Ð³ÑÑÐ»Ð°Ð»ÑÑÐ°Ð¹ Ð°Ð¼ÑÐ°Ð»Ñ, Ð°ÑÐ»Ð°Ð», ÑÑÑÑÐ»Ð°Ð³Ð° ÑÐ¾ÑÐ¾Ð»ÑÐ¾Ð½ Ð°ÑÐ»Ð°Ð».",
  "ÐÑÐ»Ð°Ð³ÑÐ¸Ð¹Ð½ Ð·Ð¾ÑÐ¸Ð»Ð³Ð¾, ÑÑÐ³Ð°ÑÐ°Ð°, ÑÐ¾Ð½Ð¸ÑÑÐ¾Ð»Ð´ ÑÐ°Ð°ÑÑÑÐ»ÑÐ°Ð½ ÑÑÐ½ ÑÐ°ÑÐ°Ð½ Ð¼Ð°ÑÑÑÑÑ â ÑÐ¸Ð½Ñ ÑÐ»Ñ, ÑÐ¸Ð½Ñ Ð´ÑÑÑÐ°Ð¼Ð¶, ÑÐ¸Ð½Ñ Ð°Ð´Ð°Ð» ÑÐ²Ð´Ð°Ð».",
  "Nomadabe Travel is a professional travel company based in Ulaanbaatar, specializing in business travel, inbound tours, and outbound tours. We have successfully organized trips for over 10,000 travelers within Mongolia and to international destinations.",
  "Since 2019, we have served over 2,000 travelers annually, bridging the gap between business and leisure by connecting entrepreneurs to major international events and opportunities for sustainable growth.",
  "Showcase Mongolia",
  "We turn Mongolia's natural beauty and nomadic heritage into memorable travel experiences.",
  "Connect to the world",
  "We link travelers and businesses with international routes, exhibitions, and industry events.",
  "Trusted coordination",
  "Business and leisure trips are organized with hotels, transport, programs, and meetings aligned.",
  "Long-term opportunity",
  "Travel becomes a path to new partnerships, markets, and sustainable growth.",
  "Business, leisure, and custom trips, organized end to end.",
  "We arrange business travel, leisure travel, customized routes, international expo trips, and major industry event travel across Asia and beyond.",
  "International exhibitions, meetings, industry events, and market research trips.",
  "Leisure Tours",
  "Domestic and international holidays shaped around nature, cities, culture, and rest.",
  "Customized Tours",
  "Routes tailored for families, friends, companies, and special travel goals.",
  "Inbound + Outbound",
  "One team for trips into Mongolia and from Mongolia to the world.",
]);

function refreshStoredAboutDefault(value: string, fallback?: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return fallback || "";
  }

  return fallback && STALE_ABOUT_DEFAULT_TEXT.has(trimmed) ? fallback : trimmed;
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
    eyebrow: refreshStoredAboutDefault(
      stringifyPayloadValue(value.eyebrow),
      defaults.eyebrow
    ),
    title: refreshStoredAboutDefault(
      stringifyPayloadValue(value.title),
      defaults.title
    ),
    body: refreshStoredAboutDefault(
      stringifyPayloadValue(value.body),
      defaults.body
    ),
    navigation: normalizeAboutNavigation(value.navigation, defaults.navigation),
    who: {
      label: refreshStoredAboutDefault(
        stringifyPayloadValue(who.label),
        defaults.who.label
      ),
      text: refreshStoredAboutDefault(
        stringifyPayloadValue(who.text),
        defaults.who.text
      ),
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
      label: refreshStoredAboutDefault(
        stringifyPayloadValue(team.label),
        defaults.team.label
      ),
      order: getOptionalOrder(team.order, defaults.team.order),
      isVisible: getOptionalBoolean(team.isVisible, defaults.team.isVisible),
    },
    work: {
      label: refreshStoredAboutDefault(
        stringifyPayloadValue(work.label),
        defaults.work.label
      ),
      title: refreshStoredAboutDefault(
        stringifyPayloadValue(work.title),
        defaults.work.title
      ),
      body: refreshStoredAboutDefault(
        stringifyPayloadValue(work.body),
        defaults.work.body
      ),
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
      const rawValueText = stringifyPayloadValue(item.value);
      const label = stringifyPayloadValue(item.label) || fallbackItem?.label;
      const isExperienceStat =
        label === "ÐÐ¸Ð»Ð¸Ð¹Ð½ ÑÑÑÑÐ»Ð°Ð³Ð°" ||
        label === "Years of experience" ||
        label === "å¹´ç»éª" ||
        label === "å¹´ã®çµé¨" ||
        label === "ë ê²½í";
      const valueText =
        rawValueText === "7+" && isExperienceStat
          ? fallbackItem?.value
          : rawValueText || fallbackItem?.value;

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
      const title = refreshStoredAboutDefault(
        stringifyPayloadValue(item.title),
        fallbackItem?.title
      );
      const body = refreshStoredAboutDefault(
        stringifyPayloadValue(item.body),
        fallbackItem?.body
      );

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
        name: name || "ÐÑÑ Ð¾ÑÑÑÐ»Ð°Ñ",
        role: role || "ÐÐ»Ð±Ð°Ð½ ÑÑÑÐ°Ð°Ð»",
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
    location: fields.get("location") || existing?.location || "ÐÐ°ÑÐ¸Ð°Ð»Ð³Ð°Ñ",
    country: fields.get("country") || existing?.country || "ÐÐ°ÑÐ¸Ð°Ð»Ð³Ð°Ñ",
    days: getNumberFromString(fields.get("days"), existing?.days ?? 5),
    groupSize: fields.get("groupSize") || existing?.groupSize || "Flexible",
    difficulty: getDifficulty(fields.get("difficulty") || existing?.difficulty || "Easy"),
    price: getNumberFromString(fields.get("price"), existing?.price ?? 0),
    currency: fields.get("currency") || existing?.currency || "MNT",
    image: fields.get("image") || existing?.image || DEFAULT_SITE_SETTINGS.heroImage,
    galleryImages: getListFromString(fields.get("galleryImages"), existing?.galleryImages ?? []),
    tags: getListFromString(fields.get("tags"), existing?.tags ?? ["ÐÐ°ÑÐ¸Ð°Ð»Ð³Ð°Ñ"]),
    rating: getNumberFromString(fields.get("rating"), existing?.rating ?? 4.8),
    reviews: getNumberFromString(fields.get("reviews"), existing?.reviews ?? 0),
    category: getCategory(fields.get("categoryCustom") || fields.get("category") || existing?.category || "custom"),
    summary: fields.get("summary") || existing?.summary || "ÐÐ°ÑÐ¸Ð°Ð»Ð³Ð°Ñ Ð°ÑÐ»Ð»ÑÐ½ ÑÓ©ÑÓ©Ð»Ð±Ó©Ñ.",
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

function normalizeHeroTitle(value: string) {
  const normalized = value.replace(/\s+/g, " ").toLocaleLowerCase("mn-MN");

  if (normalized === "Ð°ÑÐ»Ð»Ð°Ð° Ð½Ò¯Ò¯Ð´ÑÐ»ÑÐ¸Ð½ ÑÑÐ¼Ð½ÑÐ»ÑÑÑ." || normalized === "Ð°ÑÐ»Ð»Ð°Ð° Ð½Ò¯Ò¯Ð´ÑÐ»ÑÐ¸Ð½ ÑÑÐ¼Ð½ÑÐ»ÑÑÑ") {
    return DEFAULT_SITE_SETTINGS.heroTitle;
  }

  return value;
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

function getVideoListFromString(value: string, fallback: string[]) {
  if (!value) {
    return fallback;
  }

  const videos = value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);

  return videos.length > 0 ? videos : fallback;
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
