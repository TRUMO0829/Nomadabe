"use client";

import {
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  type MotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
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
  "/nomadabe-hero-panorama.webp",
  "/hero-winter.webp",
  "/hero-spring.webp",
  "/hero-autumn.webp",
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

function getOutboundModalDetails(
  option: (typeof OUTBOUND_OPTIONS)[number],
  country: string,
  locale: keyof typeof SECTION_COPY
) {
  const isMn = locale === "mn";

  return {
    summary: isMn
      ? `${country} чиглэлийн ${option.days} хоногийн аялал. Хотын үзвэр, амралт, зураг авах цэг, өдөр бүрийн маршрут, буудал болон тээврийн зохион байгуулалтыг Nomadabe баг төлөвлөнө.`
      : `${option.days}-day ${country} travel package with daily routing, city highlights, leisure time, photo spots, accommodation guidance, and transport planning by the Nomadabe team.`,
    idealFor: isMn
      ? ["Гэр бүл", "Найз нөхөд", "Жижиг групп", "Анх удаа аялагч"]
      : ["Families", "Friends", "Small groups", "First-time visitors"],
    includes: isMn
      ? [
          "Өдөр бүрийн маршрут",
          "Буудал, тээврийн чиглүүлэг",
          "Аяллын зөвлөгөө",
          "Хөтөч/орчуулгын мэдээлэл",
          "eSIM, даатгалын зөвлөмж",
        ]
      : [
          "Daily itinerary planning",
          "Hotel and transport guidance",
          "Travel consulting",
          "Guide and interpreter options",
          "eSIM and insurance guidance",
        ],
    businessSupport: isMn
      ? [
          "Бизнес уулзалт, expo эсвэл бүтээгдэхүүн судалгааны зорилготой бол тусгай хөтөлбөр нэмэх боломжтой.",
          "Нийлүүлэгч, худалдан авалт, логистикийн анхан шатны зөвлөгөөг аяллын төлөвлөгөөнд уялдуулна.",
        ]
      : [
          "Business meetings, expo visits, or product research can be added as a custom track.",
          "Supplier, purchasing, and logistics guidance can be aligned with the travel plan.",
        ],
  };
}

type SteppedGallerySlot = {
  offset: number;
  left: number;
  top: number;
  width: number;
  opacity: number;
  zIndex: number;
};

const STEPPED_GALLERY_SLOTS = [
  { offset: -5, left: -8, top: 40, width: 8, opacity: 0, zIndex: 0 },
  { offset: -4, left: 0, top: 40, width: 8, opacity: 1, zIndex: 10 },
  { offset: -3, left: 8, top: 32.5, width: 14, opacity: 1, zIndex: 20 },
  { offset: -2, left: 22, top: 23.75, width: 21, opacity: 1, zIndex: 30 },
  { offset: -1, left: 42, top: 13.75, width: 29, opacity: 1, zIndex: 40 },
  { offset: 0, left: 63, top: 1.25, width: 39, opacity: 1, zIndex: 50 },
  { offset: 1, left: 103, top: 1.25, width: 39, opacity: 0, zIndex: 60 },
] satisfies readonly SteppedGallerySlot[];

const STEPPED_GALLERY_UNIT = "calc(1vw / var(--site-scale))";
const STEPPED_GALLERY_GROUP_WIDTH = 100;
const STEPPED_GALLERY_HEIGHT = 50;
const STEPPED_GALLERY_VISIBLE_COUNT = 5;

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function getLoopOffset(value: number, count: number) {
  if (count <= 0) {
    return 99;
  }

  if (count === 1) {
    return 0;
  }

  return positiveModulo(value + count / 2, count) - count / 2;
}

function interpolateNumber(
  input: number,
  inputStart: number,
  inputEnd: number,
  outputStart: number,
  outputEnd: number
) {
  if (inputEnd === inputStart) {
    return outputEnd;
  }

  const progress = (input - inputStart) / (inputEnd - inputStart);
  return outputStart + (outputEnd - outputStart) * progress;
}

function interpolateSteppedSlot(
  relativeOffset: number,
  key: keyof Omit<SteppedGallerySlot, "offset">
) {
  const firstSlot = STEPPED_GALLERY_SLOTS[0];
  const lastSlot = STEPPED_GALLERY_SLOTS[STEPPED_GALLERY_SLOTS.length - 1];

  if (relativeOffset <= firstSlot.offset) {
    return firstSlot[key];
  }

  if (relativeOffset >= lastSlot.offset) {
    return lastSlot[key];
  }

  for (let index = 0; index < STEPPED_GALLERY_SLOTS.length - 1; index += 1) {
    const current = STEPPED_GALLERY_SLOTS[index];
    const next = STEPPED_GALLERY_SLOTS[index + 1];

    if (relativeOffset >= current.offset && relativeOffset <= next.offset) {
      return interpolateNumber(
        relativeOffset,
        current.offset,
        next.offset,
        current[key],
        next[key]
      );
    }
  }

  return lastSlot[key];
}

function getActiveWeight(relativeOffset: number) {
  return Math.max(0, 1 - Math.abs(relativeOffset) / 0.72);
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
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground transition-colors hover:border-accent hover:bg-accent"
        >
          <Star className="h-4 w-4 fill-accent text-accent" />
          {status === "success" ? copy.done : copy.rate}
        </button>
      ) : (
        <form
          className="grid gap-2 rounded-md border border-border bg-background p-3"
          onSubmit={handleSubmit}
        >
          <div className="trip-meta-text text-xs uppercase tracking-wider text-foreground">
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

function SteppedTripTile({
  adventure,
  index,
  startIndex,
  adventureCount,
  loopProgress,
  locale,
  dayLabel,
  detailsLabel,
  onSelect,
}: {
  adventure: Adventure;
  index: number;
  startIndex: number;
  adventureCount: number;
  loopProgress: MotionValue<number>;
  locale: keyof typeof SECTION_COPY;
  dayLabel: string;
  detailsLabel: string;
  onSelect: (adventure: Adventure) => void;
}) {
  const text = getAdventureText(adventure, locale);
  const routeLabel = {
    mn: "чиглэл",
    en: "route",
    zh: "路线",
    ja: "ルート",
    ko: "루트",
  }[locale];
  const getRelativeOffset = (progress: number) =>
    getLoopOffset(index - startIndex + progress, adventureCount);
  const left = useTransform(
    loopProgress,
    (progress) =>
      `calc(var(--gallery-unit) * ${interpolateSteppedSlot(
        getRelativeOffset(progress),
        "left"
      ).toFixed(4)})`
  );
  const top = useTransform(
    loopProgress,
    (progress) =>
      `calc(var(--gallery-unit) * ${interpolateSteppedSlot(
        getRelativeOffset(progress),
        "top"
      ).toFixed(4)})`
  );
  const width = useTransform(
    loopProgress,
    (progress) =>
      `calc(var(--gallery-unit) * ${interpolateSteppedSlot(
        getRelativeOffset(progress),
        "width"
      ).toFixed(4)})`
  );
  const opacity = useTransform(loopProgress, (progress) =>
    interpolateSteppedSlot(getRelativeOffset(progress), "opacity")
  );
  const zIndex = useTransform(loopProgress, (progress) =>
    Math.round(interpolateSteppedSlot(getRelativeOffset(progress), "zIndex"))
  );
  const detailsOpacity = useTransform(loopProgress, (progress) =>
    getActiveWeight(getRelativeOffset(progress))
  );
  const detailsY = useTransform(
    detailsOpacity,
    (value) => `${(1 - value) * 18}px`
  );
  const activeShadeOpacity = useTransform(
    detailsOpacity,
    (value) => 0.18 + value * 0.82
  );
  const imageScale = useTransform(
    detailsOpacity,
    (value) => 1.01 + value * 0.03
  );

  return (
    <motion.figure
      className="group absolute m-0 cursor-pointer overflow-hidden bg-[#e8e8e8]"
      style={{
        left,
        top,
        width,
        aspectRatio: "4 / 5",
        opacity,
        zIndex,
      }}
      onClick={() => onSelect(adventure)}
    >
      <motion.div
        className="h-full w-full bg-cover bg-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
        style={{
          backgroundImage: `url(${adventure.image})`,
          scale: imageScale,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-white/6" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/12 to-white/6"
        style={{ opacity: activeShadeOpacity }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-[clamp(2.25rem,6vh,4.75rem)] z-30 p-4 text-white sm:p-5 lg:p-6"
        style={{ opacity: detailsOpacity, y: detailsY }}
      >
        <p className="trip-meta-text flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase text-white/70">
          <span>{routeLabel}</span>
          <span className="inline-flex items-center gap-1">
            <MapPinned className="h-3.5 w-3.5 text-white" />
            {text.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5 text-white" />
            {adventure.days} {dayLabel}
          </span>
        </p>
        <h3 className="trip-header-title trip-header-title--compact mt-2 max-w-[14ch] text-balance text-white">
          {text.title}
        </h3>
        <p className="trip-copy-text mt-3 line-clamp-2 max-w-sm text-xs leading-5 text-white/75 sm:text-sm">
          {text.summary}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect(adventure);
            }}
            className="inline-flex min-h-10 items-center justify-center gap-2 bg-accent px-4 text-[10px] uppercase text-accent-foreground transition-colors hover:bg-white hover:text-black"
          >
            {detailsLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.figure>
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
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const { contentLocale, t } = useLanguage();
  const sectionCopy = SECTION_COPY[contentLocale];
  const sortCopy = SORT_COPY[contentLocale];
  const { scrollYProgress: galleryScrollYProgress } = useScroll({
    target: gallerySectionRef,
    offset: ["start start", "end end"],
  });

  const staticOutboundAdventures = useMemo<Adventure[]>(
    () =>
      OUTBOUND_OPTIONS.map((option, index) => {
        const title = getOutboundOptionTitle(option, contentLocale);
        const country = getOutboundOptionCountry(option, contentLocale);
        const modalDetails = getOutboundModalDetails(
          option,
          country,
          contentLocale
        );

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
          summary: modalDetails.summary,
          idealFor: modalDetails.idealFor,
          includes: modalDetails.includes,
          businessSupport: modalDetails.businessSupport,
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
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("search")?.trim();
    const scopeQuery = params.get("scope");
    const nextScope =
      scopeQuery === "all" ||
      scopeQuery === "domestic" ||
      scopeQuery === "outbound"
        ? scopeQuery
        : null;

    if (!searchQuery && !nextScope) {
      return;
    }

    const timerId = window.setTimeout(() => {
      if (nextScope) {
        setScope(nextScope);
      }

      if (searchQuery) {
        setQuery(searchQuery);
      }
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

  const galleryAdventureCount = filteredAdventures.length;
  const galleryStartIndex = Math.min(
    STEPPED_GALLERY_VISIBLE_COUNT - 1,
    Math.max(0, galleryAdventureCount - 1)
  );
  const galleryLoopProgress = useTransform(
    galleryScrollYProgress,
    [0, 0.86, 1],
    [0, galleryAdventureCount, galleryAdventureCount]
  );
  const galleryScrollHeight =
    Math.max(1, galleryAdventureCount) * 96 + 52;

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

        <div className="absolute inset-x-0 top-[300px] z-10 px-6 sm:top-[330px] lg:top-[390px] lg:px-10">
          <div className="mx-auto max-w-4xl text-foreground">
              <label className="flex items-center gap-4 rounded-full border border-white/35 bg-[#fff8e4]/38 px-5 py-4">
                <Search className="h-6 w-6 shrink-0 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={sectionCopy.search}
                  className="trip-copy-text min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground lg:text-xl"
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

              <div
                className="trip-marquee mt-4"
                style={{ "--marquee-duration": "18s" } as CSSProperties}
              >
                <div className="trip-marquee-track gap-3">
                  {[...scopeOptions, ...scopeOptions, ...scopeOptions].map(
                    (item, index) => (
                      <button
                        key={`${item.key}-${index}`}
                        type="button"
                        onClick={() => setScope(item.key)}
                        className={cn(
                          "inline-flex min-w-[168px] items-center justify-center gap-2 rounded-full border px-4 py-3 text-xs font-black uppercase text-white shadow-sm backdrop-blur transition-colors",
                          scope === item.key
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-white/45 bg-black/18 hover:border-accent hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.count}</span>
                        <span>{item.label}</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {filtersOpen && (
                <div className="mt-3 rounded-lg border border-white/35 bg-[#fff8e4]/44 p-3">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {sortOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setSortMode(option.key)}
                        className={cn(
                          "rounded-md border px-3 py-2 text-xs transition-colors",
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

      <div
        ref={gallerySectionRef}
        id="all"
        className="overflow-clip bg-white"
        style={
          filteredAdventures.length > 0
            ? ({
                height: `calc(${galleryScrollHeight}svh / var(--site-scale))`,
              } satisfies CSSProperties)
            : undefined
        }
      >
        {filteredAdventures.length > 0 ? (
          <div className="flow-frame sticky top-0 bg-white text-[#050505]">
            <div className="tours-list-copy absolute left-0 top-[8vh] z-20 w-[min(620px,88vw)] px-6 sm:px-8 lg:top-[10vh] lg:px-10">
              <h2 className="tours-list-title max-w-[13ch] text-balance text-[clamp(1.55rem,3.6vw,3.35rem)] uppercase leading-[0.96] text-black">
                {sectionCopy.listTitle}
              </h2>
              <div className="mt-4 max-w-xs">
                <p className="tours-list-body max-w-xs text-sm uppercase leading-[1.34] text-black/78 sm:text-[15px]">
                  {sectionCopy.listBody}
                </p>
                <div className="tours-list-count mt-4 inline-flex border border-black bg-white px-3 py-2 text-xs uppercase text-black">
                  {filteredAdventures.length} {sectionCopy.result}
                </div>
              </div>
            </div>

            <div
              className="absolute bottom-0 left-0 z-10 overflow-visible"
              style={
                {
                  "--gallery-unit": STEPPED_GALLERY_UNIT,
                  width: `calc(var(--gallery-unit) * ${STEPPED_GALLERY_GROUP_WIDTH})`,
                  height: `calc(var(--gallery-unit) * ${STEPPED_GALLERY_HEIGHT})`,
                } as CSSProperties
              }
            >
              {filteredAdventures.map((adventure, index) => (
                <SteppedTripTile
                  key={adventure.id}
                  adventure={adventure}
                  index={index}
                  startIndex={galleryStartIndex}
                  adventureCount={galleryAdventureCount}
                  loopProgress={galleryLoopProgress}
                  locale={contentLocale}
                  dayLabel={t.featured.days}
                  detailsLabel={t.featured.details}
                  onSelect={setSelected}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
            <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
              {t.featured.noResults}
            </div>
          </div>
        )}
      </div>

      {beforeList}

      <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
