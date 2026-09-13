import type { Adventure, AdventureTranslations } from "./adventures";
import type { CopyLocale } from "./i18n";

/**
 * The six packaged outbound trips that exist before any admin-created ones.
 * One source for the home cards, the /tours lists and the
 * /tours/static-outbound-<id> detail pages, which each used to keep their own
 * copy of this list.
 */
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
      "https://images.unsplash.com/photo-1561031454-4f1331bd2a34?w=2400&q=90&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1748078096261-5eff2aee113f?w=2400&q=90&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=2400&q=90&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1667971286457-144269b0e4d8?w=2400&q=90&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=2400&q=90&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1748104433499-3d492d0337cb?w=2400&q=90&auto=format&fit=crop",
  },
];

export type OutboundOption = (typeof OUTBOUND_OPTIONS)[number];

export const STATIC_OUTBOUND_SLUG_PREFIX = "static-outbound-";

const TRANSLATION_LOCALES = ["en", "zh", "ja", "ko"] as const;

export function parseMntPrice(price: string) {
  const numericPrice = Number(price.replace(/[^\d]/g, ""));
  return Number.isFinite(numericPrice) ? numericPrice : 0;
}

export function getOutboundTitle(option: OutboundOption, locale: CopyLocale) {
  return {
    mn: option.titleMn,
    en: option.titleEn,
    zh: option.titleZh,
    ja: option.titleJa,
    ko: option.titleKo,
  }[locale];
}

export function getOutboundCountry(option: OutboundOption, locale: CopyLocale) {
  return {
    mn: option.countryMn,
    en: option.countryEn,
    zh: option.countryZh,
    ja: option.countryJa,
    ko: option.countryKo,
  }[locale];
}

function getOutboundSummary(option: OutboundOption, locale: CopyLocale) {
  const country = getOutboundCountry(option, locale);

  switch (locale) {
    case "mn":
      return `${country} чиглэлийн ${option.days} хоногийн аялал. Хотын үзвэр, амралт, зураг авах цэг, өдөр бүрийн маршрут, буудал болон тээврийн зохион байгуулалтыг Nomadabe баг төлөвлөнө.`;
    case "zh":
      return `${country}${option.days}天旅行套餐：每日行程、城市亮点、休闲时间、拍照打卡点、住宿建议和交通安排，均由Nomadabe团队为您规划。`;
    case "ja":
      return `${country}への${option.days}日間ツアー。毎日のルート、街の見どころ、自由時間、フォトスポット、宿泊と交通の手配までNomadabeチームがプランニングします。`;
    case "ko":
      return `${country} ${option.days}일 여행 패키지. 일일 동선, 도시 명소, 휴식 시간, 포토 스팟, 숙소 안내와 교통편까지 Nomadabe 팀이 계획합니다.`;
    case "en":
    default:
      return `${option.days}-day ${country} travel package with daily routing, city highlights, leisure time, photo spots, accommodation guidance, and transport planning by the Nomadabe team.`;
  }
}

const OUTBOUND_DETAILS: Record<
  CopyLocale,
  {
    groupSize: string;
    tag: string;
    idealFor: string[];
    includes: string[];
    businessSupport: string[];
  }
> = {
  mn: {
    groupSize: "Жижиг групп",
    tag: "Гадаад",
    idealFor: ["Гэр бүл", "Найз нөхөд", "Жижиг групп", "Анх удаа аялагч"],
    includes: [
      "Өдөр бүрийн маршрут",
      "Буудал, тээврийн чиглүүлэг",
      "Аяллын зөвлөгөө",
      "Хөтөч/орчуулгын мэдээлэл",
      "eSIM, даатгалын зөвлөмж",
    ],
    businessSupport: [
      "Бизнес уулзалт, үзэсгэлэн эсвэл бүтээгдэхүүн судалгааны зорилготой бол тусгай хөтөлбөр нэмэх боломжтой.",
      "Нийлүүлэгч, худалдан авалт, логистикийн анхан шатны зөвлөгөөг аяллын төлөвлөгөөнд уялдуулна.",
    ],
  },
  en: {
    groupSize: "Small group",
    tag: "Outbound",
    idealFor: ["Families", "Friends", "Small groups", "First-time visitors"],
    includes: [
      "Daily itinerary planning",
      "Hotel and transport guidance",
      "Travel consulting",
      "Guide and interpreter options",
      "eSIM and insurance guidance",
    ],
    businessSupport: [
      "Business meetings, expo visits, or product research can be added as a custom track.",
      "Supplier, purchasing, and logistics guidance can be aligned with the travel plan.",
    ],
  },
  zh: {
    groupSize: "小团",
    tag: "出境",
    idealFor: ["家庭", "朋友", "小团体", "首次到访者"],
    includes: ["每日行程规划", "酒店与交通指引", "旅行咨询", "导游与翻译选项", "eSIM与保险建议"],
    businessSupport: [
      "如有商务会谈、展会参观或产品考察需求，可增加定制行程。",
      "可将供应商、采购和物流方面的咨询与旅行计划相结合。",
    ],
  },
  ja: {
    groupSize: "少人数グループ",
    tag: "海外",
    idealFor: ["ご家族", "友人同士", "少人数グループ", "初めての方"],
    includes: [
      "毎日の旅程プランニング",
      "ホテル・交通のご案内",
      "旅行相談",
      "ガイド・通訳の手配",
      "eSIM・保険のアドバイス",
    ],
    businessSupport: [
      "商談、展示会視察、製品リサーチ向けの特別プログラムを追加できます。",
      "仕入先、購買、物流に関する初期アドバイスを旅行計画に組み込みます。",
    ],
  },
  ko: {
    groupSize: "소규모 그룹",
    tag: "해외",
    idealFor: ["가족", "친구", "소규모 그룹", "첫 방문자"],
    includes: ["일일 일정 계획", "호텔 및 교통 안내", "여행 상담", "가이드·통역 옵션", "eSIM 및 보험 안내"],
    businessSupport: [
      "비즈니스 미팅, 박람회 방문, 제품 조사 목적의 맞춤 일정을 추가할 수 있습니다.",
      "공급업체, 구매, 물류 관련 기본 상담을 여행 계획에 연계합니다.",
    ],
  },
};

/**
 * A packaged option as an Adventure, so it renders with the normal trip UI.
 * The base record is Mongolian with translations for the other locales, the
 * same shape admin trips have, so getAdventureText localizes it everywhere.
 */
export function buildStaticOutboundAdventure(
  option: OutboundOption,
  imageOverride?: string,
  nextDeparture = ""
): Adventure {
  const country = getOutboundCountry(option, "mn");
  const details = OUTBOUND_DETAILS.mn;
  const translations: AdventureTranslations = {};

  for (const locale of TRANSLATION_LOCALES) {
    const localCountry = getOutboundCountry(option, locale);
    const localDetails = OUTBOUND_DETAILS[locale];

    translations[locale] = {
      title: getOutboundTitle(option, locale),
      location: localCountry,
      country: localCountry,
      groupSize: localDetails.groupSize,
      tags: [localDetails.tag, localCountry],
      summary: getOutboundSummary(option, locale),
      idealFor: localDetails.idealFor,
      includes: localDetails.includes,
      businessSupport: localDetails.businessSupport,
    };
  }

  return {
    id: `${STATIC_OUTBOUND_SLUG_PREFIX}${option.id}`,
    slug: `${STATIC_OUTBOUND_SLUG_PREFIX}${option.id}`,
    title: getOutboundTitle(option, "mn"),
    location: country,
    country,
    days: option.days,
    groupSize: details.groupSize,
    difficulty: "Easy",
    price: parseMntPrice(option.price),
    currency: "MNT",
    image: imageOverride || option.image,
    tags: [details.tag, country],
    // Packaged options have no collected reviews; never invent a rating.
    rating: 0,
    reviews: 0,
    category: "outbound",
    summary: getOutboundSummary(option, "mn"),
    idealFor: details.idealFor,
    includes: details.includes,
    businessSupport: details.businessSupport,
    nextDeparture,
    translations,
  };
}

export function getStaticOutboundAdventureBySlug(
  slug: string,
  outboundTripImages: Record<string, string> = {},
  nextDeparture = ""
) {
  const option = OUTBOUND_OPTIONS.find(
    (item) => `${STATIC_OUTBOUND_SLUG_PREFIX}${item.id}` === slug
  );

  return option
    ? buildStaticOutboundAdventure(option, outboundTripImages[option.id], nextDeparture)
    : null;
}
