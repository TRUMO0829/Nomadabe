"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Search, Users } from "lucide-react";
import type { Language } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/site-settings";

const HERO_TEXT = {
  mn: {
    badge: "★★★★★ 1,200+ аялагчийн үнэлгээ",
    title: "Нүүдэлчин хэв маягаар\nаялъя.",
    subtitle:
      "Монгол болон гадаад чиглэлийн жижиг групп аяллууд. Орон нутгийн туршлагатай баг таны аяллыг зохион байгуулна.",
    est: "2025 оноос · Улаанбаатар",
    where: "Хаашаа",
    whereValue: "Хаана ч · Монгол, Ази, Европ",
    when: "Хэзээ",
    whenValue: "Дурын сар",
    who: "Хэн",
    whoValue: "2 аялагч",
    search: "Хайх",
    scroll: "Доош",
    chips: ["Говь 7 өдөр", "Алтай треккинг", "Бүргэдчид", "Цаатан аялал", "Япон цана"],
  },
  en: {
    est: "Est. 2025 · Ulaanbaatar",
    where: "Where",
    whereValue: "Anywhere · Mongolia, Asia, Europe",
    when: "When",
    whenValue: "Any month",
    who: "Who",
    whoValue: "2 travellers",
    search: "Search",
    scroll: "Scroll",
    chips: ["Gobi 7-day", "Altai trekking", "Eagle hunters", "Reindeer tribe", "Japan ski"],
  },
};

type Props = {
  settings: SiteSettings;
  language: Language;
  onSearch: (query: string) => void;
};

export function Hero({ settings, language, onSearch }: Props) {
  const text = HERO_TEXT[language];
  const title = language === "mn" ? HERO_TEXT.mn.title : settings.heroTitle;
  const subtitle = language === "mn" ? HERO_TEXT.mn.subtitle : settings.heroSubtitle;
  const badge = language === "mn" ? HERO_TEXT.mn.badge : settings.heroBadge;
  const overlay = settings.heroOverlayOpacity;
  const heroTextColor = settings.heroTextColor;
  const accentColor = settings.accentColor;

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: `url('${settings.heroImage}')`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, ${overlay * 0.55}), rgba(0, 0, 0, ${
            overlay * 0.28
          }), rgba(0, 0, 0, ${overlay}))`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-28 lg:top-32 left-6 lg:left-10 right-6 lg:right-10 flex items-center justify-between"
        style={{ color: heroTextColor }}
      >
        <span className="text-xs lg:text-sm tracking-[0.2em] uppercase opacity-80">
          {badge}
        </span>
        <span className="hidden lg:block text-xs tracking-[0.2em] uppercase opacity-80">
          {text.est}
        </span>
      </motion.div>

      <div className="relative mx-auto max-w-7xl w-full px-6 lg:px-10 pb-16 lg:pb-24 pt-32">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl lg:text-8xl xl:text-9xl leading-[0.95] tracking-tight text-balance max-w-5xl"
          style={{ color: heroTextColor }}
        >
          {title.split("\n").map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {index === 1 ? <span className="italic">{line}</span> : line}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-6 text-lg lg:text-xl max-w-2xl opacity-85"
          style={{ color: heroTextColor }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-10 lg:mt-14 bg-background/95 backdrop-blur rounded-2xl lg:rounded-full p-2 lg:p-2 shadow-2xl max-w-4xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_auto] gap-1">
            <button
              type="button"
              onClick={() => onSearch(language === "mn" ? "Монгол" : "Mongolia")}
              className="flex items-center gap-3 px-5 py-3 lg:py-2 hover:bg-muted rounded-xl lg:rounded-full transition-colors text-left"
            >
              <MapPin className="w-5 h-5 shrink-0" style={{ color: accentColor }} />
              <span className="flex-1 min-w-0">
                <span className="block text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {text.where}
                </span>
                <span className="block text-sm font-medium truncate">
                  {text.whereValue}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onSearch("2026")}
              className="flex items-center gap-3 px-5 py-3 lg:py-2 hover:bg-muted rounded-xl lg:rounded-full transition-colors cursor-pointer border-t lg:border-t-0 lg:border-l border-border/50 text-left"
            >
              <Calendar className="w-5 h-5 shrink-0" style={{ color: accentColor }} />
              <span className="flex-1 min-w-0">
                <span className="block text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {text.when}
                </span>
                <span className="block text-sm font-medium truncate">
                  {text.whenValue}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onSearch("Small group")}
              className="flex items-center gap-3 px-5 py-3 lg:py-2 hover:bg-muted rounded-xl lg:rounded-full transition-colors cursor-pointer border-t lg:border-t-0 lg:border-l border-border/50 text-left"
            >
              <Users className="w-5 h-5 shrink-0" style={{ color: accentColor }} />
              <span className="flex-1 min-w-0">
                <span className="block text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {text.who}
                </span>
                <span className="block text-sm font-medium truncate">
                  {text.whoValue}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onSearch("")}
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90 lg:rounded-full"
              style={{ backgroundColor: accentColor }}
            >
              <Search className="w-5 h-5" />
              <span>{text.search}</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {text.chips.map((query) => (
            <button
              key={query}
              type="button"
              onClick={() => onSearch(query)}
              className="text-xs lg:text-sm border rounded-full px-4 py-1.5 transition-colors backdrop-blur-sm hover:bg-white hover:text-foreground"
              style={{ color: heroTextColor, borderColor: `${heroTextColor}66` }}
            >
              {query}
            </button>
          ))}
        </motion.div>
      </div>

      <div
        className="absolute bottom-6 right-6 hidden origin-bottom-right rotate-90 items-center gap-3 text-xs uppercase tracking-[0.3em] opacity-70 lg:right-10 lg:flex"
        style={{ color: heroTextColor }}
      >
        <span>{text.scroll}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </section>
  );
}
