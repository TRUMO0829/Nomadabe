"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { getHighResolutionImageUrl } from "@/lib/image-quality";
import {
  CARD_CTA,
  CARD_FRAME,
  CardMedia,
  CardMeta,
  CardOverlay,
  CardTitle,
} from "@/components/ui/card-recipe";
import { Container, SectionHeading } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

const COPY = {
  mn: {
    eyebrow: "Сонгосон маршрут",
    title: "Онцлох аяллууд",
    subtitle: "Аяллаа сонгоод дэлгэрэнгүй мэдээлэл, үнэ, багцын нөхцөлийг хараарай.",
    details: "Дэлгэрэнгүй",
    day: "хоног",
  },
  en: {
    eyebrow: "Hand-picked",
    title: "Featured trips",
    subtitle: "Open a trip to view details, pricing, inclusions, and planning notes.",
    details: "Details",
    day: "days",
  },
  zh: {
    eyebrow: "精选推荐",
    title: "精选旅行",
    subtitle: "打开行程即可查看详情、价格、包含项目和规划说明。",
    details: "详情",
    day: "天",
  },
  ja: {
    eyebrow: "おすすめ",
    title: "注目ツアー",
    subtitle: "ツアーを開くと、詳細、料金、含まれる内容、計画メモを確認できます。",
    details: "詳細",
    day: "日",
  },
  ko: {
    eyebrow: "추천 코스",
    title: "추천 여행",
    subtitle: "여행을 열어 상세 정보, 가격, 포함 사항, 일정 메모를 확인하세요.",
    details: "자세히",
    day: "일",
  },
} as const;

type FeaturedTripsCarouselProps = {
  adventures?: Adventure[];
};

function uniqueBySlug(trips: Adventure[]) {
  const seen = new Set<string>();

  return trips.filter((trip) => {
    if (seen.has(trip.slug)) return false;
    seen.add(trip.slug);
    return true;
  });
}

function getFeaturedTrips(adventures: Adventure[]) {
  const featuredTrips = uniqueBySlug([
    ...adventures.filter((adventure) => adventure.featured),
    ...ADVENTURES.filter((adventure) => adventure.featured),
  ]);

  return featuredTrips
    .sort((a, b) => {
      if (a.slug === "mongolia-festival-experience") return -1;
      if (b.slug === "mongolia-festival-experience") return 1;
      return 0;
    })
    .slice(0, 4);
}

export function FeaturedTripsCarousel({ adventures = ADVENTURES }: FeaturedTripsCarouselProps) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale];
  const featuredTrips = getFeaturedTrips(adventures);
  // Built-in sample trips fill the grid when the catalogue has too few
  // featured ones, but only catalogue trips have a /tours/<slug> page; the
  // rest go straight to the planning form instead of a 404.
  const slugsWithPage = new Set(adventures.map((adventure) => adventure.slug));

  if (featuredTrips.length === 0) {
    return null;
  }

  return (
    <section id="trips" className="bg-background py-16 lg:py-20">
      <Container>
        <SectionHeading
          tone="light"
          align="center"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.subtitle}
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {featuredTrips.map((adventure, index) => {
            const text = getAdventureText(adventure, contentLocale);
            const isFestivalCard = adventure.slug === "mongolia-festival-experience";
            const title =
              contentLocale === "mn" && isFestivalCard ? "Монгол Фестивалийн аялал" : text.title;
            const summary =
              contentLocale === "mn" && isFestivalCard
                ? "Наадам, хотын соёлын арга хэмжээ, үндэсний хоол, музей болон өдөр бүрийн уян хатан хөтөлбөртэй фестивалийн аялал."
                : text.summary;
            const image = getHighResolutionImageUrl(adventure.image);
            const slug = encodeURIComponent(adventure.slug);
            const href = slugsWithPage.has(adventure.slug)
              ? `/tours/${slug}`
              : `/plan?trip=${slug}`;

            return (
              <motion.div
                key={adventure.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  href={href}
                  className={cn(CARD_FRAME, "aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/3]")}
                >
                  <CardMedia
                    src={image}
                    alt={title}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <CardOverlay>
                    <CardMeta
                      items={[
                        { label: text.country },
                        { label: text.location, icon: MapPin },
                        { label: `${adventure.days} ${copy.day}`, icon: CalendarDays },
                      ]}
                    />
                    <CardTitle>{title}</CardTitle>
                    <p className="trip-copy-text mt-3 line-clamp-2 max-w-md text-sm text-white/80">
                      {summary}
                    </p>
                    <span className={cn(CARD_CTA, "mt-4 self-start")}>
                      {copy.details}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </CardOverlay>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
