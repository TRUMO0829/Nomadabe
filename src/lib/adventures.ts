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
