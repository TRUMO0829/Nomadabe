"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { useLanguage } from "./language-provider";

const COPY = {
  mn: {
    eyebrow: "Онцлох аяллууд",
    title: "Онцлох аяллууд",
    body:
      "Хамгийн их сонирхол татдаг бизнес, expo, амралт болон захиалгат аяллын 4 багц.",
    priceFrom: "Эхлэх үнэ",
    quote: "Санал авах",
    details: "Дэлгэрэнгүй",
    day: "хоног",
  },
  en: {
    eyebrow: "Featured trips",
    title: "Featured trips",
    body:
      "Four popular business, expo, leisure, and custom travel packages from Nomadabe.",
    priceFrom: "From",
    quote: "Request quote",
    details: "Details",
    day: "days",
  },
  zh: {
    eyebrow: "精选旅行",
    title: "精选旅行",
    body:
      "Nomadabe 最受欢迎的4个商务、展会、休闲和定制旅行套餐。",
    priceFrom: "起价",
    quote: "获取报价",
    details: "详情",
    day: "天",
  },
  ja: {
    eyebrow: "注目ツアー",
    title: "注目ツアー",
    body:
      "Nomadabe の人気ビジネス、展示会、レジャー、カスタム旅行4プラン。",
    priceFrom: "開始料金",
    quote: "見積もり依頼",
    details: "詳細",
    day: "日",
  },
  ko: {
    eyebrow: "추천 여행",
    title: "추천 여행",
    body:
      "Nomadabe의 인기 비즈니스, 엑스포, 휴양, 맞춤 여행 4가지 패키지.",
    priceFrom: "시작가",
    quote: "견적 요청",
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

  if (variant === "compact") {
    return (
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 max-w-2xl lg:mb-12">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground lg:text-sm">
              <Star className="h-4 w-4 fill-accent text-accent" />
              {copy.eyebrow}
            </p>
            <h2 className="font-display text-4xl text-balance sm:text-5xl lg:text-6xl">
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
                  : copy.quote;

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
                    <div className="absolute left-4 top-4 rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">
                      {price}
                    </div>
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
                    <a
                      href="/tours"
                      className="mt-auto inline-flex w-fit rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {copy.details}
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background">
      <div className="relative min-h-[48svh] overflow-hidden px-6 py-16 text-white lg:min-h-[56svh] lg:px-10 lg:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url(${featuredTrips[0]?.image ?? "/hero-autumn.jpg"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/32 to-black/0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
        <div className="relative mx-auto flex min-h-[calc(48svh-8rem)] max-w-7xl items-end lg:min-h-[calc(56svh-10rem)]">
          <div className="max-w-3xl pb-2 lg:pb-4">
            <p className="mb-5 inline-flex items-center gap-2 bg-accent px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-accent-foreground">
              <Star className="h-4 w-4 fill-current" />
              {copy.eyebrow}
            </p>
            <h2 className="font-sans text-4xl font-black leading-[0.95] text-balance sm:text-5xl lg:text-7xl">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/84 lg:text-xl">
              {copy.body}
            </p>
          </div>
        </div>
      </div>

      <div className="py-10 lg:py-0">
        <div className="grid gap-10 lg:gap-0">
          {featuredTrips.map((adventure, idx) => {
            const text = getAdventureText(adventure, contentLocale);
            const price =
              adventure.price > 0
                ? `${adventure.price.toLocaleString()} ${adventure.currency}`
                : copy.quote;
            const reverse = idx % 2 === 1;

            return (
              <motion.article
                key={adventure.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.05 }}
                className="grid min-h-[78svh] gap-7 lg:grid-cols-2 lg:items-stretch lg:gap-0"
              >
                <div
                  className={`flex items-center px-6 py-10 lg:px-10 ${
                    reverse ? "lg:order-2 lg:justify-start" : "lg:justify-end"
                  }`}
                >
                  <div className="w-full max-w-xl">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    {adventure.rating} ({adventure.reviews})
                  </div>
                  <h3 className="mt-4 font-sans text-3xl font-black leading-tight text-balance lg:text-5xl">
                    {text.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground lg:text-lg">
                    {text.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
                    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      {text.location}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2">
                      <CalendarDays className="h-4 w-4 text-accent" />
                      {adventure.days} {copy.day}
                    </span>
                    <span className="rounded-md bg-accent px-3 py-2 text-accent-foreground">
                      {price}
                    </span>
                  </div>
                  <a
                    href="/tours"
                    className="mt-7 inline-flex w-fit rounded-md bg-primary px-5 py-3 text-sm font-black text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {copy.details}
                  </a>
                  </div>
                </div>

                <div className={`group relative min-h-[420px] overflow-hidden bg-card shadow-lg lg:min-h-full ${
                  reverse ? "lg:order-1" : ""
                }`}>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${adventure.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-md bg-accent px-3 py-2 text-xs font-black text-accent-foreground">
                    {price}
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2 text-xs font-bold text-white">
                    <span className="flex items-center gap-1 rounded-md bg-black/40 px-2.5 py-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {text.location}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-black/40 px-2.5 py-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {adventure.days} {copy.day}
                    </span>
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
