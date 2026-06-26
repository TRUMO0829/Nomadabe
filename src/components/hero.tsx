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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  const heading = settings?.heroTitle?.trim()
    ? settings.heroTitle
    : `${t.hero.headingLine1} ${t.hero.headingEmphasis} ${t.hero.headingLine2}`;
  const textColor = settings?.heroTextColor || "#ffffff";
  const overlayOpacity = settings?.heroOverlayOpacity ?? 0.36;
  const poster = settings?.heroImage || "/nomadabe-hero-panorama.webp";

  const total = HERO_VIDEOS.length;
  const nextIndex = (active + 1) % total;

  // Play the active clip from the start; pause/rewind the others. The next clip
  // is already preloaded (see `preload` below) so the crossfade never goes dark.
  useEffect(() => {
    setReady(false);
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active]);

  return (
    <section
      id="hero"
      className="home-hero-screen relative flex items-center justify-center overflow-hidden bg-primary px-5 py-24 sm:px-8 lg:px-12"
    >
      <span id="home" className="absolute left-0 top-0" aria-hidden="true" />

      {/* Poster bridges the brief moment before the active clip can play — a
          bright image, never a black frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: `url('${poster}')` }}
      />

      {/* All clips are stacked; only the active one is visible. The next clip is
          preloaded so it is already buffered before it fades in. */}
      {HERO_VIDEOS.map((src, index) => {
        const isActive = index === active;
        return (
          <video
            key={src}
            ref={(element) => {
              videoRefs.current[index] = element;
            }}
            aria-hidden="true"
            muted
            playsInline
            autoPlay={index === 0}
            preload={index === active || index === nextIndex ? "auto" : "metadata"}
            poster={poster}
            src={src}
            onCanPlay={() => {
              if (isActive) setReady(true);
            }}
            onEnded={() => {
              if (isActive) setActive((current) => (current + 1) % total);
            }}
            className="absolute inset-0 h-full w-full scale-105 object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: isActive && ready ? 1 : 0 }}
          />
        );
      })}

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
          className="hero-heading max-w-5xl whitespace-pre-line text-xl font-black leading-tight sm:text-3xl lg:text-4xl xl:text-5xl"
          style={{ color: textColor }}
        >
          <span className="hero-title-mark">{heading}</span>
        </motion.h1>
      </div>
    </section>
  );
}
