"use client";

import {
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Camera,
  Home,
  MapPinned,
  Search,
  UsersRound,
} from "lucide-react";
import {
  ADVENTURES,
  getAdventureText,
  type Adventure,
  type AdventureTranslations,
} from "@/lib/adventures";
import { getHighResolutionImageUrl } from "@/lib/image-quality";
import {
  CARD_CTA,
  CARD_FRAME,
  CARD_FRAME_LIGHT,
  CardMedia,
  CardMeta,
  CardOverlay,
  CardTitle,
} from "@/components/ui/card-recipe";
import { cn } from "@/lib/utils";
import { AdventureModal } from "./adventure-modal";
import { useLanguage } from "./language-provider";
import { formatPriceString } from "@/lib/currency";
import { type StayOption, DEFAULT_STAYS } from "@/lib/site-settings";
import { OUTBOUND_OPTIONS } from "./outbound-trips-carousel";

type TripScope = "all" | "outbound" | "domestic" | "corporate";
type SortMode =
  | "recommended"
  | "price-low"
  | "price-high"
  | "days-low"
  | "days-high";

type FeaturedAdventuresProps = {
  adventures?: Adventure[];
  beforeList?: ReactNode;
  outboundTripImages?: Record<string, string>;
  stays?: StayOption[];
  pageMode?: "all" | "outbound" | "domestic";
};

const SEARCH_LOCALES = ["mn", "en", "zh", "ja", "ko"] as const;

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
  locale: (typeof SEARCH_LOCALES)[number]
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
  locale: (typeof SEARCH_LOCALES)[number]
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

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getOutboundOptionSummary(
  option: (typeof OUTBOUND_OPTIONS)[number],
  locale: (typeof SEARCH_LOCALES)[number]
) {
  const country = getOutboundOptionCountry(option, locale);

  switch (locale) {
    case "mn":
      return `${country} чиглэлийн ${option.days} хоногийн аялал. Хотын үзвэр, амралт, зураг авах цэг, өдөр бүрийн маршрут, буудал болон тээврийн зохион байгуулалтыг Nomadabe баг төлөвлөнө.`;
    case "zh":
    case "ja":
    case "ko":
    case "en":
    default:
      return `${option.days}-day ${country} travel package with daily routing, city highlights, leisure time, photo spots, accommodation guidance, and transport planning by the Nomadabe team.`;
  }
}

function getOutboundOptionDetails(locale: (typeof SEARCH_LOCALES)[number]) {
  const isMn = locale === "mn";

  return {
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

function getOutboundOptionTranslations(
  option: (typeof OUTBOUND_OPTIONS)[number]
): AdventureTranslations {
  return SEARCH_LOCALES.reduce<AdventureTranslations>((translations, locale) => {
    if (locale === "mn") {
      return translations;
    }

    const country = getOutboundOptionCountry(option, locale);

    translations[locale] = {
      title: getOutboundOptionTitle(option, locale),
      location: country,
      country,
      groupSize: "Small group",
      tags: ["Outbound", country],
      summary: getOutboundOptionSummary(option, locale),
      ...getOutboundOptionDetails(locale),
    };

    return translations;
  }, {});
}

function getAdventureSearchText(adventure: Adventure) {
  const localizedParts = SEARCH_LOCALES.flatMap((locale) => {
    const text = getAdventureText(adventure, locale);

    return [
      text.title,
      text.location,
      text.country,
      text.groupSize,
      text.difficulty,
      text.summary,
      text.nextDeparture ?? "",
      ...text.tags,
      ...text.idealFor,
      ...text.includes,
      ...text.businessSupport,
    ];
  });

  return normalizeSearchText(
    [
      adventure.title,
      adventure.location,
      adventure.country,
      adventure.category,
      adventure.slug,
      ...adventure.tags,
      ...adventure.idealFor,
      ...adventure.includes,
      ...adventure.businessSupport,
      ...localizedParts,
    ].join(" ")
  );
}

function isCorporateAdventure(adventure: Adventure) {
  const corporateText = normalizeSearchText(
    [
      adventure.category,
      adventure.title,
      adventure.summary,
      ...adventure.tags,
      ...adventure.idealFor,
    ].join(" ")
  );

  return [
    "business",
    "corporate",
    "company",
    "organization",
    "expo",
    "import",
    "supplier",
    "meeting",
    "байгууллага",
    "бизнес",
    "үзэсгэлэн",
    "нийлүүлэгч",
  ].some((keyword) => corporateText.includes(keyword));
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
    corporate: "Байгууллагын аялал",
    villa: "Вилла",
    directions: "Чиглэлүүд",
    categoryTitle: "Аяллын категори",
    outboundDirection: "Гадаад чиглэл",
    domesticDirection: "Дотоод чиглэл",
    outboundDescription: "Чиглэлүүд, байгууллагын аялал болон вилла сонголтууд.",
    domesticDescription: "Монгол доторх амралт, байгаль, соёлын аяллууд.",
    subcategoryTitle: "Дэд категори",
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
    corporate: "Corporate trips",
    villa: "Villas",
    directions: "Destinations",
    categoryTitle: "Trip categories",
    outboundDirection: "Outbound",
    domesticDirection: "Domestic",
    outboundDescription: "Destinations, corporate trips, and villa options.",
    domesticDescription: "Trips across Mongolia for nature, leisure, and culture.",
    subcategoryTitle: "Subcategories",
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
    corporate: "企业旅行",
    villa: "别墅",
    directions: "目的地",
    categoryTitle: "旅行分类",
    outboundDirection: "出境方向",
    domesticDirection: "国内方向",
    outboundDescription: "目的地、企业旅行和别墅选择。",
    domesticDescription: "蒙古国内自然、休闲和文化旅行。",
    subcategoryTitle: "子分类",
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
    corporate: "法人向けツアー",
    villa: "ヴィラ",
    directions: "目的地",
    categoryTitle: "ツアーカテゴリ",
    outboundDirection: "海外方面",
    domesticDirection: "国内方面",
    outboundDescription: "目的地、法人向けツアー、ヴィラ選択。",
    domesticDescription: "モンゴル国内の自然、休暇、文化ツアー。",
    subcategoryTitle: "サブカテゴリ",
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
    corporate: "기업 여행",
    villa: "빌라",
    directions: "목적지",
    categoryTitle: "여행 카테고리",
    outboundDirection: "해외 방향",
    domesticDirection: "국내 방향",
    outboundDescription: "목적지, 기업 여행, 빌라 옵션.",
    domesticDescription: "몽골 국내 자연, 휴식, 문화 여행.",
    subcategoryTitle: "하위 카테고리",
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
    allDestinations: "All",
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
    allDestinations: "All",
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
    allDestinations: "All",
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
    allDestinations: "All",
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
    allDestinations: "All",
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

type SectionCopy = (typeof SECTION_COPY)[keyof typeof SECTION_COPY];

function ToursCategoryNavigation({
  mode,
  copy,
  staysCount,
}: {
  mode: "all" | "outbound" | "domestic";
  copy: SectionCopy;
  staysCount: number;
}) {
  const cards =
    mode === "outbound"
      ? [
          {
            href: "#outbound-trips",
            title: copy.directions,
            body: copy.outboundDescription,
          },
          {
            href: "#corporate-trips",
            title: copy.corporate,
            body: copy.outboundDescription,
          },
          ...(staysCount > 0
            ? [
                {
                  href: "#stays",
                  title: copy.villa,
                  body: copy.outboundDescription,
                },
              ]
            : []),
        ]
      : [
          {
            href: "/tours/outbound",
            title: copy.outboundDirection,
            body: copy.outboundDescription,
          },
          {
            href: "/tours/domestic",
            title: copy.domesticDirection,
            body: copy.domesticDescription,
          },
        ];

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 pt-10 sm:px-6 lg:px-8 lg:pt-12">
      <p className="nav-text text-xs uppercase text-[#b89422]">
        {mode === "outbound" ? copy.subcategoryTitle : copy.categoryTitle}
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group border border-[#eadfac] bg-[#fffdf3] p-5 text-[#11100b] transition-colors hover:border-[#11100b]"
          >
            <div className="flex items-center justify-between gap-5">
              <h3 className="site-heading text-xl leading-tight">
                {card.title}
              </h3>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#b89422] transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-3 text-sm leading-6 text-[#11100b]/60">
              {card.body}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function DestinationDragCarousel({
  id,
  title,
  resultLabel,
  adventures,
  locale,
  dayLabel,
  detailsLabel,
  onSelect,
}: {
  id: string;
  title: string;
  resultLabel: string;
  adventures: Adventure[];
  locale: keyof typeof SECTION_COPY;
  dayLabel: string;
  detailsLabel: string;
  onSelect: (adventure: Adventure) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);
  const dragRef = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    didDrag: false,
    frame: 0,
  });
  const adventureCount = adventures.length;
  const adventureSignature = useMemo(
    () => adventures.map((adventure) => adventure.id).join("|"),
    [adventures]
  );

  useEffect(() => {
    const dragState = dragRef.current;

    return () => {
      if (dragState.frame) {
        window.cancelAnimationFrame(dragState.frame);
      }
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    if (dragRef.current.frame) {
      window.cancelAnimationFrame(dragRef.current.frame);
      dragRef.current.frame = 0;
    }

    dragRef.current.active = false;
    dragRef.current.velocity = 0;
    dragRef.current.didDrag = false;
    setIsDragging(false);
    scroller.scrollLeft = 0;
  }, [adventureSignature]);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller || adventureCount <= 1 || isDragging || autoPaused) {
      return;
    }

    scroller.classList.add("snap-none");
    scroller.classList.remove("snap-x", "snap-mandatory");

    let frame = 0;
    let lastTime = 0;

    const step = (time: number) => {
      if (!scrollerRef.current) {
        return;
      }

      if (lastTime === 0) {
        lastTime = time;
      }

      const elapsed = time - lastTime;
      lastTime = time;
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;

      if (maxScroll > 0 && !dragRef.current.active) {
        scroller.scrollLeft += elapsed * 0.034;

        if (scroller.scrollLeft >= maxScroll - 1) {
          scroller.scrollLeft = 0;
        }
      }

      frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frame);
  }, [adventureCount, adventureSignature, autoPaused, isDragging]);

  function stopMomentum() {
    if (dragRef.current.frame) {
      window.cancelAnimationFrame(dragRef.current.frame);
      dragRef.current.frame = 0;
    }
  }

  function snapToNearestCard() {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-carousel-card]")
    );

    if (cards.length === 0) {
      return;
    }

    const scrollerLeft = scroller.getBoundingClientRect().left;
    const currentScroll = scroller.scrollLeft;
    let nearestScroll = currentScroll;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const card of cards) {
      const cardLeft = card.getBoundingClientRect().left;
      const targetScroll = currentScroll + cardLeft - scrollerLeft;
      const distance = Math.abs(cardLeft - scrollerLeft);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestScroll = targetScroll;
      }
    }

    scroller.classList.remove("snap-none");
    scroller.classList.add("snap-x", "snap-mandatory");
    scroller.scrollTo({ left: nearestScroll, behavior: "smooth" });
  }

  function startMomentum() {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    let velocity = dragRef.current.velocity;
    let lastTime = 0;

    const step = (time: number) => {
      if (lastTime === 0) {
        lastTime = time;
      }

      const elapsed = time - lastTime;
      lastTime = time;

      scroller.scrollLeft += velocity * elapsed;
      velocity *= 0.94;

      const atStart = scroller.scrollLeft <= 0;
      const atEnd =
        scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 1;

      if (Math.abs(velocity) < 0.025 || atStart || atEnd) {
        dragRef.current.frame = 0;
        snapToNearestCard();
        return;
      }

      dragRef.current.frame = window.requestAnimationFrame(step);
    };

    dragRef.current.frame = window.requestAnimationFrame(step);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    stopMomentum();
    dragRef.current.active = true;
    dragRef.current.startX = event.clientX;
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastTime = event.timeStamp;
    dragRef.current.velocity = 0;
    dragRef.current.didDrag = false;
    setIsDragging(true);
    scroller.classList.add("snap-none");
    scroller.classList.remove("snap-x", "snap-mandatory");
    scroller.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;

    if (!dragRef.current.active || !scroller) {
      return;
    }

    const now = event.timeStamp;
    const deltaX = event.clientX - dragRef.current.lastX;
    const elapsed = Math.max(1, now - dragRef.current.lastTime);
    const deltaScroll = -deltaX;

    if (Math.abs(event.clientX - dragRef.current.startX) > 4) {
      dragRef.current.didDrag = true;
    }

    scroller.scrollLeft += deltaScroll;
    dragRef.current.velocity = deltaScroll / elapsed;
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastTime = now;
  }

  function endPointerDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;

    if (!dragRef.current.active || !scroller) {
      return;
    }

    dragRef.current.active = false;
    setIsDragging(false);

    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }

    if (Math.abs(dragRef.current.velocity) > 0.05) {
      startMomentum();
    } else {
      snapToNearestCard();
    }
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;

    if (!scroller || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const nextScroll = scroller.scrollLeft + event.deltaY;

    if (nextScroll <= 0 || nextScroll >= maxScroll) {
      return;
    }

    event.preventDefault();
    scroller.scrollLeft = nextScroll;
  }

  function openAdventureDetails(adventure: Adventure) {
    stopMomentum();
    onSelect(adventure);
  }

  function handleCardClick(
    event: ReactMouseEvent<HTMLElement>,
    adventure: Adventure
  ) {
    if ((event.target as HTMLElement).closest("a")) {
      return;
    }

    if (dragRef.current.didDrag) {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current.didDrag = false;
      return;
    }

    openAdventureDetails(adventure);
  }

  if (adventureCount === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className="overflow-hidden bg-white py-10 lg:py-12"
    >
      <div className="text-[#050505]">
        <div className="tours-list-copy mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <h2 className="section-header-title tours-list-title max-w-[13ch] text-balance text-black">
            {title}
          </h2>
          <div className="tours-list-count mt-5 inline-flex border border-black bg-white px-3 py-2 text-xs uppercase text-black">
            {adventureCount} {resultLabel}
          </div>
        </div>

        <div
          ref={scrollerRef}
          className={cn(
            "mx-auto mt-8 flex w-full max-w-[1500px] cursor-grab scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 active:cursor-grabbing sm:scroll-px-6 sm:gap-5 sm:px-6 lg:mt-10 lg:scroll-px-8 lg:gap-6 lg:px-8",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "[-webkit-overflow-scrolling:touch] [touch-action:pan-x]",
            isDragging && "cursor-grabbing select-none"
          )}
          onMouseEnter={() => setAutoPaused(true)}
          onMouseLeave={() => setAutoPaused(false)}
          onFocus={() => setAutoPaused(true)}
          onBlur={() => setAutoPaused(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointerDrag}
          onPointerCancel={endPointerDrag}
          onWheel={handleWheel}
        >
          {adventures.map((adventure) => {
            const text = getAdventureText(adventure, locale);

            return (
              <article
                key={adventure.id}
                data-carousel-card
                onClick={(event) => handleCardClick(event, adventure)}
                className="group relative m-0 flex min-w-[82vw] shrink-0 cursor-pointer flex-col transition-transform duration-300 ease-out hover:-translate-y-1.5 sm:min-w-[52vw] md:min-w-[38vw] lg:min-w-[30vw] xl:min-w-[24rem] 2xl:min-w-[26rem]"
              >
                <div className={cn(CARD_FRAME, "aspect-[4/6.05]")}>
                  <CardMedia
                    src={getHighResolutionImageUrl(adventure.image)}
                    alt={text.title}
                    sizes="(max-width: 768px) 82vw, 26rem"
                  />
                  <CardOverlay>
                    <CardMeta
                      items={[
                        { label: text.country },
                        { label: text.location, icon: MapPinned },
                        { label: `${adventure.days} ${dayLabel}`, icon: CalendarDays },
                      ]}
                    />
                    <CardTitle>{text.title}</CardTitle>
                    <p className="trip-copy-text mt-3 line-clamp-2 max-w-md text-sm text-white/80">
                      {text.summary}
                    </p>
                    <Link
                      href={`/tours/${adventure.slug}`}
                      onPointerDown={(event) => {
                        event.stopPropagation();
                        stopMomentum();
                        dragRef.current.didDrag = false;
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (dragRef.current.didDrag) {
                          event.preventDefault();
                          dragRef.current.didDrag = false;
                          return;
                        }
                        dragRef.current.didDrag = false;
                        stopMomentum();
                      }}
                      className={cn(CARD_CTA, "group/btn mt-4 self-start")}
                    >
                      {detailsLabel}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                    </Link>
                  </CardOverlay>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StaysAndVillasSection({ stays }: { stays: StayOption[] }) {
  const { contentLocale } = useLanguage();
  return (
    <section id="stays" className="bg-white px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="nav-text text-xs uppercase text-[#b89422]">
              Вилла
            </p>
            <h2 className="site-heading mt-2 text-[clamp(1.5rem,3vw,2.6rem)] leading-tight text-[#11100b]">
              Вилла
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#11100b]/58">
            Аяллын маршрут, төсөв, хүний тоо, өрөөний хэрэгцээнд тааруулж
            вилла сонголтыг нэг дор төлөвлөнө.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {stays.map((stay) => {
            const requestHref = `/plan?mode=villa&trip=${encodeURIComponent(
              `villa-${stay.id}`
            )}&title=${encodeURIComponent(stay.title)}`;

            return (
              <article key={stay.id} className={CARD_FRAME_LIGHT}>
                {/* Same image treatment as every trip card: one photo, one
                    scrim, the meta row and title sitting over it. */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <CardMedia
                    src={stay.images[0]}
                    alt={stay.title}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <CardOverlay>
                    <CardMeta
                      items={[
                        { label: stay.type, icon: Home },
                        { label: stay.location, icon: MapPinned },
                        { label: `${stay.images.length} зураг`, icon: Camera },
                      ]}
                    />
                    <CardTitle>{stay.title}</CardTitle>
                  </CardOverlay>
                </div>

                <div className="px-5 pb-5 pt-4">
                  <p className="trip-copy-text line-clamp-3 text-sm text-[#11100b]/70">
                    {stay.summary}
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-2">
                    <div className="border border-[#eadfac] bg-white px-3 py-3">
                      <dt className="nav-text flex items-center gap-2 text-[10px] uppercase text-[#8a6f12]">
                        <CalendarDays className="h-4 w-4" />
                        Хоног
                      </dt>
                      <dd className="mt-2 text-sm font-semibold text-[#11100b]">
                        {stay.nights} хоног
                      </dd>
                    </div>
                    <div className="border border-[#eadfac] bg-white px-3 py-3">
                      <dt className="nav-text flex items-center gap-2 text-[10px] uppercase text-[#8a6f12]">
                        <UsersRound className="h-4 w-4" />
                        Хүний тоо
                      </dt>
                      <dd className="mt-2 text-sm font-semibold text-[#11100b]">
                        {stay.guests} хүн
                      </dd>
                    </div>
                    <div className="border border-[#eadfac] bg-white px-3 py-3">
                      <dt className="nav-text flex items-center gap-2 text-[10px] uppercase text-[#8a6f12]">
                        <BedDouble className="h-4 w-4" />
                        Өрөөний тоо
                      </dt>
                      <dd className="mt-2 text-sm font-semibold text-[#11100b]">
                        {stay.rooms} өрөө
                      </dd>
                    </div>
                    <div className="border border-[#eadfac] bg-white px-3 py-3">
                      <dt className="nav-text flex items-center gap-2 text-[10px] uppercase text-[#8a6f12]">
                        <MapPinned className="h-4 w-4" />
                        Үнэ
                      </dt>
                      <dd className="mt-2 text-sm font-semibold text-[#11100b]">
                        {formatPriceString(stay.price, contentLocale)}
                      </dd>
                    </div>
                  </dl>

                  <Link href={requestHref} className={cn(CARD_CTA, "mt-5 self-start")}>
                    Захиалах хүсэлт
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FeaturedAdventures({
  adventures = ADVENTURES,
  beforeList,
  outboundTripImages = {},
  stays = DEFAULT_STAYS,
  pageMode = "all",
}: FeaturedAdventuresProps) {
  const [selected, setSelected] = useState<Adventure | null>(null);
  const [scope, setScope] = useState<TripScope>(
    pageMode === "domestic" ? "domestic" : "all"
  );
  const [sortMode] = useState<SortMode>("recommended");
  const [query, setQuery] = useState("");
  const [activeHeroImage, setActiveHeroImage] = useState(0);
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const { contentLocale, t } = useLanguage();
  const sectionCopy = SECTION_COPY[contentLocale];
  const searchCopy = TRIP_SEARCH_COPY[contentLocale];

  const staticOutboundAdventures = useMemo<Adventure[]>(
    () =>
      OUTBOUND_OPTIONS.map((option, index) => {
        const title = getOutboundOptionTitle(option, "mn");
        const country = getOutboundOptionCountry(option, "mn");
        const modalDetails = getOutboundOptionDetails("mn");

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
          image: outboundTripImages[option.id] || option.image,
          tags: ["Гадаад", country],
          rating: 4.8,
          reviews: 18 + index * 4,
          category: "outbound",
          summary: getOutboundOptionSummary(option, "mn"),
          idealFor: modalDetails.idealFor,
          includes: modalDetails.includes,
          businessSupport: modalDetails.businessSupport,
          nextDeparture: sectionCopy.flexible,
          translations: getOutboundOptionTranslations(option),
        };
      }),
    [outboundTripImages, sectionCopy.flexible]
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
      scopeQuery === "outbound" ||
      scopeQuery === "corporate"
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
    const normalizedQuery = normalizeSearchText(query.trim());

    const matches = allAdventures.filter((adventure) => {
      const isDomestic = adventure.country === "Mongolia";
      const isCorporate = isCorporateAdventure(adventure);
      const searchText = getAdventureSearchText(adventure);
      const matchesPageMode =
        pageMode === "all" ||
        (pageMode === "domestic" && isDomestic) ||
        (pageMode === "outbound" && (!isDomestic || isCorporate));

      const matchesScope =
        scope === "all" ||
        (scope === "domestic" && isDomestic) ||
        (scope === "outbound" && !isDomestic) ||
        (scope === "corporate" && isCorporate);
      const matchesQuery =
        !normalizedQuery || searchText.includes(normalizedQuery);

      return matchesPageMode && matchesScope && matchesQuery;
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
  }, [allAdventures, pageMode, query, scope, sortMode]);

  const groupedFilteredAdventures = useMemo(() => {
    const outbound = filteredAdventures.filter(
      (adventure) =>
        adventure.country !== "Mongolia" && !isCorporateAdventure(adventure)
    );
    const corporate = filteredAdventures.filter(isCorporateAdventure);
    const domestic = filteredAdventures.filter(
      (adventure) => adventure.country === "Mongolia"
    );

    const groups =
      pageMode === "domestic"
        ? [
            {
              id: "domestic-trips",
              title: sectionCopy.domestic,
              adventures: domestic,
            },
          ]
        : pageMode === "outbound"
          ? [
              {
                id: "outbound-trips",
                title: sectionCopy.directions,
                adventures: outbound,
              },
              {
                id: "corporate-trips",
                title: sectionCopy.corporate,
                adventures: corporate,
              },
            ]
          : [
              {
                id: "outbound-trips",
                title: sectionCopy.outboundDirection,
                adventures: outbound,
              },
              {
                id: "corporate-trips",
                title: sectionCopy.corporate,
                adventures: corporate,
              },
              {
                id: "domestic-trips",
                title: sectionCopy.domesticDirection,
                adventures: domestic,
              },
            ];

    return groups.filter((group) => group.adventures.length > 0);
  }, [
    filteredAdventures,
    sectionCopy.corporate,
    sectionCopy.domestic,
    sectionCopy.directions,
    sectionCopy.domesticDirection,
    sectionCopy.outboundDirection,
    pageMode,
  ]);
  function handleTripSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    gallerySectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section id="adventures" className="bg-background">
      <div className="relative min-h-[calc(100svh/var(--site-scale))] overflow-visible bg-primary text-primary-foreground">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          {TOURS_BACKGROUNDS.map((image, index) => (
            <motion.div
              key={image}
              initial={false}
              animate={{ opacity: activeHeroImage === index ? 1 : 0 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="absolute inset-0 scale-105 bg-cover bg-center"
              style={{ backgroundImage: `url('${getHighResolutionImageUrl(image)}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-black/38 to-primary/82" />
          <div className="absolute inset-0 bg-primary/10" />
        </div>

        <div className="absolute inset-x-0 top-[42vh] z-30 px-6 sm:top-[44vh] lg:px-10">
          <form
            onSubmit={handleTripSearchSubmit}
            className="relative mx-auto max-w-3xl text-white"
          >
            <div className="grid overflow-hidden rounded-[1.75rem] border border-white/32 bg-white/[0.035] shadow-[0_14px_44px_rgba(17,16,11,0.09)] backdrop-blur-[0.5px] sm:rounded-full lg:grid-cols-[1fr_auto]">
              <div className="flex min-h-[60px] flex-col justify-center border-b border-white/24 px-5 py-3 transition-colors sm:border-b-0 lg:border-r">
                <label
                  htmlFor="trip-where-search"
                  className="sr-only"
                >
                  {searchCopy.wherePlaceholder}
                </label>
                <input
                  id="trip-where-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchCopy.wherePlaceholder}
                  className="min-w-0 appearance-none border-0 bg-transparent p-0 text-sm text-white shadow-none outline-none [background:transparent] placeholder:text-white/62 selection:bg-white/20 focus:bg-transparent focus:ring-0 lg:text-lg"
                />
              </div>

              <div className="flex items-center justify-end px-2.5 pb-2.5 sm:pb-2.5 lg:p-2.5">
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/80 bg-white/5 px-6 text-xs uppercase text-white transition-colors hover:bg-white/14 lg:w-auto"
                >
                  <Search className="h-5 w-5" />
                  <span>{searchCopy.search}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div
        ref={gallerySectionRef}
        id="all"
        className="bg-white"
      >
        <ToursCategoryNavigation
          mode={pageMode}
          copy={sectionCopy}
          staysCount={stays.length}
        />
        {groupedFilteredAdventures.length > 0 ? (
          groupedFilteredAdventures.map((group) => (
            <DestinationDragCarousel
              key={group.id}
              id={group.id}
              title={group.title}
              resultLabel={sectionCopy.result}
              adventures={group.adventures}
              locale={contentLocale}
              dayLabel={t.featured.days}
              detailsLabel={t.featured.details}
              onSelect={setSelected}
            />
          ))
        ) : (
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
            <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
              {t.featured.noResults}
            </div>
          </div>
        )}
      </div>

      {pageMode !== "domestic" ? <StaysAndVillasSection stays={stays} /> : null}

      {beforeList}

      <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
