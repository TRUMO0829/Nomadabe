"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  MapPinned,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import {
  getAdventureDetailInfo,
  getAdventureText,
  type Adventure,
} from "@/lib/adventures";
import type { CopyLocale } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/section";
import { canOptimizeImage } from "@/lib/image-quality";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

type TripDetailCopy = {
  back: string;
  days: (count: number) => string;
  duration: string;
  group: string;
  rating: string;
  reviews: (count: number) => string;
  price: string;
  priceOnRequest: string;
  overviewEyebrow: string;
  overviewTitle: string;
  included: string;
  excluded: string;
  itinerary: string;
  day: (day: string) => string;
  booking: string;
  bookingBody: string;
  cta: string;
  gallery: string;
  photo: string;
  trustTitle: string;
  trustBody: string;
};

const COPY: Record<CopyLocale, TripDetailCopy> = {
  mn: {
    back: "Бүх аялал",
    days: (count) => `${count} хоног`,
    duration: "Хугацаа",
    group: "Групп",
    rating: "Үнэлгээ",
    reviews: (count) => `${count} үнэлгээ`,
    price: "Үнэ",
    priceOnRequest: "Үнэ тохиролцоно",
    overviewEyebrow: "Аяллын дэлгэрэнгүй",
    overviewTitle: "Аяллын тойм",
    included: "Үнэд багтсан",
    excluded: "Үнэд багтаагүй",
    itinerary: "Аяллын хөтөлбөр",
    day: (day) => `Өдөр ${day}`,
    booking: "Захиалга",
    bookingBody:
      "Аяллын боломжит өдөр, хүний тоо болон нэмэлт хэрэгцээгээ үлдээгээд зөвлөхтэй холбогдоорой.",
    cta: "Төлөвлөх",
    gallery: "Аяллын зургууд",
    photo: "зураг",
    trustTitle: "Монголын аялал жуулчлалын холбооны гишүүн",
    trustBody:
      "Nomadabe Adventure Silkres ХХК — гадаад, дотоод чиглэлийн бүртгэлтэй тур оператор.",
  },
  en: {
    back: "All trips",
    days: (count) => `${count} ${count === 1 ? "day" : "days"}`,
    duration: "Duration",
    group: "Group",
    rating: "Rating",
    reviews: (count) => `${count} ${count === 1 ? "review" : "reviews"}`,
    price: "Price",
    priceOnRequest: "Price on request",
    overviewEyebrow: "Trip details",
    overviewTitle: "Trip overview",
    included: "What's included",
    excluded: "Not included",
    itinerary: "Itinerary",
    day: (day) => `Day ${day}`,
    booking: "Booking",
    bookingBody:
      "Share your preferred dates, group size and any special needs, and a travel advisor will get back to you.",
    cta: "Plan this trip",
    gallery: "Trip photos",
    photo: "photo",
    trustTitle: "Member of the Mongolian Tourism Association",
    trustBody:
      "Nomadabe Adventure Silkres LLC — a registered inbound and outbound tour operator.",
  },
  zh: {
    back: "全部行程",
    days: (count) => `${count}天`,
    duration: "行程天数",
    group: "团队规模",
    rating: "评分",
    reviews: (count) => `${count}条评价`,
    price: "价格",
    priceOnRequest: "价格面议",
    overviewEyebrow: "行程详情",
    overviewTitle: "行程概览",
    included: "费用包含",
    excluded: "费用不含",
    itinerary: "行程安排",
    day: (day) => `第${day}天`,
    booking: "预订",
    bookingBody: "留下您方便出行的日期、人数和其他需求，我们的旅行顾问会尽快与您联系。",
    cta: "规划此行程",
    gallery: "行程照片",
    photo: "照片",
    trustTitle: "蒙古旅游协会会员",
    trustBody: "Nomadabe Adventure Silkres 有限责任公司——入境与出境游注册旅行社。",
  },
  ja: {
    back: "すべてのツアー",
    days: (count) => `${count}日間`,
    duration: "日数",
    group: "グループ",
    rating: "評価",
    reviews: (count) => `${count}件のレビュー`,
    price: "料金",
    priceOnRequest: "料金は応相談",
    overviewEyebrow: "ツアー詳細",
    overviewTitle: "ツアー概要",
    included: "料金に含まれるもの",
    excluded: "料金に含まれないもの",
    itinerary: "旅程",
    day: (day) => `${day}日目`,
    booking: "ご予約",
    bookingBody:
      "ご希望の日程、人数、その他のご要望をお知らせください。旅行アドバイザーよりご連絡いたします。",
    cta: "この旅を計画する",
    gallery: "ツアー写真",
    photo: "写真",
    trustTitle: "モンゴル観光協会 会員",
    trustBody:
      "Nomadabe Adventure Silkres LLC — インバウンド・アウトバウンドの登録ツアーオペレーター。",
  },
  ko: {
    back: "전체 여행",
    days: (count) => `${count}일`,
    duration: "기간",
    group: "그룹",
    rating: "평점",
    reviews: (count) => `리뷰 ${count}개`,
    price: "가격",
    priceOnRequest: "가격 문의",
    overviewEyebrow: "여행 상세",
    overviewTitle: "여행 개요",
    included: "포함 사항",
    excluded: "불포함 사항",
    itinerary: "여행 일정",
    day: (day) => `${day}일차`,
    booking: "예약",
    bookingBody:
      "원하시는 날짜, 인원, 기타 요청 사항을 남겨 주시면 여행 상담사가 연락드립니다.",
    cta: "이 여행 계획하기",
    gallery: "여행 사진",
    photo: "사진",
    trustTitle: "몽골 관광협회 회원사",
    trustBody: "Nomadabe Adventure Silkres LLC — 인바운드·아웃바운드 등록 여행사.",
  },
};

const NUMBER_LOCALE: Record<CopyLocale, string> = {
  mn: "mn-MN",
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
};

const HERO_TILE =
  "border border-white/30 bg-black/30 p-4 shadow-raised backdrop-blur-md";

type TripDetailViewProps = {
  adventure: Adventure;
  heroImage: string;
  galleryImages: string[];
  planHref: string;
};

export function TripDetailView({
  adventure,
  heroImage,
  galleryImages,
  planHref,
}: TripDetailViewProps) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale] ?? COPY.mn;
  const text = getAdventureText(adventure, contentLocale);
  const details = getAdventureDetailInfo(adventure, contentLocale);
  const price = adventure.price
    ? `${adventure.price.toLocaleString(NUMBER_LOCALE[contentLocale])} ${adventure.currency}`
    : copy.priceOnRequest;
  const hasRating = adventure.reviews > 0;

  return (
    <>
      <section className="relative flex min-h-screen items-end overflow-hidden bg-ink pb-12 pt-28">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={text.title}
            fill
            priority
            sizes="100vw"
            unoptimized={!canOptimizeImage(heroImage)}
            className="object-cover"
          />
        ) : null}
        {/* Darker at the top so the navbar and the meta line stay readable
            against a bright sky, darkest at the bottom behind the tiles. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.46),rgba(0,0,0,0.22)_34%,rgba(0,0,0,0.78))]"
        />

        <Container className="relative z-10 text-white">
          <div className="mb-8 max-w-[min(100%,52rem)]">
            <Link
              href="/tours"
              className="nav-text inline-flex items-center gap-2 text-xs uppercase text-white/80 transition-colors hover:text-accent"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {copy.back}
            </Link>
            <p className="trip-meta-text mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              <span className="text-accent">{text.country}</span>
              <span aria-hidden="true" className="text-white/40">
                ·
              </span>
              <span>{text.location}</span>
              <span aria-hidden="true" className="text-white/40">
                ·
              </span>
              <span>{copy.days(adventure.days)}</span>
            </p>
            <h1 className="trip-header-title trip-header-title--hero mt-4 text-balance break-words text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)]">
              {text.title}
            </h1>
          </div>

          <dl
            className={cn(
              "grid gap-3 sm:grid-cols-2",
              hasRating ? "lg:grid-cols-4" : "lg:grid-cols-3"
            )}
          >
            <div className={HERO_TILE}>
              <CalendarDays aria-hidden="true" className="h-5 w-5 text-accent" />
              <dt className="mt-3 text-xs uppercase text-white/75">{copy.duration}</dt>
              <dd className="mt-1 text-lg">{copy.days(adventure.days)}</dd>
            </div>
            <div className={HERO_TILE}>
              <Users aria-hidden="true" className="h-5 w-5 text-accent" />
              <dt className="mt-3 text-xs uppercase text-white/75">{copy.group}</dt>
              <dd className="mt-1 break-words text-lg">{text.groupSize}</dd>
            </div>
            {hasRating ? (
              <div className={HERO_TILE}>
                <Star aria-hidden="true" className="h-5 w-5 text-accent" />
                <dt className="mt-3 text-xs uppercase text-white/75">{copy.rating}</dt>
                <dd className="mt-1 text-lg">
                  {adventure.rating.toFixed(1)} · {copy.reviews(adventure.reviews)}
                </dd>
              </div>
            ) : null}
            <div className={HERO_TILE}>
              <MapPinned aria-hidden="true" className="h-5 w-5 text-accent" />
              <dt className="mt-3 text-xs uppercase text-white/75">{copy.price}</dt>
              <dd className="mt-1 break-words text-lg">{price}</dd>
            </div>
          </dl>
        </Container>
      </section>

      <Container className="grid gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:py-24">
        <div className="min-w-0 space-y-12">
          <SectionHeading
            tone="light"
            eyebrow={copy.overviewEyebrow}
            title={copy.overviewTitle}
            description={text.summary}
          />

          {details.highlights.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {details.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="border border-border bg-card p-5 shadow-card"
                >
                  <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-accent-text" />
                  <p className="mt-4 text-sm text-foreground/85">{highlight}</p>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-2">
            <section
              aria-labelledby="trip-included"
              className="border border-border bg-card p-6 shadow-card"
            >
              <h2 id="trip-included" className="text-2xl">
                {copy.included}
              </h2>
              <ul className="mt-6 space-y-4">
                {details.included.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-foreground/85">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-text"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="trip-excluded"
              className="border border-border bg-card p-6 shadow-card"
            >
              <h2 id="trip-excluded" className="text-2xl">
                {copy.excluded}
              </h2>
              <ul className="mt-6 space-y-4">
                {details.excluded.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                    <XCircle
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {details.itinerary.length > 0 ? (
            <section
              aria-labelledby="trip-itinerary"
              className="border border-border bg-card p-6 shadow-card lg:p-8"
            >
              <h2 id="trip-itinerary" className="text-2xl">
                {copy.itinerary}
              </h2>
              <ol className="mt-8 space-y-6">
                {details.itinerary.map((step) => (
                  <li
                    key={`${step.day}-${step.title}`}
                    className="grid gap-4 border-t border-border pt-6 sm:grid-cols-[110px_1fr]"
                  >
                    <p className="nav-text text-xs uppercase text-accent-text">
                      {/^\d+$/.test(step.day.trim()) ? copy.day(step.day.trim()) : step.day}
                    </p>
                    <div className="min-w-0">
                      <h3 className="text-xl">{step.title}</h3>
                      {step.body ? (
                        <p className="mt-3 text-sm text-foreground/80">{step.body}</p>
                      ) : null}
                      {step.items?.length ? (
                        <ul className="mt-3 space-y-2">
                          {step.items.map((item, index) => (
                            <li
                              key={`${item.time ?? ""}-${index}`}
                              className="flex gap-3 text-sm text-foreground/80"
                            >
                              {item.time ? (
                                <span className="shrink-0 text-accent-text">{item.time}</span>
                              ) : null}
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>

        <aside className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:self-start">
          <section
            aria-labelledby="trip-booking"
            className="bg-foreground p-6 text-white shadow-floating"
          >
            <h2 id="trip-booking" className="nav-text text-xs uppercase text-white/70">
              {copy.booking}
            </h2>
            <p className="mt-4 break-words text-3xl">{price}</p>
            <p className="mt-3 text-sm text-white/75">{copy.bookingBody}</p>
            <Link
              href={planHref}
              className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}
            >
              {copy.cta}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>

            {/* Trust signal: the same association membership the About page
                certifies, with the same award badge. */}
            <div className="mt-6 flex items-start gap-3 border-t border-white/12 pt-5">
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15"
              >
                <Award className="h-5 w-5 text-accent" />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-white">{copy.trustTitle}</p>
                <p className="mt-1 text-xs text-white/65">{copy.trustBody}</p>
              </div>
            </div>
          </section>

          {galleryImages.length > 0 ? (
            <ul aria-label={copy.gallery} className="grid gap-3">
              {galleryImages.map((image, index) => (
                <li
                  key={`${image}-${index}`}
                  className="relative aspect-[16/10] overflow-hidden bg-muted"
                >
                  <Image
                    src={image}
                    alt={`${text.title} — ${copy.photo} ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 380px"
                    unoptimized={!canOptimizeImage(image)}
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      </Container>
    </>
  );
}
