import type { Locale } from "@/lib/i18n";

export type TravelCategory = "business" | "expo" | "leisure" | "custom";

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
  seatsLeft?: number;
  featured?: boolean;
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

export type AdventureItineraryStep = {
  day: string;
  title: string;
  body: string;
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
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80&auto=format&fit=crop",
    tags: ["Business", "Expo", "Import"],
    rating: 4.9,
    reviews: 38,
    category: "expo",
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
    seatsLeft: 8,
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
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80&auto=format&fit=crop",
    tags: ["Energy", "Expo", "Technology"],
    rating: 4.8,
    reviews: 21,
    category: "expo",
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
    image:
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&q=80&auto=format&fit=crop",
    tags: ["Gobi", "Leisure", "Culture"],
    rating: 4.9,
    reviews: 64,
    category: "leisure",
    summary:
      "Говийн байгаль, элсэн манхан, нутгийн айл, одтой шөнийг мэдрэх хувийн болон жижиг групп аялал.",
    idealFor: ["Гэр бүл", "Найз нөхөд", "Гадаад аялагч"],
    includes: ["Унаа", "Жолооч", "Буудал/гэр", "Маршрут төлөвлөлт"],
    businessSupport: [],
    featured: true,
  },
  {
    id: "7",
    slug: "gobi-domestic-adventure",
    title: "Говийн аялал",
    location: "Өмнөговь",
    country: "Mongolia",
    days: 5,
    groupSize: "Family / Group",
    difficulty: "Easy",
    price: 1490000,
    currency: "MNT",
    image:
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&q=80&auto=format&fit=crop",
    tags: ["Domestic", "Gobi", "Nature"],
    rating: 4.9,
    reviews: 44,
    category: "leisure",
    summary:
      "Gobi desert highlights with dunes, canyons, ger stays, and local guide support.",
    idealFor: ["Families", "Friend groups", "First-time domestic travellers"],
    includes: ["Route planning", "Transport coordination", "Guide support"],
    businessSupport: [],
    nextDeparture: "2026-07",
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
    price: 1690000,
    currency: "MNT",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80&auto=format&fit=crop",
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

const ADVENTURE_TEXT: Record<Locale, Record<string, AdventureText>> = {
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
      title: "Говийн аялал",
      location: "Өмнөговь",
      country: "Монгол",
      groupSize: "Гэр бүл / групп",
      difficulty: "Хялбар",
      tags: ["Дотоод", "Говь", "Байгаль"],
      summary:
        "Элсэн манхан, хавцал, гэр буудал, нутгийн хөтөчтэй Говийн гол үзмэрүүдийг багтаасан аялал.",
      idealFor: [
        "Гэр бүлээрээ аялах хүмүүс",
        "Найз нөхдийн групп",
        "Дотоод аяллаа эхлүүлэх аялагч",
      ],
      includes: [
        "Маршрут төлөвлөлт",
        "Тээврийн зохион байгуулалт",
        "Хөтөчийн дэмжлэг",
      ],
      businessSupport: [],
      nextDeparture: "2026.07",
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
      title: "Gobi domestic adventure",
      location: "Umnugovi",
      country: "Mongolia",
      groupSize: "Family / Group",
      difficulty: "Easy",
      tags: ["Domestic", "Gobi", "Nature"],
      summary:
        "Gobi desert highlights with dunes, canyons, ger stays, and local guide support.",
      idealFor: [
        "Families",
        "Friend groups",
        "First-time domestic travellers",
      ],
      includes: [
        "Route planning",
        "Transport coordination",
        "Guide support",
      ],
      businessSupport: [],
      nextDeparture: "July 2026",
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
};

const ADVENTURE_GALLERIES: Record<string, string[]> = {
  "1": [
    "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80&auto=format&fit=crop",
  ],
  "2": [
    "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=80&auto=format&fit=crop",
  ],
  "3": [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80&auto=format&fit=crop",
  ],
  "4": [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80&auto=format&fit=crop",
  ],
  "5": [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop",
  ],
  "6": [
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80&auto=format&fit=crop",
  ],
  "7": [
    "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&q=80&auto=format&fit=crop",
  ],
  "8": [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=1200&q=80&auto=format&fit=crop",
  ],
  "9": [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=80&auto=format&fit=crop",
  ],
};

export function getAdventureGalleryImages(adventure: Adventure): string[] {
  return Array.from(
    new Set([
      adventure.image,
      ...(adventure.galleryImages ?? ADVENTURE_GALLERIES[adventure.id] ?? []),
    ])
  );
}

export function getAdventureText(adventure: Adventure, locale: Locale): AdventureText {
  return (
    ADVENTURE_TEXT[locale][adventure.id] ?? {
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
    }
  );
}

export function getAdventureDetailInfo(
  adventure: Adventure,
  locale: Locale
): AdventureDetailInfo {
  const text = getAdventureText(adventure, locale);
  const isMn = locale === "mn";
  const isDomestic = adventure.country === "Mongolia";
  const isExpo = adventure.category === "expo";
  const isBusiness = adventure.category === "business" || isExpo;
  const middleDay =
    adventure.days > 4 ? `3-${adventure.days - 1}` : "3";

  const highlights = isMn
    ? [
        `${text.location} чиглэлийн гол үзмэрүүд`,
        isExpo
          ? "Олон улсын expo, бүтээгдэхүүн судалгааны өдөр"
          : isBusiness
            ? "Үйлдвэрлэгч, нийлүүлэгчтэй уулзах боломж"
            : "Байгаль, амралт, зураг авах цэгүүд",
        `${adventure.days} хоногийн зохион байгуулалттай хөтөлбөр`,
        isDomestic
          ? "Орон нутгийн хөтөч, аяллын зөвлөгөө"
          : "Нислэг, буудал, тээврийн чиглүүлэг",
        "Жижиг групп болон хувийн аялалд тохиромжтой",
        "Аяллын өмнөх бэлтгэл, маршрут зөвлөгөө",
      ]
    : [
        `Key stops around ${text.location}`,
        isExpo
          ? "International expo and product research days"
          : isBusiness
            ? "Supplier and manufacturer meeting opportunities"
            : "Scenic, leisure, and photo-friendly stops",
        `${adventure.days}-day organized travel program`,
        isDomestic
          ? "Local guide and route advice"
          : "Flight, hotel, and transfer guidance",
        "Suitable for small groups and private trips",
        "Pre-trip preparation and route advice",
      ];

  const included = Array.from(
    new Set([
      ...text.includes,
      ...(isMn
        ? [
            "Хөтөлбөрт заагдсан маршрут, цагийн төлөвлөлт",
            "Аяллын өмнөх зөвлөгөө, мэдээлэл",
          ]
        : [
            "Planned route and timing",
            "Pre-trip advice and information",
          ]),
      ...(isBusiness ? text.businessSupport.slice(0, 2) : []),
    ])
  );

  const excluded = isMn
    ? [
        "Хувийн хэрэглээний зардал",
        "Хөтөлбөрт тусгагдаагүй хоол, унаа",
        "Нэмэлтээр санал болгосон хөтөлбөр",
        isDomestic
          ? "Нэмэлт морь, завь, тусгай үйлчилгээний төлбөр"
          : "Виз болон бичиг баримтын төлбөр",
        "Буудалд ганцаар байрлах нэмэлт төлбөр",
      ]
    : [
        "Personal expenses",
        "Meals and transport not listed in the program",
        "Optional activities suggested during the trip",
        isDomestic
          ? "Extra horse, boat, or special activity fees"
          : "Visa and documentation fees",
        "Single-room supplement",
      ];

  const itinerary = isMn
    ? [
        {
          day: "1",
          title: `Улаанбаатар - ${text.location}`,
          body: isDomestic
            ? "Аялал эхэлж, чиглэлийн дагуу хөдөлнө. Замын нөхцөл, байрлах газар, өдрийн хөтөлбөрийг баг танилцуулна."
            : "Нислэг, тосолт, буудалдаа байрлах болон аяллын эхний чиглүүлэг хийнэ.",
        },
        {
          day: "2",
          title: isExpo
            ? "Expo / үзэсгэлэнгийн үндсэн өдөр"
            : `${text.location} орчмын гол үзмэрүүд`,
          body: isExpo
            ? "Үзэсгэлэнгийн танхимд бүтээгдэхүүн, нийлүүлэгч, шинэ чиг хандлагатай танилцана."
            : "Гол үзмэрүүдээр аялж, зураг авах болон орон нутгийн соёл, байгальтай танилцах өдөр.",
        },
        {
          day: middleDay,
          title: isBusiness
            ? "Уулзалт, судалгаа, чөлөөт хөтөлбөр"
            : "Нэмэлт үзмэр, амралт, чөлөөт цаг",
          body: isBusiness
            ? "Нийлүүлэгч, үйлдвэрлэгч, үйлчилгээний боломжуудыг судалж, багийн зорилгод тааруулсан уулзалтууд хийнэ."
            : "Аяллын хэмнэлд тааруулан нэмэлт үзмэр, амралтын цаг, гэрэл зургийн зогсолтууд орно.",
        },
        {
          day: `${adventure.days}`,
          title: "Буцах өдөр",
          body: "Өглөөний хөтөлбөр, буудлаас гарах, буцах тээвэр болон аяллын дараах зөвлөгөөгөөр аялал өндөрлөнө.",
        },
      ]
    : [
        {
          day: "1",
          title: `Ulaanbaatar - ${text.location}`,
          body: isDomestic
            ? "The route begins with transport coordination, check-in guidance, and a briefing for the travel days ahead."
            : "Flight, arrival support, hotel check-in, and the first route briefing.",
        },
        {
          day: "2",
          title: isExpo
            ? "Main expo day"
            : `Key stops around ${text.location}`,
          body: isExpo
            ? "Explore the exhibition halls, research products, and meet potential suppliers."
            : "Visit the main sights with time for photos, local context, and a comfortable travel pace.",
        },
        {
          day: middleDay,
          title: isBusiness
            ? "Meetings, research, and flexible program"
            : "Additional sights, rest, and free time",
          body: isBusiness
            ? "Supplier research, manufacturer meetings, and route adjustments based on your business goals."
            : "Additional stops, rest time, and photo-friendly breaks shaped around the group pace.",
        },
        {
          day: `${adventure.days}`,
          title: "Return day",
          body: "Morning program, checkout, return transport, and post-trip guidance from the team.",
        },
      ];

  return { highlights, included, excluded, itinerary };
}
