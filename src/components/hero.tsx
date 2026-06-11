"use client";

import { type FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { useLanguage } from "./language-provider";

const HERO_BACKGROUNDS = [
  "/nomadabe-hero-panorama.png",
  "/hero-winter.jpg",
  "/hero-spring.jpg",
  "/hero-autumn.jpg",
];

const HERO_SEARCH_COPY = {
  mn: {
    placeholder: "Аялал, улс, хот хайх...",
    button: "Хайх",
    label: "Аялал хайх",
  },
  en: {
    placeholder: "Search trips, countries, cities...",
    button: "Search",
    label: "Search trips",
  },
  zh: {
    placeholder: "搜索旅行、国家、城市...",
    button: "搜索",
    label: "搜索旅行",
  },
  ja: {
    placeholder: "ツアー、国、都市を検索...",
    button: "検索",
    label: "ツアーを検索",
  },
  ko: {
    placeholder: "여행, 국가, 도시 검색...",
    button: "검색",
    label: "여행 검색",
  },
} as const;

export function Hero() {
  const { contentLocale, t } = useLanguage();
  const [activeImage, setActiveImage] = useState(0);
  const [query, setQuery] = useState("");
  const searchCopy = HERO_SEARCH_COPY[contentLocale];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % HERO_BACKGROUNDS.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    window.location.href = trimmedQuery
      ? `/tours?search=${encodeURIComponent(trimmedQuery)}`
      : "/tours";
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary px-6 py-24 lg:px-10"
    >
      {HERO_BACKGROUNDS.map((image, index) => (
        <motion.div
          key={image}
          aria-hidden="true"
          initial={false}
          animate={{ opacity: activeImage === index ? 1 : 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage: `url('${image}')`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/85" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.05 }}
          onSubmit={handleSearch}
          aria-label={searchCopy.label}
          className="mb-8 flex w-full max-w-3xl items-center gap-3 rounded-full border border-white/28 bg-white/10 p-2 text-left shadow-2xl backdrop-blur-md"
        >
          <Search className="ml-4 h-5 w-5 shrink-0 text-accent" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchCopy.placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/72 sm:text-base"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-black text-accent-foreground transition-colors hover:bg-secondary"
          >
            {searchCopy.button}
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="max-w-5xl text-balance font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-8xl xl:text-9xl"
        >
          {t.hero.headingLine1}
          <br />
          <span className="italic text-accent">{t.hero.headingEmphasis}</span>{" "}
          {t.hero.headingLine2}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-5 max-w-2xl text-balance text-sm leading-relaxed text-white/82 sm:text-base lg:text-lg"
        >
          {t.hero.body}
        </motion.p>
      </div>
    </section>
  );
}
