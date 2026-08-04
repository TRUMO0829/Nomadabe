"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPinned,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import {
  getAdventureDetailInfo,
  getAdventureGalleryImages,
  getAdventureText,
  type Adventure,
} from "@/lib/adventures";
import { getHighResolutionImageUrl } from "@/lib/image-quality";
import { useLanguage } from "./language-provider";
import { PriceTag } from "./price-tag";

const LABELS = {
  mn: {
    duration: "Хугацаа", day: "хоног", group: "Групп", rating: "Үнэлгээ", reviews: "сэтгэгдэл",
    price: "Үнэ", eyebrow: "Аяллын дэлгэрэнгүй", title: "Таны аялалд багтах гол мэдээлэл",
    included: "Үнэд багтсан", excluded: "Үнэд багтаагүй", itinerary: "Аяллын хөтөлбөр",
    dayN: "Өдөр", booking: "Захиалга",
    bookingNote: "Аяллын боломжит өдөр, хүний тоо болон нэмэлт хэрэгцээгээ үлдээгээд зөвлөхтэй холбогдоорой.",
    plan: "Төлөвлөх",
  },
  en: {
    duration: "Duration", day: "days", group: "Group", rating: "Rating", reviews: "reviews",
    price: "Price", eyebrow: "Trip details", title: "Everything included in your trip",
    included: "Included", excluded: "Not included", itinerary: "Itinerary",
    dayN: "Day", booking: "Booking",
    bookingNote: "Leave your preferred dates, group size, and any extra needs, and a consultant will get in touch.",
    plan: "Plan a trip",
  },
  zh: {
    duration: "时长", day: "天", group: "团队", rating: "评分", reviews: "条评价",
    price: "价格", eyebrow: "行程详情", title: "您行程中的核心信息",
    included: "费用包含", excluded: "费用不含", itinerary: "行程安排",
    dayN: "第", booking: "预订",
    bookingNote: "留下您期望的日期、人数和其他需求，顾问会尽快与您联系。",
    plan: "开始规划",
  },
  ja: {
    duration: "期間", day: "日", group: "グループ", rating: "評価", reviews: "件のレビュー",
    price: "料金", eyebrow: "ツアー詳細", title: "旅行に含まれる主な情報",
    included: "料金に含まれる", excluded: "料金に含まれない", itinerary: "旅程",
    dayN: "日目", booking: "ご予約",
    bookingNote: "ご希望の日程・人数・その他のご要望を残していただければ、担当者よりご連絡します。",
    plan: "プランを立てる",
  },
  ko: {
    duration: "기간", day: "일", group: "그룹", rating: "평점", reviews: "리뷰",
    price: "가격", eyebrow: "여행 상세", title: "여행에 포함된 주요 정보",
    included: "포함 사항", excluded: "불포함 사항", itinerary: "여행 일정",
    dayN: "일차", booking: "예약",
    bookingNote: "원하는 날짜와 인원, 추가 요청을 남겨 주시면 담당자가 연락드립니다.",
    plan: "여행 계획하기",
  },
} as const;

type Props = { adventure: Adventure };

export function TourDetailBody({ adventure }: Props) {
  const { contentLocale } = useLanguage();
  const t = LABELS[contentLocale] ?? LABELS.mn;
  const text = getAdventureText(adventure, contentLocale);
  const details = getAdventureDetailInfo(adventure, contentLocale);
  const heroImage = getHighResolutionImageUrl(adventure.image);
  const galleryImages = getAdventureGalleryImages(adventure)
    .slice(0, 4)
    .map((image) => getHighResolutionImageUrl(image));
  const planHref = `/plan?trip=${encodeURIComponent(adventure.slug)}`;

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#11100b]">
      <section
        className="relative flex min-h-screen items-end overflow-hidden px-4 pb-12 pt-28 sm:px-6 lg:px-10"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.72)), url(${heroImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="relative z-10 mx-auto w-full max-w-[1500px] text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FFD400]">
            {text.country}
          </p>
          <h1 className="mt-3 max-w-4xl text-balance text-[clamp(2rem,5vw,4.75rem)] font-medium leading-[0.98]">
            {text.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/80">{text.summary}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-white/30 bg-black/28 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
              <CalendarDays className="h-5 w-5 text-[#FFD400]" />
              <p className="mt-3 text-xs font-semibold uppercase text-white/76">{t.duration}</p>
              <p className="mt-1 text-lg font-semibold">{adventure.days} {t.day}</p>
            </div>
            <div className="border border-white/30 bg-black/28 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
              <Users className="h-5 w-5 text-[#FFD400]" />
              <p className="mt-3 text-xs font-semibold uppercase text-white/76">{t.group}</p>
              <p className="mt-1 text-lg font-semibold">{text.groupSize}</p>
            </div>
            <div className="border border-white/30 bg-black/28 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
              <Star className="h-5 w-5 text-[#FFD400]" />
              <p className="mt-3 text-xs font-semibold uppercase text-white/76">{t.rating}</p>
              <p className="mt-1 text-lg font-semibold">
                {adventure.rating.toFixed(1)} / {adventure.reviews} {t.reviews}
              </p>
            </div>
            <div className="border border-white/30 bg-black/28 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
              <MapPinned className="h-5 w-5 text-[#FFD400]" />
              <p className="mt-3 text-xs font-semibold uppercase text-white/76">{t.price}</p>
              <p className="mt-1 text-lg font-semibold">
                <PriceTag mnt={adventure.price} />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-10 lg:py-24">
        <div className="space-y-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a6f12]">
              {t.eyebrow}
            </p>
            <h2 className="mt-4 max-w-3xl text-balance text-[clamp(2.25rem,5vw,5.25rem)] font-medium leading-[0.96]">
              {t.title}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {details.highlights.map((highlight) => (
              <div key={highlight} className="border border-[#eadfac] bg-[#fffdf3] p-5 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-[#FFD400]" />
                <p className="mt-4 text-sm font-medium leading-6 text-black/82">{highlight}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="border border-[#eadfac] bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-medium">{t.included}</h3>
              <ul className="mt-6 space-y-4">
                {details.included.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-black/78">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD400]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-[#eadfac] bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-medium">{t.excluded}</h3>
              <ul className="mt-6 space-y-4">
                {details.excluded.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-black/72">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-black/45" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border border-[#eadfac] bg-white p-6 shadow-sm lg:p-8">
            <h3 className="text-2xl font-medium">{t.itinerary}</h3>
            <div className="mt-8 space-y-6">
              {details.itinerary.map((step) => (
                <div
                  key={`${step.day}-${step.title}`}
                  className="grid gap-4 border-t border-[#eadfac] pt-6 sm:grid-cols-[96px_1fr]"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6f12]">
                    {t.dayN} {step.day}
                  </div>
                  <div>
                    <h4 className="text-xl font-medium">{step.title}</h4>
                    <p className="mt-3 text-sm font-medium leading-7 text-black/76">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="bg-[#11100b] p-6 text-white shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/68">
              {t.booking}
            </p>
            <p className="mt-4 text-3xl font-medium">
              <PriceTag mnt={adventure.price} />
            </p>
            <p className="mt-3 text-sm font-medium leading-6 text-white/76">{t.bookingNote}</p>
            <Link
              href={planHref}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#FFD400] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
            >
              {t.plan}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3">
            {galleryImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="aspect-[16/10] bg-[#e4dfd2] bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
