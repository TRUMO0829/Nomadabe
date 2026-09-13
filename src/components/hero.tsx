"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Globe2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/i18n";
import type { PublicSiteSettings } from "@/lib/site-settings";
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
  settings?: PublicSiteSettings;
};

const HERO_COPY = {
  mn: {
    title: "Гадаад, дотоод аяллаа бидэнтэй төлөвлө",
    body: "Бизнес аялал, үзэсгэлэн, амралт, гэр бүлийн аялал — маршрут, буудал, тээврийг Улаанбаатараас нэг дор зохион байгуулна.",
    primary: "Аялал төлөвлөх",
    secondary: "Аяллууд үзэх",
  },
  en: {
    title: "Plan your trip abroad or across Mongolia with us",
    body: "Business trips, expos, holidays and family travel — routes, hotels and transport arranged in one place from Ulaanbaatar.",
    primary: "Plan a trip",
    secondary: "Browse trips",
  },
  zh: {
    title: "与我们一起规划境外或蒙古国内旅行",
    body: "商务考察、展会、度假与家庭出游——线路、酒店与交通，从乌兰巴托一站式安排。",
    primary: "规划旅行",
    secondary: "浏览行程",
  },
  ja: {
    title: "海外・モンゴル国内の旅を私たちと計画しましょう",
    body: "出張、展示会、休暇、家族旅行まで。ルート、ホテル、交通をウランバートルからまとめて手配します。",
    primary: "旅行を計画する",
    secondary: "ツアーを見る",
  },
  ko: {
    title: "해외·몽골 국내 여행을 함께 계획하세요",
    body: "출장, 박람회, 휴가, 가족 여행까지 — 일정, 숙소, 교통을 울란바토르에서 한 번에 준비합니다.",
    primary: "여행 계획하기",
    secondary: "여행 보기",
  },
} as const;

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
  const reduceMotion = useReducedMotion();
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
  const heroCopy = HERO_COPY[contentLocale];
  const navItems = [
    { label: copy.trips, href: "/tours" },
    { label: copy.about, href: "/about" },
    { label: copy.order, href: "/plan" },
  ];

  const total = heroVideos.length;
  // Clamp during render rather than correcting it in an effect. The video list
  // is admin-editable, so `active` can point past the end after a save; a
  // setState inside the effect would render the wrong clip for one frame first.
  const activeIndex = active < total ? active : 0;
  const nextIndex = total > 1 ? (activeIndex + 1) % total : -1;

  // Keep only the active clip playing so the landing page starts with motion
  // quickly instead of competing downloads for every hero video. Visitors who
  // ask for reduced motion get the still poster instead of a looping video.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex && !reduceMotion) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex, reduceMotion]);

  return (
    <section
      id="hero"
      className="home-hero-screen relative flex items-center justify-center overflow-hidden bg-primary px-5 py-24 sm:px-8 lg:px-12"
    >
      <span id="home" className="absolute left-0 top-0" aria-hidden="true" />

      {/* Poster bridges the brief moment before the active clip can play — a
          bright image, never a black frame. This is the LCP element, so it goes
          through next/image (AVIF/WebP, sized to the viewport) with priority
          rather than a CSS background, which the optimiser cannot touch. */}
      <div aria-hidden="true" className="absolute inset-0 scale-105">
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover object-center"
        />
      </div>

      {/* All clips are stacked; only the active one is visible. */}
      {heroVideos.map((src, index) => {
        const isActive = index === activeIndex;
        return (
          <video
            key={src}
            ref={(element) => {
              videoRefs.current[index] = element;
            }}
            aria-hidden="true"
            muted
            playsInline
            autoPlay={index === 0 && !reduceMotion}
            // Only the playing clip and the one queued after it are fetched.
            // "metadata" on every clip still issued a range request per video,
            // which on a four-clip hero competed with the poster for bandwidth.
            preload={isActive ? "auto" : index === nextIndex ? "metadata" : "none"}
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
      {/* A soft dark well behind the headline so white text stays readable
          over the brightest frames of the video. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.38)_0%,rgba(0,0,0,0.12)_55%,rgba(0,0,0,0.08)_100%)]" />
      <span
        aria-hidden="true"
        className="hero-credit-watermark pointer-events-none absolute bottom-[3vh] right-[5vw] z-10 text-[clamp(0.9rem,1.4vw,1.4rem)] italic text-white/20 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
      >
        created by coziestone
      </span>

      <div className="pointer-events-none absolute inset-x-0 top-[6vh] z-20 flex justify-center px-6">
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
            sizes="(min-width: 1024px) 160px, 128px"
            className="h-20 w-auto object-contain brightness-0 invert drop-shadow-[0_8px_24px_rgba(0,0,0,0.28)] lg:h-28"
          />
        </Link>
      </div>

      {/* Slide only, no fade: the headline is server-rendered and must be
          visible before JavaScript loads (it is the page's H1 and LCP text). */}
      <motion.div
        initial={{ y: 16 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center pt-16 text-center text-white"
      >
        <h1 className="text-balance text-[clamp(1.75rem,4.4vw,3.9rem)] leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
          {heroCopy.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-lg">
          {heroCopy.body}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/plan" className={buttonVariants({ size: "lg" })}>
            {heroCopy.primary}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/tours"
            className={buttonVariants({ variant: "outline-light", size: "lg" })}
          >
            {heroCopy.secondary}
          </Link>
        </div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-[8vh] z-10 flex justify-center px-5">
        <motion.nav
          aria-label={t.nav.language ? copy.trips : "Hero"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setLanguageOpen(false);
            }
          }}
          className="relative flex max-w-[92vw] flex-wrap items-center justify-center gap-x-2 gap-y-2 overflow-visible rounded-xl bg-white/[0.018] px-4 py-2.5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[2px] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:bg-[linear-gradient(115deg,rgba(255,255,255,0.035),rgba(255,255,255,0.006)_48%,rgba(255,255,255,0.025))] sm:gap-x-3 sm:px-6"
        >
          {navItems.map((item) => (
            <span key={item.href} className="inline-flex items-center gap-x-2 sm:gap-x-3">
              <Link
                href={item.href}
                className="nav-text whitespace-nowrap text-[11px] uppercase text-white transition-colors hover:text-accent sm:text-[13px]"
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
            className="nav-text whitespace-nowrap text-[11px] uppercase text-white transition-colors hover:text-accent sm:text-[13px]"
          >
            {copy.login}
          </button>
          <span aria-hidden="true" className="text-white/72">
            |
          </span>
          <Link
            href="/tours#tour-search"
            className="nav-text whitespace-nowrap text-[11px] uppercase text-white transition-colors hover:text-accent sm:text-[13px]"
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
              <div className="absolute bottom-[calc(100%+0.55rem)] right-0 min-w-40 overflow-hidden rounded-xl bg-black/70 p-1 text-white shadow-xl backdrop-blur-md">
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
        </motion.nav>
      </div>
    </section>
  );
}
