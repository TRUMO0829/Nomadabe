"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Globe,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { LANGUAGES, type CopyLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { SiteSearch } from "./site-search";

const NAV_TRIP_CHOICES: Record<
  CopyLocale,
  Array<{ title: string; body: string; href: string }>
> = {
  mn: [
    {
      title: "Дотоод аялал",
      body: "Монгол доторх аяллын багцууд.",
      href: "/tours?scope=domestic",
    },
    {
      title: "Гадаад аялал",
      body: "Хятад, Япон, Солонгос, Турк зэрэг чиглэлүүд.",
      href: "/tours?scope=outbound",
    },
    {
      title: "Бүх аялал",
      body: "Бүх аяллын жагсаалтыг нэг дороос харах.",
      href: "/tours",
    },
  ],
  en: [
    { title: "Domestic trips", body: "Trips inside Mongolia.", href: "/tours?scope=domestic" },
    { title: "Outbound trips", body: "China, Japan, Korea, Turkey, and more.", href: "/tours?scope=outbound" },
    { title: "All trips", body: "Browse every available trip.", href: "/tours" },
  ],
  zh: [
    { title: "国内旅行", body: "蒙古国内旅行套餐。", href: "/tours?scope=domestic" },
    { title: "出境旅行", body: "中国、日本、韩国、土耳其等路线。", href: "/tours?scope=outbound" },
    { title: "全部旅行", body: "查看所有旅行。", href: "/tours" },
  ],
  ja: [
    { title: "国内旅行", body: "モンゴル国内の旅行プラン。", href: "/tours?scope=domestic" },
    { title: "海外旅行", body: "中国、日本、韓国、トルコなど。", href: "/tours?scope=outbound" },
    { title: "すべての旅行", body: "すべてのツアーを見る。", href: "/tours" },
  ],
  ko: [
    { title: "국내 여행", body: "몽골 국내 여행 패키지.", href: "/tours?scope=domestic" },
    { title: "해외 여행", body: "중국, 일본, 한국, 튀르키예 등.", href: "/tours?scope=outbound" },
    { title: "전체 여행", body: "모든 여행 보기.", href: "/tours" },
  ],
};

const AUTH_COPY = {
  mn: "Нэвтрэх / Бүртгүүлэх",
  en: "Sign in / Register",
  zh: "登录 / 注册",
  ja: "ログイン / 登録",
  ko: "로그인 / 회원가입",
} as const;

const PROFILE_COPY = {
  mn: "Профайл",
  en: "Profile",
  zh: "资料",
  ja: "プロフィール",
  ko: "프로필",
} as const;

type AuthCustomer = {
  email: string;
  name?: string;
  isAdmin?: boolean;
};
const DESKTOP_ACTION_CLASS =
  "inline-flex h-10 items-center justify-center rounded-lg px-3 text-xs font-black uppercase leading-none";

function openSignupPrompt() {
  window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
}

function DestinationMegaMenu({ locale }: { locale: CopyLocale }) {
  const choices = NAV_TRIP_CHOICES[locale];

  return (
    <div className="w-full rounded-xl border border-[#eadfac] bg-white p-5 text-[#11100b] shadow-[0_30px_90px_rgba(17,16,11,0.16)] backdrop-blur-xl">
      <div className="grid gap-2">
        {choices.map((choice) => (
          <Link
            key={choice.href}
            href={choice.href}
            className="block rounded-lg px-4 py-3 transition-colors hover:bg-[#fff6d8]"
          >
            <span className="block text-sm font-black uppercase leading-tight text-[#11100b]">
              {choice.title}
            </span>
            <span className="mt-1 block text-sm font-medium leading-5 text-[#4b4538]">
              {choice.body}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Navbar({ showHomeSearch = false }: { showHomeSearch?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [customer, setCustomer] = useState<AuthCustomer | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { contentLocale, locale, setLocale, t } = useLanguage();
  const currentLanguage =
    LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomer() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const result = (await response.json()) as {
          ok?: boolean;
          data?: { customer?: AuthCustomer | null; isAdmin?: boolean };
        };

        if (!cancelled) {
          const loadedCustomer = response.ok && result.ok ? (result.data?.customer ?? null) : null;
          setCustomer(
            loadedCustomer
              ? { ...loadedCustomer, isAdmin: Boolean(result.data?.isAdmin) }
              : null
          );
        }
      } catch {
        if (!cancelled) {
          setCustomer(null);
        }
      }
    }

    void loadCustomer();
    window.addEventListener("nomadabe:auth-changed", loadCustomer);

    return () => {
      cancelled = true;
      window.removeEventListener("nomadabe:auth-changed", loadCustomer);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/92 shadow-[0_16px_44px_rgba(17,16,11,0.08)] backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="relative flex h-16 w-full items-center px-6 lg:h-20 lg:px-8">
        <Link
          href="/#home"
          aria-label="Nomadabe Travel"
          className="order-1 flex shrink-0 items-center lg:absolute lg:left-8 lg:top-1/2 lg:-translate-y-1/2"
        >
          <Image
            src="/nomadabe-logo-cropped.webp"
            alt=""
            width={574}
            height={615}
            priority
            sizes="(min-width: 1024px) 80px, 64px"
            className={cn(
              "w-auto object-contain transition-all duration-300",
              scrolled
                ? "h-12 drop-shadow-[0_1px_5px_rgba(0,0,0,0.18)] lg:h-14"
                : "h-16 drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)] lg:h-20"
            )}
          />
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
                    "text-sm font-black uppercase transition-colors hover:text-accent",
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
                    "text-sm font-black uppercase transition-colors hover:text-accent",
                    destinationOpen && "text-accent",
                    scrolled ? "text-foreground/80" : "text-white/90"
                  )}
                >
                  {n.label}
                </a>

                {destinationOpen && (
                  <div className="absolute left-1/2 top-full z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 pt-5">
                    <DestinationMegaMenu locale={contentLocale} />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:ml-auto lg:flex">
          {showHomeSearch ? (
            <button
              type="button"
              aria-label="Аялал хайх"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((value) => !value)}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                searchOpen
                  ? "border-accent bg-accent text-accent-foreground"
                  : scrolled
                    ? "border-border bg-card/90 text-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground"
                    : "border-white/30 bg-black/25 text-white hover:border-accent hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {searchOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          ) : null}

          <div
            aria-label={t.nav.language}
            className={cn(
              "relative h-10 rounded-lg border",
              scrolled
                ? "border-border bg-card/90 text-foreground"
                : "border-white/30 bg-black/25 text-white"
            )}
          >
            <button
              type="button"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((value) => !value)}
              className="flex h-full items-center gap-2 rounded-lg px-3 text-xs font-black uppercase leading-none transition-colors hover:bg-white/15"
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
            className={cn(
              DESKTOP_ACTION_CLASS,
              "border transition-colors",
              scrolled
                ? "border-border bg-card text-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground"
                : "border-white/30 bg-black/25 text-white hover:border-accent hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {t.nav.cta}
          </Link>
          {customer ? (
            <Link
              href={customer.isAdmin ? "/admin" : "/profile"}
              className={cn(
                DESKTOP_ACTION_CLASS,
                "max-w-56 gap-2 border px-4 normal-case transition-colors",
                scrolled
                  ? "border-border bg-card text-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground"
                  : "border-white/30 bg-black/25 text-white hover:border-accent hover:bg-accent hover:text-accent-foreground"
              )}
              title={customer.email}
            >
              <UserRound className="h-4 w-4 shrink-0" />
              <span className="truncate">{PROFILE_COPY[contentLocale]}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={openSignupPrompt}
              className={cn(
                DESKTOP_ACTION_CLASS,
                "gap-2 border transition-colors",
                scrolled
                  ? "border-border bg-card text-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground"
                  : "border-white/30 bg-black/25 text-white hover:border-accent hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <UserRound className="h-4 w-4" />
              {AUTH_COPY[contentLocale]}
            </button>
          )}
        </div>

        <button
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "order-3 ml-auto rounded-md p-2 lg:hidden",
            scrolled ? "bg-card/90 text-foreground shadow-sm" : "text-white"
          )}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {showHomeSearch && searchOpen ? (
        <div className="pointer-events-none absolute inset-x-0 top-full z-40 flex justify-center px-5 pt-3 sm:px-8 lg:pt-4">
          <div className="pointer-events-auto w-full max-w-[min(92vw,620px)]">
            <SiteSearch compact />
          </div>
        </div>
      ) : null}

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
                className="py-2 text-base font-black uppercase text-foreground/80 hover:text-accent"
              >
                {n.label}
              </a>
            ))}
            <Link
              href="/plan"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg border border-border bg-card px-5 py-3 text-center text-sm font-black uppercase text-foreground"
            >
              {t.nav.cta}
            </Link>
            {customer ? (
              <Link
                href={customer.isAdmin ? "/admin" : "/profile"}
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border bg-card px-5 py-3 text-center text-sm font-black uppercase text-foreground"
              >
                {PROFILE_COPY[contentLocale]}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openSignupPrompt();
                }}
                className="rounded-lg border border-border bg-card px-5 py-3 text-center text-sm font-black uppercase text-foreground"
              >
                {AUTH_COPY[contentLocale]}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
