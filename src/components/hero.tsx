"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
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
  const currentLanguage =
    LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0];

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
          background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.1}), rgba(0,0,0,${overlayOpacity * 0.08}), rgba(0,0,0,${overlayOpacity * 0.24}))`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.16)_100%)]" />

      <div className="pointer-events-none absolute inset-x-0 top-[9vh] z-10 flex justify-center px-6">
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

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-1 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-[28vh] flex justify-center"
        >
          <nav
            aria-label="Hero navigation"
            className="flex max-w-[92vw] flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-xl border border-white/20 bg-black/24 px-5 py-2.5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-md sm:gap-x-4 sm:px-8"
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
            <div
              aria-label={t.nav.language}
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setLanguageOpen(false);
                }
              }}
            >
              <button
                type="button"
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen((value) => !value)}
                className="nav-text inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:text-accent sm:text-sm"
              >
                {currentLanguage.short}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    languageOpen && "rotate-180"
                  )}
                />
              </button>

              {languageOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.7rem)] min-w-36 overflow-hidden rounded-lg border border-white/20 bg-black/72 p-1 text-white shadow-xl backdrop-blur-md">
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
                        "nav-text flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors",
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
          </nav>
        </motion.div>
      </div>
    </section>
  );
}
