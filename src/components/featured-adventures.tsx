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
  Minus,
  MapPinned,
  Plus,
  Search,
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
type SearchPanel = "where" | "when" | "who";
type GuestKey = "adults" | "children" | "infants" | "pets";
type GuestCounts = Record<GuestKey, number>;

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

const TRIP_SEARCH_COPY = {
  mn: {
    where: "Хаашаа",
    wherePlaceholder: "Чиглэл хайх",
    whereHint: "Манай аяллын чиглэлүүд",
    when: "Хэзээ",
    whenPlaceholder: "Огноо нэмэх",
    who: "Хэн",
    whoPlaceholder: "Зочид нэмэх",
    search: "Хайх",
    dates: "Огноо",
    flexible: "Уян хатан",
    suggestionsEmpty: "Ийм чиглэл олдсонгүй",
    guests: "зочид",
    adults: "Том хүн",
    adultsHint: "13 ба түүнээс дээш",
    children: "Хүүхэд",
    childrenHint: "2-12 нас",
    infants: "Нярай",
    infantsHint: "2-оос доош",
    pets: "Амьтан",
    petsHint: "Үйлчилгээний амьтан авч явах уу?",
  },
  en: {
    where: "Where",
    wherePlaceholder: "Search destinations",
    whereHint: "Available trip destinations",
    when: "When",
    whenPlaceholder: "Add dates",
    who: "Who",
    whoPlaceholder: "Add guests",
    search: "Search",
    dates: "Dates",
    flexible: "Flexible",
    suggestionsEmpty: "No destinations found",
    guests: "guests",
    adults: "Adults",
    adultsHint: "Ages 13 or above",
    children: "Children",
    childrenHint: "Ages 2-12",
    infants: "Infants",
    infantsHint: "Under 2",
    pets: "Pets",
    petsHint: "Bringing a service animal?",
  },
  zh: {
    where: "地点",
    wherePlaceholder: "搜索目的地",
    whereHint: "可选旅行目的地",
    when: "时间",
    whenPlaceholder: "添加日期",
    who: "人数",
    whoPlaceholder: "添加客人",
    search: "搜索",
    dates: "日期",
    flexible: "灵活",
    suggestionsEmpty: "未找到目的地",
    guests: "位客人",
    adults: "成人",
    adultsHint: "13岁及以上",
    children: "儿童",
    childrenHint: "2-12岁",
    infants: "婴儿",
    infantsHint: "2岁以下",
    pets: "宠物",
    petsHint: "携带服务动物？",
  },
  ja: {
    where: "行き先",
    wherePlaceholder: "目的地を検索",
    whereHint: "選べる旅行先",
    when: "日程",
    whenPlaceholder: "日付を追加",
    who: "人数",
    whoPlaceholder: "ゲストを追加",
    search: "検索",
    dates: "日付",
    flexible: "柔軟に探す",
    suggestionsEmpty: "目的地が見つかりません",
    guests: "名",
    adults: "大人",
    adultsHint: "13歳以上",
    children: "子ども",
    childrenHint: "2-12歳",
    infants: "乳幼児",
    infantsHint: "2歳未満",
    pets: "ペット",
    petsHint: "サービス動物を同伴しますか？",
  },
  ko: {
    where: "어디로",
    wherePlaceholder: "목적지 검색",
    whereHint: "가능한 여행 목적지",
    when: "언제",
    whenPlaceholder: "날짜 추가",
    who: "누구와",
    whoPlaceholder: "게스트 추가",
    search: "검색",
    dates: "날짜",
    flexible: "유연한 일정",
    suggestionsEmpty: "목적지를 찾을 수 없습니다",
    guests: "명",
    adults: "성인",
    adultsHint: "13세 이상",
    children: "어린이",
    childrenHint: "2-12세",
    infants: "유아",
    infantsHint: "2세 미만",
    pets: "반려동물",
    petsHint: "서비스 동물을 동반하시나요?",
  },
} as const;

const LOCALE_TAGS = {
  mn: "mn-MN",
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
} as const;

const WEEKDAY_LABELS = {
  mn: ["Н", "Д", "М", "Л", "П", "Б", "Б"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
  zh: ["日", "一", "二", "三", "四", "五", "六"],
  ja: ["日", "月", "火", "水", "木", "金", "土"],
  ko: ["일", "월", "화", "수", "목", "금", "토"],
} as const;

const GUEST_ROWS = ["adults", "children", "infants", "pets"] as const;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getMonthDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();

  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: dayCount }, (_, index) =>
      new Date(month.getFullYear(), month.getMonth(), index + 1)
    ),
  ];
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

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
        className="absolute inset-x-0 bottom-[clamp(4.75rem,10vh,7.25rem)] z-30 p-4 text-white sm:p-5 lg:px-6 lg:py-5"
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
        <h3 className="trip-header-title trip-header-title--compact mt-2 max-w-[14ch] text-balance !text-[clamp(1.45rem,2.55vw,2.65rem)] !leading-[1.04] text-white">
          {text.title}
        </h3>
        <p className="trip-copy-text mt-2 line-clamp-2 max-w-sm text-xs leading-5 text-white/78 sm:text-sm">
          {text.summary}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
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
  const [sortMode] = useState<SortMode>("recommended");
  const [query, setQuery] = useState("");
  const [activeSearchPanel, setActiveSearchPanel] =
    useState<SearchPanel | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const [activeHeroImage, setActiveHeroImage] = useState(0);
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const { contentLocale, t } = useLanguage();
  const sectionCopy = SECTION_COPY[contentLocale];
  const searchCopy = TRIP_SEARCH_COPY[contentLocale];
  const localeTag = LOCALE_TAGS[contentLocale];
  const { scrollYProgress: galleryScrollYProgress } = useScroll({
    target: gallerySectionRef,
    offset: ["start start", "end end"],
  });

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

  const destinationOptions = useMemo(() => {
    const options = new Map<string, { label: string; count: number }>();

    allAdventures.forEach((adventure) => {
      const text = getAdventureText(adventure, contentLocale);
      const label = text.country.trim();

      if (!label) {
        return;
      }

      const key = label.toLowerCase();
      const current = options.get(key);
      options.set(key, {
        label,
        count: (current?.count ?? 0) + 1,
      });
    });

    return Array.from(options.values()).sort((left, right) =>
      left.label.localeCompare(right.label, localeTag)
    );
  }, [allAdventures, contentLocale, localeTag]);

  const visibleDestinationOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return destinationOptions
      .filter((option) =>
        normalizedQuery
          ? option.label.toLowerCase().includes(normalizedQuery)
          : true
      )
      .slice(0, 8);
  }, [destinationOptions, query]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const calendarStartMonth = useMemo(() => startOfMonth(new Date()), []);
  const visibleCalendarMonths = useMemo(
    () => [
      addMonths(calendarStartMonth, calendarOffset),
      addMonths(calendarStartMonth, calendarOffset + 1),
    ],
    [calendarOffset, calendarStartMonth]
  );
  const selectedDateKey = selectedDate ? getDateKey(selectedDate) : null;
  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat(localeTag, {
        month: "short",
        day: "numeric",
      }).format(selectedDate)
    : searchCopy.whenPlaceholder;
  const guestTotal = Object.values(guestCounts).reduce(
    (total, count) => total + count,
    0
  );
  const guestLabel =
    guestTotal > 0
      ? `${guestTotal} ${searchCopy.guests}`
      : searchCopy.whoPlaceholder;

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
        adventure.location,
        adventure.country,
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

  function handleTripSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveSearchPanel(null);
    gallerySectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function updateGuestCount(key: GuestKey, amount: number) {
    setGuestCounts((current) => ({
      ...current,
      [key]: Math.max(0, current[key] + amount),
    }));
  }

  return (
    <section id="adventures" className="bg-background">
      <div className="relative min-h-[560px] overflow-x-clip bg-primary text-primary-foreground lg:min-h-[660px]">
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

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 lg:px-10 lg:pt-32">
          <div className="max-w-xl">
            <p className="trip-meta-text mb-4 inline-block bg-accent px-3 py-1 font-sans text-sm uppercase tracking-[0.16em] text-accent-foreground">
              {sectionCopy.eyebrow}
            </p>
            <h1 className="trip-header-title max-w-xl text-balance font-sans text-white">
              {sectionCopy.title}
            </h1>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[300px] z-30 px-6 sm:top-[330px] lg:top-[390px] lg:px-10">
          <form
            onSubmit={handleTripSearchSubmit}
            className="relative mx-auto max-w-5xl text-[#11100b]"
          >
            <div className="grid overflow-hidden rounded-[2rem] border border-white/55 bg-white/68 shadow-[0_24px_80px_rgba(17,16,11,0.28)] backdrop-blur-xl sm:rounded-full lg:grid-cols-[1.12fr_0.9fr_0.86fr_auto]">
              <div
                className={cn(
                  "flex min-h-[76px] flex-col justify-center border-b border-[#11100b]/10 px-6 py-4 transition-colors sm:border-b-0 lg:border-r",
                  activeSearchPanel === "where" && "bg-white/90"
                )}
                onClick={() => setActiveSearchPanel("where")}
              >
                <label
                  htmlFor="trip-where-search"
                  className="trip-meta-text text-xs uppercase tracking-[0.14em] text-[#11100b]"
                >
                  {searchCopy.where}
                </label>
                <input
                  id="trip-where-search"
                  value={query}
                  onFocus={() => setActiveSearchPanel("where")}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveSearchPanel("where");
                  }}
                  placeholder={searchCopy.wherePlaceholder}
                  className="mt-1 min-w-0 bg-transparent text-base text-[#4b4538] outline-none placeholder:text-[#4b4538]/82 lg:text-xl"
                />
              </div>

              <button
                type="button"
                onClick={() => setActiveSearchPanel("when")}
                className={cn(
                  "flex min-h-[76px] flex-col justify-center border-b border-[#11100b]/10 px-6 py-4 text-left transition-colors sm:border-b-0 lg:border-r",
                  activeSearchPanel === "when" && "bg-white/90"
                )}
              >
                <span className="trip-meta-text text-xs uppercase tracking-[0.14em] text-[#11100b]">
                  {searchCopy.when}
                </span>
                <span className="mt-1 truncate text-base text-[#4b4538] lg:text-xl">
                  {selectedDateLabel}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSearchPanel("who")}
                className={cn(
                  "flex min-h-[76px] flex-col justify-center px-6 py-4 text-left transition-colors lg:border-r lg:border-[#11100b]/10",
                  activeSearchPanel === "who" && "bg-white/90"
                )}
              >
                <span className="trip-meta-text text-xs uppercase tracking-[0.14em] text-[#11100b]">
                  {searchCopy.who}
                </span>
                <span className="mt-1 truncate text-base text-[#4b4538] lg:text-xl">
                  {guestLabel}
                </span>
              </button>

              <div className="flex items-center justify-end px-3 pb-3 sm:pb-3 lg:p-3">
                <button
                  type="submit"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm uppercase text-accent-foreground shadow-[0_12px_34px_rgba(17,16,11,0.22)] transition-transform hover:scale-[1.02] lg:w-auto"
                >
                  <Search className="h-5 w-5" />
                  <span>{searchCopy.search}</span>
                </button>
              </div>
            </div>

            {activeSearchPanel ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.85rem)] z-40 rounded-[2rem] border border-black/10 bg-white p-6 text-[#11100b] shadow-[0_30px_90px_rgba(17,16,11,0.22)]">
                {activeSearchPanel === "where" ? (
                  <div>
                    <p className="trip-meta-text text-xs uppercase tracking-[0.16em] text-[#8f7020]">
                      {searchCopy.whereHint}
                    </p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {visibleDestinationOptions.length > 0 ? (
                        visibleDestinationOptions.map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => {
                              setQuery(option.label);
                              setActiveSearchPanel(null);
                            }}
                            className="rounded-xl border border-[#eadfac] bg-[#fffdf3] px-4 py-3 text-left transition-colors hover:border-accent hover:bg-accent/15"
                          >
                            <span className="block text-base text-[#11100b]">
                              {option.label}
                            </span>
                            <span className="mt-1 block text-xs text-[#6d6352]">
                              {option.count} {sectionCopy.result}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="rounded-xl border border-[#eadfac] bg-[#fffdf3] px-4 py-5 text-sm text-[#6d6352] sm:col-span-2 lg:col-span-4">
                          {searchCopy.suggestionsEmpty}
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}

                {activeSearchPanel === "when" ? (
                  <div>
                    <div className="mx-auto mb-6 grid max-w-md grid-cols-2 rounded-full bg-[#f1f1f1] p-1 text-center text-sm">
                      <span className="rounded-full bg-white px-5 py-3 shadow-sm">
                        {searchCopy.dates}
                      </span>
                      <span className="px-5 py-3 text-[#4b4538]">
                        {searchCopy.flexible}
                      </span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <button
                        type="button"
                        disabled={calendarOffset === 0}
                        onClick={() =>
                          setCalendarOffset((offset) => Math.max(0, offset - 1))
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfac] text-xl disabled:opacity-30"
                        aria-label="Previous month"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalendarOffset((offset) => offset + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfac] text-xl"
                        aria-label="Next month"
                      >
                        ›
                      </button>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-2">
                      {visibleCalendarMonths.map((month) => (
                        <div key={month.toISOString()}>
                          <h3 className="mb-5 text-center text-xl text-[#11100b]">
                            {new Intl.DateTimeFormat(localeTag, {
                              month: "long",
                              year: "numeric",
                            }).format(month)}
                          </h3>
                          <div className="grid grid-cols-7 gap-2 text-center text-xs text-[#6d6352]">
                            {WEEKDAY_LABELS[contentLocale].map((day) => (
                              <span key={day} className="py-1">
                                {day}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 grid grid-cols-7 gap-2">
                            {getMonthDays(month).map((day, index) => {
                              if (!day) {
                                return <span key={`blank-${index}`} />;
                              }

                              const isDisabled = day < today;
                              const isSelected =
                                selectedDateKey === getDateKey(day);

                              return (
                                <button
                                  key={day.toISOString()}
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={() => {
                                    setSelectedDate(day);
                                    setActiveSearchPanel(null);
                                  }}
                                  className={cn(
                                    "flex aspect-square items-center justify-center rounded-full text-sm transition-colors",
                                    isSelected
                                      ? "bg-[#11100b] text-white"
                                      : "hover:bg-[#f4edcf]",
                                    isDisabled &&
                                      "cursor-not-allowed text-[#11100b]/22 hover:bg-transparent"
                                  )}
                                >
                                  {day.getDate()}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {activeSearchPanel === "who" ? (
                  <div className="mx-auto max-w-2xl">
                    {GUEST_ROWS.map((key, index) => {
                      const hintKey = `${key}Hint` as const;

                      return (
                        <div
                          key={key}
                          className={cn(
                            "flex items-center justify-between gap-6 py-6",
                            index > 0 && "border-t border-[#eadfac]"
                          )}
                        >
                          <div>
                            <h3 className="text-xl text-[#11100b]">
                              {searchCopy[key]}
                            </h3>
                            <p className="mt-1 text-sm text-[#6d6352]">
                              {searchCopy[hintKey]}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              disabled={guestCounts[key] === 0}
                              onClick={() => updateGuestCount(key, -1)}
                              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f1f1] text-[#11100b] disabled:opacity-35"
                              aria-label={`Decrease ${key}`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-6 text-center text-xl">
                              {guestCounts[key]}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateGuestCount(key, 1)}
                              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f1f1] text-[#11100b]"
                              aria-label={`Increase ${key}`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}
          </form>
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
              <h2 className="section-header-title tours-list-title max-w-[13ch] text-balance text-black">
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
              className="absolute bottom-0 left-0 z-10 overflow-visible [--gallery-unit:calc(1.32vw/var(--site-scale))] sm:[--gallery-unit:calc(1.14vw/var(--site-scale))] lg:[--gallery-unit:calc(1vw/var(--site-scale))]"
              style={
                {
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
