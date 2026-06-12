"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  MapPinned,
  Search,
  SlidersHorizontal,
  Star,
  Send,
} from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { cn } from "@/lib/utils";
import { AdventureModal } from "./adventure-modal";
import { useLanguage } from "./language-provider";
import { OUTBOUND_OPTIONS } from "./outbound-trips-carousel";

type TripScope = "all" | "outbound" | "domestic";
type SortMode =
  | "recommended"
  | "price-low"
  | "price-high"
  | "days-low"
  | "days-high";

type FeaturedAdventuresProps = {
  adventures?: Adventure[];
  beforeList?: ReactNode;
};

const TOURS_BACKGROUNDS = [
  "/nomadabe-hero-panorama.png",
  "/hero-winter.jpg",
  "/hero-spring.jpg",
  "/hero-autumn.jpg",
];

function compareTripPrice(
  left: Adventure,
  right: Adventure,
  direction: "asc" | "desc"
) {
  const leftHasPrice = left.price > 0;
  const rightHasPrice = right.price > 0;

  if (leftHasPrice !== rightHasPrice) {
    return leftHasPrice ? -1 : 1;
  }

  if (!leftHasPrice && !rightHasPrice) {
    return 0;
  }

  return direction === "asc"
    ? left.price - right.price
    : right.price - left.price;
}

function compareTripDays(
  left: Adventure,
  right: Adventure,
  direction: "asc" | "desc"
) {
  return direction === "asc"
    ? left.days - right.days
    : right.days - left.days;
}

function getOutboundOptionTitle(
  option: (typeof OUTBOUND_OPTIONS)[number],
  locale: keyof typeof SECTION_COPY
) {
  switch (locale) {
    case "mn":
      return option.titleMn;
    case "zh":
      return option.titleZh;
    case "ja":
      return option.titleJa;
    case "ko":
      return option.titleKo;
    case "en":
    default:
      return option.titleEn;
  }
}

function getOutboundOptionCountry(
  option: (typeof OUTBOUND_OPTIONS)[number],
  locale: keyof typeof SECTION_COPY
) {
  switch (locale) {
    case "mn":
      return option.countryMn;
    case "zh":
      return option.countryZh;
    case "ja":
      return option.countryJa;
    case "ko":
      return option.countryKo;
    case "en":
    default:
      return option.countryEn;
  }
}

function parseMntPrice(price: string) {
  const numericPrice = Number(price.replace(/[^\d]/g, ""));
  return Number.isFinite(numericPrice) ? numericPrice : 0;
}

const SECTION_COPY = {
  mn: {
    eyebrow: "Аяллууд",
    title: "Бүх аяллаа нэг дороос хайж сонго.",
    body:
      "Гадаад болон дотоод аяллуудыг чиглэл, нэр, аяллын төрлөөр нь хурдан хайж үзээрэй.",
    all: "Бүх аялал",
    outbound: "Гадаад аялал",
    domestic: "Дотоод аялал",
    search: "Аялал хайх...",
    listTitle: "Бүх аяллын жагсаалт",
    listBody: "Сонгосон аяллаа дарж дэлгэрэнгүй мэдээлэл, үнэ, багцын нөхцөлийг хараарай.",
    result: "аялал",
    searchAction: "Хайлт цэвэрлэх эсвэл хайх талбарт очих",
    flexible: "Тохиролцоно",
  },
  en: {
    eyebrow: "Trips",
    title: "Find every trip in one place.",
    body:
      "Search outbound and domestic trips by destination, name, or travel style.",
    all: "All trips",
    outbound: "Outbound trips",
    domestic: "Domestic trips",
    search: "Search trips...",
    listTitle: "All available trips",
    listBody: "Open a trip to view details, pricing, inclusions, and planning notes.",
    result: "trips",
    searchAction: "Clear filters or focus search",
    flexible: "Flexible",
  },
  zh: {
    eyebrow: "旅游",
    title: "在一个地方搜索并选择所有旅行。",
    body:
      "按目的地、名称或旅行类型快速查看出境和蒙古国内旅行。",
    all: "全部旅行",
    outbound: "出境旅行",
    domestic: "蒙古国内旅行",
    search: "搜索旅行...",
    listTitle: "全部旅行列表",
    listBody: "点击旅行查看详细信息、价格和套餐条件。",
    result: "个行程",
    searchAction: "清除筛选或定位到搜索框",
    flexible: "可协商",
  },
  ja: {
    eyebrow: "ツアー",
    title: "すべてのツアーを一か所で検索・選択。",
    body:
      "海外旅行とモンゴル国内旅行を、目的地、名前、旅行タイプで素早く探せます。",
    all: "すべてのツアー",
    outbound: "海外ツアー",
    domestic: "国内ツアー",
    search: "ツアーを検索...",
    listTitle: "すべてのツアー一覧",
    listBody: "ツアーを開くと詳細、料金、含まれる条件を確認できます。",
    result: "件",
    searchAction: "絞り込みを解除、または検索欄へ移動",
    flexible: "相談可能",
  },
  ko: {
    eyebrow: "여행",
    title: "모든 여행을 한곳에서 검색하고 선택하세요.",
    body:
      "해외 및 몽골 국내 여행을 목적지, 이름, 여행 유형으로 빠르게 찾아보세요.",
    all: "전체 여행",
    outbound: "해외 여행",
    domestic: "몽골 국내 여행",
    search: "여행 검색...",
    listTitle: "전체 여행 목록",
    listBody: "여행을 눌러 자세한 정보, 가격, 패키지 조건을 확인하세요.",
    result: "개 여행",
    searchAction: "필터 초기화 또는 검색창으로 이동",
    flexible: "협의 가능",
  },
} as const;

const SORT_COPY = {
  mn: {
    filterToggle: "Шүүлтүүр нээх",
    recommended: "Санал болгосноор",
    priceLow: "Үнэ багаас их",
    priceHigh: "Үнэ ихээс бага",
    daysLow: "Хугацаа богиноос урт",
    daysHigh: "Хугацаа уртаас богино",
  },
  en: {
    filterToggle: "Open trip filters",
    recommended: "Recommended",
    priceLow: "Price low to high",
    priceHigh: "Price high to low",
    daysLow: "Duration short to long",
    daysHigh: "Duration long to short",
  },
  zh: {
    filterToggle: "打开行程筛选",
    recommended: "推荐排序",
    priceLow: "价格从低到高",
    priceHigh: "价格从高到低",
    daysLow: "行程从短到长",
    daysHigh: "行程从长到短",
  },
  ja: {
    filterToggle: "ツアーフィルターを開く",
    recommended: "おすすめ順",
    priceLow: "料金が低い順",
    priceHigh: "料金が高い順",
    daysLow: "短い日程順",
    daysHigh: "長い日程順",
  },
  ko: {
    filterToggle: "여행 필터 열기",
    recommended: "추천순",
    priceLow: "낮은 가격순",
    priceHigh: "높은 가격순",
    daysLow: "짧은 일정순",
    daysHigh: "긴 일정순",
  },
} as const;

const RATING_COPY = {
  mn: {
    rate: "Үнэлэх",
    title: "Энэ аяллыг үнэлэх",
    name: "Таны нэр",
    email: "И-мэйл",
    note: "Санал хүсэлт",
    submit: "Илгээх",
    loading: "Илгээж байна...",
    done: "Үнэлсэн",
    success: "Баярлалаа. Үнэлгээ хүлээн авлаа.",
    error: "Илгээж чадсангүй. Дахин оролдоно уу.",
    score: "Үнэлгээ",
    recordLabel: "Аяллын үнэлгээ",
    trip: "Аялал",
    emptyNote: "Нэмэлт санал бичээгүй",
  },
  en: {
    rate: "Rate",
    title: "Rate this trip",
    name: "Your name",
    email: "Email",
    note: "Feedback",
    submit: "Send",
    loading: "Sending...",
    done: "Rated",
    success: "Thanks. We received your rating.",
    error: "Could not send. Please try again.",
    score: "Rating",
    recordLabel: "Trip rating",
    trip: "Trip",
    emptyNote: "No extra note.",
  },
  zh: {
    rate: "评分",
    title: "评价此行程",
    name: "姓名",
    email: "邮箱",
    note: "反馈",
    submit: "提交",
    loading: "发送中...",
    done: "已评分",
    success: "谢谢，我们已收到您的评分。",
    error: "暂时无法发送，请再试一次。",
    score: "评分",
    recordLabel: "行程评分",
    trip: "行程",
    emptyNote: "未填写补充意见。",
  },
  ja: {
    rate: "評価",
    title: "このツアーを評価",
    name: "お名前",
    email: "メール",
    note: "ご意見",
    submit: "送信",
    loading: "送信中...",
    done: "評価済み",
    success: "ありがとうございます。評価を受け付けました。",
    error: "送信できませんでした。もう一度お試しください。",
    score: "評価",
    recordLabel: "ツアー評価",
    trip: "ツアー",
    emptyNote: "追加コメントはありません。",
  },
  ko: {
    rate: "평가",
    title: "이 여행 평가",
    name: "이름",
    email: "이메일",
    note: "의견",
    submit: "보내기",
    loading: "전송 중...",
    done: "평가됨",
    success: "감사합니다. 평가를 받았습니다.",
    error: "전송할 수 없습니다. 다시 시도해주세요.",
    score: "평점",
    recordLabel: "여행 평가",
    trip: "여행",
    emptyNote: "추가 의견 없음.",
  },
} as const;

type RatingStatus = "idle" | "loading" | "success" | "error";

export function TripRatingWidget({
  adventure,
  title,
  locale,
}: {
  adventure: Adventure;
  title: string;
  locale: keyof typeof RATING_COPY;
}) {
  const copy = RATING_COPY[locale];
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [form, setForm] = useState({ name: "", email: "", note: "" });
  const [status, setStatus] = useState<RatingStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setStatus("loading");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          inquiryType: "trip",
          tripSlug: adventure.slug,
          message: [
            copy.recordLabel,
            `${copy.score}: ${rating}/5`,
            `${copy.trip}: ${title}`,
            form.note ? `${copy.note}: ${form.note}` : copy.emptyNote,
          ].join("\n"),
        }),
      });

      if (response.ok) {
        setForm({ name: "", email: "", note: "" });
        setRating(5);
        setStatus("success");
        setOpen(false);
        return;
      }
    } catch {
      setStatus("error");
      return;
    }

    setStatus("error");
  }

  return (
    <div
      className="mt-4"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {!open ? (
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setOpen(true);
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-black text-foreground transition-colors hover:border-accent hover:bg-accent"
        >
          <Star className="h-4 w-4 fill-accent text-accent" />
          {status === "success" ? copy.done : copy.rate}
        </button>
      ) : (
        <form
          className="grid gap-2 rounded-md border border-border bg-background p-3"
          onSubmit={handleSubmit}
        >
          <div className="text-xs font-black uppercase tracking-wider text-foreground">
            {copy.title}
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${copy.score} ${value}`}
                aria-pressed={rating === value}
                onClick={() => setRating(value)}
                className="rounded-sm p-0.5 text-accent transition-transform hover:scale-110"
              >
                <Star
                  className={`h-4 w-4 ${
                    rating >= value ? "fill-current" : "fill-transparent"
                  }`}
                />
              </button>
            ))}
          </div>
          <input
            required
            value={form.name}
            onChange={(event) =>
              setForm((value) => ({ ...value, name: event.target.value }))
            }
            placeholder={copy.name}
            className="min-w-0 rounded-md border border-border bg-card px-3 py-2 text-xs outline-none focus:border-accent"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((value) => ({ ...value, email: event.target.value }))
            }
            placeholder={copy.email}
            className="min-w-0 rounded-md border border-border bg-card px-3 py-2 text-xs outline-none focus:border-accent"
          />
          <textarea
            value={form.note}
            onChange={(event) =>
              setForm((value) => ({ ...value, note: event.target.value }))
            }
            placeholder={copy.note}
            rows={2}
            className="min-w-0 resize-none rounded-md border border-border bg-card px-3 py-2 text-xs outline-none focus:border-accent"
          />
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <p className="min-h-4 text-[11px] leading-tight text-muted-foreground">
              {status === "success"
                ? copy.success
                : status === "error"
                  ? copy.error
                  : ""}
            </p>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-wait disabled:opacity-70"
            >
              {status === "loading" ? copy.loading : copy.submit}
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function FeaturedAdventures({
  adventures = ADVENTURES,
  beforeList,
}: FeaturedAdventuresProps) {
  const [selected, setSelected] = useState<Adventure | null>(null);
  const [scope, setScope] = useState<TripScope>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [query, setQuery] = useState("");
  const [activeHeroImage, setActiveHeroImage] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { contentLocale, t } = useLanguage();
  const sectionCopy = SECTION_COPY[contentLocale];
  const sortCopy = SORT_COPY[contentLocale];

  const staticOutboundAdventures = useMemo<Adventure[]>(
    () =>
      OUTBOUND_OPTIONS.map((option, index) => {
        const title = getOutboundOptionTitle(option, contentLocale);
        const country = getOutboundOptionCountry(option, contentLocale);

        return {
          id: `static-outbound-${option.id}`,
          slug: `static-outbound-${option.id}`,
          title,
          location: country,
          country,
          days: option.days,
          groupSize: "Жижиг групп",
          difficulty: "Easy",
          price: parseMntPrice(option.price),
          currency: "MNT",
          image: option.image,
          tags: ["Гадаад", country],
          rating: 4.8,
          reviews: 18 + index * 4,
          category: "outbound",
          summary:
            contentLocale === "mn"
              ? `${country} чиглэлийн ${option.days} хоногийн гадаад аяллын багц.`
              : `${option.days}-day outbound travel package for ${country}.`,
          idealFor: ["Гэр бүл", "Жижиг групп", "Амралт"],
          includes: ["Маршрут төлөвлөлт", "Аяллын зөвлөгөө", "Зохион байгуулалт"],
          businessSupport: [],
          nextDeparture: sectionCopy.flexible,
        };
      }),
    [contentLocale, sectionCopy.flexible]
  );

  const allAdventures = useMemo(
    () => [...staticOutboundAdventures, ...adventures],
    [adventures, staticOutboundAdventures]
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveHeroImage((current) => (current + 1) % TOURS_BACKGROUNDS.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const searchQuery = new URLSearchParams(window.location.search)
      .get("search")
      ?.trim();

    if (!searchQuery) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setQuery(searchQuery);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  const outboundCount = useMemo(
    () =>
      allAdventures.filter((adventure) => adventure.country !== "Mongolia").length,
    [allAdventures]
  );
  const domesticCount = useMemo(
    () =>
      allAdventures.filter((adventure) => adventure.country === "Mongolia").length,
    [allAdventures]
  );

  const filteredAdventures = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const matches = allAdventures.filter((adventure) => {
      const text = getAdventureText(adventure, contentLocale);
      const isDomestic = adventure.country === "Mongolia";
      const searchText = [
        text.title,
        text.location,
        text.country,
        text.summary,
        adventure.category,
        ...text.tags,
        ...text.idealFor,
      ]
        .join(" ")
        .toLowerCase();

      const matchesScope =
        scope === "all" ||
        (scope === "domestic" && isDomestic) ||
        (scope === "outbound" && !isDomestic);
      const matchesQuery =
        !normalizedQuery || searchText.includes(normalizedQuery);

      return matchesScope && matchesQuery;
    });

    const sortedMatches = [...matches];

    switch (sortMode) {
      case "price-low":
        sortedMatches.sort((left, right) =>
          compareTripPrice(left, right, "asc")
        );
        break;
      case "price-high":
        sortedMatches.sort((left, right) =>
          compareTripPrice(left, right, "desc")
        );
        break;
      case "days-low":
        sortedMatches.sort((left, right) =>
          compareTripDays(left, right, "asc")
        );
        break;
      case "days-high":
        sortedMatches.sort((left, right) =>
          compareTripDays(left, right, "desc")
        );
        break;
      case "recommended":
      default:
        break;
    }

    return sortedMatches;
  }, [allAdventures, contentLocale, query, scope, sortMode]);

  const scopeOptions = [
    {
      key: "all" as const,
      label: sectionCopy.all,
      count: allAdventures.length,
      icon: SlidersHorizontal,
    },
    {
      key: "outbound" as const,
      label: sectionCopy.outbound,
      count: outboundCount,
      icon: Globe2,
    },
    {
      key: "domestic" as const,
      label: sectionCopy.domestic,
      count: domesticCount,
      icon: MapPinned,
    },
  ];

  const sortOptions = [
    { key: "price-low" as const, label: sortCopy.priceLow },
    { key: "price-high" as const, label: sortCopy.priceHigh },
    { key: "days-low" as const, label: sortCopy.daysLow },
    { key: "days-high" as const, label: sortCopy.daysHigh },
  ];

  function handleFilterToggle() {
    setFiltersOpen((value) => !value);
  }

  return (
    <section id="adventures" className="bg-background">
      <div className="relative min-h-[560px] overflow-hidden bg-primary text-primary-foreground lg:min-h-[660px]">
        {TOURS_BACKGROUNDS.map((image, index) => (
          <motion.div
            key={image}
            aria-hidden="true"
            initial={false}
            animate={{ opacity: activeHeroImage === index ? 1 : 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-black/38 to-primary/82" />
        <div className="absolute inset-0 bg-primary/10" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-36 lg:px-10 lg:pt-48">
          <div className="max-w-2xl">
            <p className="mb-4 inline-block bg-accent px-3 py-1 font-sans text-sm font-black uppercase tracking-[0.16em] text-accent-foreground">
              {sectionCopy.eyebrow}
            </p>
            <h1 className="max-w-3xl text-balance font-sans text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              {sectionCopy.title}
            </h1>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-4 z-10 px-6 lg:bottom-6 lg:px-10">
          <div className="mx-auto max-w-4xl rounded-lg border border-white/35 bg-background/36 p-3 text-foreground shadow-[0_12px_34px_rgba(0,0,0,0.28)]">
              <label className="flex items-center gap-4 rounded-full border border-white/35 bg-[#fff8e4]/38 px-5 py-4">
                <Search className="h-6 w-6 shrink-0 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={sectionCopy.search}
                  className="min-w-0 flex-1 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground lg:text-xl"
                />
                <button
                  type="button"
                  aria-expanded={filtersOpen}
                  aria-label={sortCopy.filterToggle}
                  onClick={handleFilterToggle}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    filtersOpen || sortMode !== "recommended"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </label>

              {filtersOpen && (
                <div className="mt-3 rounded-lg border border-white/35 bg-[#fff8e4]/44 p-3">
                  <div className="grid gap-2 sm:grid-cols-3">
                    {scopeOptions.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setScope(item.key)}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold transition-colors",
                          scope === item.key
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-white/35 bg-[#fff8e4]/44 text-foreground hover:border-accent"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.count} {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {sortOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setSortMode(option.key)}
                        className={cn(
                          "rounded-md border px-3 py-2 text-xs font-black transition-colors",
                          sortMode === option.key
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border bg-background text-foreground hover:border-accent"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      <div id="all" className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:mb-10 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 font-sans text-xs font-black uppercase tracking-[0.18em] text-foreground lg:text-sm">
              {sectionCopy.eyebrow}
            </p>
            <h1 className="max-w-4xl text-balance font-sans text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              {sectionCopy.listTitle}
            </h1>
            <p className="mt-3 max-w-2xl font-sans text-sm font-medium leading-7 text-muted-foreground lg:text-base">
              {sectionCopy.listBody}
            </p>
          </div>
          <div className="rounded-full border border-border bg-card px-5 py-2 font-sans text-sm font-bold text-foreground">
            {filteredAdventures.length} {sectionCopy.result}
          </div>
        </div>

        <div className="-mx-6 flex snap-x gap-6 overflow-x-auto px-6 pb-5 [scrollbar-width:none] lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden">
          {filteredAdventures.map((adventure, idx) => {
            const text = getAdventureText(adventure, contentLocale);
            const price =
              adventure.price > 0
                ? `${adventure.price.toLocaleString()} ${adventure.currency}`
                : t.featured.quote;

            return (
              <motion.article
                key={adventure.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.04, 0.24) }}
                onClick={() => setSelected(adventure)}
                className="group w-[min(86vw,360px)] shrink-0 snap-start cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-accent hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${adventure.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-md bg-accent px-3 py-2 text-xs font-black text-accent-foreground">
                    {price}
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2 text-xs font-bold text-white">
                    <span className="flex items-center gap-1 rounded-md bg-black/45 px-2.5 py-1.5">
                      <MapPinned className="h-3.5 w-3.5" />
                      {text.location}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-black/45 px-2.5 py-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {adventure.days} {t.featured.days}
                    </span>
                  </div>
                </div>

                <div className="flex min-h-[250px] flex-col p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t.featured.price}
                  </div>
                  <h3 className="mt-3 font-sans text-2xl font-medium leading-tight text-balance">
                    {text.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {text.summary}
                  </p>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelected(adventure);
                    }}
                    className="mt-auto inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-black text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground"
                  >
                    {t.featured.details}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filteredAdventures.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            {t.featured.noResults}
          </div>
        )}
      </div>

      {beforeList}

      <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
