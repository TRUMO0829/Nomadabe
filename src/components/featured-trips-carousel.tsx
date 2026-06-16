"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { AdventureModal } from "./adventure-modal";
import { useLanguage } from "./language-provider";

const COPY = {
  mn: {
    eyebrow: "Онцлох аяллууд",
    title: "Онцлох аяллууд",
    body:
      "Хамгийн их сонирхол татдаг бизнес, expo, амралт болон захиалгат аяллын багцууд.",
    priceFrom: "Эхлэх үнэ",
    quote: "Сонирхох",
    details: "Дэлгэрэнгүй",
    day: "хоног",
    mapLabel: "MONGOLIA HUB",
    arrival: "Нислэг буулаа",
    routeTitle: "Сонгосон чиглэлүүд",
    routeBody:
      "Онгоц газрын зураг дээр буусны дараа манай хамгийн эрэлттэй аяллуудын маршрут, зураг, дэлгэрэнгүй мэдээлэл эндээс гарч ирнэ.",
  },
  en: {
    eyebrow: "Featured trips",
    title: "Featured trips",
    body: "Popular business, expo, leisure, and custom travel packages.",
    priceFrom: "From",
    quote: "Request quote",
    details: "Details",
    day: "days",
    mapLabel: "MONGOLIA HUB",
    arrival: "Arrival sequence complete",
    routeTitle: "Selected routes",
    routeBody:
      "Once the aircraft lands on the map, our most requested travel routes open with visuals and detailed trip info.",
  },
  zh: {
    eyebrow: "精选旅行",
    title: "精选旅行",
    body: "热门商务、展会、休闲和定制旅行套餐。",
    priceFrom: "起价",
    quote: "获取报价",
    details: "详情",
    day: "天",
    mapLabel: "MONGOLIA HUB",
    arrival: "航线已降落",
    routeTitle: "精选路线",
    routeBody: "飞机降落到地图后，热门路线、图片和详细信息将在此展开。",
  },
  ja: {
    eyebrow: "注目ツアー",
    title: "注目ツアー",
    body: "人気のビジネス、展示会、レジャー、カスタム旅行プラン。",
    priceFrom: "開始料金",
    quote: "見積もり依頼",
    details: "詳細",
    day: "日",
    mapLabel: "MONGOLIA HUB",
    arrival: "フライト到着",
    routeTitle: "選ばれたルート",
    routeBody:
      "飛行機が地図に着地すると、人気の旅行ルート、写真、詳細情報がここに現れます。",
  },
  ko: {
    eyebrow: "추천 여행",
    title: "추천 여행",
    body: "인기 비즈니스, 엑스포, 휴양, 맞춤 여행 패키지.",
    priceFrom: "시작가",
    quote: "견적 요청",
    details: "자세히",
    day: "일",
    mapLabel: "MONGOLIA HUB",
    arrival: "착륙 완료",
    routeTitle: "선택된 노선",
    routeBody:
      "비행기가 지도 위에 착륙하면 가장 인기 있는 여행 노선과 이미지, 상세 정보가 옆에서 열립니다.",
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

function clampIndex(value: number, length: number) {
  return Math.min(Math.max(value, 0), Math.max(length - 1, 0));
}

function FeaturedTripsCompact({
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
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-2xl lg:mb-12">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground lg:text-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {copy.eyebrow}
          </p>
          <h2 className="font-display text-3xl text-balance sm:text-4xl lg:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {copy.body}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {featuredTrips.map((adventure, idx) => {
            const text = getAdventureText(adventure, contentLocale);
            const price =
              adventure.price > 0
                ? `${adventure.price.toLocaleString()} ${adventure.currency}`
                : null;

            return (
              <motion.article
                key={adventure.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.05 }}
                className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-accent hover:shadow-xl lg:grid lg:grid-cols-[240px_1fr]"
              >
                <div className="relative min-h-[240px] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${adventure.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  {price ? (
                    <div className="absolute left-4 top-4 rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">
                      {price}
                    </div>
                  ) : null}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 text-xs font-semibold text-white">
                    <span className="flex items-center gap-1 rounded-md bg-black/35 px-2.5 py-1 backdrop-blur">
                      <MapPin className="h-3.5 w-3.5" />
                      {text.location}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-black/35 px-2.5 py-1 backdrop-blur">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {adventure.days} {copy.day}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col p-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    {adventure.rating} ({adventure.reviews})
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-tight text-balance">
                    {text.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {text.summary}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <Link
                      href={`/plan?trip=${encodeURIComponent(adventure.slug)}&title=${encodeURIComponent(text.title)}`}
                      className="inline-flex w-fit rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground transition-colors hover:bg-secondary"
                    >
                      {copy.quote}
                    </Link>
                    <button
                      type="button"
                      onClick={() => onSelect(adventure)}
                      className="inline-flex w-fit rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {copy.details}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedTripsEditorial({
  copy,
  featuredTrips,
  onSelect,
}: {
  copy: (typeof COPY)[keyof typeof COPY];
  featuredTrips: Adventure[];
  onSelect: (adventure: Adventure) => void;
}) {
  const { contentLocale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (featuredTrips.length <= 1) {
        setActiveIndex(0);
        return;
      }

      if (value < 0.68) {
        setActiveIndex(0);
        return;
      }

      const localProgress = (value - 0.68) / 0.32;
      const nextIndex = clampIndex(
        Math.floor(localProgress * featuredTrips.length),
        featuredTrips.length,
      );

      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    });

    return () => unsubscribe();
  }, [featuredTrips.length, scrollYProgress]);

  const activeAdventure = featuredTrips[activeIndex] ?? featuredTrips[0];
  const activeText = getAdventureText(activeAdventure, contentLocale);
  const activePrice =
    activeAdventure.price > 0
      ? `${activeAdventure.price.toLocaleString()} ${activeAdventure.currency}`
      : null;

  const planeX = useTransform(
    scrollYProgress,
    [0, 0.16, 0.34, 0.54],
    ["-12vw", "7vw", "22vw", "33vw"],
  );
  const planeY = useTransform(
    scrollYProgress,
    [0, 0.16, 0.34, 0.54],
    ["5vh", "13vh", "26vh", "43vh"],
  );
  const planeScale = useTransform(scrollYProgress, [0, 0.24, 0.54], [1.06, 0.92, 0.26]);
  const planeRotate = useTransform(scrollYProgress, [0, 0.22, 0.44, 0.54], [-18, -10, -4, 8]);
  const planeOpacity = useTransform(scrollYProgress, [0, 0.5, 0.58, 0.64], [1, 1, 0.5, 0]);
  const trailOpacity = useTransform(scrollYProgress, [0, 0.42, 0.58], [0.72, 0.48, 0]);
  const mapScale = useTransform(scrollYProgress, [0.12, 0.54], [0.96, 1]);
  const mapGlow = useTransform(scrollYProgress, [0.42, 0.58], [0.15, 0.42]);
  const arrivalOpacity = useTransform(scrollYProgress, [0.48, 0.66], [0, 1]);
  const arrivalScale = useTransform(scrollYProgress, [0.5, 0.68], [0.72, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.54, 0.72], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.54, 0.72], [60, 0]);

  return (
    <section
      id="trips"
      ref={sectionRef}
      className="relative bg-[#0b0a07] text-[#fff8ea]"
      style={{ height: "calc(220svh / var(--site-scale))" }}
    >
      <div className="sticky top-0 h-[calc(100svh/var(--site-scale))] overflow-hidden bg-[#0b0a07]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(216,187,114,0.18),transparent_24%),radial-gradient(circle_at_76%_32%,rgba(255,248,234,0.08),transparent_28%),linear-gradient(180deg,#0b0a07_0%,#12110d_52%,#0b0a07_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,248,234,0.85)_1px,transparent_0)] [background-size:20px_20px]" />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-30 h-[92px] w-[220px] sm:h-[110px] sm:w-[270px] lg:h-[140px] lg:w-[340px]"
          style={{ opacity: planeOpacity, x: planeX, y: planeY }}
        >
          <motion.div
            className="relative h-full w-full [transform-style:preserve-3d]"
            style={{ rotate: planeRotate, scale: planeScale }}
          >
            <motion.span
              className="absolute left-8 top-1/2 h-1 w-36 -translate-x-full rounded-full bg-gradient-to-l from-white/65 via-white/18 to-transparent blur-[1px] sm:w-44 lg:w-52"
              style={{ opacity: trailOpacity }}
            />
            <motion.span
              className="absolute left-10 top-[58%] h-10 w-24 -translate-x-1/2 rounded-full bg-[#d8bb72]/30 blur-3xl"
              style={{ opacity: trailOpacity }}
            />
            <Image
              src="/airplanes/plane-diagonal-down.webp"
              alt=""
              fill
              sizes="(max-width: 640px) 220px, (max-width: 1024px) 270px, 340px"
              className="object-contain drop-shadow-[0_26px_32px_rgba(0,0,0,0.42)]"
              priority
            />
          </motion.div>
        </motion.div>

        <div className="relative z-10 grid h-full items-center gap-8 px-6 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 xl:px-14">
          <motion.div style={{ scale: mapScale }} className="relative h-full min-h-[320px]">
            <div className="relative h-full overflow-hidden rounded-[30px] border border-[#d8bb72]/22 bg-[#f6f1e4] shadow-[0_32px_90px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(126,185,255,0.45),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(121,179,255,0.22),transparent_18%),linear-gradient(180deg,#f9f5ea_0%,#ebe4d4_100%)]" />
              <div className="absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(180deg,rgba(141,205,255,0.92),rgba(255,255,255,0))]" />
              <div className="absolute inset-y-[16%] left-[14%] right-[10%] rounded-[36px] border border-[#d2c6ad]/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(243,237,223,0.88))]" />
              <div className="absolute inset-y-[16%] left-[14%] right-[10%] opacity-40 [background-image:linear-gradient(rgba(139,164,192,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(139,164,192,0.25)_1px,transparent_1px)] [background-size:64px_64px]" />
              <div className="absolute left-[16%] top-[19%] h-24 w-24 rounded-full border border-[#6ea6de]/60 bg-[#dbeeff]/55" />
              <div className="absolute left-[66%] top-[24%] h-12 w-12 rounded-full border border-[#6ea6de]/55 bg-[#dbeeff]/45" />
              <div className="absolute bottom-[15%] right-[11%] h-40 w-40 rounded-full bg-[#cfe7ff]/58 blur-[2px]" />
              <div className="absolute left-[24%] top-[42%] h-[24%] w-[46%] rounded-[44%_52%_48%_46%] bg-[#f28f2d] shadow-[0_22px_28px_rgba(191,94,12,0.28)]" />
              <div className="absolute left-[30%] top-[48%] text-[clamp(1.1rem,2vw,1.75rem)] font-black uppercase tracking-[0.18em] text-[#17130d]">
                Mongolia
              </div>
              <div className="absolute left-[26%] top-[34%] rounded-full border border-[#efb35b]/55 bg-white/72 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-[#7e5a1b] shadow-sm">
                {copy.mapLabel}
              </div>

              <motion.div
                className="absolute left-[47%] top-[58%] z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7ad45] shadow-[0_0_0_10px_rgba(247,173,69,0.16),0_0_0_20px_rgba(247,173,69,0.08)]"
                style={{ opacity: mapGlow }}
              />

              <motion.div
                className="absolute bottom-[8%] left-[8%] z-20 w-[min(74%,420px)] overflow-hidden rounded-[26px] border border-[#d8bb72]/24 bg-[#11100b] shadow-[0_20px_50px_rgba(0,0,0,0.26)]"
                style={{ opacity: arrivalOpacity, scale: arrivalScale, originX: 0.2, originY: 0.8 }}
              >
                <div className="relative aspect-[4/2.65]">
                  <Image
                    src={activeAdventure.image}
                    alt={activeText.title}
                    fill
                    sizes="(max-width: 1024px) 70vw, 420px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/18 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex rounded-full bg-[#f0d57a] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#11100b]">
                    {copy.arrival}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f0d57a]">
                      {copy.eyebrow}
                    </p>
                    <p className="mt-2 text-xl font-semibold leading-tight text-[#fff8ea]">
                      {activeText.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="relative flex h-full items-center"
          >
            <div className="w-full rounded-[30px] border border-white/8 bg-white/[0.03] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-6 lg:p-8">
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#d8bb72]">
                {copy.routeTitle}
              </p>
              <h2 className="mt-3 max-w-[14ch] text-balance font-display text-3xl uppercase leading-[0.92] text-[#fff8ea] sm:text-4xl lg:text-5xl">
                {activeText.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#fff8ea]/68 sm:text-base">
                {activeText.summary || copy.routeBody}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#15130f]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={activeAdventure.image}
                      alt={activeText.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 380px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-transparent" />
                    {activePrice ? (
                      <div className="absolute left-4 top-4 rounded-full bg-[#f0d57a] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#11100b]">
                        {activePrice}
                      </div>
                    ) : null}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 text-xs font-semibold text-white">
                      <span className="flex items-center gap-1 rounded-full bg-black/45 px-3 py-2 backdrop-blur">
                        <MapPin className="h-3.5 w-3.5 text-[#f0d57a]" />
                        {activeText.location}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-black/45 px-3 py-2 backdrop-blur">
                        <CalendarDays className="h-3.5 w-3.5 text-[#f0d57a]" />
                        {activeAdventure.days} {copy.day}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-black/45 px-3 py-2 backdrop-blur">
                        <Star className="h-3.5 w-3.5 fill-[#f0d57a] text-[#f0d57a]" />
                        {activeAdventure.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-[22px] border border-white/10 bg-[#15130f] p-5">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#d8bb72]">
                      {copy.eyebrow}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#fff8ea]/72">
                      {copy.routeBody}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/plan?trip=${encodeURIComponent(activeAdventure.slug)}&title=${encodeURIComponent(activeText.title)}`}
                      className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f0d57a] px-5 text-[11px] font-black uppercase tracking-[0.18em] text-[#11100b] transition-colors hover:bg-[#fff8ea]"
                    >
                      {copy.quote}
                    </Link>
                    <button
                      type="button"
                      onClick={() => onSelect(activeAdventure)}
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#f0d57a]/50 px-5 text-[11px] font-black uppercase tracking-[0.18em] text-[#f0d57a] transition-colors hover:bg-[#f0d57a] hover:text-[#11100b]"
                    >
                      {copy.details}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {featuredTrips.map((adventure, index) => {
                  const text = getAdventureText(adventure, contentLocale);
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={adventure.id}
                      type="button"
                      onClick={() => onSelect(adventure)}
                      className={`group overflow-hidden rounded-[20px] border text-left transition-all ${
                        isActive
                          ? "border-[#f0d57a]/60 bg-[#f0d57a]/8 shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={adventure.image}
                          alt={text.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 240px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d8bb72]">
                            {String(index + 1).padStart(2, "0")}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm font-semibold text-[#fff8ea]">
                            {text.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
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
  const featuredTrips = uniqueBySlug([
    ...adventures.filter((adventure) => adventure.featured),
    ...ADVENTURES.filter((adventure) => adventure.featured),
  ]).slice(0, 3);

  if (featuredTrips.length === 0) {
    return null;
  }

  return (
    <>
      {variant === "compact" ? (
        <FeaturedTripsCompact
          copy={copy}
          featuredTrips={featuredTrips}
          onSelect={setSelected}
        />
      ) : (
        <FeaturedTripsEditorial
          copy={copy}
          featuredTrips={featuredTrips}
          onSelect={setSelected}
        />
      )}
      <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
    </>
  );
}
