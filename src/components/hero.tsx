"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { SiteSettings } from "@/lib/site-settings";
import { useLanguage } from "./language-provider";

const HERO_VIDEOS = [
  "/hero/hero1.mp4",
  "/hero/hero2.mp4",
  "/hero/hero3.mp4",
  "/hero/hero4.mp4",
];

type HeroProps = {
  settings?: SiteSettings;
};

export function Hero({ settings }: HeroProps) {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  const heading = settings?.heroTitle?.trim()
    ? settings.heroTitle
    : `${t.hero.headingLine1} ${t.hero.headingEmphasis} ${t.hero.headingLine2}`;
  const textColor = settings?.heroTextColor || "#ffffff";
  const overlayOpacity = settings?.heroOverlayOpacity ?? 0.36;
  const poster = settings?.heroImage || "/nomadabe-hero-panorama.webp";

  // Load + autoplay the next clip whenever the active index changes; the
  // clips cycle in order and loop. Muted autoplay is allowed by browsers.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.load();
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
  }, [active]);

  return (
    <section
      id="hero"
      className="home-hero-screen relative flex items-center justify-center overflow-hidden bg-primary px-5 py-24 sm:px-8 lg:px-12"
    >
      <span id="home" className="absolute left-0 top-0" aria-hidden="true" />

      {/* Poster shows instantly on entry, then the video fades in once it can play. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: `url('${poster}')` }}
      />
      <motion.video
        ref={videoRef}
        aria-hidden="true"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={poster}
        src={HERO_VIDEOS[active]}
        onCanPlay={() => setReady(true)}
        onEnded={() => setActive((index) => (index + 1) % HERO_VIDEOS.length)}
        initial={false}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        className="absolute inset-0 h-full w-full scale-105 object-cover"
      />

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
