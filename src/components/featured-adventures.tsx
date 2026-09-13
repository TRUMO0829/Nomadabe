"use client";

import {
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Camera,
  Home,
  MapPinned,
  Search,
  Tag,
  UsersRound,
} from "lucide-react";
import {
  ADVENTURES,
  getAdventureText,
  type Adventure,
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
import { Container, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { formatPrice, formatPriceString } from "@/lib/currency";
import { type StayOption, DEFAULT_STAYS } from "@/lib/site-settings";
import { OUTBOUND_OPTIONS, buildStaticOutboundAdventure } from "@/lib/outbound-trips";

type TripScope = "all" | "outbound" | "domestic" | "corporate";
type PageMode = "all" | "outbound" | "domestic";

type FeaturedAdventuresProps = {
  adventures?: Adventure[];
  beforeList?: ReactNode;
  outboundTripImages?: Record<string, string>;
  stays?: StayOption[];
  pageMode?: PageMode;
};

const SEARCH_LOCALES = ["mn", "en", "zh", "ja", "ko"] as const;
type SearchLocale = (typeof SEARCH_LOCALES)[number];

const TOURS_BACKGROUNDS = [
  "/nomadabe-hero-panorama.webp",
  "/hero-winter.webp",
  "/hero-spring.webp",
  "/hero-autumn.webp",
];

/** Long enough to read the heading before the photo changes underneath it. */
const HERO_SLIDE_INTERVAL_MS = 7000;

/** How long a touch interaction keeps a carousel's auto-scroll paused. */
const TOUCH_RESUME_DELAY_MS = 4000;

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
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

function parseTripScope(value: string | null): TripScope | null {
  return value === "all" ||
    value === "domestic" ||
    value === "outbound" ||
    value === "corporate"
    ? value
    : null;
}

const SECTION_COPY = {
  mn: {
    heroTitle: "Аяллууд",
    heroBody:
      "Гадаад болон дотоод аяллуудыг чиглэл, нэр, аяллын төрлөөр нь хурдан хайж үзээрэй.",
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
    result: "аялал",
    flexible: "Тохиролцоно",
    priceOnRequest: "Үнэ тохиролцоно",
    searchLabel: "Аялал хайх",
    searchPlaceholder: "Чиглэл хайх",
    searchSubmit: "Хайх",
  },
  en: {
    heroTitle: "Trips",
    heroBody:
      "Search outbound and domestic trips by destination, name, or travel style.",
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
    result: "trips",
    flexible: "Flexible",
    priceOnRequest: "Price on request",
    searchLabel: "Search trips",
    searchPlaceholder: "Search destinations",
    searchSubmit: "Search",
  },
  zh: {
    heroTitle: "旅游",
    heroBody: "按目的地、名称或旅行类型快速查看出境和蒙古国内旅行。",
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
    result: "个行程",
    flexible: "可协商",
    priceOnRequest: "价格面议",
    searchLabel: "搜索旅行",
    searchPlaceholder: "搜索目的地",
    searchSubmit: "搜索",
  },
  ja: {
    heroTitle: "ツアー",
    heroBody:
      "海外旅行とモンゴル国内旅行を、目的地、名前、旅行タイプで素早く探せます。",
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
    result: "件",
    flexible: "相談可能",
    priceOnRequest: "料金はお問い合わせ",
    searchLabel: "ツアーを検索",
    searchPlaceholder: "目的地を検索",
    searchSubmit: "検索",
  },
  ko: {
    heroTitle: "여행",
    heroBody:
      "해외 및 몽골 국내 여행을 목적지, 이름, 여행 유형으로 빠르게 찾아보세요.",
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
    result: "개 여행",
    flexible: "협의 가능",
    priceOnRequest: "가격 문의",
    searchLabel: "여행 검색",
    searchPlaceholder: "목적지 검색",
    searchSubmit: "검색",
  },
} as const;

type SectionCopy = (typeof SECTION_COPY)[keyof typeof SECTION_COPY];

const STAYS_COPY: Record<
  SearchLocale,
  {
    eyebrow: string;
    title: string;
    body: string;
    nights: string;
    guests: string;
    rooms: string;
    price: string;
    request: string;
    formatNights: (count: number) => string;
    formatGuests: (count: number) => string;
    formatRooms: (count: number) => string;
    formatPhotos: (count: number) => string;
  }
> = {
  mn: {
    eyebrow: "Байр сууц",
    title: "Вилла",
    body: "Аяллын маршрут, төсөв, хүний тоо, өрөөний хэрэгцээнд тааруулж вилла сонголтыг нэг дор төлөвлөнө.",
    nights: "Хоног",
    guests: "Хүний тоо",
    rooms: "Өрөөний тоо",
    price: "Үнэ",
    request: "Захиалах хүсэлт",
    formatNights: (count) => `${count} хоног`,
    formatGuests: (count) => `${count} хүн`,
    formatRooms: (count) => `${count} өрөө`,
    formatPhotos: (count) => `${count} зураг`,
  },
  en: {
    eyebrow: "Stays",
    title: "Villas",
    body: "We plan villa options around your route, budget, group size, and room needs, all in one place.",
    nights: "Nights",
    guests: "Guests",
    rooms: "Rooms",
    price: "Price",
    request: "Request booking",
    formatNights: (count) => `${count} ${count === 1 ? "night" : "nights"}`,
    formatGuests: (count) => `${count} ${count === 1 ? "guest" : "guests"}`,
    formatRooms: (count) => `${count} ${count === 1 ? "room" : "rooms"}`,
    formatPhotos: (count) => `${count} ${count === 1 ? "photo" : "photos"}`,
  },
  zh: {
    eyebrow: "住宿",
    title: "别墅",
    body: "根据您的路线、预算、人数和房间需求，一站式规划别墅住宿。",
    nights: "晚数",
    guests: "人数",
    rooms: "房间数",
    price: "价格",
    request: "提交预订申请",
    formatNights: (count) => `${count}晚`,
    formatGuests: (count) => `${count}人`,
    formatRooms: (count) => `${count}间`,
    formatPhotos: (count) => `${count}张照片`,
  },
  ja: {
    eyebrow: "宿泊",
    title: "ヴィラ",
    body: "旅程、ご予算、人数、必要な部屋数に合わせて、ヴィラ選びをまとめてプランニングします。",
    nights: "泊数",
    guests: "人数",
    rooms: "部屋数",
    price: "料金",
    request: "予約をリクエスト",
    formatNights: (count) => `${count}泊`,
    formatGuests: (count) => `${count}名`,
    formatRooms: (count) => `${count}室`,
    formatPhotos: (count) => `${count}枚の写真`,
  },
  ko: {
    eyebrow: "숙소",
    title: "빌라",
    body: "여행 동선, 예산, 인원, 객실 수에 맞춰 빌라 선택을 한 번에 계획해 드립니다.",
    nights: "숙박일",
    guests: "인원",
    rooms: "객실 수",
    price: "가격",
    request: "예약 요청",
    formatNights: (count) => `${count}박`,
    formatGuests: (count) => `${count}명`,
    formatRooms: (count) => `${count}실`,
    formatPhotos: (count) => `사진 ${count}장`,
  },
};

/**
 * Keeps the search box and scope filter in step with `?search=` / `?scope=`.
 * It lives in its own Suspense boundary so reading the URL does not push the
 * whole (statically rendered) tours page onto client-side rendering, and it
 * reacts to client-side navigations such as the navbar search, which no
 * longer reloads the page.
 */
function TourSearchParamsSync({
  onSearch,
  onScope,
}: {
  onSearch: (value: string) => void;
  onScope: (value: TripScope) => void;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.trim() ?? "";
  const scope = parseTripScope(searchParams.get("scope"));

  useEffect(() => {
    if (search) {
      onSearch(search);
    }
  }, [onSearch, search]);

  useEffect(() => {
    if (scope) {
      onScope(scope);
    }
  }, [onScope, scope]);

  return null;
}

function ToursCategoryNavigation({
  mode,
  copy,
  staysCount,
}: {
  mode: PageMode;
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
    <Container className="pt-10 lg:pt-12">
      <p className="nav-text text-xs uppercase text-accent-text">
        {mode === "outbound" ? copy.subcategoryTitle : copy.categoryTitle}
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group border border-border bg-background p-5 text-foreground transition-colors hover:border-foreground"
          >
            <div className="flex items-center justify-between gap-5">
              <h3 className="site-heading text-xl leading-tight">
                {card.title}
              </h3>
              <ArrowRight className="h-5 w-5 shrink-0 text-accent-text transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-3 text-sm leading-6 text-foreground/60">
              {card.body}
            </p>
          </Link>
        ))}
      </div>
    </Container>
  );
}

function DestinationDragCarousel({
  id,
  title,
  adventures,
  locale,
  copy,
  dayLabel,
  detailsLabel,
}: {
  id: string;
  title: string;
  adventures: Adventure[];
  locale: SearchLocale;
  copy: SectionCopy;
  dayLabel: string;
  detailsLabel: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [isTouchPaused, setIsTouchPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const touchResumeTimer = useRef(0);
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
  const hasCards = adventureCount > 0;
  const adventureSignature = useMemo(
    () => adventures.map((adventure) => adventure.id).join("|"),
    [adventures]
  );

  useEffect(() => {
    const dragState = dragRef.current;
    const timer = touchResumeTimer;

    return () => {
      if (dragState.frame) {
        window.cancelAnimationFrame(dragState.frame);
      }
      window.clearTimeout(timer.current);
    };
  }, []);

  // Only auto-scroll while the carousel is actually on screen.
  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller || !hasCards) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry?.isIntersecting ?? false),
      { threshold: 0.1 }
    );
    observer.observe(scroller);

    return () => observer.disconnect();
  }, [hasCards]);

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
    scroller.scrollLeft = 0;
  }, [adventureSignature]);

  const autoScrollPaused =
    prefersReducedMotion === true ||
    !isInView ||
    isDragging ||
    isHovered ||
    hasFocusWithin ||
    isTouchPaused;

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller || adventureCount <= 1 || autoScrollPaused) {
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
  }, [adventureCount, adventureSignature, autoScrollPaused]);

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
    scroller.scrollTo({
      left: nearestScroll,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  function startMomentum() {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    if (prefersReducedMotion) {
      snapToNearestCard();
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
    dragRef.current.didDrag = false;

    if (event.pointerType !== "mouse") {
      // Touch and pen scroll natively; just hold the auto-scroll off so it
      // does not fight the finger.
      window.clearTimeout(touchResumeTimer.current);
      setIsTouchPaused(true);
      return;
    }

    if (event.button !== 0 || !scrollerRef.current) {
      return;
    }

    stopMomentum();
    dragRef.current.active = true;
    dragRef.current.startX = event.clientX;
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastTime = event.timeStamp;
    dragRef.current.velocity = 0;
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;

    if (!dragRef.current.active || !scroller) {
      return;
    }

    // Only a real drag captures the pointer. Capturing on pointerdown would
    // retarget a plain click to the scroller, and the card link under the
    // cursor would never receive it.
    if (
      !dragRef.current.didDrag &&
      Math.abs(event.clientX - dragRef.current.startX) > 4
    ) {
      dragRef.current.didDrag = true;
      setIsDragging(true);
      scroller.classList.add("snap-none");
      scroller.classList.remove("snap-x", "snap-mandatory");
      scroller.setPointerCapture(event.pointerId);
    }

    if (!dragRef.current.didDrag) {
      return;
    }

    const now = event.timeStamp;
    const deltaScroll = -(event.clientX - dragRef.current.lastX);
    const elapsed = Math.max(1, now - dragRef.current.lastTime);

    scroller.scrollLeft += deltaScroll;
    dragRef.current.velocity = deltaScroll / elapsed;
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastTime = now;
  }

  function endPointerDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      window.clearTimeout(touchResumeTimer.current);
      touchResumeTimer.current = window.setTimeout(
        () => setIsTouchPaused(false),
        TOUCH_RESUME_DELAY_MS
      );
      return;
    }

    const scroller = scrollerRef.current;

    if (!dragRef.current.active || !scroller) {
      return;
    }

    dragRef.current.active = false;
    setIsDragging(false);

    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }

    if (!dragRef.current.didDrag) {
      return;
    }

    if (Math.abs(dragRef.current.velocity) > 0.05) {
      startMomentum();
    } else {
      snapToNearestCard();
    }
  }

  // A drag that ends over a card must not also follow its link.
  function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!dragRef.current.didDrag) {
      stopMomentum();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragRef.current.didDrag = false;
  }

  if (!hasCards) {
    return null;
  }

  return (
    <section id={id} className="overflow-hidden bg-white py-10 lg:py-12">
      <div className="text-ink">
        <Container>
          <SectionHeading tone="light" title={title} />
          <div className="mt-5 inline-flex border border-foreground bg-white px-3 py-2 text-xs uppercase text-foreground">
            {adventureCount} {copy.result}
          </div>
        </Container>

        <div
          ref={scrollerRef}
          className={cn(
            "mx-auto mt-8 flex w-full max-w-7xl cursor-grab scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 pt-2 sm:scroll-px-8 sm:gap-5 sm:px-8 lg:mt-10 lg:scroll-px-12 lg:gap-6 lg:px-12",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "[-webkit-overflow-scrolling:touch]",
            isDragging && "cursor-grabbing select-none"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setHasFocusWithin(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setHasFocusWithin(false);
            }
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointerDrag}
          onPointerCancel={endPointerDrag}
          onClickCapture={handleClickCapture}
          // Native link/image dragging would swallow the pointer drag.
          onDragStart={(event) => event.preventDefault()}
        >
          {adventures.map((adventure) => {
            const text = getAdventureText(adventure, locale);
            const price =
              adventure.price > 0
                ? formatPrice(adventure.price, locale, adventure.currency || undefined)
                : copy.priceOnRequest;

            return (
              <Link
                key={adventure.id}
                href={`/tours/${adventure.slug}`}
                data-carousel-card
                className={cn(
                  CARD_FRAME,
                  "aspect-[4/6.05] min-w-[82vw] shrink-0 sm:min-w-[52vw] md:min-w-[38vw] lg:min-w-[30vw] xl:min-w-[24rem] 2xl:min-w-[26rem]"
                )}
              >
                <CardMedia
                  src={getHighResolutionImageUrl(adventure.image)}
                  alt={text.title}
                  sizes="(max-width: 768px) 82vw, 26rem"
                />

                <span className="trip-meta-text absolute right-5 top-5 z-10 border border-white/25 bg-black/45 px-3 py-1.5 text-[10px] uppercase text-white backdrop-blur">
                  {price}
                </span>

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
                  <span className={cn(CARD_CTA, "mt-4 self-start")}>
                    {detailsLabel}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </CardOverlay>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StaysAndVillasSection({ stays }: { stays: StayOption[] }) {
  const { contentLocale } = useLanguage();
  const copy = STAYS_COPY[contentLocale];

  if (stays.length === 0) {
    return null;
  }

  const facts = (stay: StayOption) => [
    { icon: CalendarDays, label: copy.nights, value: copy.formatNights(stay.nights) },
    { icon: UsersRound, label: copy.guests, value: copy.formatGuests(stay.guests) },
    { icon: BedDouble, label: copy.rooms, value: copy.formatRooms(stay.rooms) },
    {
      icon: Tag,
      label: copy.price,
      value: formatPriceString(stay.price, contentLocale),
    },
  ];

  return (
    <section id="stays" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <Container>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading tone="light" eyebrow={copy.eyebrow} title={copy.title} />
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {copy.body}
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
                <div className="relative aspect-[4/3] overflow-hidden bg-foreground">
                  {stay.images[0] ? (
                    <CardMedia
                      src={stay.images[0]}
                      alt={stay.title}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : null}
                  <CardOverlay>
                    <CardMeta
                      items={[
                        { label: stay.type, icon: Home },
                        { label: stay.location, icon: MapPinned },
                        {
                          label: copy.formatPhotos(stay.images.length),
                          icon: Camera,
                        },
                      ]}
                    />
                    <CardTitle>{stay.title}</CardTitle>
                  </CardOverlay>
                </div>

                <div className="px-5 pb-5 pt-4">
                  <p className="trip-copy-text line-clamp-3 text-sm text-foreground/70">
                    {stay.summary}
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-2">
                    {facts(stay).map(({ icon: Icon, label, value }) => (
                      <div key={label} className="border border-border bg-white px-3 py-3">
                        <dt className="nav-text flex items-center gap-2 text-[10px] uppercase text-accent-text">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {label}
                        </dt>
                        <dd className="mt-2 text-sm font-semibold text-foreground">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Link href={requestHref} className={cn(CARD_CTA, "mt-5 self-start")}>
                    {copy.request}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
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
  const [scope, setScope] = useState<TripScope>(
    pageMode === "domestic" ? "domestic" : "all"
  );
  const [query, setQuery] = useState("");
  const [activeHeroImage, setActiveHeroImage] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const { contentLocale, t } = useLanguage();
  const sectionCopy = SECTION_COPY[contentLocale];

  const heroTitle =
    pageMode === "outbound"
      ? sectionCopy.outbound
      : pageMode === "domestic"
        ? sectionCopy.domestic
        : sectionCopy.heroTitle;
  const heroBody =
    pageMode === "outbound"
      ? sectionCopy.outboundDescription
      : pageMode === "domestic"
        ? sectionCopy.domesticDescription
        : sectionCopy.heroBody;
  // Under reduced motion the slideshow never advances; show the first photo.
  const visibleHeroImage = prefersReducedMotion ? 0 : activeHeroImage;

  const staticOutboundAdventures = useMemo<Adventure[]>(
    () =>
      OUTBOUND_OPTIONS.map((option) =>
        buildStaticOutboundAdventure(option, outboundTripImages[option.id], sectionCopy.flexible)
      ),
    [outboundTripImages, sectionCopy.flexible]
  );

  const allAdventures = useMemo(
    () => [...staticOutboundAdventures, ...adventures],
    [adventures, staticOutboundAdventures]
  );

  // Hero slideshow: slow, paused while the tab is hidden, off entirely under
  // prefers-reduced-motion.
  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let interval = 0;

    const start = () => {
      if (!interval) {
        interval = window.setInterval(() => {
          setActiveHeroImage((current) => (current + 1) % TOURS_BACKGROUNDS.length);
        }, HERO_SLIDE_INTERVAL_MS);
      }
    };
    const stop = () => {
      window.clearInterval(interval);
      interval = 0;
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    if (!document.hidden) {
      start();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [prefersReducedMotion]);

  const filteredAdventures = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query.trim());

    return allAdventures.filter((adventure) => {
      const isDomestic = adventure.country === "Mongolia";
      const isCorporate = isCorporateAdventure(adventure);
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
        !normalizedQuery ||
        getAdventureSearchText(adventure).includes(normalizedQuery);

      return matchesPageMode && matchesScope && matchesQuery;
    });
  }, [allAdventures, pageMode, query, scope]);

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
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <section id="adventures" className="bg-background">
      <Suspense fallback={null}>
        <TourSearchParamsSync onSearch={setQuery} onScope={setScope} />
      </Suspense>

      <div className="relative flex min-h-svh flex-col justify-center bg-primary text-white">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          {TOURS_BACKGROUNDS.map((image, index) =>
            prefersReducedMotion && index > 0 ? null : (
              <motion.div
                key={image}
                initial={false}
                animate={{ opacity: visibleHeroImage === index ? 1 : 0 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
                className="absolute inset-0 scale-105"
              >
                <Image
                  src={getHighResolutionImageUrl(image)}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  quality={90}
                  className="object-cover object-center"
                />
              </motion.div>
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-primary/82" />
          <div className="absolute inset-0 bg-primary/10" />
        </div>

        <Container className="relative z-30 pb-16 pt-32 lg:pt-36">
          <SectionHeading
            as="h1"
            align="center"
            tone="dark"
            title={heroTitle}
            description={heroBody}
            className="[&_h1]:drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]"
          />

          <form
            id="tour-search"
            role="search"
            aria-label={sectionCopy.searchLabel}
            onSubmit={handleTripSearchSubmit}
            className="relative mx-auto mt-10 max-w-3xl scroll-mt-32"
          >
            <div className="grid border border-white/40 bg-black/25 shadow-floating backdrop-blur-sm transition-colors focus-within:border-white/80 sm:grid-cols-[1fr_auto]">
              <div className="flex min-h-[60px] items-center gap-3 border-b border-white/24 px-5 py-3 sm:border-b-0 sm:border-r">
                <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-white/80" />
                <label htmlFor="trip-where-search" className="sr-only">
                  {sectionCopy.searchLabel}
                </label>
                <input
                  id="trip-where-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={sectionCopy.searchPlaceholder}
                  className="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-sm text-white shadow-none outline-none placeholder:text-white/70 selection:bg-white/20 focus:ring-0 lg:text-lg"
                />
              </div>

              <div className="flex items-center p-2.5">
                <Button type="submit" variant="outline-light" className="w-full sm:w-auto">
                  {sectionCopy.searchSubmit}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </Container>
      </div>

      <div ref={gallerySectionRef} id="all" className="scroll-mt-24 bg-white">
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
              adventures={group.adventures}
              locale={contentLocale}
              copy={sectionCopy}
              dayLabel={t.featured.days}
              detailsLabel={t.featured.details}
            />
          ))
        ) : (
          <Container className="py-12">
            <div
              role="status"
              className="border border-border bg-card p-8 text-center text-muted-foreground"
            >
              {t.featured.noResults}
            </div>
          </Container>
        )}
      </div>

      {pageMode !== "domestic" ? <StaysAndVillasSection stays={stays} /> : null}

      {beforeList}
    </section>
  );
}
