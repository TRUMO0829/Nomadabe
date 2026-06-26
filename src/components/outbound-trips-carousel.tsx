"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { getAdventureText, type Adventure } from "@/lib/adventures";
import { AdventureModal } from "./adventure-modal";
import { useLanguage } from "./language-provider";

const ACCENT = "#FF6A1A";

const COPY = {
  mn: {
    eyebrow: "Гадаад чиглэлийн аяллууд",
    title: "Гадаад аяллын чиглэлүүд",
    body:
      "Хятад, Япон, Солонгос, Турк зэрэг эрэлттэй чиглэлүүдийн аяллын багцууд.",
    quote: "Санал авах",
    details: "Дэлгэрэнгүй",
    day: "хоног",
  },
  en: {
    eyebrow: "Outbound trips",
    title: "Outbound travel routes",
    body:
      "Popular travel packages across China, Japan, South Korea, Turkey, and more.",
    quote: "Request quote",
    details: "Details",
    day: "days",
  },
  zh: {
    eyebrow: "出境旅行",
    title: "出境旅行路线",
    body: "中国、日本、韩国、土耳其等热门目的地的旅行套餐。",
    quote: "获取报价",
    details: "详情",
    day: "天",
  },
  ja: {
    eyebrow: "海外ツアー",
    title: "海外旅行ルート",
    body: "中国、日本、韓国、トルコなど人気目的地の旅行プラン。",
    quote: "見積もり依頼",
    details: "詳細",
    day: "日",
  },
  ko: {
    eyebrow: "해외 여행",
    title: "해외 여행 루트",
    body: "중국, 일본, 한국, 튀르키예 등 인기 목적지의 여행 패키지.",
    quote: "견적 요청",
    details: "자세히",
    day: "일",
  },
} as const;

export const OUTBOUND_OPTIONS = [
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

function parseMntPrice(price: string) {
  const numericPrice = Number(price.replace(/[^\d]/g, ""));
  return Number.isFinite(numericPrice) ? numericPrice : 0;
}

export function OutboundTripsCarousel({
  adventures = [],
}: OutboundTripsCarouselProps) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale];
  const [selected, setSelected] = useState<Adventure | null>(null);
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
            : "",
        image: adventure.image,
        adventure,
      };
    });
  const options = [...OUTBOUND_OPTIONS, ...backendOptions].slice(0, 3);
  const cardRows = options.map((option, idx) => {
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
    const backendAdventure = (option as { adventure?: Adventure }).adventure;
    const adventureForModal: Adventure = backendAdventure
      ? backendAdventure
      : {
          id: `static-outbound-${option.id}`,
          slug: `static-outbound-${option.id}`,
          title,
          location: country,
          country,
          days: option.days,
          groupSize: "Жижиг групп",
          difficulty: "Easy",
          price: parseMntPrice(option.price),
          currency: "MNT",
          image: option.image,
          tags: ["Гадаад", country],
          rating: 4.8,
          reviews: 18 + idx * 4,
          category: "outbound",
          summary:
            contentLocale === "mn"
              ? `${country} чиглэлийн ${option.days} хоногийн гадаад аяллын багц.`
              : `${option.days}-day outbound travel package for ${country}.`,
          idealFor: ["Гэр бүл", "Жижиг групп", "Амралт"],
          includes: [
            "Маршрут төлөвлөлт",
            "Аяллын зөвлөгөө",
            "Зохион байгуулалт",
          ],
          businessSupport: [],
          nextDeparture: "",
        };
    return adventureForModal;
  });

  return (
    <section className="relative overflow-hidden bg-[#0B0A07] text-[#FFFDF3]">
      {/* ambient orange glow (matches the About section) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-8%] h-[420px] w-[420px] rounded-full blur-[130px]"
        style={{ background: "rgba(255,106,26,0.18)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[-10%] h-[360px] w-[360px] rounded-full blur-[130px]"
        style={{ background: "rgba(255,106,26,0.1)" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <span
          className="inline-flex items-center gap-2.5 text-xs tracking-[0.3em]"
          style={{ color: ACCENT }}
        >
          <span className="h-px w-8" style={{ background: ACCENT }} />
          {copy.eyebrow}
        </span>
        <h2 className="mt-5 max-w-2xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
          {copy.title}
        </h2>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {cardRows.map((adventure, index) => {
            const text = getAdventureText(adventure, contentLocale);
            const featured = index === 0;
            const price =
              adventure.price > 0
                ? `${adventure.price.toLocaleString()} ${adventure.currency}`
                : null;

            return (
              <button
                key={adventure.id}
                type="button"
                onClick={() => setSelected(adventure)}
                className={[
                  "group relative block overflow-hidden rounded-[28px] border border-white/10 text-left transition-colors hover:border-[rgba(255,106,26,0.5)]",
                  featured
                    ? "h-[clamp(20rem,40vw,30rem)] lg:col-span-2"
                    : "h-[clamp(18rem,30vw,26rem)]",
                ].join(" ")}
              >
                <Image
                  src={adventure.image}
                  alt={text.title}
                  fill
                  sizes={featured ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />

                {price ? (
                  <span className="trip-meta-text absolute right-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs text-[#11100b] backdrop-blur">
                    {price}
                  </span>
                ) : null}

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="trip-meta-text flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/80">
                    <span style={{ color: ACCENT }}>{text.country}</span>
                  </div>
                  <h3
                    className="mt-3 max-w-[20ch] text-balance text-2xl leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)] sm:text-3xl"
                    style={{ textTransform: "none" }}
                  >
                    {text.title}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <span className="trip-meta-text inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur">
                      <CalendarDays className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                      {adventure.days} {copy.day}
                    </span>
                    {text.location ? (
                      <span className="trip-meta-text inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur">
                        <MapPin className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                        {text.location}
                      </span>
                    ) : null}
                  </div>

                  <span
                    className="trip-meta-text mt-5 inline-flex items-center gap-2 text-sm"
                    style={{ color: ACCENT, textTransform: "none" }}
                  >
                    {copy.details}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
