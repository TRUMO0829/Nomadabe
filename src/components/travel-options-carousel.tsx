"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { useLanguage } from "./language-provider";

const COPY = {
  mn: {
    eyebrow: "Дотоод аяллууд",
    title: "Аяллын сонголтууд",
    body:
      "Монгол орны говь, нуур, уулсын чиглэлүүдийг гэр бүл, найз нөхөд, хамт олонд зориулан сонгоорой.",
    priceFrom: "Эхлэх үнэ",
    quote: "Санал авах",
    details: "Дэлгэрэнгүй",
    day: "хоног",
    previous: "Өмнөх",
    next: "Дараах",
  },
  en: {
    eyebrow: "Domestic trips",
    title: "Travel options",
    body:
      "Choose Mongolia routes across the Gobi, lakes, and mountains for family, friends, and teams.",
    priceFrom: "From",
    quote: "Request quote",
    details: "Details",
    day: "days",
    previous: "Previous",
    next: "Next",
  },
} as const;

type TravelOptionsCarouselProps = {
  adventures?: Adventure[];
};

export function TravelOptionsCarousel({
  adventures = ADVENTURES,
}: TravelOptionsCarouselProps) {
  const { locale } = useLanguage();
  const copy = COPY[locale];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const domesticOptions = adventures.filter(
    (adventure) => adventure.country === "Mongolia"
  );

  function scrollByCard(direction: "prev" | "next") {
    scrollerRef.current?.scrollBy({
      left: direction === "next" ? 360 : -360,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-background py-20 lg:py-28">
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
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-accent hover:bg-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={copy.next}
              onClick={() => scrollByCard("next")}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-accent hover:bg-accent"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {domesticOptions.map((adventure, idx) => {
            const text = getAdventureText(adventure, locale);
            const price =
              adventure.price > 0
                ? `${adventure.price.toLocaleString()} ${adventure.currency}`
                : copy.quote;

            return (
              <motion.article
                key={adventure.id}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.05 }}
                className="group relative flex min-w-[78vw] snap-start flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-accent hover:shadow-xl sm:min-w-[420px] lg:min-w-[360px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${adventure.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
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

                <div className="flex flex-1 flex-col p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {copy.priceFrom}
                  </div>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-balance">
                    {text.title}
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
