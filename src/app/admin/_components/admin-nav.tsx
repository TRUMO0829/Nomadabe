"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Gauge,
  Inbox,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Plane,
  UserCheck,
} from "lucide-react";

/**
 * The menu lives here rather than in the server component because Lucide icons
 * are functions, and a Server Component may only hand plain objects to a Client
 * Component.
 *
 * Order matches the order of the sections on the page — previously the two
 * disagreed, so "Бүртгэлүүд" (second in the menu) jumped to the fifth section.
 */
const NAV_ITEMS = [
  { label: "Ерөнхий", href: "#overview", icon: LayoutDashboard },
  { label: "Бүртгэлүүд", href: "#registrations", icon: Inbox },
  { label: "Хэрэглэгчид", href: "#customers", icon: UserCheck },
  { label: "Сэтгэгдэл", href: "#reviews", icon: MessageSquare },
  { label: "Хөтөлбөрүүд", href: "#programs", icon: Plane },
  { label: "Баг ба үйлчилгээ", href: "#team-services", icon: Briefcase },
  { label: "Веб тохиргоо", href: "#web-settings", icon: Gauge },
  { label: "Мэйл илгээх", href: "#mail-sender", icon: Mail },
];

/**
 * Sidebar navigation with a real active state.
 *
 * The previous version highlighted the first item unconditionally (`index === 0`),
 * so the sidebar always claimed you were on "Ерөнхий" no matter where you had
 * scrolled. This tracks the section actually in view instead.
 */
export function AdminNav() {
  const [activeHref, setActiveHref] = useState(NAV_ITEMS[0].href);

  useEffect(() => {
    const sections = NAV_ITEMS
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // The section nearest the top of the viewport wins, so scrolling past a
        // long section does not leave the previous one highlighted.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveHref(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="mt-10 space-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === activeHref;

        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
