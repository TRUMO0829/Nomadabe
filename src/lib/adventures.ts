import { getCopyLocale, type CopyLocale, type Locale } from "@/lib/i18n";
import { getHighResolutionImageUrl } from "@/lib/image-quality";

export type TravelCategory = string;

export type AdventureTranslation = {
  title?: string;
  location?: string;
  country?: string;
  groupSize?: string;
  difficulty?: string;
  tags?: string[];
  summary?: string;
  idealFor?: string[];
  includes?: string[];
  businessSupport?: string[];
};

export type AdventureTranslations = Partial<Record<CopyLocale, AdventureTranslation>>;

export type Adventure = {
  id: string;
  slug: string;
  title: string;
  location: string;
  country: string;
  days: number;
  groupSize: string;
  difficulty: "Easy" | "Moderate" | "Challenging" | "Tough";
  price: number;
  currency: string;
  image: string;
  galleryImages?: string[];
  tags: string[];
  rating: number;
  reviews: number;
  category: TravelCategory;
  summary: string;
  idealFor: string[];
  includes: string[];
  businessSupport: string[];
  nextDeparture?: string;
  featured?: boolean;
  translations?: AdventureTranslations;
  itinerary?: AdventureItineraryStep[];
};

export type AdventureText = {
  title: string;
  location: string;
  country: string;
  groupSize: string;
  difficulty: string;
  tags: string[];
  summary: string;
  idealFor: string[];
  includes: string[];
  businessSupport: string[];
  nextDeparture?: string;
};

export type AdventureItineraryItem = {
  time?: string;
  text: string;
};

export type AdventureItineraryStep = {
  day: string;
  title: string;
  body?: string;
  items?: AdventureItineraryItem[];
};

export type AdventureDetailInfo = {
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: AdventureItineraryStep[];
};

export type TravelService = {
  id: string;
  title: string;
  description: string;
  highlights: string[];
};

const CURATED_ADVENTURE_IMAGES: Record<string, string> = {
  "canton-fair-business-trip":
    "https://images.unsplash.com/photo-1729434090353-7f2c090cc7ca?w=3200&q=90&fit=crop&fm=webp",
  "gobi-seven-day-private-trip":
    "https://images.unsplash.com/photo-1613294577715-0f52ff3504a0?w=3200&q=90&fit=crop&fm=webp",
  "mongolia-festival-experience":
    "https://images.unsplash.com/photo-1613294576846-73901118ef6d?w=3200&q=90&fit=crop&fm=webp",
  "khuvsgul-lake-domestic-trip":
    "https://images.unsplash.com/photo-1630614812901-550f93e0e888?w=3200&q=90&fit=crop&fm=webp",
  "altai-domestic-trek":
    "https://images.unsplash.com/photo-1742205025826-d6ae1b3727be?w=3200&q=90&fit=crop&fm=webp",
};

const STALE_ADVENTURE_IMAGE_IDS: Record<string, string[]> = {
  "canton-fair-business-trip": ["photo-1508009603885", "photo-1753172201568"],
  "gobi-seven-day-private-trip": ["photo-1547234935", "photo-1547531455"],
  "mongolia-festival-experience": ["photo-1542662565"],
  "khuvsgul-lake-domestic-trip": ["photo-1500530855697"],
  "altai-domestic-trek": ["photo-1551632811"],
};

export function normalizeAdventureImage(adventure: Adventure): Adventure {
  const curatedImage = CURATED_ADVENTURE_IMAGES[adventure.slug];

  if (!curatedImage) {
    return adventure;
  }

  const currentImage = adventure.image || "";
  const staleIds = STALE_ADVENTURE_IMAGE_IDS[adventure.slug] ?? [];
  const shouldReplace =
    !currentImage || staleIds.some((imageId) => currentImage.includes(imageId));

  return shouldReplace ? { ...adventure, image: curatedImage } : adventure;
}

export const ADVENTURES: Adventure[] = [
  {
    id: "1",
    slug: "canton-fair-business-trip",
    title: "Canton Fair бизнес аялал",
    location: "Guangzhou",
    country: "China",
    days: 7,
    groupSize: "Limited seats",
    difficulty: "Easy",
    price: 0,
    currency: "MNT",
    image: CURATED_ADVENTURE_IMAGES["canton-fair-business-trip"],
    tags: ["Business", "Expo", "Import"],
    rating: 4.9,
    reviews: 38,
    category: "festival",
    summary:
      "Импортын бизнес эхлүүлэх, шинэ бараа бүтээгдэхүүн судлах, үйлдвэрлэгчтэй шууд холбогдох зорилготой expo аялал.",
    idealFor: [
      "Импортын бизнес эхлүүлэх гэж буй хүн",
      "Шинэ бүтээгдэхүүн, брэнд хайж буй бизнес эрхлэгч",
      "Үйлдвэрлэгчтэй шууд холбогдох хүсэлтэй хүн",
    ],
    includes: [
      "Нислэг, зочид буудлын зохион байгуулалт",
      "Дата SIM / eSIM",
      "Аяллын даатгал",
      "Мэргэжлийн орчуулагч, хөтөч",
    ],
    businessSupport: [
      "Бүтээгдэхүүн сонголтын зөвлөгөө",
      "Карго, тээвэр логистикийн чиглүүлэг",
      "Төлбөр тооцооны мэдээлэл",
    ],
    nextDeparture: "2026-10",
    featured: true,
  },
  {
    id: "2",
    slug: "snec-pv-2026-business-trip",
    title: "SNEC PV+ 2026 бизнес аялал",
    location: "Shanghai",
    country: "China",
    days: 6,
    groupSize: "Small group",
    difficulty: "Easy",
    price: 0,
    currency: "MNT",
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=3200&q=90&fit=crop&fm=webp",
    tags: ["Energy", "Expo", "Technology"],
    rating: 4.8,
    reviews: 21,
    category: "festival",
    summary:
      "Нарны эрчим хүч, шинэ технологи, тоног төхөөрөмжийн нийлүүлэгчтэй холбогдох бизнес аялал.",
    idealFor: ["Эрчим хүчний бизнес эрхлэгч", "Тоног төхөөрөмж судалж буй хүн"],
    includes: ["Expo бүртгэлийн чиглүүлэг", "Орчуулга", "Хот доторх зохион байгуулалт"],
    businessSupport: ["Үйлдвэрлэгчтэй уулзалт", "Логистикийн зөвлөгөө"],
    nextDeparture: "2026-06",
    featured: true,
  },
  {
    id: "3",
    slug: "gobi-seven-day-private-trip",
    title: "Говь 7 өдрийн аялал",
    location: "Gobi",
    country: "Mongolia",
    days: 7,
    groupSize: "2-8 travellers",
    difficulty: "Moderate",
    price: 0,
    currency: "MNT",
    image: CURATED_ADVENTURE_IMAGES["gobi-seven-day-private-trip"],
    tags: ["Gobi", "Leisure", "Culture"],
    rating: 4.9,
    reviews: 64,
    category: "leisure",
    summary:
      "Говийн байгаль, элсэн манхан, нутгийн айл, одтой шөнийг мэдрэх хувийн болон жижиг групп аялал.",
    idealFor: ["Гэр бүл", "Найз нөхөд", "Гадаад аялагч"],
    includes: ["Унаа", "Жолооч", "Буудал/гэр", "Маршрут төлөвлөлт"],
    businessSupport: [],
    featured: false,
  },
  {
    id: "7",
    slug: "mongolia-festival-experience",
    title: "Монгол фестивалийн аялал",
    location: "Улаанбаатар",
    country: "Mongolia",
    days: 5,
    groupSize: "Family / Group",
    difficulty: "Easy",
    price: 0,
    currency: "MNT",
    image: CURATED_ADVENTURE_IMAGES["mongolia-festival-experience"],
    tags: ["Domestic", "Festival", "Culture"],
    rating: 4.9,
    reviews: 44,
    category: "custom",
    summary:
      "Festival-focused Mongolia experience with cultural events, city highlights, local food, and flexible day programs.",
    idealFor: ["Culture lovers", "Families", "Friend groups"],
    includes: ["Festival program planning", "Transport coordination", "Guide support"],
    businessSupport: [],
    nextDeparture: "Flexible",
    featured: true,
  },
  {
    id: "8",
    slug: "khuvsgul-lake-domestic-trip",
    title: "Хөвсгөл нуурын аялал",
    location: "Хөвсгөл",
    country: "Mongolia",
    days: 6,
    groupSize: "Small group",
    difficulty: "Easy",
    price: 0,
    currency: "MNT",
    image: CURATED_ADVENTURE_IMAGES["khuvsgul-lake-domestic-trip"],
    tags: ["Domestic", "Lake", "Family"],
    rating: 4.8,
    reviews: 31,
    category: "leisure",
    summary:
      "A calm lake escape with forest scenery, boat time, light hiking, and family-friendly pacing.",
    idealFor: ["Families", "Nature lovers", "Relaxed travellers"],
    includes: ["Daily route", "Accommodation guidance", "Guide advice"],
    businessSupport: [],
    nextDeparture: "2026-08",
    featured: true,
  },
  {
    id: "9",
    slug: "altai-domestic-trek",
    title: "Алтайн аялал",
    location: "Баян-Өлгий",
    country: "Mongolia",
    days: 7,
    groupSize: "Small group",
    difficulty: "Moderate",
    price: 2190000,
    currency: "MNT",
    image: CURATED_ADVENTURE_IMAGES["altai-domestic-trek"],
    tags: ["Domestic", "Altai", "Trekking"],
    rating: 4.9,
    reviews: 26,
    category: "custom",
    summary:
      "A western Mongolia route with mountain scenery, local culture, and flexible trekking days.",
    idealFor: ["Adventure travellers", "Small groups", "Photography lovers"],
    includes: ["Route and timing plan", "Local partner support", "Travel preparation advice"],
    businessSupport: [],
    nextDeparture: "2026-09",
    featured: true,
  },
];

export const TRAVEL_SERVICES: TravelService[] = [
  {
    id: "business-travel",
    title: "Business travel",
    description: "Expo, supplier meetings, translation and logistics support.",
    highlights: ["Expo planning", "Supplier meetings", "Cargo guidance"],
  },
  {
    id: "custom-trips",
    title: "Custom trips",
    description: "Tailor-made Mongolia and outbound travel programs.",
    highlights: ["Private itinerary", "Local guides", "Flexible dates"],
  },
  {
    id: "visa-logistics",
    title: "Visa and logistics",
    description: "Documentation, hotel, transfers and travel support.",
    highlights: ["Visa checklist", "Hotel booking", "Airport transfer"],
  },
];

export function findAdventureBySlug(slug: string) {
  return ADVENTURES.find((adventure) => adventure.slug === slug);
}

const ADVENTURE_TEXT: Record<CopyLocale, Record<string, AdventureText>> = {
  mn: {
    "1": {
      title: "Canton Fair бизнес аялал",
      location: "Гуанжоу",
      country: "Хятад",
      groupSize: "Суудал хязгаартай",
      difficulty: "Хялбар",
      tags: ["Бизнес", "Expo", "Импорт"],
      summary:
        "Импортын бизнес эхлүүлэх, шинэ бараа бүтээгдэхүүн судлах, үйлдвэрлэгчтэй шууд холбогдох зорилготой expo аялал.",
      idealFor: [
        "Импортын бизнес эхлүүлэх гэж буй хүн",
        "Шинэ бүтээгдэхүүн, брэнд хайж буй бизнес эрхлэгч",
        "Үйлдвэрлэгч, нийлүүлэгчтэй шууд холбогдох хүсэлтэй хүн",
      ],
      includes: [
        "Нислэг, зочид буудлын зохион байгуулалт",
        "Дата SIM / eSIM",
        "Аяллын даатгал",
        "Мэргэжлийн орчуулагч, хөтөч",
      ],
      businessSupport: [
        "Бүтээгдэхүүн сонголтын зөвлөгөө",
        "Санхүүжилт, төлбөр тооцооны мэдээлэл",
        "Карго, тээвэр логистикийн чиглүүлэг",
        "Сүлжээ дэлгүүрт нийлүүлэх бараа сонгох аргачлал",
      ],
      nextDeparture: "2026.10",
    },
    "2": {
      title: "SNEC PV+ 2026 бизнес аялал",
      location: "Шанхай",
      country: "Хятад",
      groupSize: "Жижиг групп",
      difficulty: "Хялбар",
      tags: ["Эрчим хүч", "Expo", "Технологи"],
      summary:
        "Нарны эрчим хүч, battery storage, smart energy технологи судлах олон улсын үзэсгэлэнгийн аялал.",
      idealFor: [
        "Нарны эрчим хүчний бизнес сонирхогч",
        "Battery storage шийдэл хайж буй бизнес",
        "Renewable energy чиглэлээр бүтээгдэхүүн судлах хүн",
      ],
      includes: [
        "Expo аяллын маршрут",
        "Буудал, тээврийн зохион байгуулалт",
        "Орчуулагч, хөтөчийн дэмжлэг",
        "Даатгал болон аяллын зөвлөгөө",
      ],
      businessSupport: [
        "Шинэ технологи, нийлүүлэгч судлах",
        "Монголын зах зээлд тохирох шийдэл үнэлэх",
        "Бүтээгдэхүүн импортлох эхний чиглүүлэг",
      ],
      nextDeparture: "2026.06",
    },
    "3": {
      title: "SIAL Shanghai Expo бизнес аялал",
      location: "Шанхай",
      country: "Хятад",
      groupSize: "Жижиг групп",
      difficulty: "Хялбар",
      tags: ["Хүнс", "Expo", "Импорт"],
      summary:
        "Хүнсний бизнесээ тэлэх, олон улсын хүнсний брэнд, бүтээгдэхүүн, нийлүүлэгчтэй танилцах аялал.",
      idealFor: [
        "Хүнсний бизнес эрхлэгч",
        "Импортын хүнсний бүтээгдэхүүн хайж буй хүн",
        "Шинэ хүнсний брэнд нэвтрүүлэхээр төлөвлөж буй бизнес",
      ],
      includes: [
        "Expo оролцооны зохион байгуулалт",
        "Зочид буудал, тээврийн төлөвлөлт",
        "Орчуулагч, хөтөч",
        "Аяллын даатгал",
      ],
      businessSupport: [
        "Хүнсний чиг хандлага судлах",
        "Брэнд, бүтээгдэхүүний боломж үнэлэх",
        "Нийлүүлэгчтэй холбогдох дэмжлэг",
      ],
      nextDeparture: "2026.05",
    },
    "4": {
      title: "Захиалгат бизнес аялал",
      location: "Ази",
      country: "Олон чиглэл",
      groupSize: "Хувийн / багийн аялал",
      difficulty: "Хялбар",
      tags: ["Зөвлөгөө", "Судалгаа"],
      summary:
        "Танай бизнесийн зорилгод тохируулж үйлдвэрлэгч, бүтээгдэхүүн, зах зээл судлах захиалгат аялал.",
      idealFor: [
        "Одоо байгаа бизнесээ өргөжүүлэх компани",
        "Шинэ бараа бүтээгдэхүүн судлах баг",
        "Үйлдвэрлэгчтэй уулзалт хийх шаардлагатай бизнес",
      ],
      includes: [
        "Маршрут, уулзалтын төлөвлөгөө",
        "Буудал, тээврийн зөвлөгөө",
        "Орчуулагч, хөтөчийн зохион байгуулалт",
      ],
      businessSupport: [
        "Бүтээгдэхүүн судалгааны checklist",
        "Үйлдвэрлэгчтэй уулзах бэлтгэл",
        "Логистик, карго шийдлийн зөвлөгөө",
      ],
    },
    "5": {
      title: "Хөтөлбөртэй амралт зугаалга",
      location: "Ази",
      country: "Сонгосон чиглэлүүд",
      groupSize: "Гэр бүл / групп",
      difficulty: "Хялбар",
      tags: ["Амралт", "Гэр бүл"],
      summary:
        "Маршрут, байр, тээвэр, аяллын хөтөлбөр нь тодорхой амралт зугаалгын багц.",
      idealFor: [
        "Гэр бүлээрээ аялах хүмүүс",
        "Найз нөхөд, байгууллагын аялал",
        "Өөрөө бүх зүйл зохион байгуулахыг хүсэхгүй аялагч",
      ],
      includes: [
        "Өдөр тутмын аяллын хөтөлбөр",
        "Буудал, тээврийн зохион байгуулалт",
        "Хөтөч, аяллын зөвлөгөө",
      ],
      businessSupport: [],
    },
    "6": {
      title: "Чөлөөт аяллын төлөвлөлт",
      location: "Дэлхий даяар",
      country: "Захиалгат",
      groupSize: "Уян хатан",
      difficulty: "Хялбар",
      tags: ["Захиалгат", "Уян хатан"],
      summary:
        "Хугацаа, төсөв, зорилго, сонирхолд тань тохируулан уян хатан аяллын төлөвлөгөө гаргана.",
      idealFor: [
        "Өөрийн хуваариар аялах хүсэлтэй хүн",
        "Нислэг, буудал, маршрут дээр зөвлөгөө хэрэгтэй аялагч",
        "Богино хугацаанд аяллаа төлөвлөх шаардлагатай хүн",
      ],
      includes: [
        "Маршрут болон төсвийн санал",
        "Нислэг, буудлын чиглүүлэг",
        "Даатгал, eSIM, аяллын бэлтгэлийн зөвлөгөө",
      ],
      businessSupport: [],
    },
    "7": {
      title: "Монгол фестивалийн аялал",
      location: "Улаанбаатар",
      country: "Монгол",
      groupSize: "Гэр бүл / групп",
      difficulty: "Хялбар",
      tags: ["Дотоод", "Фестиваль", "Соёл"],
      summary:
        "Наадам, хотын соёлын арга хэмжээ, үндэсний хоол, музей болон өдөр бүрийн уян хатан хөтөлбөртэй festival аялал.",
      idealFor: [
        "Гэр бүлээрээ аялах хүмүүс",
        "Найз нөхдийн групп",
        "Монгол соёл, festival уур амьсгал сонирхдог аялагч",
      ],
      includes: [
        "Festival өдрийн хөтөлбөр",
        "Хот доторх тээврийн зохион байгуулалт",
        "Хөтөчийн дэмжлэг, соёлын тайлбар",
      ],
      businessSupport: [],
      nextDeparture: "Тохиролцоно",
    },
    "8": {
      title: "Хөвсгөл нуурын аялал",
      location: "Хөвсгөл",
      country: "Монгол",
      groupSize: "Жижиг групп",
      difficulty: "Хялбар",
      tags: ["Дотоод", "Нуур", "Гэр бүл"],
      summary:
        "Нуур, ой мод, завь, хөнгөн алхалттай гэр бүлд тохиромжтой тайван амралтын аялал.",
      idealFor: [
        "Гэр бүлээрээ аялах хүмүүс",
        "Байгальд дуртай аялагч",
        "Тайван хэмнэлтэй амрах хүсэлтэй хүн",
      ],
      includes: [
        "Өдөр тутмын маршрут",
        "Байрлах газрын чиглүүлэг",
        "Аяллын зөвлөгөө",
      ],
      businessSupport: [],
      nextDeparture: "2026.08",
    },
    "9": {
      title: "Алтайн аялал",
      location: "Баян-Өлгий",
      country: "Монгол",
      groupSize: "Жижиг групп",
      difficulty: "Дунд зэрэг",
      tags: ["Дотоод", "Алтай", "Треккинг"],
      summary:
        "Баруун Монголын уулсын үзэмж, нутгийн соёл, уян хатан алхалтын өдрүүдтэй аялал.",
      idealFor: [
        "Адал явдалд дуртай аялагч",
        "Жижиг групп",
        "Фото аялал сонирхогч",
      ],
      includes: [
        "Маршрут, хугацааны төлөвлөгөө",
        "Орон нутгийн түншийн дэмжлэг",
        "Аяллын бэлтгэлийн зөвлөгөө",
      ],
      businessSupport: [],
      nextDeparture: "2026.09",
    },
  },
  en: {
    "1": {
      title: "Canton Fair business trip",
      location: "Guangzhou",
      country: "China",
      groupSize: "Limited seats",
      difficulty: "Easy",
      tags: ["Business", "Expo", "Import"],
      summary:
        "An expo trip for starting an import business, researching new products, and meeting manufacturers directly.",
      idealFor: [
        "People planning to start an import business",
        "Business owners looking for new products or brands",
        "Travellers who want direct access to manufacturers and suppliers",
      ],
      includes: [
        "Flight and hotel coordination",
        "Data SIM / eSIM",
        "Travel insurance",
        "Professional translator and guide",
      ],
      businessSupport: [
        "Product selection guidance",
        "Financing and payment information",
        "Cargo and logistics direction",
        "Methods for selecting goods for retail distribution",
      ],
      nextDeparture: "October 2026",
    },
    "2": {
      title: "SNEC PV+ 2026 business trip",
      location: "Shanghai",
      country: "China",
      groupSize: "Small group",
      difficulty: "Easy",
      tags: ["Energy", "Expo", "Technology"],
      summary:
        "An international expo trip for researching solar power, battery storage, and smart energy technology.",
      idealFor: [
        "People interested in the solar energy business",
        "Businesses looking for battery storage solutions",
        "Travellers researching renewable energy products",
      ],
      includes: [
        "Expo travel route",
        "Hotel and transport coordination",
        "Translator and guide support",
        "Insurance and travel advice",
      ],
      businessSupport: [
        "Research new technologies and suppliers",
        "Assess solutions for the Mongolian market",
        "Initial guidance for importing products",
      ],
      nextDeparture: "June 2026",
    },
    "3": {
      title: "SIAL Shanghai Expo business trip",
      location: "Shanghai",
      country: "China",
      groupSize: "Small group",
      difficulty: "Easy",
      tags: ["Food", "Expo", "Import"],
      summary:
        "A trip for growing a food business and meeting international food brands, products, and suppliers.",
      idealFor: [
        "Food business owners",
        "Travellers looking for imported food products",
        "Businesses planning to introduce a new food brand",
      ],
      includes: [
        "Expo participation coordination",
        "Hotel and transport planning",
        "Translator and guide",
        "Travel insurance",
      ],
      businessSupport: [
        "Research food trends",
        "Evaluate brand and product opportunities",
        "Supplier connection support",
      ],
      nextDeparture: "May 2026",
    },
    "4": {
      title: "Custom business sourcing trip",
      location: "Asia",
      country: "Multiple destinations",
      groupSize: "Private / Team",
      difficulty: "Easy",
      tags: ["Consulting", "Sourcing"],
      summary:
        "A custom trip for researching manufacturers, products, and markets around your business goals.",
      idealFor: [
        "Companies expanding an existing business",
        "Teams researching new goods and products",
        "Businesses that need manufacturer meetings",
      ],
      includes: [
        "Route and meeting plan",
        "Hotel and transport advice",
        "Translator and guide coordination",
      ],
      businessSupport: [
        "Product research checklist",
        "Preparation for manufacturer meetings",
        "Logistics and cargo solution advice",
      ],
    },
    "5": {
      title: "Programmed leisure holiday",
      location: "Asia",
      country: "Selected destinations",
      groupSize: "Family / Group",
      difficulty: "Easy",
      tags: ["Leisure", "Family"],
      summary:
        "A leisure package with a clear route, accommodation, transport, and daily travel program.",
      idealFor: [
        "Families travelling together",
        "Friend groups and company trips",
        "Travellers who do not want to organize every detail themselves",
      ],
      includes: [
        "Daily travel program",
        "Hotel and transport coordination",
        "Guide and travel advice",
      ],
      businessSupport: [],
    },
    "6": {
      title: "Flexible travel planning",
      location: "Worldwide",
      country: "Custom",
      groupSize: "Flexible",
      difficulty: "Easy",
      tags: ["Custom", "Flexible"],
      summary:
        "Flexible travel planning shaped around your timing, budget, purpose, and interests.",
      idealFor: [
        "Travellers who want to move on their own schedule",
        "Travellers who need advice on flights, hotels, and route planning",
        "People who need to plan a trip on a short timeline",
      ],
      includes: [
        "Route and budget proposal",
        "Flight and hotel guidance",
        "Insurance, eSIM, and travel preparation advice",
      ],
      businessSupport: [],
    },
    "7": {
      title: "Mongolia festival experience",
      location: "Ulaanbaatar",
      country: "Mongolia",
      groupSize: "Family / Group",
      difficulty: "Easy",
      tags: ["Domestic", "Festival", "Culture"],
      summary:
        "A festival-focused Mongolia trip with cultural events, city highlights, local food, and flexible daily programs.",
      idealFor: [
        "Culture lovers",
        "Families",
        "Friend groups",
      ],
      includes: [
        "Festival day planning",
        "City transport coordination",
        "Guide support and cultural context",
      ],
      businessSupport: [],
      nextDeparture: "Flexible",
    },
    "8": {
      title: "Khuvsgul lake domestic trip",
      location: "Khuvsgul",
      country: "Mongolia",
      groupSize: "Small group",
      difficulty: "Easy",
      tags: ["Domestic", "Lake", "Family"],
      summary:
        "A calm lake escape with forest scenery, boat time, light hiking, and family-friendly pacing.",
      idealFor: ["Families", "Nature lovers", "Relaxed travellers"],
      includes: [
        "Daily route",
        "Accommodation guidance",
        "Guide advice",
      ],
      businessSupport: [],
      nextDeparture: "August 2026",
    },
    "9": {
      title: "Altai domestic trek",
      location: "Bayan-Ulgii",
      country: "Mongolia",
      groupSize: "Small group",
      difficulty: "Moderate",
      tags: ["Domestic", "Altai", "Trekking"],
      summary:
        "A western Mongolia route with mountain scenery, local culture, and flexible trekking days.",
      idealFor: ["Adventure travellers", "Small groups", "Photography lovers"],
      includes: [
        "Route and timing plan",
        "Local partner support",
        "Travel preparation advice",
      ],
      businessSupport: [],
      nextDeparture: "September 2026",
    },
  },
  zh: {
    "1": {
      title: "广交会商务考察",
      location: "广州",
      country: "中国",
      groupSize: "席位有限",
      difficulty: "轻松",
      tags: ["商务", "展会", "进口"],
      summary:
        "面向启动进口业务、调研新品并直接对接制造商的展会旅行。",
      idealFor: [
        "计划启动进口业务的人",
        "寻找新产品或新品牌的企业主",
        "希望直接接触制造商和供应商的旅行者",
      ],
      includes: [
        "机票和酒店协调",
        "数据 SIM / eSIM",
        "旅行保险",
        "专业翻译和导游",
      ],
      businessSupport: [
        "产品选择指导",
        "融资和付款信息",
        "货运与物流方向建议",
        "为零售渠道选择商品的方法",
      ],
      nextDeparture: "2026年10月",
    },
    "2": {
      title: "SNEC PV+ 2026 商务考察",
      location: "上海",
      country: "中国",
      groupSize: "小团",
      difficulty: "轻松",
      tags: ["能源", "展会", "技术"],
      summary:
        "调研太阳能、储能和智慧能源技术的国际展会旅行。",
      idealFor: [
        "关注太阳能业务的人",
        "寻找储能解决方案的企业",
        "调研可再生能源产品的旅行者",
      ],
      includes: [
        "展会旅行路线",
        "酒店和交通协调",
        "翻译和导游支持",
        "保险和旅行建议",
      ],
      businessSupport: [
        "调研新技术和供应商",
        "评估适合蒙古市场的解决方案",
        "产品进口初步指导",
      ],
      nextDeparture: "2026年6月",
    },
    "3": {
      title: "SIAL 上海食品展商务考察",
      location: "上海",
      country: "中国",
      groupSize: "小团",
      difficulty: "轻松",
      tags: ["食品", "展会", "进口"],
      summary:
        "帮助食品业务增长，并认识国际食品品牌、产品和供应商的旅行。",
      idealFor: [
        "食品企业经营者",
        "寻找进口食品产品的人",
        "计划引入新食品品牌的企业",
      ],
      includes: [
        "展会参与协调",
        "酒店和交通规划",
        "翻译和导游",
        "旅行保险",
      ],
      businessSupport: [
        "调研食品趋势",
        "评估品牌和产品机会",
        "供应商对接支持",
      ],
      nextDeparture: "2026年5月",
    },
    "4": {
      title: "定制商务采购旅行",
      location: "亚洲",
      country: "多个目的地",
      groupSize: "私人 / 团队",
      difficulty: "轻松",
      tags: ["咨询", "采购"],
      summary:
        "围绕您的商务目标，调研制造商、产品和市场的定制旅行。",
      idealFor: [
        "正在扩展现有业务的公司",
        "调研新商品和产品的团队",
        "需要与制造商会面的企业",
      ],
      includes: [
        "路线和会议计划",
        "酒店和交通建议",
        "翻译和导游协调",
      ],
      businessSupport: [
        "产品调研清单",
        "制造商会议准备",
        "物流和货运解决方案建议",
      ],
    },
    "5": {
      title: "有行程安排的休闲假期",
      location: "亚洲",
      country: "精选目的地",
      groupSize: "家庭 / 团体",
      difficulty: "轻松",
      tags: ["休闲", "家庭"],
      summary:
        "包含清晰路线、住宿、交通和每日安排的休闲旅行套餐。",
      idealFor: [
        "家庭出行",
        "朋友团和公司旅行",
        "不想自己安排所有细节的旅行者",
      ],
      includes: [
        "每日旅行计划",
        "酒店和交通协调",
        "导游和旅行建议",
      ],
      businessSupport: [],
    },
    "6": {
      title: "灵活旅行规划",
      location: "全球",
      country: "定制",
      groupSize: "灵活",
      difficulty: "轻松",
      tags: ["定制", "灵活"],
      summary:
        "根据您的时间、预算、目的和兴趣制定灵活的旅行计划。",
      idealFor: [
        "希望按自己节奏旅行的人",
        "需要机票、酒店和路线建议的旅行者",
        "需要在短时间内规划旅行的人",
      ],
      includes: [
        "路线和预算建议",
        "机票和酒店指导",
        "保险、eSIM 和旅行准备建议",
      ],
      businessSupport: [],
    },
    "7": {
      title: "蒙古节庆体验",
      location: "乌兰巴托",
      country: "蒙古",
      groupSize: "家庭 / 团体",
      difficulty: "轻松",
      tags: ["国内", "节庆", "文化"],
      summary:
        "以蒙古节庆、城市文化活动、本地美食和灵活每日安排为核心的旅行体验。",
      idealFor: [
        "文化爱好者",
        "家庭",
        "朋友团",
      ],
      includes: [
        "节庆日程规划",
        "市内交通协调",
        "导游支持和文化介绍",
      ],
      businessSupport: [],
      nextDeparture: "可协商",
    },
    "8": {
      title: "库苏古尔湖国内旅行",
      location: "库苏古尔",
      country: "蒙古",
      groupSize: "小团",
      difficulty: "轻松",
      tags: ["国内", "湖泊", "家庭"],
      summary:
        "宁静的湖畔度假，包含森林景色、乘船体验、轻徒步和适合家庭的节奏。",
      idealFor: ["家庭", "自然爱好者", "喜欢轻松节奏的旅行者"],
      includes: [
        "每日路线",
        "住宿指导",
        "旅行建议",
      ],
      businessSupport: [],
      nextDeparture: "2026年8月",
    },
    "9": {
      title: "阿尔泰国内徒步",
      location: "巴彦乌列盖",
      country: "蒙古",
      groupSize: "小团",
      difficulty: "中等",
      tags: ["国内", "阿尔泰", "徒步"],
      summary:
        "西蒙古路线，包含山地风光、当地文化和灵活的徒步日程。",
      idealFor: ["冒险旅行者", "小团", "摄影爱好者"],
      includes: [
        "路线和时间计划",
        "当地伙伴支持",
        "旅行准备建议",
      ],
      businessSupport: [],
      nextDeparture: "2026年9月",
    },
  },
  ja: {
    "1": {
      title: "広州交易会ビジネス旅行",
      location: "広州",
      country: "中国",
      groupSize: "席数限定",
      difficulty: "簡単",
      tags: ["ビジネス", "展示会", "輸入"],
      summary:
        "輸入ビジネスの開始、新商品の調査、メーカーとの直接商談を目的とした展示会旅行です。",
      idealFor: [
        "輸入ビジネスを始めたい方",
        "新しい商品やブランドを探している事業者",
        "メーカーやサプライヤーに直接会いたい旅行者",
      ],
      includes: [
        "航空券とホテルの調整",
        "データ SIM / eSIM",
        "旅行保険",
        "専門通訳とガイド",
      ],
      businessSupport: [
        "商品選定のアドバイス",
        "資金調達と支払い情報",
        "貨物・物流の案内",
        "小売向け商品の選び方",
      ],
      nextDeparture: "2026年10月",
    },
    "2": {
      title: "SNEC PV+ 2026 ビジネス旅行",
      location: "上海",
      country: "中国",
      groupSize: "小グループ",
      difficulty: "簡単",
      tags: ["エネルギー", "展示会", "技術"],
      summary:
        "太陽光発電、蓄電池、スマートエネルギー技術を調査する国際展示会旅行です。",
      idealFor: [
        "太陽光エネルギービジネスに関心がある方",
        "蓄電池ソリューションを探す企業",
        "再生可能エネルギー製品を調査する旅行者",
      ],
      includes: [
        "展示会旅行ルート",
        "ホテルと交通の調整",
        "通訳とガイドのサポート",
        "保険と旅行アドバイス",
      ],
      businessSupport: [
        "新技術とサプライヤーの調査",
        "モンゴル市場に合うソリューションの評価",
        "製品輸入の初期案内",
      ],
      nextDeparture: "2026年6月",
    },
    "3": {
      title: "SIAL 上海食品展示会ビジネス旅行",
      location: "上海",
      country: "中国",
      groupSize: "小グループ",
      difficulty: "簡単",
      tags: ["食品", "展示会", "輸入"],
      summary:
        "食品ビジネスの拡大、国際食品ブランド、商品、サプライヤーとの出会いを目的とした旅行です。",
      idealFor: [
        "食品ビジネスの事業者",
        "輸入食品を探している方",
        "新しい食品ブランドの導入を計画している企業",
      ],
      includes: [
        "展示会参加の調整",
        "ホテルと交通の計画",
        "通訳とガイド",
        "旅行保険",
      ],
      businessSupport: [
        "食品トレンドの調査",
        "ブランドと商品の可能性評価",
        "サプライヤー接続サポート",
      ],
      nextDeparture: "2026年5月",
    },
    "4": {
      title: "カスタムビジネス仕入れ旅行",
      location: "アジア",
      country: "複数目的地",
      groupSize: "プライベート / チーム",
      difficulty: "簡単",
      tags: ["コンサルティング", "仕入れ"],
      summary:
        "ビジネス目標に合わせてメーカー、商品、市場を調査するカスタム旅行です。",
      idealFor: [
        "既存事業を拡大する企業",
        "新商品を調査するチーム",
        "メーカーとの面談が必要な企業",
      ],
      includes: [
        "ルートと面談計画",
        "ホテルと交通のアドバイス",
        "通訳とガイドの調整",
      ],
      businessSupport: [
        "商品調査チェックリスト",
        "メーカー面談の準備",
        "物流・貨物ソリューションのアドバイス",
      ],
    },
    "5": {
      title: "プログラム付きレジャー休暇",
      location: "アジア",
      country: "選択目的地",
      groupSize: "家族 / グループ",
      difficulty: "簡単",
      tags: ["レジャー", "家族"],
      summary:
        "明確なルート、宿泊、交通、毎日の旅行プログラムを含むレジャーパッケージです。",
      idealFor: [
        "家族で旅行する方",
        "友人グループや会社旅行",
        "細部まで自分で手配したくない旅行者",
      ],
      includes: [
        "毎日の旅行プログラム",
        "ホテルと交通の調整",
        "ガイドと旅行アドバイス",
      ],
      businessSupport: [],
    },
    "6": {
      title: "フレキシブル旅行計画",
      location: "世界各地",
      country: "カスタム",
      groupSize: "柔軟",
      difficulty: "簡単",
      tags: ["カスタム", "柔軟"],
      summary:
        "時期、予算、目的、興味に合わせて柔軟に旅行計画を作成します。",
      idealFor: [
        "自分のスケジュールで旅行したい方",
        "航空券、ホテル、ルート計画のアドバイスが必要な旅行者",
        "短期間で旅行を計画する必要がある方",
      ],
      includes: [
        "ルートと予算提案",
        "航空券とホテルの案内",
        "保険、eSIM、旅行準備のアドバイス",
      ],
      businessSupport: [],
    },
    "7": {
      title: "モンゴル祭り体験",
      location: "ウランバートル",
      country: "モンゴル",
      groupSize: "家族 / グループ",
      difficulty: "簡単",
      tags: ["国内", "祭り", "文化"],
      summary:
        "モンゴルの祭り、都市文化イベント、ローカルフード、柔軟な日別プログラムを楽しむ旅行です。",
      idealFor: [
        "文化が好きな方",
        "家族",
        "友人グループ",
      ],
      includes: [
        "祭りの日程計画",
        "市内交通の調整",
        "ガイドサポートと文化解説",
      ],
      businessSupport: [],
      nextDeparture: "応相談",
    },
    "8": {
      title: "フブスグル湖国内旅行",
      location: "フブスグル",
      country: "モンゴル",
      groupSize: "小グループ",
      difficulty: "簡単",
      tags: ["国内", "湖", "家族"],
      summary:
        "湖と森の景色、ボート、軽いハイキングを楽しむ、家族向けの穏やかな休暇です。",
      idealFor: ["家族", "自然好き", "ゆったり旅したい方"],
      includes: [
        "毎日のルート",
        "宿泊先の案内",
        "旅行アドバイス",
      ],
      businessSupport: [],
      nextDeparture: "2026年8月",
    },
    "9": {
      title: "アルタイ国内トレッキング",
      location: "バヤン・ウルギー",
      country: "モンゴル",
      groupSize: "小グループ",
      difficulty: "中級",
      tags: ["国内", "アルタイ", "トレッキング"],
      summary:
        "西モンゴルの山岳風景、現地文化、柔軟なトレッキング日を含むルートです。",
      idealFor: ["冒険好きな旅行者", "小グループ", "写真好き"],
      includes: [
        "ルートと時期の計画",
        "現地パートナーのサポート",
        "旅行準備アドバイス",
      ],
      businessSupport: [],
      nextDeparture: "2026年9月",
    },
  },
  ko: {
    "1": {
      title: "캔톤페어 비즈니스 여행",
      location: "광저우",
      country: "중국",
      groupSize: "좌석 한정",
      difficulty: "쉬움",
      tags: ["비즈니스", "엑스포", "수입"],
      summary:
        "수입 비즈니스를 시작하고 신제품을 조사하며 제조사와 직접 만나는 엑스포 여행입니다.",
      idealFor: [
        "수입 비즈니스를 시작하려는 사람",
        "새로운 제품이나 브랜드를 찾는 사업자",
        "제조사와 공급업체를 직접 만나고 싶은 여행자",
      ],
      includes: [
        "항공권 및 호텔 조율",
        "데이터 SIM / eSIM",
        "여행 보험",
        "전문 통역사와 가이드",
      ],
      businessSupport: [
        "제품 선택 안내",
        "자금 및 결제 정보",
        "화물 및 물류 방향 안내",
        "소매 유통용 상품 선택 방법",
      ],
      nextDeparture: "2026년 10월",
    },
    "2": {
      title: "SNEC PV+ 2026 비즈니스 여행",
      location: "상하이",
      country: "중국",
      groupSize: "소규모 그룹",
      difficulty: "쉬움",
      tags: ["에너지", "엑스포", "기술"],
      summary:
        "태양광, 배터리 저장장치, 스마트 에너지 기술을 조사하는 국제 엑스포 여행입니다.",
      idealFor: [
        "태양광 에너지 비즈니스에 관심 있는 사람",
        "배터리 저장 솔루션을 찾는 기업",
        "재생에너지 제품을 조사하는 여행자",
      ],
      includes: [
        "엑스포 여행 루트",
        "호텔 및 교통 조율",
        "통역사와 가이드 지원",
        "보험 및 여행 안내",
      ],
      businessSupport: [
        "신기술 및 공급업체 조사",
        "몽골 시장에 맞는 솔루션 평가",
        "제품 수입 초기 안내",
      ],
      nextDeparture: "2026년 6월",
    },
    "3": {
      title: "SIAL 상하이 식품 엑스포 비즈니스 여행",
      location: "상하이",
      country: "중국",
      groupSize: "소규모 그룹",
      difficulty: "쉬움",
      tags: ["식품", "엑스포", "수입"],
      summary:
        "식품 비즈니스를 성장시키고 국제 식품 브랜드, 제품, 공급업체를 만나는 여행입니다.",
      idealFor: [
        "식품 비즈니스 운영자",
        "수입 식품 제품을 찾는 사람",
        "새로운 식품 브랜드 도입을 계획하는 기업",
      ],
      includes: [
        "엑스포 참가 조율",
        "호텔 및 교통 계획",
        "통역사와 가이드",
        "여행 보험",
      ],
      businessSupport: [
        "식품 트렌드 조사",
        "브랜드와 제품 기회 평가",
        "공급업체 연결 지원",
      ],
      nextDeparture: "2026년 5월",
    },
    "4": {
      title: "맞춤 비즈니스 소싱 여행",
      location: "아시아",
      country: "다양한 목적지",
      groupSize: "개인 / 팀",
      difficulty: "쉬움",
      tags: ["컨설팅", "소싱"],
      summary:
        "비즈니스 목표에 맞춰 제조사, 제품, 시장을 조사하는 맞춤 여행입니다.",
      idealFor: [
        "기존 비즈니스를 확장하는 회사",
        "새로운 상품과 제품을 조사하는 팀",
        "제조사 미팅이 필요한 기업",
      ],
      includes: [
        "루트 및 미팅 계획",
        "호텔 및 교통 안내",
        "통역사와 가이드 조율",
      ],
      businessSupport: [
        "제품 조사 체크리스트",
        "제조사 미팅 준비",
        "물류 및 화물 솔루션 안내",
      ],
    },
    "5": {
      title: "프로그램형 휴양 여행",
      location: "아시아",
      country: "선택 목적지",
      groupSize: "가족 / 그룹",
      difficulty: "쉬움",
      tags: ["휴양", "가족"],
      summary:
        "명확한 루트, 숙소, 교통, 일일 여행 프로그램이 포함된 휴양 패키지입니다.",
      idealFor: [
        "가족 여행자",
        "친구 그룹 및 회사 여행",
        "모든 세부 사항을 직접 준비하고 싶지 않은 여행자",
      ],
      includes: [
        "일일 여행 프로그램",
        "호텔 및 교통 조율",
        "가이드와 여행 조언",
      ],
      businessSupport: [],
    },
    "6": {
      title: "유연한 여행 계획",
      location: "전 세계",
      country: "맞춤",
      groupSize: "유연함",
      difficulty: "쉬움",
      tags: ["맞춤", "유연함"],
      summary:
        "일정, 예산, 목적, 관심사에 맞춰 유연한 여행 계획을 만듭니다.",
      idealFor: [
        "자신의 일정에 맞춰 여행하고 싶은 사람",
        "항공권, 호텔, 루트 계획 조언이 필요한 여행자",
        "짧은 기간 안에 여행을 계획해야 하는 사람",
      ],
      includes: [
        "루트 및 예산 제안",
        "항공권 및 호텔 안내",
        "보험, eSIM, 여행 준비 조언",
      ],
      businessSupport: [],
    },
    "7": {
      title: "몽골 축제 체험",
      location: "울란바토르",
      country: "몽골",
      groupSize: "가족 / 그룹",
      difficulty: "쉬움",
      tags: ["국내", "축제", "문화"],
      summary:
        "몽골 축제, 도시 문화 행사, 현지 음식, 유연한 일일 프로그램을 중심으로 한 여행입니다.",
      idealFor: [
        "문화 애호가",
        "가족",
        "친구 그룹",
      ],
      includes: [
        "축제 일정 계획",
        "도시 내 교통 조율",
        "가이드 지원 및 문화 해설",
      ],
      businessSupport: [],
      nextDeparture: "협의 가능",
    },
    "8": {
      title: "홉스굴 호수 국내 여행",
      location: "홉스굴",
      country: "몽골",
      groupSize: "소규모 그룹",
      difficulty: "쉬움",
      tags: ["국내", "호수", "가족"],
      summary:
        "호수와 숲 풍경, 보트, 가벼운 하이킹을 즐기는 가족 친화적인 여유로운 휴식 여행입니다.",
      idealFor: ["가족", "자연 애호가", "느긋한 여행자"],
      includes: [
        "일일 루트",
        "숙소 안내",
        "여행 조언",
      ],
      businessSupport: [],
      nextDeparture: "2026년 8월",
    },
    "9": {
      title: "알타이 국내 트레킹",
      location: "바얀울기",
      country: "몽골",
      groupSize: "소규모 그룹",
      difficulty: "보통",
      tags: ["국내", "알타이", "트레킹"],
      summary:
        "서몽골의 산악 풍경, 현지 문화, 유연한 트레킹 일정이 포함된 루트입니다.",
      idealFor: ["모험 여행자", "소규모 그룹", "사진 애호가"],
      includes: [
        "루트 및 일정 계획",
        "현지 파트너 지원",
        "여행 준비 조언",
      ],
      businessSupport: [],
      nextDeparture: "2026년 9월",
    },
  },
};

const ADVENTURE_TEXT_SLUG_ALIASES: Partial<Record<string, string>> = {
  "canton-fair-business-trip": "1",
  "snec-pv-2026-business-trip": "2",
  "mongolia-festival-experience": "7",
  "khuvsgul-lake-domestic-trip": "8",
  "altai-domestic-trek": "9",
};

const GOBI_ADVENTURE_TEXT: Record<CopyLocale, AdventureText> = {
  mn: {
    title: "Говь 7 өдрийн аялал",
    location: "Говь",
    country: "Монгол",
    groupSize: "Жижиг групп",
    difficulty: "Дунд зэрэг",
    tags: ["Дотоод", "Говь", "Байгаль"],
    summary:
      "Говийн байгаль, элсэн манхан, нутгийн айл, одтой шөнийг мэдрэх хувийн болон жижиг групп аялал.",
    idealFor: ["Гэр бүл", "Найз нөхөд", "Гадаад аялагч"],
    includes: ["Унаа", "Жолооч", "Буудал/гэр", "Маршрут төлөвлөлт"],
    businessSupport: [],
  },
  en: {
    title: "Gobi 7-day trip",
    location: "Gobi",
    country: "Mongolia",
    groupSize: "Small group",
    difficulty: "Moderate",
    tags: ["Domestic", "Gobi", "Nature"],
    summary:
      "A private or small-group trip through the Gobi desert, sand dunes, local nomadic life, and star-filled nights.",
    idealFor: ["Families", "Friend groups", "International travellers"],
    includes: ["Transport", "Driver", "Hotel / ger stay", "Route planning"],
    businessSupport: [],
  },
  zh: {
    title: "戈壁 7 日旅行",
    location: "戈壁",
    country: "蒙古",
    groupSize: "小团",
    difficulty: "中等",
    tags: ["国内", "戈壁", "自然"],
    summary:
      "私人或小团戈壁旅行，体验沙丘、游牧家庭、辽阔自然和星空之夜。",
    idealFor: ["家庭", "朋友团", "国际游客"],
    includes: ["交通", "司机", "酒店 / 蒙古包住宿", "路线规划"],
    businessSupport: [],
  },
  ja: {
    title: "ゴビ 7日間ツアー",
    location: "ゴビ",
    country: "モンゴル",
    groupSize: "小グループ",
    difficulty: "中級",
    tags: ["国内", "ゴビ", "自然"],
    summary:
      "砂丘、遊牧民の暮らし、広大な自然、満天の星を楽しむプライベートまたは小グループのゴビ旅行です。",
    idealFor: ["家族", "友人グループ", "海外旅行者"],
    includes: ["車両", "ドライバー", "ホテル / ゲル宿泊", "ルート計画"],
    businessSupport: [],
  },
  ko: {
    title: "고비 7일 여행",
    location: "고비",
    country: "몽골",
    groupSize: "소규모 그룹",
    difficulty: "보통",
    tags: ["국내", "고비", "자연"],
    summary:
      "고비 사막, 모래언덕, 유목민 생활, 별이 가득한 밤을 경험하는 개인 또는 소규모 그룹 여행입니다.",
    idealFor: ["가족", "친구 그룹", "해외 여행자"],
    includes: ["교통", "운전기사", "호텔 / 게르 숙박", "루트 계획"],
    businessSupport: [],
  },
};

const ADVENTURE_GALLERIES: Record<string, string[]> = {
  "1": [
    "https://images.unsplash.com/photo-1753172201568-b28dc578ad57?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1768396855393-42624b5f0be5?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=3200&q=90&fit=crop&fm=webp",
  ],
  "2": [
    "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=3200&q=90&fit=crop&fm=webp",
  ],
  "3": [
    "https://images.unsplash.com/photo-1613297042426-58e7fa325fa4?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1587741748743-fcda9b5b237a?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=3200&q=90&fit=crop&fm=webp",
  ],
  "4": [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=3200&q=90&fit=crop&fm=webp",
  ],
  "5": [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=3200&q=90&fit=crop&fm=webp",
  ],
  "6": [
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=3200&q=90&fit=crop&fm=webp",
  ],
  "7": [
    "https://images.unsplash.com/photo-1613294576846-73901118ef6d?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1542662565-7e4b66bae529?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=3200&q=90&fit=crop&fm=webp",
  ],
  "8": [
    "https://images.unsplash.com/photo-1630614812901-550f93e0e888?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1664770427537-f24e362b0c30?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=3200&q=90&fit=crop&fm=webp",
  ],
  "9": [
    "https://images.unsplash.com/photo-1742205025826-d6ae1b3727be?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1514920735211-8c697444a248?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=3200&q=90&fit=crop&fm=webp",
  ],
};

const FALLBACK_GALLERIES: Record<string, string[]> = {
  china: [
    "https://images.unsplash.com/photo-1753172201568-b28dc578ad57?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=3200&q=90&fit=crop&fm=webp",
  ],
  japan: [
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=3200&q=90&fit=crop&fm=webp",
  ],
  korea: [
    "https://images.unsplash.com/photo-1667971286457-144269b0e4d8?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1538485399081-7c8edb81cdb4?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=3200&q=90&fit=crop&fm=webp",
  ],
  turkey: [
    "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=3200&q=90&fit=crop&fm=webp",
  ],
  taiwan: [
    "https://images.unsplash.com/photo-1748104433499-3d492d0337cb?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=3200&q=90&fit=crop&fm=webp",
  ],
  mongolia: [
    "https://images.unsplash.com/photo-1613297042426-58e7fa325fa4?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1742205025826-d6ae1b3727be?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1630614812901-550f93e0e888?w=3200&q=90&fit=crop&fm=webp",
  ],
  festival: [
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=3200&q=90&fit=crop&fm=webp",
  ],
  leisure: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=3200&q=90&fit=crop&fm=webp",
  ],
  default: [
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=3200&q=90&fit=crop&fm=webp",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=3200&q=90&fit=crop&fm=webp",
  ],
};

function getFallbackGalleryImages(adventure: Adventure): string[] {
  const haystack = [
    adventure.slug,
    adventure.title,
    adventure.location,
    adventure.country,
    adventure.category,
    ...adventure.tags,
  ]
    .join(" ")
    .toLowerCase();

  if (haystack.includes("japan") || haystack.includes("япон")) {
    return FALLBACK_GALLERIES.japan;
  }

  if (
    haystack.includes("korea") ||
    haystack.includes("jeju") ||
    haystack.includes("солонгос") ||
    haystack.includes("бнсу")
  ) {
    return FALLBACK_GALLERIES.korea;
  }

  if (haystack.includes("turkey") || haystack.includes("турк")) {
    return FALLBACK_GALLERIES.turkey;
  }

  if (haystack.includes("taiwan") || haystack.includes("тайван")) {
    return FALLBACK_GALLERIES.taiwan;
  }

  if (haystack.includes("china") || haystack.includes("хятад")) {
    return FALLBACK_GALLERIES.china;
  }

  if (haystack.includes("expo") || haystack.includes("fair") || haystack.includes("festival")) {
    return FALLBACK_GALLERIES.festival;
  }

  if (
    haystack.includes("mongolia") ||
    haystack.includes("gobi") ||
    haystack.includes("altai") ||
    haystack.includes("khuvsgul")
  ) {
    return FALLBACK_GALLERIES.mongolia;
  }

  if (haystack.includes("leisure") || haystack.includes("beach")) {
    return FALLBACK_GALLERIES.leisure;
  }

  return FALLBACK_GALLERIES.default;
}

export function getAdventureGalleryImages(adventure: Adventure): string[] {
  const configuredGallery =
    adventure.galleryImages && adventure.galleryImages.length > 0
      ? adventure.galleryImages
      : [
          ...(ADVENTURE_GALLERIES[adventure.id] ?? []),
          ...getFallbackGalleryImages(adventure),
        ];

  return Array.from(
    new Set([
      adventure.image,
      ...configuredGallery,
    ].map((image) => getHighResolutionImageUrl(image)))
  );
}

export function getAdventureText(adventure: Adventure, locale: Locale): AdventureText {
  const copyLocale = getCopyLocale(locale);
  const autoTranslatedText = adventure.translations?.[copyLocale];
  const slugAlias = ADVENTURE_TEXT_SLUG_ALIASES[adventure.slug];
  const slugLocalizedText =
    adventure.slug === "gobi-seven-day-private-trip"
      ? GOBI_ADVENTURE_TEXT[copyLocale]
      : slugAlias
        ? ADVENTURE_TEXT[copyLocale][slugAlias]
        : undefined;
  const localizedText = slugLocalizedText ?? ADVENTURE_TEXT[copyLocale][adventure.id];

  const fallbackText = {
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
    nextDeparture: adventure.nextDeparture,
  };

  if (copyLocale !== "mn" && autoTranslatedText) {
    return {
      ...fallbackText,
      ...autoTranslatedText,
      tags: autoTranslatedText.tags?.length ? autoTranslatedText.tags : fallbackText.tags,
      idealFor: autoTranslatedText.idealFor?.length
        ? autoTranslatedText.idealFor
        : fallbackText.idealFor,
      includes: autoTranslatedText.includes?.length
        ? autoTranslatedText.includes
        : fallbackText.includes,
      businessSupport: autoTranslatedText.businessSupport?.length
        ? autoTranslatedText.businessSupport
        : fallbackText.businessSupport,
    };
  }

  if (localizedText) {
    return localizedText;
  }

  return fallbackText;
}

export function getAdventureDetailInfo(
  adventure: Adventure,
  locale: Locale
): AdventureDetailInfo {
  const copyLocale = getCopyLocale(locale);
  const text = getAdventureText(adventure, copyLocale);
  const isDomestic = adventure.country === "Mongolia";
  const isExpo = adventure.category === "festival";
  const isBusiness = adventure.category === "business" || isExpo;
  const detailCopy = {
    mn: {
      keyStops: `${text.location} чиглэлийн гол үзмэрүүд`,
      expo: "Олон улсын expo, бүтээгдэхүүн судалгааны өдөр",
      business: "Үйлдвэрлэгч, нийлүүлэгчтэй уулзах боломж",
      leisure: "Байгаль, амралт, зураг авах цэгүүд",
      program: `${adventure.days} хоногийн зохион байгуулалттай хөтөлбөр`,
      domesticGuide: "Орон нутгийн хөтөч, аяллын зөвлөгөө",
      outboundGuide: "Нислэг, буудал, тээврийн чиглүүлэг",
      smallGroup: "Жижиг групп болон хувийн аялалд тохиромжтой",
      prep: "Аяллын өмнөх бэлтгэл, маршрут зөвлөгөө",
      includedRoute: "Хөтөлбөрт заагдсан маршрут, цагийн төлөвлөлт",
      includedPrep: "Аяллын өмнөх зөвлөгөө, мэдээлэл",
      excludedPersonal: "Хувийн хэрэглээний зардал",
      excludedProgram: "Хөтөлбөрт тусгагдаагүй хоол, унаа",
      excludedOptional: "Нэмэлтээр санал болгосон хөтөлбөр",
      excludedDomestic: "Нэмэлт морь, завь, тусгай үйлчилгээний төлбөр",
      excludedOutbound: "Виз болон бичиг баримтын төлбөр",
      excludedSingle: "Буудалд ганцаар байрлах нэмэлт төлбөр",
      day1Title: `Улаанбаатар - ${text.location}`,
      day1Domestic:
        "Аялал эхэлж, чиглэлийн дагуу хөдөлнө. Замын нөхцөл, байрлах газар, өдрийн хөтөлбөрийг баг танилцуулна.",
      day1Outbound:
        "Нислэг, тосолт, буудалдаа байрлах болон аяллын эхний чиглүүлэг хийнэ.",
      day2ExpoTitle: "Expo / үзэсгэлэнгийн үндсэн өдөр",
      day2StopsTitle: `${text.location} орчмын гол үзмэрүүд`,
      day2ExpoBody:
        "Үзэсгэлэнгийн танхимд бүтээгдэхүүн, нийлүүлэгч, шинэ чиг хандлагатай танилцана.",
      day2StopsBody:
        "Гол үзмэрүүдээр аялж, зураг авах болон орон нутгийн соёл, байгальтай танилцах өдөр.",
      middleBusinessTitle: "Уулзалт, судалгаа, чөлөөт хөтөлбөр",
      middleLeisureTitle: "Нэмэлт үзмэр, амралт, чөлөөт цаг",
      middleBusinessBody:
        "Нийлүүлэгч, үйлдвэрлэгч, үйлчилгээний боломжуудыг судалж, багийн зорилгод тааруулсан уулзалтууд хийнэ.",
      middleLeisureBody:
        "Аяллын хэмнэлд тааруулан нэмэлт үзмэр, амралтын цаг, гэрэл зургийн зогсолтууд орно.",
      returnTitle: "Буцах өдөр",
      returnBody:
        "Өглөөний хөтөлбөр, буудлаас гарах, буцах тээвэр болон аяллын дараах зөвлөгөөгөөр аялал өндөрлөнө.",
    },
    en: {
      keyStops: `Key stops around ${text.location}`,
      expo: "International expo and product research days",
      business: "Supplier and manufacturer meeting opportunities",
      leisure: "Scenic, leisure, and photo-friendly stops",
      program: `${adventure.days}-day organized travel program`,
      domesticGuide: "Local guide and route advice",
      outboundGuide: "Flight, hotel, and transfer guidance",
      smallGroup: "Suitable for small groups and private trips",
      prep: "Pre-trip preparation and route advice",
      includedRoute: "Planned route and timing",
      includedPrep: "Pre-trip advice and information",
      excludedPersonal: "Personal expenses",
      excludedProgram: "Meals and transport not listed in the program",
      excludedOptional: "Optional activities suggested during the trip",
      excludedDomestic: "Extra horse, boat, or special activity fees",
      excludedOutbound: "Visa and documentation fees",
      excludedSingle: "Single-room supplement",
      day1Title: `Ulaanbaatar - ${text.location}`,
      day1Domestic:
        "The route begins with transport coordination, check-in guidance, and a briefing for the travel days ahead.",
      day1Outbound:
        "Flight, arrival support, hotel check-in, and the first route briefing.",
      day2ExpoTitle: "Main expo day",
      day2StopsTitle: `Key stops around ${text.location}`,
      day2ExpoBody:
        "Explore the exhibition halls, research products, and meet potential suppliers.",
      day2StopsBody:
        "Visit the main sights with time for photos, local context, and a comfortable travel pace.",
      middleBusinessTitle: "Meetings, research, and flexible program",
      middleLeisureTitle: "Additional sights, rest, and free time",
      middleBusinessBody:
        "Supplier research, manufacturer meetings, and route adjustments based on your business goals.",
      middleLeisureBody:
        "Additional stops, rest time, and photo-friendly breaks shaped around the group pace.",
      returnTitle: "Return day",
      returnBody:
        "Morning program, checkout, return transport, and post-trip guidance from the team.",
    },
    zh: {
      keyStops: `${text.location} 周边主要看点`,
      expo: "国际展会和产品调研日",
      business: "供应商和制造商会面机会",
      leisure: "风景、休闲和适合拍照的停留点",
      program: `${adventure.days}天有组织行程`,
      domesticGuide: "当地导游和路线建议",
      outboundGuide: "航班、酒店和接送指导",
      smallGroup: "适合小团和私人旅行",
      prep: "出发前准备和路线建议",
      includedRoute: "规划好的路线和时间安排",
      includedPrep: "出发前建议和信息",
      excludedPersonal: "个人消费",
      excludedProgram: "行程未列明的餐食和交通",
      excludedOptional: "旅途中建议的自选活动",
      excludedDomestic: "额外骑马、乘船或特别活动费用",
      excludedOutbound: "签证和文件费用",
      excludedSingle: "单人房差",
      day1Title: `乌兰巴托 - ${text.location}`,
      day1Domestic:
        "行程开始并安排交通、入住说明和后续旅行日的 briefing。",
      day1Outbound:
        "航班、抵达协助、酒店入住以及首次路线说明。",
      day2ExpoTitle: "展会主要日",
      day2StopsTitle: `${text.location} 周边主要看点`,
      day2ExpoBody:
        "参观展馆，调研产品，并会见潜在供应商。",
      day2StopsBody:
        "参观主要景点，安排拍照时间，了解当地背景，并保持舒适节奏。",
      middleBusinessTitle: "会面、调研和灵活安排",
      middleLeisureTitle: "更多景点、休息和自由时间",
      middleBusinessBody:
        "根据商务目标安排供应商调研、制造商会面和路线调整。",
      middleLeisureBody:
        "按照团队节奏安排更多停留、休息时间和适合拍照的节点。",
      returnTitle: "返回日",
      returnBody:
        "以早晨安排、退房、返程交通和旅行后的团队建议结束行程。",
    },
    ja: {
      keyStops: `${text.location}周辺の主な見どころ`,
      expo: "国際展示会と商品リサーチの日",
      business: "サプライヤーやメーカーとの面談機会",
      leisure: "景色、休憩、写真に適したスポット",
      program: `${adventure.days}日間の手配済み旅行プログラム`,
      domesticGuide: "現地ガイドとルートアドバイス",
      outboundGuide: "航空券、ホテル、送迎の案内",
      smallGroup: "小グループやプライベート旅行に適しています",
      prep: "出発前の準備とルート相談",
      includedRoute: "計画済みのルートと時間配分",
      includedPrep: "出発前のアドバイスと情報",
      excludedPersonal: "個人的な支出",
      excludedProgram: "プログラムに記載されていない食事と交通",
      excludedOptional: "旅行中に提案される任意アクティビティ",
      excludedDomestic: "追加の乗馬、ボート、特別アクティビティ料金",
      excludedOutbound: "ビザおよび書類費用",
      excludedSingle: "一人部屋追加料金",
      day1Title: `ウランバートル - ${text.location}`,
      day1Domestic:
        "交通手配、チェックイン案内、これからの旅行日の説明からルートが始まります。",
      day1Outbound:
        "フライト、到着サポート、ホテルチェックイン、最初のルート説明を行います。",
      day2ExpoTitle: "展示会メイン日",
      day2StopsTitle: `${text.location}周辺の主な見どころ`,
      day2ExpoBody:
        "展示ホールを見学し、商品を調査し、候補サプライヤーと会います。",
      day2StopsBody:
        "主要スポットを訪れ、写真撮影、現地の背景、快適なペースを大切にします。",
      middleBusinessTitle: "商談、リサーチ、柔軟なプログラム",
      middleLeisureTitle: "追加スポット、休憩、自由時間",
      middleBusinessBody:
        "ビジネス目標に合わせてサプライヤー調査、メーカー面談、ルート調整を行います。",
      middleLeisureBody:
        "グループのペースに合わせて追加スポット、休憩、写真向きの停車を組み込みます。",
      returnTitle: "帰着日",
      returnBody:
        "朝のプログラム、チェックアウト、帰路の交通、旅行後のアドバイスで終了します。",
    },
    ko: {
      keyStops: `${text.location} 주변 주요 방문지`,
      expo: "국제 엑스포 및 제품 조사일",
      business: "공급업체 및 제조사 미팅 기회",
      leisure: "풍경, 휴식, 사진 촬영에 좋은 방문지",
      program: `${adventure.days}일 구성 여행 프로그램`,
      domesticGuide: "현지 가이드와 루트 조언",
      outboundGuide: "항공, 호텔, 이동 안내",
      smallGroup: "소규모 그룹 및 개인 여행에 적합",
      prep: "여행 전 준비와 루트 상담",
      includedRoute: "계획된 루트와 일정",
      includedPrep: "여행 전 안내 및 정보",
      excludedPersonal: "개인 지출",
      excludedProgram: "프로그램에 명시되지 않은 식사와 교통",
      excludedOptional: "여행 중 제안되는 선택 활동",
      excludedDomestic: "추가 승마, 보트 또는 특별 활동 비용",
      excludedOutbound: "비자 및 서류 비용",
      excludedSingle: "싱글룸 추가 요금",
      day1Title: `울란바토르 - ${text.location}`,
      day1Domestic:
        "교통 조율, 체크인 안내, 앞으로의 여행 일정 브리핑으로 루트가 시작됩니다.",
      day1Outbound:
        "항공, 도착 지원, 호텔 체크인, 첫 루트 브리핑을 진행합니다.",
      day2ExpoTitle: "엑스포 주요 일정",
      day2StopsTitle: `${text.location} 주변 주요 방문지`,
      day2ExpoBody:
        "전시장을 둘러보고 제품을 조사하며 잠재 공급업체를 만납니다.",
      day2StopsBody:
        "주요 명소를 방문하고 사진 촬영, 현지 설명, 편안한 여행 속도를 함께 제공합니다.",
      middleBusinessTitle: "미팅, 조사, 유연한 프로그램",
      middleLeisureTitle: "추가 명소, 휴식, 자유 시간",
      middleBusinessBody:
        "비즈니스 목표에 맞춰 공급업체 조사, 제조사 미팅, 루트 조정을 진행합니다.",
      middleLeisureBody:
        "그룹 속도에 맞춰 추가 방문지, 휴식 시간, 사진 촬영에 좋은 정차를 구성합니다.",
      returnTitle: "귀환일",
      returnBody:
        "아침 프로그램, 체크아웃, 귀환 교통, 여행 후 팀의 안내로 일정이 마무리됩니다.",
    },
  }[copyLocale];

  const highlights = [
    detailCopy.keyStops,
    isExpo
      ? detailCopy.expo
      : isBusiness
        ? detailCopy.business
        : detailCopy.leisure,
    detailCopy.program,
    isDomestic ? detailCopy.domesticGuide : detailCopy.outboundGuide,
    detailCopy.smallGroup,
    detailCopy.prep,
  ];

  const included = Array.from(
    new Set([
      ...text.includes,
      detailCopy.includedRoute,
      detailCopy.includedPrep,
      ...(isBusiness ? text.businessSupport.slice(0, 2) : []),
    ])
  );

  const excluded = [
    detailCopy.excludedPersonal,
    detailCopy.excludedProgram,
    detailCopy.excludedOptional,
    isDomestic ? detailCopy.excludedDomestic : detailCopy.excludedOutbound,
    detailCopy.excludedSingle,
  ];

  const itinerary: AdventureItineraryStep[] = [
    {
      day: "1",
      title: detailCopy.day1Title,
      body: isDomestic ? detailCopy.day1Domestic : detailCopy.day1Outbound,
    },
    {
      day: "2",
      title: isExpo ? detailCopy.day2ExpoTitle : detailCopy.day2StopsTitle,
      body: isExpo ? detailCopy.day2ExpoBody : detailCopy.day2StopsBody,
    },
  ];

  for (let day = 3; day < adventure.days; day += 1) {
    itinerary.push({
      day: `${day}`,
      title: isBusiness
        ? detailCopy.middleBusinessTitle
        : detailCopy.middleLeisureTitle,
      body: isBusiness
        ? detailCopy.middleBusinessBody
        : detailCopy.middleLeisureBody,
    });
  }

  if (adventure.days >= 3) {
    itinerary.push({
      day: `${adventure.days}`,
      title: detailCopy.returnTitle,
      body: detailCopy.returnBody,
    });
  }

  return {
    highlights,
    included,
    excluded,
    // Admin-defined day/time itinerary takes precedence over the auto-generated one.
    itinerary: adventure.itinerary && adventure.itinerary.length > 0 ? adventure.itinerary : itinerary,
  };
}
