"use client";

import { useState } from "react";
import { CardsParallax, type iCardItem } from "@/components/ui/scroll-cards";
import { getAdventureText, type Adventure } from "@/lib/adventures";
import { AdventureModal } from "./adventure-modal";
import { useLanguage } from "./language-provider";
import { TravelSectionIntro } from "./travel-section-intro";

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
  const options = [...OUTBOUND_OPTIONS, ...backendOptions].slice(0, 4);
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
    const card: iCardItem = {
      title,
      description: `${country} - ${option.days} ${copy.day}`,
      tag: option.price,
      src: option.image,
      link: "#",
      color: "#11100B",
      textColor: "#FFFDF3",
      actionLabel: copy.details,
    };

    return { adventure: adventureForModal, card };
  });

  return (
    <>
      <TravelSectionIntro title={copy.eyebrow} />

      <section className="bg-card">
        <CardsParallax
          items={cardRows.map((row) => row.card)}
          onItemSelect={(_, index) => {
            setSelected(cardRows[index]?.adventure ?? null);
          }}
        />
        <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
      </section>
    </>
  );
}
