"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { getAdventureText, type Adventure } from "@/lib/adventures";
import { useLanguage } from "./language-provider";

const COPY = {
  mn: {
    eyebrow: "Гадаад аяллууд",
    title: "Гадаад аяллын чиглэлүүд",
    body:
      "Хятад, Япон, Солонгос, Турк зэрэг эрэлттэй чиглэлүүдийн аяллын багцууд.",
    priceFrom: "Эхлэх үнэ",
    quote: "Санал авах",
    details: "Дэлгэрэнгүй",
    day: "хоног",
    previous: "Өмнөх",
    next: "Дараах",
  },
  en: {
    eyebrow: "Outbound trips",
    title: "Outbound travel routes",
    body:
      "Popular travel packages across China, Japan, South Korea, Turkey, and more.",
    priceFrom: "From",
    quote: "Request quote",
    details: "Details",
    day: "days",
    previous: "Previous",
    next: "Next",
  },
  zh: {
    eyebrow: "出境旅行",
    title: "出境旅行路线",
    body:
      "中国、日本、韩国、土耳其等热门目的地的旅行套餐。",
    priceFrom: "起价",
    quote: "Request quote",
    details: "详情",
    day: "天",
    previous: "上一个",
    next: "下一个",
  },
  ja: {
    eyebrow: "海外ツアー",
    title: "海外旅行ルート",
    body:
      "中国、日本、韓国、トルコなど人気目的地の旅行プラン。",
    priceFrom: "開始料金",
    quote: "Request quote",
    details: "詳細",
    day: "日",
    previous: "前へ",
    next: "次へ",
  },
  ko: {
    eyebrow: "해외 여행",
    title: "해외 여행 루트",
    body:
      "중국, 일본, 한국, 터키 등 인기 목적지의 여행 패키지.",
    priceFrom: "시작가",
    quote: "Request quote",
    details: "자세히",
    day: "일",
    previous: "이전",
    next: "다음",
  },
} as const;

const OUTBOUND_OPTIONS = [
  {
    id: "zhangjiajie",
    countryMn: "Хятад",
    countryEn: "China",
    countryZh: "中国",
    countryJa: "中国",
    countryKo: "중국",
    titleMn: "Жанжиажэ аялал /Аватар/",
    titleEn: "Zhangjiajie Avatar trip",
    titleZh: "张家界阿凡达之旅",
    titleJa: "張家界アバター旅行",
    titleKo: "장자제 아바타 여행",
    days: 8,
    price: "2,990,000₮",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "shanghai",
    countryMn: "Хятад",
    countryEn: "China",
    countryZh: "中国",
    countryJa: "中国",
    countryKo: "중국",
    titleMn: "Шанхай хотын аяллын хөтөлбөр",
    titleEn: "Shanghai city travel program",
    titleZh: "上海城市旅行项目",
    titleJa: "上海シティ旅行プログラム",
    titleKo: "상하이 도시 여행 프로그램",
    days: 6,
    price: "3,390,000₮",
    image:
      "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "japan",
    countryMn: "Япон",
    countryEn: "Japan",
    countryZh: "日本",
    countryJa: "日本",
    countryKo: "일본",
    titleMn: "Япон 4 хотын аялал",
    titleEn: "Japan four-city trip",
    titleZh: "日本四城之旅",
    titleJa: "日本4都市旅行",
    titleKo: "일본 4개 도시 여행",
    days: 5,
    price: "4,990,000₮",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "jeju",
    countryMn: "БНСУ",
    countryEn: "South Korea",
    countryZh: "韩国",
    countryJa: "韓国",
    countryKo: "대한민국",
    titleMn: "Жэжү арлын аялал",
    titleEn: "Jeju island trip",
    titleZh: "济州岛之旅",
    titleJa: "済州島旅行",
    titleKo: "제주도 여행",
    days: 5,
    price: "4,290,000₮",
    image:
      "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "turkey",
    countryMn: "Турк",
    countryEn: "Turkey",
    countryZh: "土耳其",
    countryJa: "トルコ",
    countryKo: "튀르키예",
    titleMn: "Анталья, Памуккале, Истанбул",
    titleEn: "Antalya, Pamukkale, Istanbul",
    titleZh: "安塔利亚、棉花堡、伊斯坦布尔",
    titleJa: "アンタルヤ、パムッカレ、イスタンブール",
    titleKo: "안탈리아, 파묵칼레, 이스탄불",
    days: 8,
    price: "4,690,000₮",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "taiwan",
    countryMn: "Тайвань",
    countryEn: "Taiwan",
    countryZh: "台湾",
    countryJa: "台湾",
    countryKo: "대만",
    titleMn: "Тайвань Тайбэй аялал",
    titleEn: "Taiwan Taipei trip",
    titleZh: "台湾台北之旅",
    titleJa: "台湾・台北旅行",
    titleKo: "대만 타이베이 여행",
    days: 7,
    price: "6,790,000₮",
    image:
      "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=900&q=80&auto=format&fit=crop",
  },
];

type OutboundTripsCarouselProps = {
  adventures?: Adventure[];
};

export function OutboundTripsCarousel({
  adventures = [],
}: OutboundTripsCarouselProps) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const backendOptions = adventures
    .filter((adventure) => adventure.country !== "Mongolia")
    .map((adventure) => {
      const text = getAdventureText(adventure, contentLocale);

      return {
        id: `trip-${adventure.id}`,
        countryMn: text.country,
        countryEn: text.country,
        countryZh: text.country,
        countryJa: text.country,
        countryKo: text.country,
        titleMn: text.title,
        titleEn: text.title,
        titleZh: text.title,
        titleJa: text.title,
        titleKo: text.title,
        days: adventure.days,
        price:
          adventure.price > 0
            ? `${adventure.price.toLocaleString()} ${adventure.currency}`
            : copy.quote,
        image: adventure.image,
      };
    });
  const options = [...OUTBOUND_OPTIONS, ...backendOptions];

  function scrollByCard(direction: "prev" | "next") {
    scrollerRef.current?.scrollBy({
      left: direction === "next" ? 360 : -360,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground lg:text-sm">
              {copy.eyebrow}
            </p>
            <h2 className="font-display text-4xl text-balance sm:text-5xl lg:text-6xl">
              {copy.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {copy.body}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label={copy.previous}
              onClick={() => scrollByCard("prev")}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:border-accent hover:bg-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={copy.next}
              onClick={() => scrollByCard("next")}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:border-accent hover:bg-accent"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {options.map((option, idx) => {
            const title = {
              mn: option.titleMn,
              en: option.titleEn,
              zh: option.titleZh,
              ja: option.titleJa,
              ko: option.titleKo,
            }[contentLocale];
            const country = {
              mn: option.countryMn,
              en: option.countryEn,
              zh: option.countryZh,
              ja: option.countryJa,
              ko: option.countryKo,
            }[contentLocale];

            return (
              <motion.article
                key={option.id}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.05 }}
                className="group relative flex min-w-[78vw] snap-start flex-col overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-all hover:border-accent hover:shadow-xl sm:min-w-[420px] lg:min-w-[360px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${option.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">
                    {option.price}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 text-xs font-semibold text-white">
                    <span className="flex items-center gap-1 rounded-md bg-black/35 px-2.5 py-1 backdrop-blur">
                      <MapPin className="h-3.5 w-3.5" />
                      {country}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-black/35 px-2.5 py-1 backdrop-blur">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {option.days} {copy.day}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {copy.priceFrom}
                  </div>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-balance">
                    {title}
                  </h3>
                  <a
                    href="/tours"
                    className="mt-5 inline-flex w-fit items-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
