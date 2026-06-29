"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteSettings } from "@/lib/site-settings";
import { useLanguage } from "./language-provider";

const HERO_VIDEOS = [
  "/hero/hero1.mp4",
  "/hero/hero2.mp4",
  "/hero/hero3.mp4",
  "/hero/hero4.mp4",
];

const DEFAULT_HERO_HEADING = "Дараагийн түвшинд аял.";
const LEGACY_HERO_HEADINGS = new Set([
  "Аяллаа нүүдэлчин хэмнэлээр.",
  "Аяллаа\nнүүдэлчин хэмнэлээр.",
  "Аяллаа нүүдэлчин хэмнэлээр",
  "Аяллаа\nнүүдэлчин хэмнэлээр",
]);

type HeroProps = {
  settings?: SiteSettings;
};

export function Hero({ settings }: HeroProps) {
  const { contentLocale } = useLanguage();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  const savedHeading = settings?.heroTitle?.trim() ?? "";
  const heading =
    savedHeading && !LEGACY_HERO_HEADINGS.has(savedHeading)
      ? settings?.heroTitle ?? savedHeading
      : contentLocale === "mn"
        ? DEFAULT_HERO_HEADING
        : "Travel, elevated.";
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
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/tours"
            aria-label={heading}
            className="group inline-flex items-center gap-2 rounded-[1rem] border border-[#d7bd6c]/70 bg-[#050504]/25 px-5 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-[#ffd400]/85 hover:bg-[#050504]/45 sm:px-6 sm:py-3.5"
          >
            <h1
              className="hero-heading max-w-5xl whitespace-pre-line text-xs font-black leading-tight sm:text-base lg:text-lg xl:text-2xl"
              style={{ color: textColor }}
            >
              <span className="hero-title-mark">{heading}</span>
            </h1>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
