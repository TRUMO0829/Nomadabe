"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { SiteSettings } from "@/lib/site-settings";
import { useLanguage } from "./language-provider";

const DEFAULT_HERO_BACKGROUNDS = [
  "/nomadabe-hero-panorama.webp",
  "/hero-winter.webp",
  "/hero-spring.webp",
  "/hero-autumn.webp",
];

type HeroProps = {
  settings?: SiteSettings;
};

export function Hero({ settings }: HeroProps) {
  const { contentLocale, t } = useLanguage();
  const [activeImage, setActiveImage] = useState(0);
  const heroImages = [
    settings?.heroImage,
    ...DEFAULT_HERO_BACKGROUNDS,
  ].filter((image, index, images): image is string =>
    Boolean(image && images.indexOf(image) === index)
  );
  const heading = settings?.heroTitle?.trim()
    ? settings.heroTitle
    : `${t.hero.headingLine1} ${t.hero.headingEmphasis} ${t.hero.headingLine2}`;
  const body = settings?.heroSubtitle?.trim() || t.hero.body;
  const badge = settings?.heroBadge?.trim();
  const textColor = settings?.heroTextColor || "#ffffff";
  const accentColor = settings?.accentColor || "#FFD400";
  const overlayOpacity = settings?.heroOverlayOpacity ?? 0.36;
  const ctaCopy = {
    mn: { trips: "Аяллууд харах", plan: "Аялал төлөвлөх" },
    en: { trips: "View trips", plan: "Plan a trip" },
    zh: { trips: "查看旅行", plan: "规划旅行" },
    ja: { trips: "ツアーを見る", plan: "旅行を計画" },
    ko: { trips: "여행 보기", plan: "여행 계획" },
  }[contentLocale];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section
      id="hero"
      className="home-hero-screen relative flex items-center justify-center overflow-hidden bg-primary px-5 py-24 sm:px-8 lg:px-12"
    >
      <span id="home" className="absolute left-0 top-0" aria-hidden="true" />
      {heroImages.map((image, index) => (
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
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.16}), rgba(0,0,0,${overlayOpacity * 0.06}), rgba(0,0,0,${overlayOpacity * 0.36}))`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.04)_90%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/70 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-1 text-center">
        {badge ? (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="mb-4 max-w-full rounded-full border border-white/35 bg-black/24 px-4 py-2 text-[11px] font-black uppercase text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur"
          >
            {badge}
          </motion.p>
        ) : null}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="hero-heading max-w-5xl whitespace-pre-line text-2xl font-black leading-tight sm:text-4xl lg:text-5xl xl:text-6xl"
          style={{ color: textColor }}
        >
          <span className="hero-title-mark">
            {heading}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-5 max-w-2xl text-sm font-bold leading-7 drop-shadow-[0_3px_14px_rgba(0,0,0,0.58)] sm:text-base lg:text-lg"
          style={{ color: textColor }}
        >
          {body}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/tours"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-accent bg-accent px-6 text-sm font-black uppercase text-accent-foreground shadow-[0_18px_44px_rgba(17,16,11,0.22)] transition-colors hover:bg-white"
            style={{
              backgroundColor: accentColor,
              borderColor: accentColor,
            }}
          >
            {ctaCopy.trips}
          </Link>
          <Link
            href="/plan"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/55 bg-black/28 px-6 text-sm font-black uppercase text-white shadow-[0_18px_44px_rgba(17,16,11,0.18)] backdrop-blur transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
          >
            {ctaCopy.plan}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
