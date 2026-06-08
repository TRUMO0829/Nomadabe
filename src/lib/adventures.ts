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

export type TravelService = {
  id: string;
  title: string;
  description: string;
  highlights: string[];
};

export const TRAVEL_SERVICES: TravelService[] = [
  {
    id: "business-travel",
    title: "Бизнес аялал",
    description:
      "Импорт, бүтээгдэхүүн судалгаа, үйлдвэрлэгч хайлт, гэрээ хэлцэл болон логистикийн шийдэлтэй аяллын үйлчилгээ.",
    highlights: [
      "Бараа бүтээгдэхүүн, нийлүүлэгч судлах",
      "Орчуулагч, хөтөч, бизнес зөвлөгөө",
      "Карго, төлбөр тооцоо, санхүүжилтийн чиглүүлэг",
    ],
  },
  {
    id: "expo-travel",
    title: "Олон улсын expo аялал",
    description:
      "Canton Fair, SNEC PV+, SIAL Shanghai зэрэг олон улсын үзэсгэлэн худалдаанд оролцох зохион байгуулалттай аялал.",
    highlights: [
      "Event registration болон аяллын төлөвлөлт",
      "Үзэсгэлэн дээр бүтээгдэхүүн, технологи судлах",
      "Шинэ түнш, нийлүүлэгчтэй холбогдох дэмжлэг",
    ],
  },
  {
    id: "programmed-leisure",
    title: "Хөтөлбөртэй амралт зугаалга",
    description:
      "Тодорхой маршрут, өдөр тутмын хөтөлбөр, байр, тээвэртэй амралт аяллын багц.",
    highlights: [
      "Урьдчилан төлөвлөсөн маршрут",
      "Байр, тээвэр, хөтөчийн зохион байгуулалт",
      "Гэр бүл, найз нөхөд, баг хамт олонд тохиромжтой",
    ],
  },
  {
    id: "custom-travel",
    title: "Чөлөөт аялал",
    description:
      "Аялагчийн зорилго, хугацаа, төсөв, сонирхолд тохируулсан уян хатан аяллын төлөвлөлт.",
    highlights: [
      "Уян хатан маршрут",
      "Хувийн болон жижиг групп аялал",
      "Нислэг, буудал, даатгал, зөвлөгөөний дэмжлэг",
    ],
  },
];

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
    nextDeparture: "2026-06",
    featured: true,
  },
  {
    id: "3",
    slug: "sial-shanghai-food-expo",
    title: "SIAL Shanghai Expo бизнес аялал",
    location: "Shanghai",
    country: "China",
    days: 5,
    groupSize: "Small group",
    difficulty: "Easy",
    price: 0,
    currency: "MNT",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80&auto=format&fit=crop",
    tags: ["Food", "Expo", "Import"],
    rating: 4.9,
    reviews: 27,
    category: "expo",
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
    nextDeparture: "2026-05",
    featured: true,
  },
  {
    id: "4",
    slug: "custom-business-sourcing-trip",
    title: "Захиалгат бизнес аялал",
    location: "Asia",
    country: "Multiple destinations",
    days: 4,
    groupSize: "Private / Team",
    difficulty: "Easy",
    price: 0,
    currency: "MNT",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80&auto=format&fit=crop",
    tags: ["Consulting", "Sourcing"],
    rating: 5,
    reviews: 16,
    category: "business",
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
    featured: true,
  },
  {
    id: "5",
    slug: "programmed-leisure-asia",
    title: "Хөтөлбөртэй амралт зугаалга",
    location: "Asia",
    country: "Selected destinations",
    days: 6,
    groupSize: "Family / Group",
    difficulty: "Easy",
    price: 0,
    currency: "MNT",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
    tags: ["Leisure", "Family"],
    rating: 4.8,
    reviews: 32,
    category: "leisure",
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
  {
    id: "6",
    slug: "free-travel-planning",
    title: "Чөлөөт аяллын төлөвлөлт",
    location: "Worldwide",
    country: "Custom",
    days: 5,
    groupSize: "Flexible",
    difficulty: "Easy",
    price: 0,
    currency: "MNT",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80&auto=format&fit=crop",
    tags: ["Custom", "Flexible"],
    rating: 4.7,
    reviews: 19,
    category: "custom",
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
];

export function findAdventureBySlug(slug: string) {
  return ADVENTURES.find((adventure) => adventure.slug === slug);
}
