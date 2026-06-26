"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { AdventureModal } from "./adventure-modal";
import { useLanguage } from "./language-provider";
import { TravelSectionIntro } from "./travel-section-intro";

const COPY = {
  mn: {
    eyebrow: "Дотоод чиглэлийн аяллууд",
    title: "Монгол орноор аялах сонголтууд",
    body:
      "Говь, нуур, уулсын чиглэлүүдийг гэр бүл, найз нөхөд, хамт олонд зориулан илүү тайван хэмнэлээр сонгоорой.",
    priceFrom: "Эхлэх үнэ",
    details: "Дэлгэрэнгүй",
    day: "хоног",
    route: "Чиглэл",
  },
  en: {
    eyebrow: "Domestic trips",
    title: "Ways to travel Mongolia",
    body:
      "Choose calm, scenic routes across the Gobi, lakes, and mountains for family, friends, and teams.",
    priceFrom: "From",
    details: "Details",
    day: "days",
    route: "Route",
  },
  zh: {
    eyebrow: "蒙古国内旅行",
    title: "探索蒙古的旅行选择",
    body: "为家人、朋友和团队选择戈壁、湖泊与山地线路。",
    priceFrom: "起价",
    details: "详情",
    day: "天",
    route: "路线",
  },
  ja: {
    eyebrow: "国内ツアー",
    title: "モンゴルを旅する選択肢",
    body: "家族、友人、チーム向けにゴビ、湖、山岳ルートを選べます。",
    priceFrom: "開始料金",
    details: "詳細",
    day: "日",
    route: "ルート",
  },
  ko: {
    eyebrow: "몽골 국내 여행",
    title: "몽골을 여행하는 방법",
    body: "가족, 친구, 팀을 위한 고비, 호수, 산악 루트를 선택하세요.",
    priceFrom: "시작가",
    details: "자세히",
    day: "일",
    route: "루트",
  },
} as const;

type TravelOptionsCarouselProps = {
  adventures?: Adventure[];
};

type DomesticCopy = {
  eyebrow: string;
  title: string;
  body: string;
  priceFrom: string;
  details: string;
  day: string;
};

type DomesticTripCardProps = {
  adventure: Adventure;
  copy: DomesticCopy;
  onSelect: (adventure: Adventure) => void;
  index: number;
  total: number;
};

const PANEL_GAP_VW = 0;
const PANEL_SCROLL_VH_PER_CARD = 180;
const PANEL_END_BUFFER_VH = 280;
const PANEL_FULLY_VISIBLE_HOLD_RATIO = 0.42;

function getPanelXOffset(panelIndex: number) {
  if (panelIndex === 0) {
    return "calc(0vw / var(--site-scale))";
  }

  return `calc(${-panelIndex * (100 + PANEL_GAP_VW)}vw / var(--site-scale))`;
}

function buildPanelTrackStops(panelCount: number) {
  if (panelCount <= 1) {
    return {
      inputRange: [0, 1],
      outputRange: [
        "calc(0vw / var(--site-scale))",
        "calc(0vw / var(--site-scale))",
      ],
    };
  }

  const inputRange = [0];
  const outputRange = [getPanelXOffset(0)];
  const segmentSize = 1 / panelCount;

  for (let index = 0; index < panelCount; index += 1) {
    const panelOffset = getPanelXOffset(index);
    const holdEnd =
      index === panelCount - 1
        ? 1
        : index * segmentSize +
          segmentSize * PANEL_FULLY_VISIBLE_HOLD_RATIO;

    inputRange.push(holdEnd);
    outputRange.push(panelOffset);

    if (index < panelCount - 1) {
      const nextPanelStart = (index + 1) * segmentSize;

      inputRange.push(nextPanelStart);
      outputRange.push(getPanelXOffset(index + 1));
    }
  }

  return { inputRange, outputRange };
}

function DomesticTripCard({
  adventure,
  copy,
  onSelect,
  index,
  total,
}: DomesticTripCardProps) {
  const { contentLocale } = useLanguage();
  const text = getAdventureText(adventure, contentLocale);
  const price =
    adventure.price > 0
      ? `${adventure.price.toLocaleString()} ${adventure.currency}`
      : null;
  const indexLabel = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  return (
    <motion.article className="relative grid h-[calc(100svh/var(--site-scale))] w-[calc(100vw/var(--site-scale))] shrink-0 overflow-hidden bg-white lg:grid-cols-2">
      {/* image side */}
      <div className="group relative min-h-[48svh] overflow-hidden bg-[#11100b] lg:min-h-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[2600ms] ease-out group-hover:scale-[1.04]"
          style={{ backgroundImage: `url(${adventure.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/20" />

        {price ? (
          <div className="trip-meta-text absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs text-[#11100b] shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur lg:left-8 lg:top-8">
            {price}
          </div>
        ) : null}

        {/* location chip on image */}
        {text.location ? (
          <div className="trip-meta-text absolute bottom-6 left-5 inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-xs uppercase tracking-wide text-white backdrop-blur lg:left-8 lg:bottom-8">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            {text.location}
          </div>
        ) : null}
      </div>

      {/* text side */}
      <div className="relative flex h-full min-w-0 items-center bg-white px-6 py-10 text-[#11100b] sm:px-10 lg:px-[clamp(3rem,5vw,6rem)]">
        {/* big faded index watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-6 select-none text-[clamp(4rem,9vw,9rem)] font-semibold leading-none text-[#11100b]/[0.05] lg:right-10 lg:top-10"
        >
          {indexLabel}
        </span>

        <div className="relative min-w-0 max-w-[min(35rem,calc(50vw-7rem))]">
          <div className="trip-meta-text flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#11100b]/55">
            <span className="text-accent">{indexLabel}</span>
            <span className="h-px w-8 bg-[#11100b]/25" />
            <span>{text.country}</span>
          </div>

          <h3
            className="mt-5 max-w-[15ch] text-balance text-[clamp(2rem,3.15vw,3.05rem)] leading-[1.1] text-[#11100b]"
            style={{ textTransform: "none" }}
          >
            {text.title}
          </h3>

          {/* meta chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="trip-meta-text inline-flex items-center gap-1.5 rounded-full border border-[#11100b]/12 bg-[#11100b]/[0.03] px-3.5 py-1.5 text-xs text-[#11100b]/75">
              <CalendarDays className="h-3.5 w-3.5 text-accent" />
              {adventure.days} {copy.day}
            </span>
            {text.location ? (
              <span className="trip-meta-text inline-flex items-center gap-1.5 rounded-full border border-[#11100b]/12 bg-[#11100b]/[0.03] px-3.5 py-1.5 text-xs text-[#11100b]/75">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {text.location}
              </span>
            ) : null}
          </div>

          <p className="trip-copy-text mt-6 max-w-full text-sm leading-7 text-[#11100b]/72 sm:text-base lg:text-lg lg:leading-8">
            {text.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => onSelect(adventure)}
              className="group/btn inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm text-accent-foreground transition-all duration-200 hover:gap-3 hover:shadow-[0_10px_28px_rgba(255,212,0,0.45)]"
              style={{ textTransform: "none" }}
            >
              {copy.details}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </button>
            <span className="trip-meta-text text-xs uppercase tracking-[0.2em] text-[#11100b]/40">
              {indexLabel} / {totalLabel}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function TravelOptionsCarousel({
  adventures = ADVENTURES,
}: TravelOptionsCarouselProps) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale];
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<Adventure | null>(null);
  const domesticOptions = adventures
    .filter((adventure) => adventure.country === "Mongolia")
    .slice(0, 3);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const { inputRange, outputRange } = buildPanelTrackStops(
    domesticOptions.length
  );
  const desktopTrackX = useTransform(
    scrollYProgress,
    inputRange,
    outputRange,
  );

  if (domesticOptions.length === 0) {
    return null;
  }

  return (
    <>
      <TravelSectionIntro
        id="destinations"
        title={copy.eyebrow}
        titleClassName="domestic-section-title"
        variant="plain"
      />

      <section
        ref={sectionRef}
        className="relative overflow-clip bg-white text-[#11100b] max-lg:!h-auto"
        style={{
          height: `calc(${domesticOptions.length * PANEL_SCROLL_VH_PER_CARD + PANEL_END_BUFFER_VH}svh / var(--site-scale))`,
        }}
      >
        <div className="hidden h-[calc(100svh/var(--site-scale))] overflow-hidden lg:sticky lg:top-0 lg:flex">
          <div className="relative z-10 h-full w-full overflow-hidden">
            <motion.div
              style={{ x: desktopTrackX }}
              className="flex h-full w-max gap-0 pr-0 will-change-transform"
            >
              {domesticOptions.map((adventure, index) => (
                <DomesticTripCard
                  key={adventure.id}
                  adventure={adventure}
                  copy={copy}
                  onSelect={setSelected}
                  index={index}
                  total={domesticOptions.length}
                />
              ))}
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 lg:hidden">
          {domesticOptions.map((adventure, index) => (
            <DomesticTripCard
              key={adventure.id}
              adventure={adventure}
              copy={copy}
              onSelect={setSelected}
              index={index}
              total={domesticOptions.length}
            />
          ))}
        </div>

        <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
      </section>

    </>
  );
}
