"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Globe2 } from "lucide-react";
import { LANGUAGES } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

const HERO_VIDEOS = [
  "/hero/hero1-2160.mp4",
  "/hero/hero2-2160.mp4",
  "/hero/hero3-2160.mp4",
  "/hero/hero4-2160.mp4",
];

type HeroProps = {
  settings?: SiteSettings;
};

const HERO_NAV_COPY = {
  mn: {
    trips: "Аяллууд",
    about: "Бидний тухай",
    order: "Захиалга",
    login: "Нэвтрэх",
    search: "Хайлт",
  },
  en: {
    trips: "Trips",
    about: "About us",
    order: "Booking",
    login: "Login",
    search: "Search",
  },
  zh: {
    trips: "旅行",
    about: "关于我们",
    order: "预订",
    login: "登录",
    search: "搜索",
  },
  ja: {
    trips: "ツアー",
    about: "私たちについて",
    order: "予約",
    login: "ログイン",
    search: "検索",
  },
  ko: {
    trips: "여행",
    about: "소개",
    order: "예약",
    login: "로그인",
    search: "검색",
  },
} as const;

function openSignupPrompt() {
  window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
}

export function Hero({ settings }: HeroProps) {
  const { contentLocale, locale, setLocale, t } = useLanguage();
  const [languageOpen, setLanguageOpen] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  const overlayOpacity = settings?.heroOverlayOpacity ?? 0.36;
  const poster = settings?.heroImage || "/nomadabe-hero-panorama.webp";
  const copy = HERO_NAV_COPY[contentLocale];
  const navItems = [
    { label: copy.trips, href: "/tours" },
    { label: copy.about, href: "/about" },
    { label: copy.order, href: "/plan" },
  ];

  const total = HERO_VIDEOS.length;

  // Play the active clip from the start; all 2160p clips preload to keep the
  // crossfade from falling back to older cached media.
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

      {/* All clips are stacked; only the active one is visible. */}
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
            preload="auto"
            poster={poster}
            src={src}
            width={3840}
            height={2160}
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
          background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.04}), rgba(0,0,0,${overlayOpacity * 0.08}), rgba(0,0,0,${overlayOpacity * 0.2}))`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.08)_100%)]" />

      <div
        className="absolute left-5 top-5 z-20 sm:left-8 sm:top-7"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setLanguageOpen(false);
          }
        }}
      >
        <button
          type="button"
          aria-label={t.nav.language}
          aria-expanded={languageOpen}
          onClick={() => setLanguageOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/12 text-white shadow-[0_14px_42px_rgba(0,0,0,0.14)] backdrop-blur-md transition-colors hover:border-accent hover:bg-black/20"
        >
          <Globe2 className="h-4 w-4" />
          <ChevronDown
            className={cn(
              "absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-black/30 p-0.5 transition-transform",
              languageOpen && "rotate-180"
            )}
          />
        </button>

        {languageOpen ? (
          <div className="mt-2 min-w-40 overflow-hidden rounded-xl border border-white/20 bg-black/70 p-1 text-white shadow-xl backdrop-blur-md">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                type="button"
                aria-pressed={locale === language.code}
                title={language.label}
                onClick={() => {
                  setLocale(language.code);
                  setLanguageOpen(false);
                }}
                className={cn(
                  "nav-text flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors",
                  locale === language.code
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-white/12"
                )}
              >
                <span>{language.label}</span>
                <span>{language.short}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-[30vh] z-10 flex justify-center px-5 sm:bottom-[32vh]">
        <motion.nav
          aria-label="Hero navigation"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex max-w-[92vw] flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-xl border border-white/20 bg-white/18 px-5 py-2.5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-md sm:gap-x-4 sm:px-8"
        >
          {navItems.map((item) => (
            <span key={item.href} className="inline-flex items-center gap-x-3 sm:gap-x-4">
              <Link
                href={item.href}
                className="nav-text whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:text-accent sm:text-sm"
              >
                {item.label}
              </Link>
              <span aria-hidden="true" className="text-white/72">
                |
              </span>
            </span>
          ))}
          <button
            type="button"
            onClick={openSignupPrompt}
            className="nav-text whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:text-accent sm:text-sm"
          >
            {copy.login}
          </button>
          <span aria-hidden="true" className="text-white/72">
            |
          </span>
          <Link
            href="/tours"
            className="nav-text whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:text-accent sm:text-sm"
          >
            {copy.search}
          </Link>
        </motion.nav>
      </div>
    </section>
  );
}
