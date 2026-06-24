"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
};

type DomesticTripCardProps = {
  adventure: Adventure;
  copy: DomesticCopy;
  onSelect: (adventure: Adventure) => void;
};

const PANEL_GAP_VW = 0;
const PANEL_SCROLL_VH_PER_CARD = 180;
const PANEL_END_BUFFER_VH = 280;
const PANEL_FULLY_VISIBLE_HOLD_VH = 180;

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
    <motion.article className="relative grid h-[calc(100svh/var(--site-scale))] w-[calc(100vw/var(--site-scale))] shrink-0 overflow-hidden bg-white lg:grid-cols-2">
      <div className="group relative min-h-[48svh] overflow-hidden bg-[#11100b] lg:min-h-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[2600ms] ease-out group-hover:scale-[1.025]"
          style={{ backgroundImage: `url(${adventure.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-black/12" />
        {price ? (
          <div className="trip-meta-text absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs text-[#11100b] shadow-[0_18px_40px_rgba(0,0,0,0.18)] lg:left-8 lg:top-8">
            {price}
          </div>
        ) : null}
      </div>

      <div className="flex h-full min-w-0 items-center bg-white px-6 py-10 text-[#11100b] sm:px-10 lg:px-[clamp(3rem,5vw,6rem)]">
        <div className="min-w-0 max-w-[min(34rem,calc(50vw-7rem))]">
          <h3 className="trip-header-title trip-header-title--hero domestic-trip-title max-w-[14ch] text-balance text-[#11100b]">
            {text.title}
          </h3>
          <p className="trip-copy-text mt-5 max-w-full text-sm leading-7 text-[#11100b] sm:text-base lg:text-lg">
            {text.summary}
          </p>

          <button
            type="button"
            onClick={() => onSelect(adventure)}
            className="trip-meta-text mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-accent bg-accent px-7 text-sm uppercase text-accent-foreground transition-colors hover:bg-white hover:text-[#11100b]"
          >
            {copy.details}
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
  const maxDesktopShiftVw =
    Math.max(0, domesticOptions.length - 1) * (100 + PANEL_GAP_VW);
  const desktopScrollDistanceVh = Math.max(
    1,
    domesticOptions.length * PANEL_SCROLL_VH_PER_CARD + PANEL_END_BUFFER_VH - 100
  );
  const desktopTrackSettleProgress = Math.max(
    0.5,
    Math.min(0.9, 1 - PANEL_FULLY_VISIBLE_HOLD_VH / desktopScrollDistanceVh)
  );
  const desktopTrackX = useTransform(
    scrollYProgress,
    [0, desktopTrackSettleProgress, 1],
    [
      "calc(0vw / var(--site-scale))",
      `calc(${-maxDesktopShiftVw}vw / var(--site-scale))`,
      `calc(${-maxDesktopShiftVw}vw / var(--site-scale))`,
    ],
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
