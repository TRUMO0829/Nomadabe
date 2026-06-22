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
import { LANGUAGES } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { SiteSearch } from "./site-search";

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
  "nav-text inline-flex h-10 items-center justify-center rounded-lg px-3 text-xs uppercase leading-none";

function openSignupPrompt() {
  window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
}

type NavbarProps = {
  showHomeSearch?: boolean;
  surface?: "auto" | "light";
};

export function Navbar({ showHomeSearch = false, surface = "auto" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [customer, setCustomer] = useState<AuthCustomer | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { contentLocale, locale, setLocale, t } = useLanguage();
  const currentLanguage =
    LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0];
  const visibleNavItems = t.nav.items.filter((item) => item.href !== "/#journal");
  const useLightHeader = surface === "light" || scrolled;

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
          ? "bg-transparent"
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
              "h-16 w-auto object-contain lg:h-20",
              useLightHeader
                ? "drop-shadow-[0_2px_12px_rgba(0,0,0,0.88)]"
                : "drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]"
            )}
          />
        </Link>

        <div
          className={cn(
            "hidden items-center rounded-xl border px-2 py-2 backdrop-blur-xl lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2",
            useLightHeader
              ? "border-border bg-card/90 shadow-[0_18px_45px_rgba(17,16,11,0.08)]"
              : "border-white/25 bg-black/20 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
          )}
        >
          <nav className="flex items-center gap-1">
            {visibleNavItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={cn(
                  "nav-text rounded-lg px-3 py-2 text-sm uppercase transition-colors hover:bg-accent hover:text-accent-foreground",
                  useLightHeader ? "text-foreground/80" : "text-white/90"
                )}
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>

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
                  : useLightHeader
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
              useLightHeader
                ? "border-border bg-card/90 text-foreground"
                : "border-white/30 bg-black/25 text-white"
            )}
          >
            <button
              type="button"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((value) => !value)}
              className="nav-text flex h-full items-center gap-2 rounded-lg px-3 text-xs uppercase leading-none transition-colors hover:bg-white/15"
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
                      "nav-text flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors",
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
              useLightHeader
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
                useLightHeader
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
                useLightHeader
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
            useLightHeader ? "text-foreground" : "text-white"
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
                className="nav-text flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
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
                        "nav-text flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors",
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
            {visibleNavItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="nav-text py-2 text-base uppercase text-foreground/80 hover:text-accent"
              >
                {n.label}
              </a>
            ))}
            <Link
              href="/plan"
              onClick={() => setOpen(false)}
              className="nav-text mt-2 rounded-lg border border-border bg-card px-5 py-3 text-center text-sm uppercase text-foreground"
            >
              {t.nav.cta}
            </Link>
            {customer ? (
              <Link
                href={customer.isAdmin ? "/admin" : "/profile"}
                onClick={() => setOpen(false)}
                className="nav-text rounded-lg border border-border bg-card px-5 py-3 text-center text-sm uppercase text-foreground"
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
                className="nav-text rounded-lg border border-border bg-card px-5 py-3 text-center text-sm uppercase text-foreground"
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
