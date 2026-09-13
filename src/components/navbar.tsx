"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { SiteSearch } from "./site-search";

const NAV_BAR_COPY = {
  mn: {
    trips: "Аяллууд",
    about: "Бидний тухай",
    booking: "Захиалга",
    login: "Нэвтрэх",
    search: "Хайлт",
  },
  en: {
    trips: "Trips",
    about: "About us",
    booking: "Booking",
    login: "Login",
    search: "Search",
  },
  zh: {
    trips: "旅行",
    about: "关于我们",
    booking: "预订",
    login: "登录",
    search: "搜索",
  },
  ja: {
    trips: "ツアー",
    about: "私たちについて",
    booking: "予約",
    login: "ログイン",
    search: "検索",
  },
  ko: {
    trips: "여행",
    about: "소개",
    booking: "예약",
    login: "로그인",
    search: "검색",
  },
} as const;

const PROFILE_COPY = {
  mn: "Профайл",
  en: "Profile",
  zh: "资料",
  ja: "プロフィール",
  ko: "프로필",
} as const;

const EXIT_COPY = {
  mn: "Гарах",
  en: "Log out",
  zh: "退出登录",
  ja: "ログアウト",
  ko: "로그아웃",
} as const;

type AuthCustomer = {
  email: string;
  name?: string;
  isAdmin?: boolean;
};

const DESKTOP_BAR_ITEM_CLASS =
  "nav-text inline-flex items-center justify-center whitespace-nowrap rounded-md uppercase transition-all duration-300 hover:bg-accent/10 hover:text-accent";
const DESKTOP_BAR_TEXT_SIZE_CLASS =
  "min-h-10 px-3 py-2 text-[12px] xl:px-3.5 xl:text-[13px]";
const MOBILE_ITEM_CLASS =
  "nav-text border border-border bg-card px-5 py-3 text-center text-sm uppercase text-foreground";

function openSignupPrompt() {
  window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
}

type NavbarProps = {
  surface?: "auto" | "light";
  logoPlacement?: "left" | "center";
  logoSize?: "default" | "compact";
  /**
   * Stay hidden until the visitor scrolls past most of the first screen. The
   * home hero carries its own logo and navigation, so the bar only needs to
   * appear once that is out of view.
   */
  revealOnScroll?: boolean;
};

export function Navbar({
  surface = "auto",
  logoPlacement = "left",
  logoSize = "default",
  revealOnScroll = false,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [customer, setCustomer] = useState<AuthCustomer | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { contentLocale, locale, setLocale, t } = useLanguage();
  const currentLanguage =
    LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0];
  const navCopy = NAV_BAR_COPY[contentLocale];
  const navItems = [
    { href: "/tours", label: navCopy.trips },
    { href: "/about", label: navCopy.about },
    { href: "/plan", label: navCopy.booking },
  ];
  const useLightHeader = surface === "light";
  // Over a photo the bar is transparent; once the page scrolls it gets a solid
  // backing so the logo and links never sit on a white section unreadably.
  const solid = scrolled || open;
  const hidden = revealOnScroll && !scrolled && !open;

  useEffect(() => {
    function update() {
      const threshold = revealOnScroll ? window.innerHeight * 0.75 : 24;
      setScrolled(window.scrollY > threshold);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [revealOnScroll]);

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
      inert={hidden}
      className={cn(
        "site-navbar fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-300",
        solid ? "bg-ink/90 shadow-raised backdrop-blur-md" : "bg-transparent",
        hidden && "pointer-events-none -translate-y-full"
      )}
    >
      <div className="relative flex h-16 w-full items-center px-6 lg:items-start lg:px-8 lg:pt-2">
        <Link
          href="/#home"
          aria-label="Nomadabe Travel"
          className={cn(
            "order-1 flex shrink-0 items-center lg:absolute",
            logoPlacement === "center" ? "lg:left-1/2 lg:-translate-x-1/2" : "lg:left-4",
            scrolled ? "lg:top-1" : logoPlacement === "center" ? "lg:top-5" : "lg:top-4"
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
              scrolled
                ? "h-12 lg:h-14"
                : logoSize === "compact"
                  ? "h-14 lg:h-24"
                  : "h-14 lg:h-28",
              useLightHeader && !solid
                ? "drop-shadow-[0_2px_12px_rgba(0,0,0,0.88)]"
                : "drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]"
            )}
          />
        </Link>

        <div
          className={cn(
            "absolute right-4 top-3 hidden items-center overflow-visible rounded-[1rem] px-3 py-2 text-accent transition-all duration-300 lg:right-6 lg:flex xl:right-8",
            solid
              ? "bg-transparent"
              : cn(
                  "backdrop-blur-[10px]",
                  useLightHeader
                    ? "bg-ink/20 shadow-[0_14px_34px_rgba(17,16,11,0.12)]"
                    : "bg-ink/22 shadow-[0_14px_34px_rgba(0,0,0,0.16)]"
                )
          )}
        >
          <nav className="relative z-10 flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(DESKTOP_BAR_ITEM_CLASS, DESKTOP_BAR_TEXT_SIZE_CLASS)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="relative z-10 flex items-center">
            {customer ? (
              <div
                className="relative min-h-10"
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
                  className={cn(DESKTOP_BAR_ITEM_CLASS, DESKTOP_BAR_TEXT_SIZE_CLASS)}
                  title={customer.email}
                >
                  {PROFILE_COPY[contentLocale]}
                </button>

                {profileMenuOpen ? (
                  <div className="absolute right-0 top-full min-w-40 pt-2">
                    <div className="overflow-hidden border border-border bg-card p-1 text-foreground shadow-floating">
                      <Link
                        href={customer.isAdmin ? "/admin" : "/profile"}
                        onClick={() => setProfileMenuOpen(false)}
                        className="nav-text flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-muted"
                      >
                        <UserRound className="h-4 w-4" />
                        {PROFILE_COPY[contentLocale]}
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleCustomerLogout()}
                        className="nav-text flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-muted"
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
                className={cn(DESKTOP_BAR_ITEM_CLASS, DESKTOP_BAR_TEXT_SIZE_CLASS)}
              >
                {navCopy.login}
              </button>
            )}
            <button
              type="button"
              aria-label={navCopy.search}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((value) => !value)}
              className={cn(
                DESKTOP_BAR_ITEM_CLASS,
                DESKTOP_BAR_TEXT_SIZE_CLASS,
                searchOpen && "bg-accent/12"
              )}
            >
              {navCopy.search}
            </button>
            <div
              aria-label={t.nav.language}
              className="relative min-h-10 transition-all duration-300"
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
                className={cn(
                  DESKTOP_BAR_ITEM_CLASS,
                  "min-h-10 gap-1",
                  "w-11 px-0 py-2 text-[12px] xl:w-12 xl:text-[13px]"
                )}
              >
                <Globe className="h-4 w-4 shrink-0 transition-all duration-300" />
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-all duration-300",
                    languageOpen && "rotate-180"
                  )}
                />
              </button>

              {languageOpen && (
                <div className="absolute right-0 top-[calc(100%+0.55rem)] z-50 min-w-40 overflow-hidden bg-black/80 p-1 text-white shadow-floating backdrop-blur-md">
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
                        "nav-text flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors",
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
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "order-3 ml-auto p-2 lg:hidden",
            useLightHeader && !solid ? "bg-card/90 text-foreground shadow-card" : "text-white"
          )}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {searchOpen ? (
        <div className="pointer-events-none absolute inset-x-0 top-full z-40 flex justify-center px-5 pt-3 sm:px-8 lg:pt-4">
          <div className="pointer-events-auto w-full max-w-[min(92vw,620px)]">
            <SiteSearch compact />
          </div>
        </div>
      ) : null}

      {open && (
        <div className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-border bg-background lg:hidden">
          <div className="flex flex-col gap-3 px-6 py-4">
            <SiteSearch compact />
            <div
              aria-label={t.nav.language}
              className="relative mb-2 w-fit border border-border bg-card text-foreground"
            >
              <button
                type="button"
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen((value) => !value)}
                className="nav-text flex items-center gap-2 px-3 py-2 text-xs"
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
                <div className="absolute left-0 top-[calc(100%+0.5rem)] z-10 min-w-36 overflow-hidden border border-border bg-card p-1 text-foreground shadow-floating">
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
                        "nav-text flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors",
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
            {navItems
              .filter((item) => item.href !== "/plan")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="nav-text py-2 text-base uppercase text-foreground/80 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            <Link
              href="/plan"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants(), "mt-2")}
            >
              {navCopy.booking}
            </Link>
            {customer ? (
              <div className="grid gap-2">
                <Link
                  href={customer.isAdmin ? "/admin" : "/profile"}
                  onClick={() => setOpen(false)}
                  className={MOBILE_ITEM_CLASS}
                >
                  {PROFILE_COPY[contentLocale]}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    void handleCustomerLogout();
                  }}
                  className={MOBILE_ITEM_CLASS}
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
                className={MOBILE_ITEM_CLASS}
              >
                {navCopy.login}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
