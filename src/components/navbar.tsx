"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import {
  ChevronDown,
  Globe,
  LogOut,
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

const EXIT_COPY = {
  mn: "Exit",
  en: "Exit",
  zh: "Exit",
  ja: "Exit",
  ko: "Exit",
} as const;

type AuthCustomer = {
  email: string;
  name?: string;
  isAdmin?: boolean;
};
const DESKTOP_BAR_ITEM_CLASS =
  "nav-text inline-flex items-center justify-center whitespace-nowrap rounded-md uppercase leading-none transition-all duration-300 hover:bg-white/10 hover:text-accent";
const DESKTOP_NAV_LINK_CLASS =
  "nav-text inline-flex items-center justify-center whitespace-nowrap rounded-md uppercase leading-none transition-all duration-300 hover:bg-white/10 hover:text-accent";
const DESKTOP_BAR_DIVIDER_CLASS =
  "w-px shrink-0 bg-current/30 transition-all duration-300";

function openSignupPrompt() {
  window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
}

type NavbarProps = {
  showHomeSearch?: boolean;
  surface?: "auto" | "light";
  logoPlacement?: "left" | "center";
};

export function Navbar({
  showHomeSearch = false,
  surface = "auto",
  logoPlacement = "left",
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [customer, setCustomer] = useState<AuthCustomer | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { contentLocale, locale, setLocale, t } = useLanguage();
  const currentLanguage =
    LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0];
  const visibleNavItems = t.nav.items.filter((item) => item.href !== "/#journal");
  const useLightHeader = surface === "light";

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

  async function handleCustomerLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setCustomer(null);
      setProfileMenuOpen(false);
      window.dispatchEvent(new Event("nomadabe:auth-changed"));

      if (window.location.pathname.startsWith("/profile")) {
        window.location.href = "/";
      }
    }
  }

  return (
    <header
      className="site-navbar fixed top-0 inset-x-0 z-50 bg-transparent transition-all duration-300"
    >
      <div className="relative flex h-16 w-full items-center px-6 transition-all duration-300 lg:h-16 lg:items-start lg:px-8 lg:pt-2">
        <Link
          href="/#home"
          aria-label="Nomadabe Travel"
          className={cn(
            "order-1 flex shrink-0 items-center lg:absolute",
            logoPlacement === "center"
              ? "lg:left-1/2 lg:top-5 lg:-translate-x-1/2"
              : "lg:left-4 lg:top-4"
          )}
        >
          <Image
            src="/nomadabe-logo-cropped.webp"
            alt=""
            width={574}
            height={615}
            priority
            sizes="(min-width: 1024px) 160px, 128px"
            className={cn(
              "w-auto object-contain transition-all duration-300",
              "h-24 lg:h-28",
              useLightHeader
                ? "drop-shadow-[0_2px_12px_rgba(0,0,0,0.88)]"
                : "drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]"
            )}
          />
        </Link>

        <div
          className={cn(
            "hidden items-center overflow-hidden border backdrop-blur-2xl transition-all duration-300 lg:ml-auto lg:flex",
            "rounded-[1.05rem] px-3 py-2",
            useLightHeader
              ? "border-white/18 bg-white/[0.08] text-white shadow-[0_18px_45px_rgba(17,16,11,0.06),inset_0_1px_0_rgba(255,255,255,0.22)]"
              : "border-white/18 bg-white/[0.08] text-white shadow-[0_18px_50px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.22)]"
          )}
        >
          <nav className="flex items-center">
            {visibleNavItems.map((n, index) => (
              <Fragment key={n.href}>
                <a
                  href={n.href}
                  className={cn(
                    DESKTOP_NAV_LINK_CLASS,
                    "h-10 px-3 text-sm"
                  )}
                >
                  {n.label}
                </a>
                {index < visibleNavItems.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={cn(DESKTOP_BAR_DIVIDER_CLASS, "h-5")}
                  />
                ) : null}
              </Fragment>
            ))}
          </nav>
          <div className="flex items-center">
            <span
              aria-hidden="true"
              className={cn(DESKTOP_BAR_DIVIDER_CLASS, "h-5")}
            />
            <Link
              href="/plan"
              className={cn(
                DESKTOP_BAR_ITEM_CLASS,
                "h-10 px-4 text-sm"
              )}
            >
              {t.nav.cta}
            </Link>
            <span
              aria-hidden="true"
              className={cn(DESKTOP_BAR_DIVIDER_CLASS, "h-5")}
            />
            {customer ? (
              <div
                className="relative h-10"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setProfileMenuOpen(false);
                  }
                }}
              >
                <button
                  type="button"
                  aria-label={PROFILE_COPY[contentLocale]}
                  aria-expanded={profileMenuOpen}
                  onClick={() => {
                    setLanguageOpen(false);
                    setProfileMenuOpen((value) => !value);
                  }}
                  className={cn(
                    DESKTOP_BAR_ITEM_CLASS,
                    "h-10 w-10 px-0 text-sm"
                  )}
                  title={customer.email}
                >
                  <UserRound
                    className="h-5 w-5 shrink-0 transition-all duration-300"
                  />
                </button>

                {profileMenuOpen ? (
                  <div className="absolute right-0 top-full min-w-40 pt-2">
                    <div className="overflow-hidden rounded-lg border border-border bg-card p-1 text-foreground shadow-xl">
                      <Link
                        href={customer.isAdmin ? "/admin" : "/profile"}
                        onClick={() => setProfileMenuOpen(false)}
                        className="nav-text flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-muted"
                      >
                        <UserRound className="h-4 w-4" />
                        {PROFILE_COPY[contentLocale]}
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleCustomerLogout()}
                        className="nav-text flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-muted"
                      >
                        <LogOut className="h-4 w-4" />
                        {EXIT_COPY[contentLocale]}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                onClick={openSignupPrompt}
                className={cn(
                  DESKTOP_BAR_ITEM_CLASS,
                  "gap-2",
                  "h-10 px-4 text-sm"
                )}
              >
                <UserRound
                  className="h-5 w-5 shrink-0 transition-all duration-300"
                />
                {AUTH_COPY[contentLocale]}
              </button>
            )}
            <span
              aria-hidden="true"
              className={cn(DESKTOP_BAR_DIVIDER_CLASS, "h-5")}
            />
            <div
              aria-label={t.nav.language}
              className="relative h-10 transition-all duration-300"
            >
              <button
                type="button"
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen((value) => !value)}
                className={cn(
                  DESKTOP_BAR_ITEM_CLASS,
                  "h-full gap-2",
                  "px-3 text-sm"
                )}
              >
                <Globe
                  className="h-5 w-5 shrink-0 transition-all duration-300"
                />
                {currentLanguage.short}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-all duration-300",
                    languageOpen && "rotate-180"
                  )}
                />
              </button>

              {languageOpen && (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] min-w-36 overflow-hidden rounded-lg border border-border bg-card p-1 text-foreground shadow-xl">
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
            {showHomeSearch ? (
              <>
                <span
                  aria-hidden="true"
                  className={cn(DESKTOP_BAR_DIVIDER_CLASS, "h-5")}
                />
                <button
                  type="button"
                  aria-label="Аялал хайх"
                  aria-expanded={searchOpen}
                  onClick={() => setSearchOpen((value) => !value)}
                  className={cn(
                    DESKTOP_BAR_ITEM_CLASS,
                    "h-10 w-10 px-0 text-sm",
                    searchOpen && "bg-accent text-accent-foreground hover:bg-accent"
                  )}
                >
                  {searchOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </>
            ) : null}
          </div>
        </div>

        <button
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "order-3 ml-auto rounded-md p-2 lg:hidden",
            useLightHeader ? "bg-card/90 text-foreground shadow-sm" : "text-white"
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
              <div className="grid gap-2">
                <Link
                  href={customer.isAdmin ? "/admin" : "/profile"}
                  onClick={() => setOpen(false)}
                  className="nav-text rounded-lg border border-border bg-card px-5 py-3 text-center text-sm uppercase text-foreground"
                >
                  {PROFILE_COPY[contentLocale]}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    void handleCustomerLogout();
                  }}
                  className="nav-text rounded-lg border border-border bg-card px-5 py-3 text-center text-sm uppercase text-foreground"
                >
                  {EXIT_COPY[contentLocale]}
                </button>
              </div>
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
