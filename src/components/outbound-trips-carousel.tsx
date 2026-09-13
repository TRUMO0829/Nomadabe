"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { getAdventureText, type Adventure } from "@/lib/adventures";
import { getHighResolutionImageUrl } from "@/lib/image-quality";
import {
  CARD_CTA,
  CARD_FRAME,
  CardMedia,
  CardMeta,
  CardOverlay,
  CardTitle,
} from "@/components/ui/card-recipe";
import { SectionHeading } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { formatPrice } from "@/lib/currency";
import { OUTBOUND_OPTIONS, buildStaticOutboundAdventure } from "@/lib/outbound-trips";

// The /tours lists still import the packaged options from here.
export { OUTBOUND_OPTIONS } from "@/lib/outbound-trips";

const COPY = {
  mn: {
    eyebrow: "Гадаад чиглэлийн аяллууд",
    title: "Гадаад аяллын чиглэлүүд",
    body: "Хятад, Япон, Солонгос, Турк зэрэг эрэлттэй чиглэлүүдийн аяллын багцууд.",
    details: "Дэлгэрэнгүй",
    day: "хоног",
  },
  en: {
    eyebrow: "Outbound trips",
    title: "Outbound travel routes",
    body: "Popular travel packages across China, Japan, South Korea, Turkey, and more.",
    details: "Details",
    day: "days",
  },
  zh: {
    eyebrow: "出境旅行",
    title: "出境旅行路线",
    body: "中国、日本、韩国、土耳其等热门目的地的旅行套餐。",
    details: "详情",
    day: "天",
  },
  ja: {
    eyebrow: "海外ツアー",
    title: "海外旅行ルート",
    body: "中国、日本、韓国、トルコなど人気目的地の旅行プラン。",
    details: "詳細",
    day: "日",
  },
  ko: {
    eyebrow: "해외 여행",
    title: "해외 여행 루트",
    body: "중국, 일본, 한국, 튀르키예 등 인기 목적지의 여행 패키지.",
    details: "자세히",
    day: "일",
  },
} as const;

type OutboundTripsCarouselProps = {
  adventures?: Adventure[];
  outboundTripImages?: Record<string, string>;
};

export function OutboundTripsCarousel({
  adventures = [],
  outboundTripImages = {},
}: OutboundTripsCarouselProps) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale];
  const cards = [
    ...OUTBOUND_OPTIONS.map((option) =>
      buildStaticOutboundAdventure(option, outboundTripImages[option.id])
    ),
    ...adventures.filter((adventure) => adventure.country !== "Mongolia"),
  ].slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-ink text-background">
      {/* ambient yellow glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-8%] h-[420px] w-[420px] rounded-full blur-[130px]"
        style={{ background: "rgba(255,212,0,0.16)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[-10%] h-[360px] w-[360px] rounded-full blur-[130px]"
        style={{ background: "rgba(255,212,0,0.09)" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.body} />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {cards.map((adventure, index) => {
            const text = getAdventureText(adventure, contentLocale);
            const featured = index === 0;
            const price =
              adventure.price > 0 ? formatPrice(adventure.price, contentLocale) : null;
            const image = getHighResolutionImageUrl(adventure.image);

            return (
              <Link
                key={adventure.id}
                href={`/tours/${encodeURIComponent(adventure.slug)}`}
                className={cn(
                  CARD_FRAME,
                  featured
                    ? "h-[clamp(20rem,40vw,30rem)] lg:col-span-2"
                    : "h-[clamp(18rem,30vw,26rem)]"
                )}
              >
                <CardMedia
                  src={image}
                  alt={text.title}
                  sizes={featured ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
                />

                {price ? (
                  <span className="trip-meta-text absolute right-5 top-5 z-10 border border-white/25 bg-black/45 px-3 py-1.5 text-[10px] uppercase text-white backdrop-blur">
                    {price}
                  </span>
                ) : null}

                <CardOverlay>
                  <CardMeta
                    items={[
                      { label: text.country },
                      { label: text.location, icon: MapPin },
                      { label: `${adventure.days} ${copy.day}`, icon: CalendarDays },
                    ]}
                  />
                  <CardTitle>{text.title}</CardTitle>
                  <span className={cn(CARD_CTA, "mt-4 self-start")}>
                    {copy.details}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </CardOverlay>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
