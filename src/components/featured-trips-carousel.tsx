"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { ADVENTURES, getAdventureText } from "@/lib/adventures";
import { useLanguage } from "./language-provider";

const COPY = {
  mn: {
    eyebrow: "Онцлох аяллууд",
    title: "Онцлох аяллууд",
    body:
      "Хамгийн их сонирхол татдаг бизнес, expo, амралт болон захиалгат аяллын 4 багц.",
    priceFrom: "Эхлэх үнэ",
    quote: "Санал авах",
    details: "Дэлгэрэнгүй",
    day: "хоног",
  },
  en: {
    eyebrow: "Featured trips",
    title: "Featured trips",
    body:
      "Four popular business, expo, leisure, and custom travel packages from Nomadabe.",
    priceFrom: "From",
    quote: "Request quote",
    details: "Details",
    day: "days",
  },
} as const;

const FEATURED_TRIPS = ADVENTURES.filter(
  (adventure) => adventure.featured && adventure.country !== "Mongolia"
).slice(0, 4);

export function FeaturedTripsCarousel() {
  const { locale } = useLanguage();
  const copy = COPY[locale];

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-2xl lg:mb-12">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground lg:text-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {copy.eyebrow}
          </p>
          <h2 className="font-display text-4xl text-balance sm:text-5xl lg:text-6xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {copy.body}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {FEATURED_TRIPS.map((adventure, idx) => {
            const text = getAdventureText(adventure, locale);
            const price =
              adventure.price > 0
                ? `${adventure.price.toLocaleString()} ${adventure.currency}`
                : copy.quote;

            return (
              <motion.article
                key={adventure.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: idx * 0.05 }}
                className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-accent hover:shadow-xl lg:grid lg:grid-cols-[240px_1fr]"
              >
                <div className="relative min-h-[240px] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${adventure.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
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

                <div className="flex flex-col p-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    {adventure.rating} ({adventure.reviews})
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-tight text-balance">
                    {text.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {text.summary}
                  </p>
                  <a
                    href="/tours"
                    className="mt-auto inline-flex w-fit rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
