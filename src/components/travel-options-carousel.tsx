"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
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
  route: string;
};

type DomesticTripCardProps = {
  adventure: Adventure;
  copy: DomesticCopy;
  onSelect: (adventure: Adventure) => void;
};

const PANEL_GAP_VW = 8;
const PANEL_END_BUFFER_VH = 26;

function DomesticTripCard({
  adventure,
  copy,
  onSelect,
}: DomesticTripCardProps) {
  const { contentLocale } = useLanguage();
  const text = getAdventureText(adventure, contentLocale);
  const price =
    adventure.price > 0
      ? `${adventure.price.toLocaleString()} ${adventure.currency}`
      : null;

  return (
    <motion.article
      className="group relative h-[calc(100svh/var(--site-scale))] w-[calc(100vw/var(--site-scale))] shrink-0 overflow-hidden bg-[#11100b]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
        style={{ backgroundImage: `url(${adventure.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/42 to-black/16" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

      {price ? (
        <div className="absolute right-6 top-24 rounded-md bg-[#ffd400] px-3 py-1.5 text-xs font-bold text-[#11100b] sm:right-10 lg:right-14 lg:top-28">
          {price}
        </div>
      ) : null}

      <div className="absolute bottom-12 left-6 right-6 max-w-3xl sm:left-10 sm:right-10 lg:bottom-14 lg:left-14">
        <div className="mb-5 flex flex-wrap gap-2 text-xs font-semibold text-[#fff8ea] lg:text-sm">
          <span className="flex items-center gap-1.5 border border-[#e4c769]/55 bg-black/25 px-3 py-2 backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-[#f0d57a]" />
            {text.location}
          </span>
          <span className="flex items-center gap-1.5 border border-[#e4c769]/55 bg-black/25 px-3 py-2 backdrop-blur">
            <CalendarDays className="h-3.5 w-3.5 text-[#f0d57a]" />
            {adventure.days} {copy.day}
          </span>
        </div>

        <h3 className="max-w-[15ch] text-3xl font-semibold uppercase leading-[1.02] text-[#fff8ea] text-balance sm:text-4xl lg:text-5xl xl:text-6xl">
          {text.title}
        </h3>
        <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-[#fff8ea]/82 sm:text-base lg:text-lg">
          {text.summary}
        </p>

        <button
          type="button"
          onClick={() => onSelect(adventure)}
          className="mt-7 inline-flex min-h-12 items-center justify-center border border-[#f0d57a] bg-[#f0d57a] px-6 text-sm font-bold uppercase text-[#11100b] transition-colors hover:bg-transparent hover:text-[#f0d57a]"
        >
          {copy.details}
        </button>
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
  const domesticOptions = adventures.filter(
    (adventure) => adventure.country === "Mongolia",
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const desktopTrackX = useTransform(
    scrollYProgress,
    (value) =>
      `calc(${
        -value * Math.max(0, domesticOptions.length - 1) * (100 + PANEL_GAP_VW)
      }vw / var(--site-scale))`,
  );

  if (domesticOptions.length === 0) {
    return null;
  }

  return (
    <>
      <TravelSectionIntro id="destinations" title={copy.eyebrow} />

      <section
        ref={sectionRef}
        className="relative overflow-clip bg-[#050505] text-[#11100b] max-lg:!h-auto"
        style={{
          height: `calc(${domesticOptions.length * 112 + PANEL_END_BUFFER_VH}svh / var(--site-scale))`,
        }}
      >
        <div className="hidden h-[calc(100svh/var(--site-scale))] overflow-hidden lg:sticky lg:top-0 lg:flex">
          <div className="relative z-10 h-full w-full overflow-hidden">
            <motion.div
              style={{ x: desktopTrackX }}
              className="flex h-full w-max gap-[calc(8vw/var(--site-scale))] pr-[calc(8vw/var(--site-scale))] will-change-transform"
            >
              {domesticOptions.map((adventure) => (
                <DomesticTripCard
                  key={adventure.id}
                  adventure={adventure}
                  copy={copy}
                  onSelect={setSelected}
                />
              ))}
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 lg:hidden">
          {domesticOptions.map((adventure) => (
            <DomesticTripCard
              key={adventure.id}
              adventure={adventure}
              copy={copy}
              onSelect={setSelected}
            />
          ))}
        </div>

        <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
      </section>
    </>
  );
}
