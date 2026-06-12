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
      className="relative flex min-h-[92svh] items-center justify-center overflow-hidden bg-primary px-5 py-24 sm:px-8 lg:min-h-screen lg:px-12"
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/14" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.035)_90%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/70 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.05 }}
          onSubmit={handleSearch}
          aria-label={searchCopy.label}
          className="absolute left-1/2 top-[-6.2rem] flex w-[min(92vw,620px)] -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-[#fff8e4]/32 p-1.5 text-left shadow-[0_8px_22px_rgba(0,0,0,0.24)] sm:top-[-6.8rem] sm:p-2 lg:top-[-8.6rem]"
        >
          <Search className="ml-3 h-4 w-4 shrink-0 text-foreground/70 sm:ml-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchCopy.placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-foreground outline-none placeholder:text-foreground/60"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-black text-accent-foreground transition-colors hover:bg-secondary"
          >
            {searchCopy.button}
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="max-w-4xl text-balance font-sans text-3xl font-black leading-[0.9] text-white sm:text-4xl lg:text-5xl xl:text-6xl"
        >
          <span className="hero-title-mark block">{t.hero.headingLine1}</span>
          <span className="block text-5xl leading-[0.86] text-accent drop-shadow-[0_6px_14px_rgba(0,0,0,0.58)] sm:text-6xl lg:text-7xl xl:text-8xl">
            {t.hero.headingEmphasis}
          </span>
          <span className="hero-title-mark block">{t.hero.headingLine2}</span>
        </motion.h1>

      </div>
    </section>
  );
}
