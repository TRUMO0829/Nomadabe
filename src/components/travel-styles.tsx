"use client";

import { type KeyboardEvent, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Compass,
  Globe2,
  MountainSnow,
  Palmtree,
  Search,
  Sparkles,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { cn } from "@/lib/utils";
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

export type DestinationFilter = {
  ids: string[];
  label: string;
  active: boolean;
};

type TravelStylesProps = {
  adventures?: Adventure[];
  embedded?: boolean;
  onFilterChange?: (filter: DestinationFilter) => void;
};

const DESTINATION_COPY = {
  mn: {
    eyebrow: "Аяллууд",
    title: "Аялал ба очих газар нэг дор.",
    body:
      "Газрын зураг дээрээс очих газраа сонгоод тухайн чиглэлд байгаа аяллуудаа шууд хар.",
    search: "Аялал хайх",
    regionLabel: "Аяллын чиглэл сонгох",
    mapTitle: "Destination map",
    mapBody:
      "Цэг дээр дарахад тухайн газрын аяллууд доор шүүгдэж, дэлгэрэнгүй мэдээлэл modal-аар нээгдэнэ.",
    selectedRoute: "Сонгосон чиглэл",
    allTrips: "Бүх аялал",
    routePoints: "Газрын цэгүүд",
    trips: "аялал",
    clear: "Бүгдийг харах",
  },
  en: {
    eyebrow: "Trips",
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
    trips: "trips",
    clear: "View all",
  },
  zh: {
    eyebrow: "Trips",
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
    trips: "trips",
    clear: "View all",
  },
  ja: {
    eyebrow: "Trips",
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
    trips: "trips",
    clear: "View all",
  },
  ko: {
    eyebrow: "Trips",
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
    trips: "trips",
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

export function TravelStyles({
  adventures = ADVENTURES,
  embedded = false,
  onFilterChange,
}: TravelStylesProps) {
  const { contentLocale } = useLanguage();
  const [activeRegionId, setActiveRegionId] = useState("all");
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
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

  const filteredAdventureIds = useMemo(
    () => filteredAdventures.map((adventure) => adventure.id),
    [filteredAdventures]
  );

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
  const selectedRegionId = selectedPoint?.regionId ?? activeRegionId;
  const mapRegionFill = (regionId: string) =>
    selectedRegionId === regionId ? "#F2A6B1" : "#DCE9DD";
  const mapRegionText = (regionId: string) =>
    selectedRegionId === regionId ? "#E11D2E" : "#626262";
  const selectMapRegion = (regionId: string) => {
    setActiveRegionId(regionId);
    setActivePointId(null);
  };
  const handleMapRegionKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    regionId: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectMapRegion(regionId);
    }
  };

  useEffect(() => {
    onFilterChange?.({
      ids: filteredAdventureIds,
      label: selectedTitle,
      active:
        activeRegionId !== "all" ||
        activePointId !== null ||
        query.trim().length > 0,
    });
  }, [
    activePointId,
    activeRegionId,
    filteredAdventureIds,
    onFilterChange,
    query,
    selectedTitle,
  ]);

  return (
    <section
      id={embedded ? "trip-destinations" : "destinations"}
      className="bg-background font-sans"
    >
      {!embedded && (
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
      )}

      <div
        className={cn(
          "mx-auto max-w-7xl px-6 lg:px-10",
          embedded ? "py-12 lg:py-14" : "py-12 lg:py-16"
        )}
      >
        {embedded && (
          <div className="mb-7 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-foreground lg:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground lg:text-base">
              {copy.body}
            </p>
          </div>
        )}
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
          <div className="relative min-h-[480px] overflow-hidden rounded-lg border border-border bg-[#F4F4F1] shadow-sm">
            <div className="absolute inset-y-0 right-0 w-[34%] bg-[#E5E5E5]" />
            <svg
              aria-label={copy.mapTitle}
              role="img"
              viewBox="0 0 1000 520"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M682 0h318v520H668c24-42 29-86 12-132-19-51 2-96 44-121 35-21 37-58 10-96-31-44-24-83 20-117 20-16 18-36-72-54Z"
                fill="#E6E6E4"
              />
              {[
                {
                  id: "turkey",
                  label: "TURKEY",
                  d: "M86 307 138 260l105 16 47 53-14 74-78 43-101-31-47-60 36-48Z",
                  text: { x: 102, y: 418 },
                },
                {
                  id: "mongolia",
                  label: "MONGOLIA",
                  d: "M312 157 449 111l164 36 66 81-42 93-172 28-142-42-62-81 51-69Z",
                  text: { x: 384, y: 254 },
                },
                {
                  id: "china",
                  label: "CHINA",
                  d: "M296 320 437 293l155 31 103 82-42 83-175 31-149-33-77-80 44-87Z",
                  text: { x: 438, y: 418 },
                },
                {
                  id: "korea",
                  label: "KOREA",
                  d: "M676 245 734 260l24 61-31 62-59-23-20-66 28-49Z",
                  text: { x: 720, y: 380 },
                },
                {
                  id: "japan",
                  label: "JAPAN",
                  d: "M798 128c38 16 70 48 72 82 2 37-30 70-67 86-26 11-49 39-45 71 34-11 74-38 104-72 53-59 65-133 27-187-24-35-59-53-91-70v90Z",
                  text: { x: 835, y: 245 },
                },
                {
                  id: "islands",
                  label: "ISLANDS",
                  d: "M592 438c26-13 56-9 74 10 20 21 13 50-15 62-31 13-68 1-83-22-11-18-1-39 24-50Z",
                  text: { x: 633, y: 494 },
                },
              ].map((region) => (
                <g
                  key={region.id}
                  role="button"
                  tabIndex={0}
                  aria-label={region.label}
                  className="cursor-pointer outline-none"
                  onClick={() => selectMapRegion(region.id)}
                  onKeyDown={(event) => handleMapRegionKeyDown(event, region.id)}
                >
                  <path
                    d={region.d}
                    fill={mapRegionFill(region.id)}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-colors duration-200"
                  />
                  <text
                    x={region.text.x}
                    y={region.text.y}
                    fill={mapRegionText(region.id)}
                    fontFamily="Arial, Helvetica, sans-serif"
                    fontSize="26"
                    fontWeight="800"
                    fontStyle="italic"
                  >
                    {region.label}
                  </text>
                </g>
              ))}
              <g
                fill="none"
                stroke="#B8B8B8"
                strokeWidth="2"
                strokeLinecap="round"
                fontFamily="Arial, Helvetica, sans-serif"
                fontWeight="800"
              >
                <path d="M162 243h111v34" />
                <path d="M482 112V70h130" />
                <path d="M628 407h120" />
                <path d="M770 246h111" />
                <path d="M116 304H38" />
                <path d="M646 454h124" />
              </g>
              <g
                fill="#8C8C8C"
                fontFamily="Arial, Helvetica, sans-serif"
                fontSize="19"
                fontWeight="900"
              >
                <text x="38" y="302">ISTANBUL</text>
                <text x="612" y="75">ULAANBAATAR</text>
                <text x="748" y="413">SEOUL</text>
                <text x="881" y="252">TOKYO</text>
                <text x="42" y="239">CAPPADOCIA</text>
                <text x="770" y="459">BALI</text>
              </g>
              <g fill="#8C8C8C">
                <circle cx="162" cy="243" r="4" />
                <circle cx="482" cy="112" r="4" />
                <circle cx="628" cy="407" r="4" />
                <circle cx="770" cy="246" r="4" />
                <circle cx="116" cy="304" r="4" />
                <circle cx="646" cy="454" r="4" />
              </g>
            </svg>

            <div className="relative z-10 flex min-h-[480px] flex-col justify-between p-5 text-foreground lg:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-foreground">
                    {copy.mapTitle}
                  </p>
                  <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-muted-foreground">
                    {copy.mapBody}
                  </p>
                </div>
                <div className="rounded-md border border-border bg-card px-3 py-2 text-xs font-black text-foreground shadow-sm">
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
                          "block h-3.5 w-3.5 rounded-full border-2 transition-all",
                          pointSelected
                            ? "scale-125 border-[#E11D2E] bg-[#E11D2E] shadow-[0_0_0_7px_rgba(225,29,46,0.16)]"
                            : "border-[#8C8C8C] bg-[#8C8C8C] hover:border-[#E11D2E] hover:bg-[#E11D2E]"
                        )}
                      />
                      <span
                        className={cn(
                          "mt-2 hidden whitespace-nowrap text-[11px] font-black uppercase tracking-wider sm:block",
                          pointSelected
                            ? "text-[#E11D2E]"
                            : "text-[#707070]"
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

      </div>
    </section>
  );
}
