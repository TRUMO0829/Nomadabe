"use client";

import { useRef, useState, useTransition, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Briefcase,
  Gauge,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Plane,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import { logoutAdminAction } from "../actions";
import { SubmitButton } from "./admin-form";
import { buttonClass, INVERSE_FOCUS_RING } from "./primitives";
import { AdminToastProvider } from "./toast";

// Lucide icons are functions, so the menu has to live in a Client Component.
const NAV_ITEMS = [
  { label: "Ерөнхий", href: "/admin", icon: LayoutDashboard },
  { label: "Бүртгэлүүд", href: "/admin/inquiries", icon: Inbox },
  { label: "Хэрэглэгчид", href: "/admin/customers", icon: UserCheck },
  { label: "Сэтгэгдэл", href: "/admin/reviews", icon: MessageSquare },
  { label: "Хөтөлбөрүүд", href: "/admin/trips", icon: Plane },
  { label: "Баг ба үйлчилгээ", href: "/admin/team", icon: Briefcase },
  { label: "Веб тохиргоо", href: "/admin/settings", icon: Gauge },
  { label: "Мэйл", href: "/admin/mail", icon: Mail },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * One navigation panel for every width: a sticky sidebar from lg up, and an
 * off-canvas drawer opened from a sticky top bar below lg. Because it is the
 * same element, the logout button exists exactly once.
 */
export function AdminShell({ adminEmail, children }: { adminEmail: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const currentLabel = NAV_ITEMS.find((item) => isActive(pathname, item.href))?.label ?? "Админ";

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && menuOpen) {
      closeMenu();
      menuButtonRef.current?.focus();
    }
  }

  return (
    <AdminToastProvider>
      <div
        className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"
        onKeyDown={handleKeyDown}
      >
        <a
          href="#admin-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)]"
        >
          Үндсэн агуулга руу шилжих
        </a>

        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-white/10 bg-[var(--primary)] px-4 text-white lg:hidden">
          <Brand />
          <span className="min-w-0 flex-1 truncate text-right text-sm font-semibold text-white/80">
            {currentLabel}
          </span>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="admin-sidebar"
            onClick={() => setMenuOpen((open) => !open)}
            className={buttonClass({ variant: "inverse", size: "sm" })}
          >
            <Menu aria-hidden="true" className="h-4 w-4" />
            Цэс
          </button>
        </header>

        {menuOpen ? (
          <div aria-hidden="true" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={closeMenu} />
        ) : null}

        <div className="mx-auto w-full max-w-[1560px] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside
            id="admin-sidebar"
            aria-label="Админ цэс"
            className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-[var(--primary)] px-5 py-6 text-white transition-[transform,visibility] duration-200 lg:visible lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-auto lg:max-w-none lg:translate-x-0 ${
              menuOpen ? "visible translate-x-0" : "invisible -translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <Brand />
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  menuButtonRef.current?.focus();
                }}
                aria-label="Цэс хаах"
                className={buttonClass({ variant: "inverse", size: "sm", className: "lg:hidden" })}
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <nav aria-label="Админ хэсгүүд" className="mt-8 space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${INVERSE_FOCUS_RING} ${
                      active
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon aria-hidden="true" className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 space-y-2">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className={buttonClass({ variant: "inverse", className: "w-full justify-start" })}
              >
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                Веб харах
                <span className="sr-only">(шинэ цонхонд)</span>
              </Link>
              <button
                type="button"
                onClick={() => startRefresh(() => router.refresh())}
                disabled={refreshing}
                className={buttonClass({ variant: "inverse", className: "w-full justify-start" })}
              >
                <RefreshCw aria-hidden="true" className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Шинэчилж байна…" : "Өгөгдөл шинэчлэх"}
              </button>
            </div>

            <div className="mt-auto rounded-md border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                Нэвтэрсэн
              </div>
              <p className="mt-2 break-words text-sm leading-6 text-white/70">{adminEmail}</p>
              <form action={logoutAdminAction} className="mt-4">
                <SubmitButton
                  variant="inverse"
                  className="w-full"
                  icon={<LogOut aria-hidden="true" className="h-4 w-4" />}
                  pendingLabel="Гарч байна…"
                >
                  Гарах
                </SubmitButton>
              </form>
            </div>
          </aside>

          <main id="admin-main" tabIndex={-1} className="min-w-0 px-4 py-6 focus:outline-none sm:px-8 lg:px-10 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </AdminToastProvider>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="h-10 w-10 shrink-0 rounded-md bg-black bg-[url('/nomadabe-mark.webp')] bg-center bg-no-repeat shadow-sm ring-1 ring-white/15 [background-position:center_35%] [background-size:175%]"
      />
      <div>
        <div className="text-lg font-black leading-none text-[var(--accent)]">Nomadabe</div>
        <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/75">Админ</div>
      </div>
    </div>
  );
}
