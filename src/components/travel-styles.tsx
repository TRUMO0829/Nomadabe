"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Compass,
  Globe2,
  MapPinned,
  MountainSnow,
  Palmtree,
  Sparkles,
  Waves,
} from "lucide-react";
import { useLanguage } from "./language-provider";

type DestinationTab = "all" | "cities" | "passion" | "style";
type CountryFilter =
  | "all"
  | "mongolia"
  | "china"
  | "japan"
  | "korea"
  | "turkey"
  | "islands";

type LocalizedText = {
  mn: string;
  en: string;
  zh: string;
  ja: string;
  ko: string;
};

type DestinationColumn = {
  country: CountryFilter;
  modes: DestinationTab[];
  title: LocalizedText;
  note: LocalizedText;
  items: LocalizedText[];
};

const DESTINATION_COPY = {
  mn: {
    eyebrow: "Чиглэлүүд",
    title: "Гадаад, дотоод аяллын чиглэлээ нэг дороос сонго.",
    body:
      "Destination дээр cursor очиход tab солигдоно. Дарж сонгоод улс, аяллын төрлөөр нь шууд шүүнэ.",
    tabs: {
      all: "Бүгд",
      cities: "Том хотууд",
      passion: "Сонирхол",
      style: "Амралтын хэв маяг",
    },
    countries: {
      all: "Бүх чиглэл",
      mongolia: "Монгол",
      china: "Хятад",
      japan: "Япон",
      korea: "Солонгос",
      turkey: "Турк",
      islands: "Арал, далай",
    },
    empty: "Энэ сонголтод чиглэл алга байна.",
  },
  en: {
    eyebrow: "Destinations",
    title: "Choose outbound and domestic routes in one place.",
    body:
      "Hover a tab to preview, click to keep the choice, then filter by country or route type.",
    tabs: {
      all: "All",
      cities: "Major cities",
      passion: "Passion",
      style: "Vacation style",
    },
    countries: {
      all: "All routes",
      mongolia: "Mongolia",
      china: "China",
      japan: "Japan",
      korea: "Korea",
      turkey: "Turkey",
      islands: "Islands",
    },
    empty: "No destinations for this selection.",
  },
  zh: {
    eyebrow: "Destinations",
    title: "Choose outbound and domestic routes in one place.",
    body:
      "Hover a tab to preview, click to keep the choice, then filter by country or route type.",
    tabs: {
      all: "All",
      cities: "Major cities",
      passion: "Passion",
      style: "Vacation style",
    },
    countries: {
      all: "All routes",
      mongolia: "Mongolia",
      china: "China",
      japan: "Japan",
      korea: "Korea",
      turkey: "Turkey",
      islands: "Islands",
    },
    empty: "No destinations for this selection.",
  },
  ja: {
    eyebrow: "Destinations",
    title: "Choose outbound and domestic routes in one place.",
    body:
      "Hover a tab to preview, click to keep the choice, then filter by country or route type.",
    tabs: {
      all: "All",
      cities: "Major cities",
      passion: "Passion",
      style: "Vacation style",
    },
    countries: {
      all: "All routes",
      mongolia: "Mongolia",
      china: "China",
      japan: "Japan",
      korea: "Korea",
      turkey: "Turkey",
      islands: "Islands",
    },
    empty: "No destinations for this selection.",
  },
  ko: {
    eyebrow: "Destinations",
    title: "Choose outbound and domestic routes in one place.",
    body:
      "Hover a tab to preview, click to keep the choice, then filter by country or route type.",
    tabs: {
      all: "All",
      cities: "Major cities",
      passion: "Passion",
      style: "Vacation style",
    },
    countries: {
      all: "All routes",
      mongolia: "Mongolia",
      china: "China",
      japan: "Japan",
      korea: "Korea",
      turkey: "Turkey",
      islands: "Islands",
    },
    empty: "No destinations for this selection.",
  },
} as const;

const DESTINATION_COLUMNS: DestinationColumn[] = [
  {
    country: "mongolia",
    modes: ["all", "passion", "style"],
    title: {
      mn: "Монголын байгаль",
      en: "Mongolia nature",
      zh: "Mongolia nature",
      ja: "Mongolia nature",
      ko: "Mongolia nature",
    },
    note: {
      mn: "Дотоод аялал",
      en: "Domestic routes",
      zh: "Domestic routes",
      ja: "Domestic routes",
      ko: "Domestic routes",
    },
    items: [
      { mn: "Хөвсгөл нуур", en: "Khuvsgul Lake", zh: "Khuvsgul Lake", ja: "Khuvsgul Lake", ko: "Khuvsgul Lake" },
      { mn: "Говийн элс", en: "Gobi dunes", zh: "Gobi dunes", ja: "Gobi dunes", ko: "Gobi dunes" },
      { mn: "Тэрэлж", en: "Terelj", zh: "Terelj", ja: "Terelj", ko: "Terelj" },
      { mn: "Орхоны хөндий", en: "Orkhon Valley", zh: "Orkhon Valley", ja: "Orkhon Valley", ko: "Orkhon Valley" },
      { mn: "Алтай", en: "Altai", zh: "Altai", ja: "Altai", ko: "Altai" },
    ],
  },
  {
    country: "mongolia",
    modes: ["all", "cities"],
    title: {
      mn: "Монголын хот, төвүүд",
      en: "Mongolia hubs",
      zh: "Mongolia hubs",
      ja: "Mongolia hubs",
      ko: "Mongolia hubs",
    },
    note: {
      mn: "Эхлэл цэгүүд",
      en: "Starting points",
      zh: "Starting points",
      ja: "Starting points",
      ko: "Starting points",
    },
    items: [
      { mn: "Улаанбаатар", en: "Ulaanbaatar", zh: "Ulaanbaatar", ja: "Ulaanbaatar", ko: "Ulaanbaatar" },
      { mn: "Хархорин", en: "Kharkhorin", zh: "Kharkhorin", ja: "Kharkhorin", ko: "Kharkhorin" },
      { mn: "Даланзадгад", en: "Dalanzadgad", zh: "Dalanzadgad", ja: "Dalanzadgad", ko: "Dalanzadgad" },
      { mn: "Мөрөн", en: "Murun", zh: "Murun", ja: "Murun", ko: "Murun" },
    ],
  },
  {
    country: "china",
    modes: ["all", "cities", "passion"],
    title: {
      mn: "Хятад",
      en: "China",
      zh: "China",
      ja: "China",
      ko: "China",
    },
    note: {
      mn: "Хот, байгаль, expo",
      en: "Cities, nature, expo",
      zh: "Cities, nature, expo",
      ja: "Cities, nature, expo",
      ko: "Cities, nature, expo",
    },
    items: [
      { mn: "Шанхай", en: "Shanghai", zh: "Shanghai", ja: "Shanghai", ko: "Shanghai" },
      { mn: "Жанжиажэ", en: "Zhangjiajie", zh: "Zhangjiajie", ja: "Zhangjiajie", ko: "Zhangjiajie" },
      { mn: "Хайнань", en: "Hainan", zh: "Hainan", ja: "Hainan", ko: "Hainan" },
      { mn: "Гуанжоу", en: "Guangzhou", zh: "Guangzhou", ja: "Guangzhou", ko: "Guangzhou" },
    ],
  },
  {
    country: "japan",
    modes: ["all", "cities", "passion", "style"],
    title: {
      mn: "Япон",
      en: "Japan",
      zh: "Japan",
      ja: "Japan",
      ko: "Japan",
    },
    note: {
      mn: "Соёл, хот, гэр бүл",
      en: "Culture, cities, family",
      zh: "Culture, cities, family",
      ja: "Culture, cities, family",
      ko: "Culture, cities, family",
    },
    items: [
      { mn: "Токио", en: "Tokyo", zh: "Tokyo", ja: "Tokyo", ko: "Tokyo" },
      { mn: "Осака", en: "Osaka", zh: "Osaka", ja: "Osaka", ko: "Osaka" },
      { mn: "Киото", en: "Kyoto", zh: "Kyoto", ja: "Kyoto", ko: "Kyoto" },
      { mn: "Фүжи уул", en: "Mt. Fuji", zh: "Mt. Fuji", ja: "Mt. Fuji", ko: "Mt. Fuji" },
    ],
  },
  {
    country: "korea",
    modes: ["all", "cities", "style"],
    title: {
      mn: "Солонгос",
      en: "South Korea",
      zh: "South Korea",
      ja: "South Korea",
      ko: "South Korea",
    },
    note: {
      mn: "Хот, арал, амралт",
      en: "Cities, islands, leisure",
      zh: "Cities, islands, leisure",
      ja: "Cities, islands, leisure",
      ko: "Cities, islands, leisure",
    },
    items: [
      { mn: "Сөүл", en: "Seoul", zh: "Seoul", ja: "Seoul", ko: "Seoul" },
      { mn: "Жэжү", en: "Jeju", zh: "Jeju", ja: "Jeju", ko: "Jeju" },
      { mn: "Бусан", en: "Busan", zh: "Busan", ja: "Busan", ko: "Busan" },
      { mn: "Инчон", en: "Incheon", zh: "Incheon", ja: "Incheon", ko: "Incheon" },
    ],
  },
  {
    country: "turkey",
    modes: ["all", "cities", "passion", "style"],
    title: {
      mn: "Турк",
      en: "Turkey",
      zh: "Turkey",
      ja: "Turkey",
      ko: "Turkey",
    },
    note: {
      mn: "Соёл, далай, урт аялал",
      en: "Culture, coast, long-haul",
      zh: "Culture, coast, long-haul",
      ja: "Culture, coast, long-haul",
      ko: "Culture, coast, long-haul",
    },
    items: [
      { mn: "Истанбул", en: "Istanbul", zh: "Istanbul", ja: "Istanbul", ko: "Istanbul" },
      { mn: "Анталья", en: "Antalya", zh: "Antalya", ja: "Antalya", ko: "Antalya" },
      { mn: "Памуккале", en: "Pamukkale", zh: "Pamukkale", ja: "Pamukkale", ko: "Pamukkale" },
      { mn: "Каппадоки", en: "Cappadocia", zh: "Cappadocia", ja: "Cappadocia", ko: "Cappadocia" },
    ],
  },
  {
    country: "islands",
    modes: ["all", "passion", "style"],
    title: {
      mn: "Арал, далайн амралт",
      en: "Island holidays",
      zh: "Island holidays",
      ja: "Island holidays",
      ko: "Island holidays",
    },
    note: {
      mn: "Гэр бүл, найзууд, амралт",
      en: "Family, friends, leisure",
      zh: "Family, friends, leisure",
      ja: "Family, friends, leisure",
      ko: "Family, friends, leisure",
    },
    items: [
      { mn: "Пукет", en: "Phuket", zh: "Phuket", ja: "Phuket", ko: "Phuket" },
      { mn: "Бали", en: "Bali", zh: "Bali", ja: "Bali", ko: "Bali" },
      { mn: "Хайнань", en: "Hainan", zh: "Hainan", ja: "Hainan", ko: "Hainan" },
      { mn: "Жэжү", en: "Jeju", zh: "Jeju", ja: "Jeju", ko: "Jeju" },
    ],
  },
];

const TAB_ICONS = {
  all: MapPinned,
  cities: Building2,
  passion: Compass,
  style: Sparkles,
} as const;

const COUNTRY_ICONS = {
  all: Globe2,
  mongolia: MountainSnow,
  china: Building2,
  japan: Sparkles,
  korea: Waves,
  turkey: Compass,
  islands: Palmtree,
} as const;

export function TravelStyles() {
  const { contentLocale } = useLanguage();
  const [activeTab, setActiveTab] = useState<DestinationTab>("all");
  const [activeCountry, setActiveCountry] = useState<CountryFilter>("all");
  const copy = DESTINATION_COPY[contentLocale];

  const visibleColumns = useMemo(
    () =>
      DESTINATION_COLUMNS.filter((column) => {
        const matchesCountry =
          activeCountry === "all" || column.country === activeCountry;
        const matchesMode =
          activeTab === "all" || column.modes.includes(activeTab);

        return matchesCountry && matchesMode;
      }),
    [activeCountry, activeTab]
  );

  const countryKeys = Object.keys(copy.countries) as CountryFilter[];

  return (
    <section
      id="destinations"
      className="border-y border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-foreground lg:text-sm">
              {copy.eyebrow}
            </p>
            <h2 className="max-w-3xl text-balance font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            {copy.body}
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-background p-2">
            <div className="flex overflow-x-auto rounded-full bg-card p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(Object.keys(copy.tabs) as DestinationTab[]).map((tab) => {
                const Icon = TAB_ICONS[tab];
                const selected = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    aria-pressed={selected}
                    onMouseEnter={() => setActiveTab(tab)}
                    onFocus={() => setActiveTab(tab)}
                    onClick={() => setActiveTab(tab)}
                    className={`flex min-w-fit flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition-colors lg:text-base ${
                      selected
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {copy.tabs[tab]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-b border-border px-5 py-4 lg:px-7">
            <div className="flex flex-wrap gap-2">
              {countryKeys.map((country) => {
                const Icon = COUNTRY_ICONS[country];
                const selected = activeCountry === country;

                return (
                  <button
                    key={country}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveCountry(country)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors lg:text-sm ${
                      selected
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-background text-foreground hover:border-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {copy.countries[country]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {visibleColumns.length > 0 ? (
              <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleColumns.map((column, idx) => (
                  <motion.article
                    key={`${column.country}-${column.title.en}-${activeTab}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.03 }}
                    className="min-w-0"
                  >
                    <div className="mb-5 flex h-20 items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                        <MapPinned className="h-8 w-8" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                          {column.note[contentLocale]}
                        </div>
                        <h3 className="mt-1 truncate font-display text-2xl font-black">
                          {column.title[contentLocale]}
                        </h3>
                      </div>
                    </div>

                    <ul className="grid gap-2">
                      {column.items.map((item) => (
                        <li
                          key={item.en}
                          className="flex items-center gap-3 py-1.5 text-base font-semibold text-foreground"
                        >
                          <span className="h-2 w-2 rounded-full bg-accent" />
                          <span>{item[contentLocale]}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-background p-8 text-center text-muted-foreground">
                {copy.empty}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
