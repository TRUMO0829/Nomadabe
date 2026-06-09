"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mountain, Star, Users } from "lucide-react";
import type { Adventure } from "@/lib/adventures";
import type { Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { AdventureModal } from "./adventure-modal";

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-800",
  Moderate: "bg-amber-100 text-amber-800",
  Challenging: "bg-orange-100 text-orange-800",
  Tough: "bg-red-100 text-red-800",
};

const TEXT = {
  mn: {
    eyebrow: "★ Онцлох аяллууд",
    title: "Бизнес аялал, expo, амралт зугаалга.",
    all: "Бүх аяллыг харах",
    duration: "өдөр",
    price: "Үнэ",
    quote: "Санал авах",
    details: "Дэлгэрэнгүй",
    results: "илэрц",
    clear: "Шүүлтүүр арилгах",
    empty: "Тохирох аялал олдсонгүй. Бүх аяллыг дахин харна уу.",
  },
  en: {
    eyebrow: "★ Featured adventures",
    title: "Business trips, expos, leisure escapes.",
    all: "View all trips",
    duration: "days",
    price: "Price",
    quote: "Request quote",
    details: "Details",
    results: "results",
    clear: "Clear filter",
    empty: "No matching trips yet. Clear the filter to view all trips.",
  },
};

type Props = {
  adventures: Adventure[];
  language: Language;
  query: string;
  onQueryChange: (query: string) => void;
};

export function FeaturedAdventures({ adventures, language, query, onQueryChange }: Props) {
  const [selected, setSelected] = useState<Adventure | null>(null);
  const text = TEXT[language];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredAdventures = normalizedQuery
    ? adventures.filter((adventure) =>
        [
          adventure.title,
          adventure.location,
          adventure.country,
          adventure.category,
          adventure.summary,
          adventure.nextDeparture ?? "",
          adventure.groupSize,
          ...adventure.tags,
          ...adventure.idealFor,
          ...adventure.includes,
          ...adventure.businessSupport,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : adventures;

  return (
    <section id="adventures" className="py-24 lg:py-32 bg-background scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div>
            <p className="text-xs lg:text-sm tracking-[0.2em] uppercase text-accent font-semibold mb-4">
              {text.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-balance max-w-2xl">
              {text.title}
            </h2>
            {query ? (
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>
                  “{query}” · {filteredAdventures.length} {text.results}
                </span>
                <button
                  type="button"
                  onClick={() => onQueryChange("")}
                  className="font-semibold text-accent hover:text-accent/80"
                >
                  {text.clear}
                </button>
              </div>
            ) : null}
          </div>
          <a
            href="#adventures"
            onClick={(event) => {
              event.preventDefault();
              onQueryChange("");
            }}
            className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-accent transition-colors group whitespace-nowrap"
          >
            {text.all}
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredAdventures.map((adventure, index) => (
            <motion.article
              key={adventure.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.07 }}
              onClick={() => setSelected(adventure)}
              className="group cursor-pointer flex flex-col rounded-3xl overflow-hidden bg-card border border-border hover:border-foreground/20 transition-all hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${adventure.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full",
                      difficultyColor[adventure.difficulty]
                    )}
                  >
                    {adventure.difficulty}
                  </span>
                  {adventure.tags.slice(0, 1).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-white/95 text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{adventure.rating}</span>
                    <span className="opacity-70">({adventure.reviews})</span>
                    <span className="mx-2 opacity-50">·</span>
                    <span>
                      {adventure.location}, {adventure.country}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4 flex-1">
                <h3 className="font-display text-2xl leading-tight text-balance">
                  {adventure.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mountain className="w-4 h-4" />
                    {adventure.days} {text.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {adventure.groupSize}
                  </span>
                </div>
                <div className="flex items-end justify-between pt-4 border-t border-border mt-auto gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">{text.price}</div>
                    <div className="font-display text-2xl">
                      {adventure.price > 0
                        ? `${adventure.price.toLocaleString()} ${adventure.currency}`
                        : text.quote}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelected(adventure);
                    }}
                    className="rounded-full bg-foreground text-background text-sm font-semibold px-4 py-2 group-hover:bg-accent transition-colors"
                  >
                    {text.details} →
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredAdventures.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            {text.empty}
          </div>
        ) : null}
      </div>

      <AdventureModal
        key={selected?.id ?? "empty-adventure"}
        adventure={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
