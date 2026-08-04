import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { CtaFooter } from "@/components/cta-footer";
import { TourDetailBody } from "@/components/tour-detail-body";
import { getAdventureText, type Adventure } from "@/lib/adventures";
import { getAdminStore } from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";

type TourDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type StaticOutboundTrip = {
  id: string;
  country: string;
  title: string;
  days: number;
  price: number;
  image: string;
};

const STATIC_OUTBOUND_TRIPS: StaticOutboundTrip[] = [
  {
    id: "zhangjiajie",
    country: "Хятад",
    title: "Жанжиажэ аялал /Аватар/",
    days: 8,
    price: 2990000,
    image:
      "https://images.unsplash.com/photo-1561031454-4f1331bd2a34?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "shanghai",
    country: "Хятад",
    title: "Шанхай хотын аяллын хөтөлбөр",
    days: 6,
    price: 3390000,
    image:
      "https://images.unsplash.com/photo-1748078096261-5eff2aee113f?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "japan",
    country: "Япон",
    title: "Япон 4 хотын аялал",
    days: 5,
    price: 4990000,
    image:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "jeju",
    country: "БНСУ",
    title: "Жэжү арлын аялал",
    days: 5,
    price: 4290000,
    image:
      "https://images.unsplash.com/photo-1667971286457-144269b0e4d8?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "turkey",
    country: "Турк",
    title: "Анталья, Памуккале, Истанбул",
    days: 8,
    price: 4690000,
    image:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=3200&q=90&auto=format&fit=crop",
  },
  {
    id: "taiwan",
    country: "Тайвань",
    title: "Тайвань Тайбэй аялал",
    days: 7,
    price: 6790000,
    image:
      "https://images.unsplash.com/photo-1748104433499-3d492d0337cb?w=3200&q=90&auto=format&fit=crop",
  },
];

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

const OUTBOUND_TITLE_I18N: Record<string, Record<"en" | "zh" | "ja" | "ko", string>> = {
  zhangjiajie: { en: "Zhangjiajie (Avatar) trip", zh: "张家界（阿凡达）之旅", ja: "張家界（アバター）旅行", ko: "장자제(아바타) 여행" },
  shanghai: { en: "Shanghai city travel program", zh: "上海城市旅行项目", ja: "上海シティ旅行プログラム", ko: "상하이 도시 여행 프로그램" },
  japan: { en: "Japan four-city trip", zh: "日本四城之旅", ja: "日本4都市旅行", ko: "일본 4개 도시 여행" },
  jeju: { en: "Jeju Island trip", zh: "济州岛之旅", ja: "済州島旅行", ko: "제주도 여행" },
  turkey: { en: "Antalya, Pamukkale, Istanbul", zh: "安塔利亚、棉花堡、伊斯坦布尔", ja: "アンタルヤ、パムッカレ、イスタンブール", ko: "안탈리아, 파묵칼레, 이스탄불" },
  taiwan: { en: "Taiwan Taipei trip", zh: "台湾台北之旅", ja: "台湾・台北旅行", ko: "대만 타이베이 여행" },
};

const OUTBOUND_COUNTRY_I18N: Record<string, Record<"en" | "zh" | "ja" | "ko", string>> = {
  "Хятад": { en: "China", zh: "中国", ja: "中国", ko: "중국" },
  "Япон": { en: "Japan", zh: "日本", ja: "日本", ko: "일본" },
  "БНСУ": { en: "South Korea", zh: "韩国", ja: "韓国", ko: "대한민국" },
  "Турк": { en: "Türkiye", zh: "土耳其", ja: "トルコ", ko: "튀르키예" },
  "Тайвань": { en: "Taiwan", zh: "台湾", ja: "台湾", ko: "대만" },
};

const OUTBOUND_GENERIC = {
  en: {
    groupSize: "Small group", tag: "Outbound",
    idealFor: ["Families", "Small groups", "Leisure"],
    includes: ["Route planning", "Travel consulting", "Full coordination"],
    summary: (country: string, days: number) =>
      `A ${days}-day outbound travel package to ${country}. Route, hotels, transport, and travel guidance are organized in one place.`,
  },
  zh: {
    groupSize: "小团", tag: "出境游",
    idealFor: ["家庭", "小团", "休闲度假"],
    includes: ["路线规划", "旅行咨询", "全程组织"],
    summary: (country: string, days: number) =>
      `前往${country}的${days}天出境旅行套餐。路线、酒店、交通及旅行咨询一站式安排。`,
  },
  ja: {
    groupSize: "少人数", tag: "海外旅行",
    idealFor: ["家族", "少人数", "レジャー"],
    includes: ["ルート計画", "旅行相談", "全体コーディネート"],
    summary: (country: string, days: number) =>
      `${country}への${days}日間の海外ツアーパッケージ。ルート、ホテル、送迎、旅行相談をまとめて手配します。`,
  },
  ko: {
    groupSize: "소규모", tag: "해외여행",
    idealFor: ["가족", "소규모", "휴양"],
    includes: ["일정 계획", "여행 상담", "전체 조율"],
    summary: (country: string, days: number) =>
      `${country} ${days}일 해외여행 패키지. 일정, 호텔, 교통, 여행 상담을 한 곳에서 준비합니다.`,
  },
} as const;

function buildOutboundTranslations(id: string, mnCountry: string, days: number) {
  const locales = ["en", "zh", "ja", "ko"] as const;
  const translations: Record<string, unknown> = {};
  for (const locale of locales) {
    const country = OUTBOUND_COUNTRY_I18N[mnCountry]?.[locale] ?? mnCountry;
    const g = OUTBOUND_GENERIC[locale];
    translations[locale] = {
      title: OUTBOUND_TITLE_I18N[id]?.[locale],
      location: country,
      country,
      groupSize: g.groupSize,
      tags: [g.tag, country],
      summary: g.summary(country, days),
      idealFor: g.idealFor,
      includes: g.includes,
      businessSupport: [],
    };
  }
  return translations as Adventure["translations"];
}

function getStaticOutboundAdventureBySlug(
  slug: string,
  outboundTripImages: Record<string, string>
): Adventure | null {
  const option = STATIC_OUTBOUND_TRIPS.find(
    (trip) => `static-outbound-${trip.id}` === slug
  );

  if (!option) {
    return null;
  }

  return {
    id: `static-outbound-${option.id}`,
    slug: `static-outbound-${option.id}`,
    title: option.title,
    location: option.country,
    country: option.country,
    days: option.days,
    groupSize: "Жижиг групп",
    difficulty: "Easy",
    price: option.price,
    currency: "MNT",
    image: outboundTripImages[option.id] || option.image,
    tags: ["Гадаад аялал", option.country],
    rating: 4.8,
    reviews: 24,
    category: "outbound",
    summary: `${option.country} чиглэлийн ${option.days} хоногийн гадаад аяллын багц. Маршрут, буудал, тээвэр болон аяллын зөвлөгөөг нэг дор зохион байгуулна.`,
    idealFor: ["Гэр бүл", "Жижиг групп", "Амралт"],
    includes: [
      "Маршрут төлөвлөлт",
      "Аяллын зөвлөгөө",
      "Зохион байгуулалт",
    ],
    businessSupport: [],
    nextDeparture: "Тохиролцоно",
    translations: buildOutboundTranslations(option.id, option.country, option.days),
  };
}

async function getTourBySlug(slug: string) {
  const decodedSlug = decodeSlug(slug);
  const { trips, siteSettings } = await getAdminStore();

  return (
    trips.find((adventure) => adventure.slug === decodedSlug) ??
    getStaticOutboundAdventureBySlug(decodedSlug, siteSettings.outboundTripImages)
  );
}

export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const adventure = await getTourBySlug(slug);

  if (!adventure) {
    return {
      title: "Nomadabe",
    };
  }

  const text = getAdventureText(adventure, "mn");

  return {
    title: `${text.title} | Nomadabe Travel`,
    description: text.summary,
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params;
  const adventure = await getTourBySlug(slug);

  if (!adventure) {
    notFound();
  }

  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar />
      <TourDetailBody adventure={adventure} />
      <CtaFooter />
    </>
  );
}
