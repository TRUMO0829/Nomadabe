"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Compass,
  Globe2,
  MapPin,
  MapPinned,
  MountainSnow,
  Palmtree,
  Search,
  Sparkles,
  Star,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { cn } from "@/lib/utils";
import { AdventureModal } from "./adventure-modal";
import { useLanguage } from "./language-provider";

type LocalizedText = {
  mn: string;
  en: string;
  zh: string;
  ja: string;
  ko: string;
};

type DestinationRegion = {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  countries: string[];
  keywords: string[];
  icon: LucideIcon;
};

type DestinationPoint = {
  id: string;
  regionId: string;
  title: LocalizedText;
  eyebrow: LocalizedText;
  description: LocalizedText;
  keywords: string[];
  x: number;
  y: number;
};

type TravelStylesProps = {
  adventures?: Adventure[];
};

const DESTINATION_COPY = {
  mn: {
    eyebrow: "Чиглэлүүд",
    title: "Аялал ба destination нэг дор.",
    body:
      "Газрын зураг дээрээс очих газраа сонгоод тухайн чиглэлд байгаа аяллуудаа шууд хар.",
    search: "Аялал хайх",
    regionLabel: "Чиглэл сонгох",
    mapTitle: "Destination map",
    mapBody:
      "Цэг дээр дарахад тухайн газрын аяллууд доор шүүгдэж, дэлгэрэнгүй мэдээлэл modal-аар нээгдэнэ.",
    selectedRoute: "Сонгосон чиглэл",
    allTrips: "Бүх аялал",
    routePoints: "Газрын цэгүүд",
    tripList: "Тухайн чиглэлийн аяллууд",
    tripListBody:
      "Аяллын card дээр дараад үнэ, хөтөлбөр, багцын нөхцөл, route мэдээллээ харна.",
    trips: "аялал",
    days: "өдөр",
    price: "Үнэ",
    quote: "Үнийн санал",
    details: "Дэлгэрэнгүй",
    empty: "Энэ сонголтод таарах аялал одоогоор алга.",
    clear: "Бүгдийг харах",
  },
  en: {
    eyebrow: "Destinations",
    title: "Trips and destinations in one place.",
    body:
      "Choose a destination on the map and the matching trips open below.",
    search: "Search trips",
    regionLabel: "Choose a route",
    mapTitle: "Destination map",
    mapBody:
      "Select a point to filter trips by place, then open each trip for details.",
    selectedRoute: "Selected route",
    allTrips: "All trips",
    routePoints: "Map points",
    tripList: "Trips for this destination",
    tripListBody:
      "Open a trip card to view pricing, itinerary, inclusions, and route details.",
    trips: "trips",
    days: "days",
    price: "Price",
    quote: "Quote",
    details: "Details",
    empty: "No trips match this destination yet.",
    clear: "View all",
  },
  zh: {
    eyebrow: "Destinations",
    title: "Trips and destinations in one place.",
    body:
      "Choose a destination on the map and the matching trips open below.",
    search: "Search trips",
    regionLabel: "Choose a route",
    mapTitle: "Destination map",
    mapBody:
      "Select a point to filter trips by place, then open each trip for details.",
    selectedRoute: "Selected route",
    allTrips: "All trips",
    routePoints: "Map points",
    tripList: "Trips for this destination",
    tripListBody:
      "Open a trip card to view pricing, itinerary, inclusions, and route details.",
    trips: "trips",
    days: "days",
    price: "Price",
    quote: "Quote",
    details: "Details",
    empty: "No trips match this destination yet.",
    clear: "View all",
  },
  ja: {
    eyebrow: "Destinations",
    title: "Trips and destinations in one place.",
    body:
      "Choose a destination on the map and the matching trips open below.",
    search: "Search trips",
    regionLabel: "Choose a route",
    mapTitle: "Destination map",
    mapBody:
      "Select a point to filter trips by place, then open each trip for details.",
    selectedRoute: "Selected route",
    allTrips: "All trips",
    routePoints: "Map points",
    tripList: "Trips for this destination",
    tripListBody:
      "Open a trip card to view pricing, itinerary, inclusions, and route details.",
    trips: "trips",
    days: "days",
    price: "Price",
    quote: "Quote",
    details: "Details",
    empty: "No trips match this destination yet.",
    clear: "View all",
  },
  ko: {
    eyebrow: "Destinations",
    title: "Trips and destinations in one place.",
    body:
      "Choose a destination on the map and the matching trips open below.",
    search: "Search trips",
    regionLabel: "Choose a route",
    mapTitle: "Destination map",
    mapBody:
      "Select a point to filter trips by place, then open each trip for details.",
    selectedRoute: "Selected route",
    allTrips: "All trips",
    routePoints: "Map points",
    tripList: "Trips for this destination",
    tripListBody:
      "Open a trip card to view pricing, itinerary, inclusions, and route details.",
    trips: "trips",
    days: "days",
    price: "Price",
    quote: "Quote",
    details: "Details",
    empty: "No trips match this destination yet.",
    clear: "View all",
  },
} as const;

const DESTINATION_REGIONS: DestinationRegion[] = [
  {
    id: "all",
    label: {
      mn: "Бүх аялал",
      en: "All trips",
      zh: "All trips",
      ja: "All trips",
      ko: "All trips",
    },
    description: {
      mn: "Гадаад, дотоод бүх аяллыг нэг дор харна.",
      en: "Browse every domestic and outbound trip.",
      zh: "Browse every domestic and outbound trip.",
      ja: "Browse every domestic and outbound trip.",
      ko: "Browse every domestic and outbound trip.",
    },
    countries: [],
    keywords: [],
    icon: Globe2,
  },
  {
    id: "mongolia",
    label: {
      mn: "Монгол",
      en: "Mongolia",
      zh: "Mongolia",
      ja: "Mongolia",
      ko: "Mongolia",
    },
    description: {
      mn: "Говь, Хөвсгөл, Алтай, Тэрэлж зэрэг дотоод аяллын чиглэлүүд.",
      en: "Domestic routes through the Gobi, Khuvsgul, Altai, and Terelj.",
      zh: "Domestic routes through the Gobi, Khuvsgul, Altai, and Terelj.",
      ja: "Domestic routes through the Gobi, Khuvsgul, Altai, and Terelj.",
      ko: "Domestic routes through the Gobi, Khuvsgul, Altai, and Terelj.",
    },
    countries: ["mongolia", "монгол"],
    keywords: ["gobi", "говь", "khuvsgul", "хөвсгөл", "altai", "алтай", "terelj", "тэрэлж", "ulaanbaatar", "улаанбаатар"],
    icon: MountainSnow,
  },
  {
    id: "china",
    label: {
      mn: "Хятад",
      en: "China",
      zh: "China",
      ja: "China",
      ko: "China",
    },
    description: {
      mn: "Expo, бизнес уулзалт, хотын аялал болон байгалийн чиглэлүүд.",
      en: "Expo, business, city, and nature routes across China.",
      zh: "Expo, business, city, and nature routes across China.",
      ja: "Expo, business, city, and nature routes across China.",
      ko: "Expo, business, city, and nature routes across China.",
    },
    countries: ["china", "хятад"],
    keywords: ["guangzhou", "гуанжоу", "canton", "shanghai", "шанхай", "snec", "zhangjiajie", "hainan"],
    icon: Building2,
  },
  {
    id: "japan",
    label: {
      mn: "Япон",
      en: "Japan",
      zh: "Japan",
      ja: "Japan",
      ko: "Japan",
    },
    description: {
      mn: "Токио, Осака, Киото, Фүжи орчмын соёл, хотын аялал.",
      en: "Culture and city routes around Tokyo, Osaka, Kyoto, and Mt. Fuji.",
      zh: "Culture and city routes around Tokyo, Osaka, Kyoto, and Mt. Fuji.",
      ja: "Culture and city routes around Tokyo, Osaka, Kyoto, and Mt. Fuji.",
      ko: "Culture and city routes around Tokyo, Osaka, Kyoto, and Mt. Fuji.",
    },
    countries: ["japan", "япон"],
    keywords: ["tokyo", "токио", "osaka", "осака", "kyoto", "киото", "fuji", "фүжи"],
    icon: Sparkles,
  },
  {
    id: "korea",
    label: {
      mn: "Солонгос",
      en: "Korea",
      zh: "Korea",
      ja: "Korea",
      ko: "Korea",
    },
    description: {
      mn: "Сөүл, Жэжү, Бусан чиглэлийн богино хот, амралтын аяллууд.",
      en: "Short city and leisure routes through Seoul, Jeju, and Busan.",
      zh: "Short city and leisure routes through Seoul, Jeju, and Busan.",
      ja: "Short city and leisure routes through Seoul, Jeju, and Busan.",
      ko: "Short city and leisure routes through Seoul, Jeju, and Busan.",
    },
    countries: ["south korea", "korea", "солонгос"],
    keywords: ["seoul", "сөүл", "jeju", "жэжү", "busan", "бусан", "korea"],
    icon: Waves,
  },
  {
    id: "turkey",
    label: {
      mn: "Турк",
      en: "Turkey",
      zh: "Turkey",
      ja: "Turkey",
      ko: "Turkey",
    },
    description: {
      mn: "Истанбул, Каппадоки, Анталья, Памуккале орчмын урт аялал.",
      en: "Long-haul culture routes through Istanbul, Cappadocia, Antalya, and Pamukkale.",
      zh: "Long-haul culture routes through Istanbul, Cappadocia, Antalya, and Pamukkale.",
      ja: "Long-haul culture routes through Istanbul, Cappadocia, Antalya, and Pamukkale.",
      ko: "Long-haul culture routes through Istanbul, Cappadocia, Antalya, and Pamukkale.",
    },
    countries: ["turkey", "түрк"],
    keywords: ["istanbul", "истанбул", "antalya", "антья", "pamukkale", "памуккале", "cappadocia", "каппадоки"],
    icon: Compass,
  },
  {
    id: "islands",
    label: {
      mn: "Арал, далай",
      en: "Islands",
      zh: "Islands",
      ja: "Islands",
      ko: "Islands",
    },
    description: {
      mn: "Пукет, Бали, Хайнань, Жэжү зэрэг далайн амралтын чиглэлүүд.",
      en: "Beach and resort routes such as Phuket, Bali, Hainan, and Jeju.",
      zh: "Beach and resort routes such as Phuket, Bali, Hainan, and Jeju.",
      ja: "Beach and resort routes such as Phuket, Bali, Hainan, and Jeju.",
      ko: "Beach and resort routes such as Phuket, Bali, Hainan, and Jeju.",
    },
    countries: ["thailand", "indonesia"],
    keywords: ["phuket", "пукет", "bali", "бали", "hainan", "хайнань", "jeju", "жэжү", "island", "beach", "resort", "далай", "арал"],
    icon: Palmtree,
  },
];

const DESTINATION_POINTS: DestinationPoint[] = [
  {
    id: "gobi",
    regionId: "mongolia",
    title: { mn: "Говь", en: "Gobi", zh: "Gobi", ja: "Gobi", ko: "Gobi" },
    eyebrow: {
      mn: "Элс, хавцал, гэр бааз",
      en: "Dunes, canyons, ger camps",
      zh: "Dunes, canyons, ger camps",
      ja: "Dunes, canyons, ger camps",
      ko: "Dunes, canyons, ger camps",
    },
    description: {
      mn: "Хонгорын элс, Ёлын ам, Баянзаг зэрэг говийн үзмэртэй аяллууд.",
      en: "Trips around Khongor dunes, Yol Valley, Bayanzag, and desert routes.",
      zh: "Trips around Khongor dunes, Yol Valley, Bayanzag, and desert routes.",
      ja: "Trips around Khongor dunes, Yol Valley, Bayanzag, and desert routes.",
      ko: "Trips around Khongor dunes, Yol Valley, Bayanzag, and desert routes.",
    },
    keywords: ["gobi", "говь", "khongor", "yol", "bayanzag", "өмнөговь"],
    x: 47,
    y: 45,
  },
  {
    id: "khuvsgul",
    regionId: "mongolia",
    title: {
      mn: "Хөвсгөл",
      en: "Khuvsgul",
      zh: "Khuvsgul",
      ja: "Khuvsgul",
      ko: "Khuvsgul",
    },
    eyebrow: {
      mn: "Нуур, ой, тайван амралт",
      en: "Lake, forest, slow travel",
      zh: "Lake, forest, slow travel",
      ja: "Lake, forest, slow travel",
      ko: "Lake, forest, slow travel",
    },
    description: {
      mn: "Нуурын эрэг, завь, хөнгөн алхалт, гэр бүлийн тайван хөтөлбөр.",
      en: "Lake-side routes with boat time, light walks, and family-friendly pacing.",
      zh: "Lake-side routes with boat time, light walks, and family-friendly pacing.",
      ja: "Lake-side routes with boat time, light walks, and family-friendly pacing.",
      ko: "Lake-side routes with boat time, light walks, and family-friendly pacing.",
    },
    keywords: ["khuvsgul", "хөвсгөл", "lake", "нуур"],
    x: 49,
    y: 29,
  },
  {
    id: "altai",
    regionId: "mongolia",
    title: { mn: "Алтай", en: "Altai", zh: "Altai", ja: "Altai", ko: "Altai" },
    eyebrow: {
      mn: "Уул, соёл, trekking",
      en: "Mountains, culture, trekking",
      zh: "Mountains, culture, trekking",
      ja: "Mountains, culture, trekking",
      ko: "Mountains, culture, trekking",
    },
    description: {
      mn: "Баруун Монголын уулс, нутгийн соёл, зураг авалттай уян хатан маршрут.",
      en: "Western Mongolia routes for mountain scenery, local culture, and photography.",
      zh: "Western Mongolia routes for mountain scenery, local culture, and photography.",
      ja: "Western Mongolia routes for mountain scenery, local culture, and photography.",
      ko: "Western Mongolia routes for mountain scenery, local culture, and photography.",
    },
    keywords: ["altai", "алтай", "bayan-ulgii", "баян-өлгий", "trek", "trekking"],
    x: 38,
    y: 37,
  },
  {
    id: "shanghai",
    regionId: "china",
    title: {
      mn: "Шанхай",
      en: "Shanghai",
      zh: "Shanghai",
      ja: "Shanghai",
      ko: "Shanghai",
    },
    eyebrow: {
      mn: "Expo, бизнес, хот",
      en: "Expo, business, city",
      zh: "Expo, business, city",
      ja: "Expo, business, city",
      ko: "Expo, business, city",
    },
    description: {
      mn: "SNEC, SIAL, хотын аялал болон бизнес уулзалтын чиглэл.",
      en: "A China hub for SNEC, SIAL, business meetings, and city programs.",
      zh: "A China hub for SNEC, SIAL, business meetings, and city programs.",
      ja: "A China hub for SNEC, SIAL, business meetings, and city programs.",
      ko: "A China hub for SNEC, SIAL, business meetings, and city programs.",
    },
    keywords: ["shanghai", "шанхай", "snec", "sial", "pv"],
    x: 63,
    y: 58,
  },
  {
    id: "guangzhou",
    regionId: "china",
    title: {
      mn: "Гуанжоу",
      en: "Guangzhou",
      zh: "Guangzhou",
      ja: "Guangzhou",
      ko: "Guangzhou",
    },
    eyebrow: {
      mn: "Canton Fair, import",
      en: "Canton Fair, import",
      zh: "Canton Fair, import",
      ja: "Canton Fair, import",
      ko: "Canton Fair, import",
    },
    description: {
      mn: "Canton Fair, нийлүүлэгч судалгаа, импортын бизнес аяллын гол хот.",
      en: "The main city for Canton Fair, supplier research, and import trips.",
      zh: "The main city for Canton Fair, supplier research, and import trips.",
      ja: "The main city for Canton Fair, supplier research, and import trips.",
      ko: "The main city for Canton Fair, supplier research, and import trips.",
    },
    keywords: ["guangzhou", "гуанжоу", "canton", "fair", "import", "импорт"],
    x: 59,
    y: 70,
  },
  {
    id: "japan-classic",
    regionId: "japan",
    title: {
      mn: "Токио - Осака",
      en: "Tokyo - Osaka",
      zh: "Tokyo - Osaka",
      ja: "Tokyo - Osaka",
      ko: "Tokyo - Osaka",
    },
    eyebrow: {
      mn: "Хот, соёл, shopping",
      en: "Cities, culture, shopping",
      zh: "Cities, culture, shopping",
      ja: "Cities, culture, shopping",
      ko: "Cities, culture, shopping",
    },
    description: {
      mn: "Токио, Фүжи, Осака, Киотог холбосон Японы сонгодог маршрут.",
      en: "Classic Japan routes connecting Tokyo, Mt. Fuji, Osaka, and Kyoto.",
      zh: "Classic Japan routes connecting Tokyo, Mt. Fuji, Osaka, and Kyoto.",
      ja: "Classic Japan routes connecting Tokyo, Mt. Fuji, Osaka, and Kyoto.",
      ko: "Classic Japan routes connecting Tokyo, Mt. Fuji, Osaka, and Kyoto.",
    },
    keywords: ["japan", "япон", "tokyo", "токио", "osaka", "осака", "kyoto", "киото", "fuji", "фүжи"],
    x: 75,
    y: 52,
  },
  {
    id: "korea-short",
    regionId: "korea",
    title: {
      mn: "Сөүл - Жэжү",
      en: "Seoul - Jeju",
      zh: "Seoul - Jeju",
      ja: "Seoul - Jeju",
      ko: "Seoul - Jeju",
    },
    eyebrow: {
      mn: "Хот, shopping, арал",
      en: "City, shopping, island",
      zh: "City, shopping, island",
      ja: "City, shopping, island",
      ko: "City, shopping, island",
    },
    description: {
      mn: "Богино хугацааны хот, shopping, гэр бүлийн амралтын чиглэл.",
      en: "Short-haul city, shopping, family, and island routes.",
      zh: "Short-haul city, shopping, family, and island routes.",
      ja: "Short-haul city, shopping, family, and island routes.",
      ko: "Short-haul city, shopping, family, and island routes.",
    },
    keywords: ["korea", "солонгос", "seoul", "сөүл", "jeju", "жэжү", "busan", "бусан"],
    x: 69,
    y: 50,
  },
  {
    id: "turkey-culture",
    regionId: "turkey",
    title: {
      mn: "Истанбул",
      en: "Istanbul",
      zh: "Istanbul",
      ja: "Istanbul",
      ko: "Istanbul",
    },
    eyebrow: {
      mn: "Соёл, далай, урт аялал",
      en: "Culture, coast, long-haul",
      zh: "Culture, coast, long-haul",
      ja: "Culture, coast, long-haul",
      ko: "Culture, coast, long-haul",
    },
    description: {
      mn: "Истанбул, Анталья, Памуккале, Каппадокийг холбосон урт маршрут.",
      en: "Culture routes linking Istanbul, Antalya, Pamukkale, and Cappadocia.",
      zh: "Culture routes linking Istanbul, Antalya, Pamukkale, and Cappadocia.",
      ja: "Culture routes linking Istanbul, Antalya, Pamukkale, and Cappadocia.",
      ko: "Culture routes linking Istanbul, Antalya, Pamukkale, and Cappadocia.",
    },
    keywords: ["turkey", "түрк", "istanbul", "истанбул", "antalya", "pamukkale", "cappadocia", "каппадоки"],
    x: 24,
    y: 52,
  },
  {
    id: "island-breaks",
    regionId: "islands",
    title: {
      mn: "Пукет - Бали",
      en: "Phuket - Bali",
      zh: "Phuket - Bali",
      ja: "Phuket - Bali",
      ko: "Phuket - Bali",
    },
    eyebrow: {
      mn: "Далайн амралт",
      en: "Beach holidays",
      zh: "Beach holidays",
      ja: "Beach holidays",
      ko: "Beach holidays",
    },
    description: {
      mn: "Resort, нислэг, буудал, өдөр тутмын хөнгөн хөтөлбөртэй далайн амралт.",
      en: "Beach and resort routes with flights, hotels, transfers, and easy pacing.",
      zh: "Beach and resort routes with flights, hotels, transfers, and easy pacing.",
      ja: "Beach and resort routes with flights, hotels, transfers, and easy pacing.",
      ko: "Beach and resort routes with flights, hotels, transfers, and easy pacing.",
    },
    keywords: ["phuket", "пукет", "bali", "бали", "hainan", "хайнань", "island", "beach", "resort", "далай"],
    x: 58,
    y: 83,
  },
];

function normalize(value: string) {
  return value.toLocaleLowerCase("en-US");
}

function getSearchText(adventure: Adventure, text: ReturnType<typeof getAdventureText>) {
  return normalize(
    [
      adventure.title,
      adventure.location,
      adventure.country,
      adventure.summary,
      adventure.category,
      text.title,
      text.location,
      text.country,
      text.summary,
      ...adventure.tags,
      ...adventure.idealFor,
      ...text.tags,
      ...text.idealFor,
    ].join(" ")
  );
}

function matchesTerms(searchText: string, terms: string[]) {
  return terms.some((term) => searchText.includes(normalize(term)));
}

function matchesRegion(
  adventure: Adventure,
  text: ReturnType<typeof getAdventureText>,
  region: DestinationRegion
) {
  if (region.id === "all") return true;
  return matchesTerms(getSearchText(adventure, text), [
    ...region.countries,
    ...region.keywords,
  ]);
}

function matchesPoint(
  adventure: Adventure,
  text: ReturnType<typeof getAdventureText>,
  point: DestinationPoint | null
) {
  if (!point) return true;
  return matchesTerms(getSearchText(adventure, text), point.keywords);
}

export function TravelStyles({ adventures = ADVENTURES }: TravelStylesProps) {
  const { contentLocale } = useLanguage();
  const [activeRegionId, setActiveRegionId] = useState("all");
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(
    null
  );
  const copy = DESTINATION_COPY[contentLocale];

  const activeRegion =
    DESTINATION_REGIONS.find((region) => region.id === activeRegionId) ??
    DESTINATION_REGIONS[0];
  const selectedPoint =
    DESTINATION_POINTS.find((point) => point.id === activePointId) ?? null;

  const visiblePoints = useMemo(
    () =>
      activeRegionId === "all"
        ? DESTINATION_POINTS
        : DESTINATION_POINTS.filter((point) => point.regionId === activeRegionId),
    [activeRegionId]
  );

  const filteredAdventures = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return adventures.filter((adventure) => {
      const text = getAdventureText(adventure, contentLocale);
      const searchText = getSearchText(adventure, text);
      const searchMatch = !normalizedQuery || searchText.includes(normalizedQuery);

      return (
        searchMatch &&
        matchesRegion(adventure, text, activeRegion) &&
        matchesPoint(adventure, text, selectedPoint)
      );
    });
  }, [activeRegion, adventures, contentLocale, query, selectedPoint]);

  const regionCounts = useMemo(
    () =>
      new Map(
        DESTINATION_REGIONS.map((region) => [
          region.id,
          adventures.filter((adventure) => {
            const text = getAdventureText(adventure, contentLocale);
            return matchesRegion(adventure, text, region);
          }).length,
        ])
      ),
    [adventures, contentLocale]
  );

  const pointCounts = useMemo(
    () =>
      new Map(
        DESTINATION_POINTS.map((point) => [
          point.id,
          adventures.filter((adventure) => {
            const text = getAdventureText(adventure, contentLocale);
            return matchesPoint(adventure, text, point);
          }).length,
        ])
      ),
    [adventures, contentLocale]
  );

  const selectedTitle = selectedPoint
    ? selectedPoint.title[contentLocale]
    : activeRegion.label[contentLocale];
  const selectedEyebrow = selectedPoint
    ? selectedPoint.eyebrow[contentLocale]
    : copy.allTrips;
  const selectedDescription = selectedPoint
    ? selectedPoint.description[contentLocale]
    : activeRegion.description[contentLocale];

  return (
    <section id="destinations" className="bg-background font-sans">
      <div className="relative isolate min-h-[520px] overflow-hidden bg-primary px-6 py-28 text-white lg:px-10 lg:py-36">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/nomadabe-hero-panorama.png')" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-primary/62 to-primary/90" />

        <div className="mx-auto flex min-h-[350px] max-w-7xl flex-col justify-end">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-accent lg:text-sm">
            {copy.eyebrow}
          </p>
          <h1 className="max-w-4xl text-balance text-5xl font-black leading-none sm:text-6xl lg:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-white/78 lg:text-xl">
            {copy.body}
          </p>

          <label className="mt-8 flex w-full max-w-md items-center gap-3 rounded-lg border border-white/22 bg-white/12 px-4 py-3 text-white shadow-xl backdrop-blur-sm transition-colors focus-within:border-accent">
            <Search className="h-5 w-5 shrink-0 text-accent" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.search}
              aria-label={copy.search}
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/66"
            />
          </label>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
              {copy.regionLabel}
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-foreground lg:text-4xl">
              {selectedTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveRegionId("all");
              setActivePointId(null);
              setQuery("");
            }}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-black text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Globe2 className="h-4 w-4" />
            {copy.clear}
          </button>
        </div>

        <div className="mb-10 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DESTINATION_REGIONS.map((region) => {
            const Icon = region.icon;
            const selected = region.id === activeRegionId && !selectedPoint;

            return (
              <button
                key={region.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setActiveRegionId(region.id);
                  setActivePointId(null);
                }}
                className={cn(
                  "inline-flex min-w-fit items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                  selected
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card text-foreground hover:border-accent"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-md",
                    selected ? "bg-black/10" : "bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-black">
                    {region.label[contentLocale]}
                  </span>
                  <span className="block text-xs font-bold opacity-70">
                    {regionCounts.get(region.id) ?? 0} {copy.trips}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative min-h-[440px] overflow-hidden rounded-lg border border-border bg-[#111410] shadow-sm">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_38%),linear-gradient(135deg,rgba(255,212,0,0.12),transparent_42%)]" />
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 520"
              className="absolute inset-0 h-full w-full text-white/13"
              preserveAspectRatio="none"
            >
              <path
                d="M92 190 164 138l85 18 45-35 92 29 70-44 94 21 54 64 91 14 78 62 93 21 55 88-37 75-92 28-103-27-86 40-109-20-82 35-107-35-86 20-86-50 20-85-60-49 37-67-28-71Z"
                fill="currentColor"
              />
              <path
                d="M615 157 706 133l93 34 74 73-22 88-87 53-96-23-61-80 8-121Z"
                fill="rgba(255,255,255,0.11)"
              />
              <path
                d="M320 285 398 244l101 18 72 62-31 69-99 30-96-18-54 31-77-37 22-70 84-44Z"
                fill="rgba(255,212,0,0.14)"
              />
              <path
                d="M130 330c109-31 192-18 282 9 103 31 187 26 286-10 78-28 143-27 247 15"
                fill="none"
                stroke="rgba(255,212,0,0.32)"
                strokeWidth="3"
                strokeDasharray="9 14"
              />
              <path
                d="M183 420c126-38 223-28 337 8 113 36 213 24 344-24"
                fill="none"
                stroke="rgba(255,255,255,0.17)"
                strokeWidth="2"
                strokeDasharray="8 16"
              />
            </svg>

            <div className="relative z-10 flex min-h-[440px] flex-col justify-between p-5 text-white lg:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
                    {copy.mapTitle}
                  </p>
                  <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-white/70">
                    {copy.mapBody}
                  </p>
                </div>
                <div className="rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-black text-white/82 backdrop-blur-sm">
                  {filteredAdventures.length} {copy.trips}
                </div>
              </div>

              <div className="absolute inset-x-5 bottom-7 top-24 lg:inset-x-7 lg:top-28">
                {DESTINATION_POINTS.map((point) => {
                  const pointSelected = selectedPoint?.id === point.id;
                  const pointVisible = visiblePoints.some(
                    (visiblePoint) => visiblePoint.id === point.id
                  );
                  const dimmed = activeRegionId !== "all" && !pointVisible;

                  return (
                    <button
                      key={point.id}
                      type="button"
                      aria-pressed={pointSelected}
                      title={point.title[contentLocale]}
                      onClick={() => {
                        setActiveRegionId(point.regionId);
                        setActivePointId(point.id);
                      }}
                      className={cn(
                        "absolute -translate-x-1/2 -translate-y-1/2 text-left transition-opacity",
                        dimmed ? "opacity-25" : "opacity-100"
                      )}
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    >
                      <span
                        className={cn(
                          "block h-4 w-4 rounded-full border-2 transition-all",
                          pointSelected
                            ? "scale-125 border-accent bg-accent shadow-[0_0_0_8px_rgba(255,212,0,0.20)]"
                            : "border-white bg-white hover:border-accent hover:bg-accent"
                        )}
                      />
                      <span
                        className={cn(
                          "mt-2 hidden whitespace-nowrap rounded-md px-2 py-1 text-xs font-black shadow-sm sm:block",
                          pointSelected
                            ? "bg-accent text-accent-foreground"
                            : "bg-black/55 text-white backdrop-blur"
                        )}
                      >
                        {point.title[contentLocale]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-border bg-card p-6 shadow-sm lg:p-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              {copy.selectedRoute}
            </p>
            <h3 className="mt-3 text-3xl font-black leading-tight text-foreground">
              {selectedTitle}
            </h3>
            <p className="mt-2 text-sm font-black text-foreground">
              {selectedEyebrow}
            </p>
            <p className="mt-4 text-sm font-semibold leading-7 text-muted-foreground">
              {selectedDescription}
            </p>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                  {copy.routePoints}
                </p>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-black text-muted-foreground">
                  {visiblePoints.length}
                </span>
              </div>
              <div className="grid gap-2">
                {visiblePoints.map((point) => {
                  const selected = selectedPoint?.id === point.id;

                  return (
                    <button
                      key={point.id}
                      type="button"
                      onClick={() => {
                        setActiveRegionId(point.regionId);
                        setActivePointId(point.id);
                      }}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-md border px-3 py-3 text-left transition-colors",
                        selected
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-background text-foreground hover:border-accent"
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black">
                          {point.title[contentLocale]}
                        </span>
                        <span className="block truncate text-xs font-semibold opacity-70">
                          {point.eyebrow[contentLocale]}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-black/5 px-2.5 py-1 text-xs font-black">
                        {pointCounts.get(point.id) ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 border-t border-border pt-10">
          <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
                {copy.tripList}
              </p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-foreground lg:text-4xl">
                {selectedTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-muted-foreground lg:text-base">
                {copy.tripListBody}
              </p>
            </div>
            <div className="rounded-full border border-border bg-card px-5 py-2 text-sm font-black text-foreground">
              {filteredAdventures.length} {copy.trips}
            </div>
          </div>

          {filteredAdventures.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredAdventures.map((adventure, index) => {
                const text = getAdventureText(adventure, contentLocale);

                return (
                  <motion.article
                    key={adventure.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(index * 0.04, 0.2),
                    }}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedAdventure(adventure)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedAdventure(adventure);
                      }
                    }}
                    className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-accent hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${adventure.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/10 to-transparent" />
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        {text.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/75">
                          <MapPin className="h-4 w-4 text-accent" />
                          {text.location}, {text.country}
                        </div>
                        <h3 className="text-2xl font-black leading-tight text-balance">
                          {text.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="line-clamp-3 min-h-[4.875rem] text-sm font-semibold leading-6 text-muted-foreground">
                        {text.summary}
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-2 border-y border-border py-4 text-sm">
                        <div>
                          <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                            <CalendarDays className="h-4 w-4 text-accent" />
                            <span className="text-xs font-bold">
                              {copy.days}
                            </span>
                          </div>
                          <div className="font-black text-foreground">
                            {adventure.days}
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="text-xs font-bold">Rating</span>
                          </div>
                          <div className="font-black text-foreground">
                            {adventure.rating}
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 text-xs font-bold text-muted-foreground">
                            {copy.price}
                          </div>
                          <div className="truncate font-black text-foreground">
                            {adventure.price > 0
                              ? `${adventure.price.toLocaleString()}`
                              : copy.quote}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedAdventure(adventure);
                        }}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-black text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground"
                      >
                        {copy.details}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <MapPinned className="mx-auto h-10 w-10 text-accent" />
              <p className="mt-4 text-base font-black text-foreground">
                {copy.empty}
              </p>
            </div>
          )}
        </div>
      </div>

      <AdventureModal
        adventure={selectedAdventure}
        onClose={() => setSelectedAdventure(null)}
      />
    </section>
  );
}
