"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Globe2 } from "lucide-react";
import { LANGUAGES } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

const HERO_VIDEOS = [
  "/hero/web/hero1-1080.mp4",
  "/hero/web/hero2-1080.mp4",
  "/hero/web/hero3-1080.mp4",
  "/hero/web/hero4-1080.mp4",
];

const FALLBACK_HERO_POSTER = "/nomadabe-hero-panorama.webp";

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

const HERO_LANGUAGE_OPTIONS = LANGUAGES.filter((language) =>
  ["mn", "zh", "en", "ja"].includes(language.code)
);

function openSignupPrompt() {
  window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
}

export function Hero({ settings }: HeroProps) {
  const { contentLocale, locale, setLocale, t } = useLanguage();
  const [languageOpen, setLanguageOpen] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const overlayOpacity = settings?.heroOverlayOpacity ?? 0.36;
  const poster = settings?.heroImage?.startsWith("/")
    ? settings.heroImage
    : FALLBACK_HERO_POSTER;
  const configuredVideos = settings?.heroVideos
    ?.map((src) => src.trim())
    .filter(Boolean)
    .slice(0, 8);
  const heroVideos =
    configuredVideos && configuredVideos.length > 0 ? configuredVideos : HERO_VIDEOS;
  const copy = HERO_NAV_COPY[contentLocale];
  const navItems = [
    { label: copy.trips, href: "/tours" },
    { label: copy.about, href: "/about" },
    { label: copy.order, href: "/plan" },
  ];

  const total = heroVideos.length;

  // Keep only the active 2160p clip playing so the landing page starts with
  // motion quickly instead of competing downloads for every hero video.
  useEffect(() => {
    if (active >= total) {
      setActive(0);
      return;
    }

    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, total]);

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
      {heroVideos.map((src, index) => {
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
            preload={isActive ? "auto" : "metadata"}
            poster={poster}
            src={src}
            width={3840}
            height={2160}
            onEnded={() => {
              if (isActive) setActive((current) => (current + 1) % total);
            }}
            className="absolute inset-0 h-full w-full scale-105 object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: isActive ? 1 : 0 }}
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
      <span
        aria-hidden="true"
        className="hero-credit-watermark pointer-events-none absolute bottom-[7vh] right-[7vw] z-10 text-[clamp(1rem,1.7vw,1.65rem)] italic text-white/20 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
      >
        created by coziestone
      </span>

      <div className="pointer-events-none absolute inset-x-0 top-[7vh] z-20 flex justify-center px-6">
        <Link
          href="/#home"
          aria-label="Nomadabe Travel"
          className="pointer-events-auto inline-flex items-center justify-center"
        >
          <Image
            src="/nomadabe-logo-cropped.webp"
            alt="Nomadabe Travel"
            width={574}
            height={615}
            priority
            sizes="112px"
            className="h-[104px] w-auto object-contain brightness-0 invert drop-shadow-[0_8px_24px_rgba(0,0,0,0.28)] sm:h-[122px]"
          />
        </Link>
      </div>

      <div className="absolute inset-x-0 bottom-[30vh] z-10 flex justify-center px-5 sm:bottom-[32vh]">
        <motion.nav
          aria-label="Hero navigation"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setLanguageOpen(false);
            }
          }}
          className="relative flex max-w-[92vw] flex-wrap items-center justify-center gap-x-3 gap-y-2 overflow-visible rounded-xl bg-white/[0.018] px-5 py-2.5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[2px] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:bg-[linear-gradient(115deg,rgba(255,255,255,0.035),rgba(255,255,255,0.006)_48%,rgba(255,255,255,0.025))] sm:gap-x-4 sm:px-8"
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
          <span aria-hidden="true" className="text-white/72">
            |
          </span>
          <div className="relative inline-flex">
            <button
              type="button"
              aria-label={t.nav.language}
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((value) => !value)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:text-accent"
            >
              <Globe2 className="h-4 w-4" />
              <ChevronDown
                className={cn(
                  "absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 transition-transform",
                  languageOpen && "rotate-180"
                )}
              />
            </button>

            {languageOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.55rem)] min-w-40 overflow-hidden rounded-xl bg-black/70 p-1 text-white shadow-xl backdrop-blur-md">
                {HERO_LANGUAGE_OPTIONS.map((language) => (
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
        </motion.nav>
      </div>
    </section>
  );
}
