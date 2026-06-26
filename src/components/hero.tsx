"use client";

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
  const { t } = useLanguage();
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
  const textColor = settings?.heroTextColor || "#ffffff";
  const overlayOpacity = settings?.heroOverlayOpacity ?? 0.36;

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
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage: `url('${heroImages[0]}')`,
        }}
      />
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
          background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.34}), rgba(0,0,0,${overlayOpacity * 0.16}), rgba(0,0,0,${overlayOpacity * 0.46}))`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.04)_90%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-1 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="hero-heading max-w-5xl whitespace-pre-line text-2xl font-black leading-tight sm:text-4xl lg:text-5xl xl:text-6xl"
          style={{ color: textColor }}
        >
          <span className="hero-title-mark">{heading}</span>
        </motion.h1>
      </div>
    </section>
  );
}
