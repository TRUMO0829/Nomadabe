"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Building2,
  ChevronDown,
  Compass,
  Globe,
  Globe2,
  Menu,
  MountainSnow,
  UserRound,
  X,
} from "lucide-react";
import { LANGUAGES, type CopyLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

const NAV_DESTINATION_COPY = {
  mn: {
    title: "Аяллууд",
    body: "Аялал, чиглэл, очих газраа нэг дороос сонго.",
    viewAll: "Бүх аяллыг харах",
  },
  en: {
    title: "Trips",
    body: "Browse trips and destinations together by country and travel type.",
    viewAll: "View all trips",
  },
  zh: {
    title: "旅行",
    body: "按国家和旅行类型浏览行程与目的地。",
    viewAll: "查看全部旅行",
  },
  ja: {
    title: "ツアー",
    body: "国や旅のタイプ別に、ツアーと目的地をまとめて探せます。",
    viewAll: "すべてのツアーを見る",
  },
  ko: {
    title: "여행",
    body: "국가와 여행 유형별로 여행과 목적지를 함께 찾아보세요.",
    viewAll: "모든 여행 보기",
  },
} as const;

const NAV_DESTINATION_GROUPS = [
  {
    icon: MountainSnow,
    title: {
      mn: "Дотоод аялал",
      en: "Domestic",
      zh: "国内旅行",
      ja: "国内旅行",
      ko: "국내 여행",
    },
    items: [
      { mn: "Монгол", en: "Mongolia", zh: "蒙古", ja: "モンゴル", ko: "몽골" },
      { mn: "Хөвсгөл", en: "Khuvsgul", zh: "库苏古尔", ja: "フブスグル", ko: "홉스골" },
      { mn: "Говь", en: "Gobi", zh: "戈壁", ja: "ゴビ", ko: "고비" },
      { mn: "Тэрэлж", en: "Terelj", zh: "特勒吉", ja: "テレルジ", ko: "테렐지" },
    ],
  },
  {
    icon: Globe2,
    title: {
      mn: "Гадаад аялал",
      en: "Outbound",
      zh: "出境旅行",
      ja: "海外旅行",
      ko: "해외 여행",
    },
    items: [
      { mn: "Япон", en: "Japan", zh: "日本", ja: "日本", ko: "일본" },
      { mn: "Солонгос", en: "Korea", zh: "韩国", ja: "韓国", ko: "한국" },
      { mn: "Хятад", en: "China", zh: "中国", ja: "中国", ko: "중국" },
      { mn: "Турк", en: "Turkey", zh: "土耳其", ja: "トルコ", ko: "튀르키예" },
    ],
  },
  {
    icon: Building2,
    title: {
      mn: "Хот, expo",
      en: "Cities & expo",
      zh: "城市与展会",
      ja: "都市・展示会",
      ko: "도시 및 엑스포",
    },
    items: [
      { mn: "Токио", en: "Tokyo", zh: "东京", ja: "東京", ko: "도쿄" },
      { mn: "Сөүл", en: "Seoul", zh: "首尔", ja: "ソウル", ko: "서울" },
      { mn: "Шанхай", en: "Shanghai", zh: "上海", ja: "上海", ko: "상하이" },
      { mn: "Гуанжоу", en: "Guangzhou", zh: "广州", ja: "広州", ko: "광저우" },
    ],
  },
  {
    icon: Compass,
    title: {
      mn: "Амралтын хэв маяг",
      en: "Vacation style",
      zh: "旅行风格",
      ja: "旅のスタイル",
      ko: "여행 스타일",
    },
    items: [
      { mn: "Гэр бүл", en: "Family", zh: "家庭", ja: "ファミリー", ko: "가족" },
      { mn: "Бизнес", en: "Business", zh: "商务", ja: "ビジネス", ko: "비즈니스" },
      { mn: "Арал", en: "Island", zh: "海岛", ja: "島", ko: "섬" },
      { mn: "Захиалгат", en: "Custom", zh: "定制", ja: "カスタム", ko: "맞춤" },
    ],
  },
] as const;

const AUTH_COPY = {
  mn: "Нэвтрэх / Бүртгүүлэх",
  en: "Sign in / Register",
  zh: "登录 / 注册",
  ja: "ログイン / 登録",
  ko: "로그인 / 회원가입",
} as const;

function openSignupPrompt() {
  window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
}

function DestinationMegaMenu({ locale }: { locale: CopyLocale }) {
  const copy = NAV_DESTINATION_COPY[locale];

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card font-sans text-foreground shadow-2xl">
      <div className="grid gap-4 border-b border-border bg-background p-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-lg font-black leading-none text-foreground">
            {copy.title}
          </p>
          <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-muted-foreground">
            {copy.body}
          </p>
        </div>
        <Link
          href="/tours"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-black text-accent-foreground transition-colors hover:bg-secondary lg:justify-self-end"
        >
          {copy.viewAll}
        </Link>
      </div>

      <div className="grid gap-0 md:grid-cols-4">
        {NAV_DESTINATION_GROUPS.map((group) => {
          const Icon = group.icon;

          return (
              <div key={group.title.en} className="border-border p-4 md:border-r md:last:border-r-0">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-black leading-tight">{group.title[locale]}</h3>
              </div>
              <ul className="grid gap-2">
                {group.items.map((item) => (
                  <li key={item.en}>
                    <Link
                      href="/tours"
                      className="block rounded-md px-2 py-1 text-sm font-medium leading-5 text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {item[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const { contentLocale, locale, setLocale, t } = useLanguage();
  const currentLanguage =
    LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="relative flex h-16 w-full items-center px-6 lg:h-20 lg:px-8">
        <Link
          href="/#home"
          aria-label="Nomadabe Travel"
          className="order-1 flex shrink-0 items-center gap-3 lg:absolute lg:left-8 lg:top-1/2 lg:-translate-y-1/2"
        >
          <span
            aria-hidden="true"
            className={cn(
              "h-10 w-10 bg-[url('/nomadabe-mark-transparent.png')] bg-center bg-no-repeat [background-size:175%] [background-position:center_35%] lg:h-12 lg:w-12",
              scrolled
                ? "invert"
                : "drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]"
            )}
          />
          <span className="flex flex-col leading-none">
            <span className="font-sans text-xl font-black text-accent lg:text-2xl">
              Nomadabe
            </span>
            <span
              className={cn(
                "mt-1 text-[10px] font-bold uppercase lg:text-xs",
                scrolled ? "text-foreground/75" : "text-white/85"
              )}
            >
              Travel
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2">
          {t.nav.items.map((n) => {
            const isTrips = n.href === "/tours";

            if (!isTrips) {
              return (
                <a
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-accent",
                    scrolled ? "text-foreground/80" : "text-white/90"
                  )}
                >
                  {n.label}
                </a>
              );
            }

            return (
              <div
                key={n.href}
                className="relative"
                onMouseEnter={() => setDestinationOpen(true)}
                onMouseLeave={() => setDestinationOpen(false)}
              >
                <a
                  href={n.href}
                  onClick={() => setDestinationOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-accent",
                    destinationOpen && "text-accent",
                    scrolled ? "text-foreground/80" : "text-white/90"
                  )}
                >
                  {n.label}
                </a>

                {destinationOpen && (
                  <div className="absolute left-1/2 top-full z-50 w-[760px] -translate-x-1/2 pt-5">
                    <DestinationMegaMenu locale={contentLocale} />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:ml-auto lg:flex">
          <div
            aria-label={t.nav.language}
            className={cn(
              "relative rounded-lg border",
              scrolled
                ? "border-border bg-card/90 text-foreground"
                : "border-white/30 bg-black/25 text-white"
            )}
          >
            <button
              type="button"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((value) => !value)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-white/15"
            >
              <Globe className="h-4 w-4" />
              {currentLanguage.short}
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  languageOpen && "rotate-180"
                )}
              />
            </button>

            {languageOpen && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] min-w-36 overflow-hidden rounded-lg border border-border bg-card p-1 text-foreground shadow-xl">
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
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-bold transition-colors",
                      locale === language.code
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <span>{language.label}</span>
                    <span>{language.short}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/plan"
            className="rounded-lg bg-accent hover:bg-secondary text-accent-foreground px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            {t.nav.cta}
          </Link>
          <button
            type="button"
            onClick={openSignupPrompt}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors",
              scrolled
                ? "border-border bg-card text-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground"
                : "border-white/30 bg-black/25 text-white hover:border-accent hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <UserRound className="h-4 w-4" />
            {AUTH_COPY[contentLocale]}
          </button>
        </div>

        <button
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "order-3 ml-auto rounded-md p-2 lg:hidden",
            scrolled ? "text-foreground" : "text-white"
          )}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="px-6 py-4 flex flex-col gap-3">
            <div
              aria-label={t.nav.language}
              className="relative mb-2 w-fit rounded-lg border border-border bg-card text-foreground"
            >
              <button
                type="button"
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen((value) => !value)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold"
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
                {currentLanguage.short}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    languageOpen && "rotate-180"
                  )}
                />
              </button>

              {languageOpen && (
                <div className="absolute left-0 top-[calc(100%+0.5rem)] z-10 min-w-36 overflow-hidden rounded-lg border border-border bg-card p-1 text-foreground shadow-xl">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      aria-pressed={locale === language.code}
                      onClick={() => {
                        setLocale(language.code);
                        setLanguageOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-bold transition-colors",
                        locale === language.code
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <span>{language.label}</span>
                      <span>{language.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {t.nav.items.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-medium text-foreground/80 hover:text-accent"
              >
                {n.label}
              </a>
            ))}
            <Link
              href="/plan"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-accent text-accent-foreground px-5 py-3 text-sm font-semibold text-center"
            >
              {t.nav.cta}
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openSignupPrompt();
              }}
              className="rounded-lg border border-border bg-card px-5 py-3 text-center text-sm font-semibold text-foreground"
            >
              {AUTH_COPY[contentLocale]}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
