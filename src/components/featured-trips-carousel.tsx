"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { AdventureModal } from "./adventure-modal";
import ParticleText from "./ui/particle-text-canvas";
import { useLanguage } from "./language-provider";

const COPY = {
  mn: {
    eyebrow: "Онцлох аяллууд",
    title: "Онцлох аяллууд",
    body:
      "Хамгийн их сонирхол татдаг бизнес, expo, амралт болон захиалгат аяллын багцууд.",
    details: "Дэлгэрэнгүй",
    day: "хоног",
  },
  en: {
    eyebrow: "Featured trips",
    title: "Featured trips",
    body: "Popular business, expo, leisure, and custom travel packages.",
    details: "Details",
    day: "days",
  },
  zh: {
    eyebrow: "精选旅行",
    title: "精选旅行",
    body: "热门商务、展会、休闲和定制旅行套餐。",
    details: "详情",
    day: "天",
  },
  ja: {
    eyebrow: "注目ツアー",
    title: "注目ツアー",
    body: "人気のビジネス、展示会、レジャー、カスタム旅行プラン。",
    details: "詳細",
    day: "日",
  },
  ko: {
    eyebrow: "추천 여행",
    title: "추천 여행",
    body: "인기 비즈니스, 엑스포, 휴양, 맞춤 여행 패키지.",
    details: "자세히",
    day: "일",
  },
} as const;

type FeaturedTripsCarouselProps = {
  adventures?: Adventure[];
  variant?: "editorial" | "compact";
};

function uniqueBySlug(trips: Adventure[]) {
  const seen = new Set<string>();

  return trips.filter((trip) => {
    if (seen.has(trip.slug)) return false;
    seen.add(trip.slug);
    return true;
  });
}

function getFeaturedTrips(adventures: Adventure[]) {
  return uniqueBySlug([
    ...adventures.filter((adventure) => adventure.featured),
    ...ADVENTURES.filter((adventure) => adventure.featured),
  ]).slice(0, 4);
}

function FeaturedTripScrollPanel({
  adventure,
  copy,
  index,
  onSelect,
}: {
  adventure: Adventure;
  copy: (typeof COPY)[keyof typeof COPY];
  index: number;
  onSelect: (adventure: Adventure) => void;
}) {
  const { contentLocale } = useLanguage();
  const panelRef = useRef<HTMLElement>(null);
  const text = getAdventureText(adventure, contentLocale);
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });
  const imageWidth = useTransform(
    scrollYProgress,
    [0.04, 0.34, 0.52, 1],
    ["38vw", "74vw", "100vw", "100vw"],
  );
  const imageHeight = useTransform(
    scrollYProgress,
    [0.04, 0.34, 0.52, 1],
    ["62vh", "86vh", "100vh", "100vh"],
  );
  const imageTop = useTransform(
    scrollYProgress,
    [0.04, 0.34, 0.52, 1],
    ["19vh", "7vh", "0vh", "0vh"],
  );
  const imageLeft = useTransform(
    scrollYProgress,
    [0.04, 0.34, 0.52, 1],
    ["5vw", "1vw", "0vw", "0vw"],
  );
  const imageScale = useTransform(scrollYProgress, [0.04, 0.52], [1, 1.08]);
  const imageRadius = useTransform(
    scrollYProgress,
    [0.04, 0.52],
    ["34px", "0px"],
  );
  const textY = useTransform(scrollYProgress, [0.18, 0.38, 1], [44, 0, 0]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0.12, 0.32, 1],
    [0, 1, 1],
  );

  return (
    <section
      ref={panelRef}
      className="relative hidden h-[calc(190svh/var(--site-scale))] bg-white lg:block"
    >
      <div className="sticky top-0 h-[calc(100svh/var(--site-scale))] overflow-hidden bg-white">
        <motion.div
          className="absolute z-0 overflow-hidden shadow-[0_36px_100px_rgba(17,16,11,0.18)]"
          style={{
            width: imageWidth,
            height: imageHeight,
            top: imageTop,
            left: imageLeft,
            borderRadius: imageRadius,
          }}
        >
          <motion.div className="relative h-full w-full" style={{ scale: imageScale }}>
            <Image
              src={adventure.image}
              alt={text.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/24 to-black/14" />
            <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-black/78 via-black/36 to-transparent" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-0 right-0 top-0 z-10 flex w-[46%] items-center justify-start px-[clamp(3rem,7vw,8rem)] text-white"
          style={{ opacity: textOpacity, y: textY }}
        >
          <div className="max-w-xl text-white drop-shadow-[0_18px_42px_rgba(0,0,0,0.58)]">
            <div className="trip-meta-text mb-6 flex flex-wrap gap-3 text-sm text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-black/24 px-4 py-2 backdrop-blur">
                <MapPin className="h-4 w-4 text-[#f0d57a]" />
                {text.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-black/24 px-4 py-2 backdrop-blur">
                <CalendarDays className="h-4 w-4 text-[#f0d57a]" />
                {adventure.days} {copy.day}
              </span>
            </div>

            <p className="trip-meta-text mb-4 text-sm uppercase tracking-[0.2em] text-[#f0d57a]">
              {contentLocale === "mn" ? "Чиглэл" : "Route"}
            </p>
            <h3 className="trip-header-title trip-header-title--hero max-w-[12ch] text-balance text-white">
              {text.title}
            </h3>
            <p className="trip-copy-text mt-5 max-w-xl text-base leading-8 text-white/82 lg:text-lg">
              {text.summary}
            </p>
            <button
              type="button"
              onClick={() => onSelect(adventure)}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-[#f0d57a] bg-[#f0d57a] px-7 text-sm uppercase text-black transition-colors hover:bg-transparent hover:text-[#f0d57a]"
            >
              {copy.details}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedTripsScrollStack({
  copy,
  featuredTrips,
  onSelect,
}: {
  copy: (typeof COPY)[keyof typeof COPY];
  featuredTrips: Adventure[];
  onSelect: (adventure: Adventure) => void;
}) {
  const { contentLocale } = useLanguage();

  return (
    <section id="trips" className="bg-white text-black">
      {featuredTrips.map((adventure, index) => (
        <FeaturedTripScrollPanel
          key={adventure.id}
          adventure={adventure}
          copy={copy}
          index={index}
          onSelect={onSelect}
        />
      ))}

      <div className="space-y-5 bg-white px-4 py-8 sm:px-6 lg:hidden">
        {featuredTrips.map((adventure) => {
          const text = getAdventureText(adventure, contentLocale);

          return (
            <article
              key={adventure.id}
              className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={adventure.image}
                  alt={text.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="trip-meta-text mb-3 flex flex-wrap gap-2 text-[10px] uppercase text-white/82">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/36 px-2.5 py-1 backdrop-blur">
                      <MapPin className="h-3.5 w-3.5" />
                      {text.location}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/36 px-2.5 py-1 backdrop-blur">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {adventure.days} {copy.day}
                    </span>
                  </div>
                  <h3 className="trip-header-title trip-header-title--compact max-w-[14ch] text-balance text-white">
                    {text.title}
                  </h3>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <p className="trip-copy-text text-sm leading-7 text-black/70">
                  {text.summary}
                </p>
                <button
                  type="button"
                  onClick={() => onSelect(adventure)}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-black bg-black px-5 text-xs uppercase text-white transition-colors hover:bg-white hover:text-black"
                >
                  {copy.details}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function FeaturedTripsCarousel({
  adventures = ADVENTURES,
  variant = "editorial",
}: FeaturedTripsCarouselProps) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale];
  const [selected, setSelected] = useState<Adventure | null>(null);
  const featuredTrips = getFeaturedTrips(adventures);

  if (featuredTrips.length === 0) {
    return null;
  }

  if (variant === "compact") {
    return (
      <>
        <FeaturedTripsScrollStack
          copy={copy}
          featuredTrips={featuredTrips}
          onSelect={setSelected}
        />
        <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
      </>
    );
  }

  return (
    <section id="trips" className="bg-white px-6 py-20 text-black lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 lg:mb-12"
        >
          <h2 className="sr-only">{copy.title}</h2>
          <ParticleText
            text={copy.title}
            colors={["#11100b", "#8f7020", "#ffd400"]}
            particleGap={3}
            particleSize={1.35}
            className="mx-auto h-[clamp(7rem,16vw,14rem)] w-full max-w-5xl"
            canvasClassName="pointer-events-auto"
          />
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredTrips.map((adventure, index) => {
            const text = getAdventureText(adventure, contentLocale);
            const price =
              adventure.price > 0
                ? `${adventure.price.toLocaleString()} ${adventure.currency}`
                : null;

            return (
              <motion.article
                key={adventure.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                onClick={() => setSelected(adventure)}
                className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-accent hover:shadow-xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={adventure.image}
                    alt={text.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
                  {price ? (
                    <div className="trip-meta-text absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] uppercase text-black">
                      {price}
                    </div>
                  ) : null}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="trip-meta-text mb-3 flex flex-wrap gap-2 text-[10px] uppercase text-white/82">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/36 px-2.5 py-1 backdrop-blur">
                        <MapPin className="h-3.5 w-3.5" />
                        {text.location}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/36 px-2.5 py-1 backdrop-blur">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {adventure.days} {copy.day}
                      </span>
                    </div>
                    <h3 className="trip-header-title trip-header-title--compact max-w-[14ch] text-balance text-white">
                      {text.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <p className="trip-copy-text line-clamp-3 text-sm leading-7 text-black/70">
                    {text.summary}
                  </p>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelected(adventure);
                    }}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-black bg-black px-5 text-xs uppercase text-white transition-colors hover:bg-white hover:text-black"
                  >
                    {copy.details}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
