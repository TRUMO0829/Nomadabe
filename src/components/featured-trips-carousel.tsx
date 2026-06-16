"use client";

import Link from "next/link";
import { Fragment, forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import BlurTextAnimation from "@/components/ui/blur-text-animation";
import ParticleText from "@/components/ui/particle-text-canvas";
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
    next: "Дараагийн аялал",
  },
  en: {
    eyebrow: "Featured trips",
    title: "Featured trips",
    body:
      "Popular business, expo, leisure, and custom travel packages.",
    priceFrom: "From",
    quote: "Request quote",
    details: "Details",
    day: "days",
    next: "Next route",
  },
  zh: {
    eyebrow: "精选旅行",
    title: "精选旅行",
    body: "热门商务、展会、休闲和定制旅行套餐。",
    priceFrom: "起价",
    quote: "获取报价",
    details: "详情",
    day: "天",
    next: "下一条路线",
  },
  ja: {
    eyebrow: "注目ツアー",
    title: "注目ツアー",
    body: "人気ビジネス、展示会、レジャー、カスタム旅行プラン。",
    priceFrom: "開始料金",
    quote: "見積もり依頼",
    details: "詳細",
    day: "日",
    next: "次のルート",
  },
  ko: {
    eyebrow: "추천 여행",
    title: "추천 여행",
    body: "인기 비즈니스, 엑스포, 휴양, 맞춤 여행 패키지.",
    priceFrom: "시작가",
    quote: "견적 요청",
    details: "자세히",
    day: "일",
    next: "다음 루트",
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

export function FeaturedTripsCarousel({
  adventures = ADVENTURES,
  variant = "editorial",
}: FeaturedTripsCarouselProps) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale];
  const featuredTrips = uniqueBySlug([
    ...adventures.filter((adventure) => adventure.featured),
    ...ADVENTURES.filter((adventure) => adventure.featured),
  ]).slice(0, 4);
  const [selected, setSelected] = useState<Adventure | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const flowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateActiveIndex() {
      const flow = flowRef.current;

      if (!flow || featuredTrips.length < 2) {
        setActiveIndex(0);
        return;
      }

      const rect = flow.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollable = Math.max(rect.height - viewportHeight, 1);
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      const nextIndex = Math.min(
        featuredTrips.length - 1,
        Math.round(progress * (featuredTrips.length - 1)),
      );

      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    }

    updateActiveIndex();
    window.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      window.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [featuredTrips.length]);

  if (featuredTrips.length === 0) {
    return null;
  }

  if (variant === "compact") {
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
                    <div className="mt-auto flex flex-wrap gap-2">
                      <Link
                        href={`/plan?trip=${encodeURIComponent(adventure.slug)}&title=${encodeURIComponent(text.title)}`}
                        className="inline-flex w-fit rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground transition-colors hover:bg-secondary"
                      >
                        {copy.quote}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setSelected(adventure)}
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
        <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
      </section>
    );
  }

  return (
    <section id="trips" className="relative bg-[#11100b] text-[#fff8ea]">
      <article className="sticky top-0 h-[100svh] overflow-hidden bg-[#11100b]">
        <div className="absolute inset-0 bg-[#11100b]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(216,187,114,0.12),transparent_30%),linear-gradient(120deg,rgba(255,248,234,0.05),transparent_45%)]" />
        <div className="relative z-10 flex h-full flex-col px-6 py-8 lg:px-10 lg:py-10">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.22em] text-[#fff8ea]/62">
            <span>Travel</span>
            <span>{String(featuredTrips.length).padStart(2, "0")} routes</span>
          </div>

          <div className="flex flex-1 items-center justify-center text-center">
            <div className="mx-auto w-full max-w-6xl" data-featured-title-zone>
              <ParticleText
                text={copy.title}
                className="mx-auto h-[170px] w-full max-w-6xl sm:h-[230px] lg:h-[285px]"
                colors={["#fff8ea", "#d8bb72", "#fff1c4"]}
                particleGap={4}
                particleSize={1.35}
              />
            </div>
          </div>
        </div>
      </article>

      <FeaturedTripsFlow
        ref={flowRef}
        activeIndex={activeIndex}
        copy={copy}
        contentLocale={contentLocale}
        featuredTrips={featuredTrips}
        onSelect={setSelected}
      />

      <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

type FeaturedTripsFlowProps = {
  activeIndex: number;
  copy: (typeof COPY)[keyof typeof COPY];
  contentLocale: keyof typeof COPY;
  featuredTrips: Adventure[];
  onSelect: (adventure: Adventure) => void;
};

const NIGHT_STARS = Array.from({ length: 42 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  opacity: 0.34 + ((index * 13) % 55) / 100,
  size: index % 7 === 0 ? 3 : index % 3 === 0 ? 2 : 1,
  top: `${(index * 19) % 76}%`,
}));

function NightFlightSlide({ slideHeight }: { slideHeight: string }) {
  return (
    <div
      className="relative w-full overflow-hidden bg-[#05070d]"
      style={{ height: slideHeight }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_24%,rgba(255,238,186,0.24),transparent_7%),radial-gradient(circle_at_50%_70%,rgba(216,187,114,0.1),transparent_22%),linear-gradient(180deg,#05070d_0%,#11172a_58%,#05070d_100%)]" />
      <div className="absolute inset-0 opacity-80">
        {NIGHT_STARS.map((star, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-[#fff8ea]"
            style={{
              height: star.size,
              left: star.left,
              opacity: star.opacity,
              top: star.top,
              width: star.size,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-[#06070d]/86 to-transparent" />
      <div className="absolute bottom-10 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#d8bb72]/42 to-transparent" />
    </div>
  );
}

const FeaturedTripsFlow = forwardRef<HTMLDivElement, FeaturedTripsFlowProps>(
  function FeaturedTripsFlow(
    { activeIndex, copy, contentLocale, featuredTrips, onSelect },
    ref,
  ) {
    const activeAdventure = featuredTrips[activeIndex] ?? featuredTrips[0];
    const activeText = getAdventureText(activeAdventure, contentLocale);
    const activePrice =
      activeAdventure.price > 0
        ? `${activeAdventure.price.toLocaleString()} ${activeAdventure.currency}`
        : null;
    const imageOnLeft = activeIndex < 2;
    const imageOrderClass = imageOnLeft ? "lg:order-1" : "lg:order-2";
    const textOrderClass = imageOnLeft ? "lg:order-2" : "lg:order-1";
    const dividerClass = imageOnLeft ? "left-0" : "right-0";
    const hasNightTransition = featuredTrips.length > 1;
    const visualSlideCount = featuredTrips.length + (hasNightTransition ? 1 : 0);
    const visualIndex = hasNightTransition && activeIndex > 0
      ? activeIndex + 1
      : activeIndex;
    const visualSlideHeight = `${100 / visualSlideCount}%`;

    return (
      <div
        ref={ref}
        data-featured-flow
        className="relative bg-[#11100b]"
        style={{ height: `${featuredTrips.length * 100}svh` }}
      >
        <article className="sticky top-0 grid h-[100svh] min-h-screen w-full grid-rows-[50svh_50svh] overflow-hidden bg-[#11100b] lg:grid-cols-2 lg:grid-rows-none">
          <div
            data-featured-plane-zone
            className={`relative h-full overflow-hidden bg-[#1c1911] ${imageOrderClass}`}
          >
            <motion.div
              className="absolute inset-x-0 top-0"
              style={{ height: `${visualSlideCount * 100}%` }}
              animate={{
                y: `-${(visualIndex * 100) / visualSlideCount}%`,
              }}
              transition={{
                duration: 1.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {featuredTrips.map((adventure, idx) => {
                const text = getAdventureText(adventure, contentLocale);

                return (
                  <Fragment key={adventure.id}>
                    <div
                      className="relative w-full overflow-hidden"
                      style={{ height: visualSlideHeight }}
                    >
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${adventure.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#11100b]/46 via-transparent to-[#11100b]/14" />
                      <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#fff8ea]/74 lg:bottom-8 lg:left-8 lg:right-8">
                        <span className="text-[#d8bb72]">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px flex-1 bg-[#fff8ea]/26" />
                        <span>{text.location}</span>
                      </div>
                    </div>
                    {idx === 0 && hasNightTransition ? (
                      <NightFlightSlide slideHeight={visualSlideHeight} />
                    ) : null}
                  </Fragment>
                );
              })}
            </motion.div>
          </div>

          <div
            className={`relative flex h-full items-center overflow-hidden bg-[#11100b] px-6 py-8 lg:px-12 xl:px-16 ${textOrderClass}`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(216,187,114,0.13),transparent_30%)]" />
            <div
              className={`pointer-events-none absolute inset-y-10 hidden w-px bg-[#fff8ea]/12 lg:block ${dividerClass}`}
            />
            <div className="relative z-40 flex max-h-[92svh] w-full max-w-xl flex-col overflow-y-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="mb-5 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.24em] text-[#fff8ea]/42">
                <span className="text-[#d8bb72]">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-12 bg-[#d8bb72]" />
                <span>{String(featuredTrips.length).padStart(2, "0")}</span>
              </div>
              <BlurTextAnimation
                key={`title-${activeAdventure.id}`}
                text={activeText.title}
                active
                compact
                loop={false}
                className="font-display text-4xl font-normal uppercase leading-[0.94] tracking-normal text-balance text-[#fff8ea] sm:text-5xl xl:text-6xl"
                fontSize="text-4xl sm:text-5xl xl:text-6xl"
                fontFamily="font-display"
                textColor="text-[#fff8ea]"
              />
              <BlurTextAnimation
                key={`summary-${activeAdventure.id}`}
                text={activeText.summary}
                active
                compact
                loop={false}
                className="mt-5 max-w-lg text-sm font-medium leading-7 text-[#fff8ea]/68 sm:text-base"
                fontSize="text-sm sm:text-base"
                fontFamily="font-sans"
                textColor="text-[#fff8ea]/68"
              />

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-[#fff8ea]">
                <span className="inline-flex items-center gap-1.5 border border-[#fff8ea]/16 bg-[#fff8ea]/7 px-3.5 py-2.5">
                  <MapPin className="h-4 w-4 text-[#d8bb72]" />
                  {activeText.location}
                </span>
                <span className="inline-flex items-center gap-1.5 border border-[#fff8ea]/16 bg-[#fff8ea]/7 px-3.5 py-2.5">
                  <CalendarDays className="h-4 w-4 text-[#d8bb72]" />
                  {activeAdventure.days} {copy.day}
                </span>
                <span className="inline-flex items-center gap-1.5 border border-[#fff8ea]/16 bg-[#fff8ea]/7 px-3.5 py-2.5">
                  <Star className="h-4 w-4 fill-[#d8bb72] text-[#d8bb72]" />
                  {activeAdventure.rating}
                </span>
                {activePrice ? (
                  <span className="bg-[#d8bb72] px-3.5 py-2.5 text-[#11100b]">
                    {activePrice}
                  </span>
                ) : null}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/plan?trip=${encodeURIComponent(activeAdventure.slug)}&title=${encodeURIComponent(activeText.title)}`}
                  className="inline-flex min-h-12 items-center justify-center bg-[#d8bb72] px-5 text-[11px] font-black uppercase tracking-[0.18em] text-[#11100b] transition-colors hover:bg-[#fff8ea]"
                >
                  {copy.quote}
                </Link>
                <button
                  type="button"
                  onClick={() => onSelect(activeAdventure)}
                  className="inline-flex min-h-12 items-center justify-center border border-[#d8bb72]/50 px-5 text-[11px] font-black uppercase tracking-[0.18em] text-[#d8bb72] transition-colors hover:bg-[#d8bb72] hover:text-[#11100b]"
                >
                  {copy.details}
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  },
);
