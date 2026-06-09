"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  MapPinned,
  Mountain,
  Search,
  SlidersHorizontal,
  Star,
  Users,
} from "lucide-react";
import { ADVENTURES, getAdventureText, type Adventure } from "@/lib/adventures";
import { cn } from "@/lib/utils";
import { AdventureModal } from "./adventure-modal";
import { useLanguage } from "./language-provider";

type TripScope = "all" | "outbound" | "domestic";

const difficultyColor: Record<string, string> = {
  Easy: "bg-accent text-accent-foreground",
  Moderate: "bg-secondary text-foreground",
  Challenging: "bg-primary text-primary-foreground",
  Tough: "bg-red-100 text-red-800",
};

const SECTION_COPY = {
  mn: {
    eyebrow: "Аяллууд",
    title: "Бүх аяллаа нэг дороос хайж сонго.",
    body:
      "Гадаад болон дотоод аяллуудыг чиглэл, нэр, аяллын төрлөөр нь хурдан хайж үзээрэй.",
    all: "Бүх аялал",
    outbound: "Гадаад аялал",
    domestic: "Дотоод аялал",
    search: "Аялал хайх...",
    listTitle: "Бүх аяллын жагсаалт",
    listBody: "Сонгосон аяллаа дарж дэлгэрэнгүй мэдээлэл, үнэ, багцын нөхцөлийг хараарай.",
    result: "аялал",
  },
  en: {
    eyebrow: "Trips",
    title: "Find every trip in one place.",
    body:
      "Search outbound and domestic trips by destination, name, or travel style.",
    all: "All trips",
    outbound: "Outbound trips",
    domestic: "Domestic trips",
    search: "Search trips...",
    listTitle: "All available trips",
    listBody: "Open a trip to view details, pricing, inclusions, and planning notes.",
    result: "trips",
  },
} as const;

export function FeaturedAdventures() {
  const [selected, setSelected] = useState<Adventure | null>(null);
  const [scope, setScope] = useState<TripScope>("all");
  const [query, setQuery] = useState("");
  const { locale, t } = useLanguage();
  const sectionCopy = SECTION_COPY[locale];

  const outboundCount = useMemo(
    () => ADVENTURES.filter((adventure) => adventure.country !== "Mongolia").length,
    []
  );
  const domesticCount = useMemo(
    () => ADVENTURES.filter((adventure) => adventure.country === "Mongolia").length,
    []
  );

  const filteredAdventures = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return ADVENTURES.filter((adventure) => {
      const text = getAdventureText(adventure, locale);
      const isDomestic = adventure.country === "Mongolia";
      const searchText = [
        text.title,
        text.location,
        text.country,
        text.summary,
        adventure.category,
        ...text.tags,
        ...text.idealFor,
      ]
        .join(" ")
        .toLowerCase();

      const matchesScope =
        scope === "all" ||
        (scope === "domestic" && isDomestic) ||
        (scope === "outbound" && !isDomestic);
      const matchesQuery =
        !normalizedQuery || searchText.includes(normalizedQuery);

      return matchesScope && matchesQuery;
    });
  }, [locale, query, scope]);

  const scopeOptions = [
    {
      key: "all" as const,
      label: sectionCopy.all,
      count: ADVENTURES.length,
      icon: SlidersHorizontal,
    },
    {
      key: "outbound" as const,
      label: sectionCopy.outbound,
      count: outboundCount,
      icon: Globe2,
    },
    {
      key: "domestic" as const,
      label: sectionCopy.domestic,
      count: domesticCount,
      icon: MapPinned,
    },
  ];

  return (
    <section id="adventures" className="bg-background">
      <div className="relative overflow-hidden bg-primary px-6 pb-16 pt-32 text-primary-foreground lg:px-10 lg:pb-20 lg:pt-40">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/nomadabe-hero-panorama.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-primary/90 to-primary" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-accent lg:text-sm">
            {sectionCopy.eyebrow}
          </p>
          <div>
            <h1 className="max-w-4xl text-balance font-display text-5xl leading-none sm:text-6xl lg:text-7xl">
              {sectionCopy.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/75 lg:text-xl">
              {sectionCopy.body}
            </p>
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/15 bg-background p-3 text-foreground shadow-2xl">
            <label className="flex items-center gap-4 rounded-full bg-card px-5 py-4">
              <Search className="h-6 w-6 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={sectionCopy.search}
                className="min-w-0 flex-1 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground lg:text-xl"
              />
              <SlidersHorizontal className="h-6 w-6 shrink-0 text-muted-foreground" />
            </label>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {scopeOptions.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setScope(item.key)}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold transition-colors",
                    scope === item.key
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground hover:border-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.count} {item.label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 px-1 pb-1">
              {t.hero.quick.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="rounded-md border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-accent hover:text-foreground lg:text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="all" className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:mb-10 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-foreground lg:text-sm">
              {sectionCopy.eyebrow}
            </p>
            <h2 className="font-display text-3xl text-balance sm:text-4xl lg:text-5xl">
              {sectionCopy.listTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
              {sectionCopy.listBody}
            </p>
          </div>
          <div className="rounded-full border border-border bg-card px-5 py-2 text-sm font-bold text-foreground">
            {filteredAdventures.length} {sectionCopy.result}
          </div>
        </div>

        <div className="space-y-5">
          {filteredAdventures.map((adventure, idx) => {
            const text = getAdventureText(adventure, locale);

            return (
              <motion.article
                key={adventure.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.04, 0.24) }}
                onClick={() => setSelected(adventure)}
                className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-accent hover:shadow-xl lg:grid lg:grid-cols-[340px_1fr]"
              >
                <div className="relative min-h-[260px] overflow-hidden lg:min-h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${adventure.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                        difficultyColor[adventure.difficulty]
                      )}
                    >
                      {text.difficulty}
                    </span>
                    {text.tags.slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{adventure.rating}</span>
                    <span className="text-white/65">({adventure.reviews})</span>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-5 p-5 lg:p-7">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    <span>{text.location}</span>
                    <span>/</span>
                    <span>{text.country}</span>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
                    <div className="min-w-0">
                      <h3 className="font-display text-3xl leading-tight text-balance lg:text-4xl">
                        {text.title}
                      </h3>
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground lg:text-base">
                        {text.summary}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-4">
                      <div className="text-xs text-muted-foreground">
                        {t.featured.price}
                      </div>
                      <div className="mt-1 font-display text-2xl">
                        {adventure.price > 0
                          ? `${adventure.price.toLocaleString()} ${adventure.currency}`
                          : t.featured.quote}
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelected(adventure);
                        }}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground"
                      >
                        {t.featured.details}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mountain className="h-4 w-4 text-accent" />
                      <span>
                        {adventure.days} {t.featured.days}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-accent" />
                      <span>{text.groupSize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4 text-accent" />
                      <span>
                        {text.nextDeparture ??
                          adventure.nextDeparture ??
                          (locale === "mn" ? "Тохиролцоно" : "Flexible")}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filteredAdventures.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            {t.featured.noResults}
          </div>
        )}
      </div>

      <AdventureModal adventure={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
