"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { getHighResolutionImageUrl } from "@/lib/image-quality";
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
  const image = getHighResolutionImageUrl(adventure.image);
  const price =
    adventure.price > 0
      ? `${adventure.price.toLocaleString()} ${adventure.currency}`
      : null;
  const indexLabel = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  return (
    <motion.article className="group relative h-[calc(100svh/var(--site-scale))] w-[calc(100vw/var(--site-scale))] shrink-0 overflow-hidden bg-[#11100b]">
      {/* full-bleed image */}
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-[3200ms] ease-out group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />
      {/* cinematic gradients — darken bottom + left for text legibility,
          keep the top + right of the image bright so it shines */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/15 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />

      {/* index watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-2 select-none text-[clamp(6rem,15vw,15rem)] font-semibold leading-none text-white/10 lg:right-14"
      >
        {indexLabel}
      </span>

      {/* price pill */}
      {price ? (
        <div className="trip-meta-text absolute right-6 top-8 rounded-full bg-white/95 px-4 py-2 text-xs text-[#11100b] shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur lg:right-14 lg:top-14">
          {price}
        </div>
      ) : null}

      {/* content overlaid bottom-left */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-12 pt-24 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
        <div className="max-w-2xl text-white">
          <div className="trip-meta-text flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/75">
            <span className="text-accent">{indexLabel}</span>
            <span className="h-px w-8 bg-white/40" />
            <span>{text.country}</span>
            <span className="text-white/40">/ {totalLabel}</span>
          </div>

          <h3
            className="mt-5 max-w-[18ch] text-balance text-[clamp(2.2rem,4.4vw,4.25rem)] leading-[1.04] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]"
            style={{ textTransform: "none" }}
          >
            {text.title}
          </h3>

          {/* glass meta chips */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="trip-meta-text inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs text-white backdrop-blur">
              <CalendarDays className="h-3.5 w-3.5 text-accent" />
              {adventure.days} {copy.day}
            </span>
            {text.location ? (
              <span className="trip-meta-text inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs text-white backdrop-blur">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {text.location}
              </span>
            ) : null}
          </div>

          <p className="trip-copy-text mt-6 max-w-xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg lg:leading-8">
            {text.summary}
          </p>

          <button
            type="button"
            onClick={() => onSelect(adventure)}
            className="group/btn mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm text-accent-foreground transition-all duration-200 hover:gap-3 hover:shadow-[0_12px_32px_rgba(255,212,0,0.5)]"
            style={{ textTransform: "none" }}
          >
            {copy.details}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </button>
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
