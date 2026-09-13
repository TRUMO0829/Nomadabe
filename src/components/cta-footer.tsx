"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { PlanningRequestSection } from "./planning-request-section";
import { useLanguage } from "./language-provider";

export const WHATSAPP_URL = "https://wa.me/97699103258";
export const PRIMARY_PHONE = { label: "+976 9910 3258", href: "tel:+97699103258" } as const;

const SOCIALS = [
  {
    label: "Facebook",
    icon: "facebook",
    href: "https://www.facebook.com/p/Nomadabe-Travel-61564497080885/",
  },
  {
    label: "Instagram",
    icon: "instagram",
    href: "https://www.instagram.com/nomadabe.travel/",
  },
  {
    label: "WhatsApp",
    icon: "whatsapp",
    href: WHATSAPP_URL,
  },
  {
    label: "WeChat",
    icon: "wechat",
    href: "weixin://dl/chat?Ariunbold",
  },
] as const;

const CONTACT_EMAIL = "info@nomadabe.mn";
const MINISTER_TOWER_MAP_URL =
  "https://www.google.com/maps/place/Minister+Tower/@47.9153226,106.917978,425m/data=!3m2!1e3!4b1!4m6!3m5!1s0x5d9693649ea1b323:0x8bb14a35346801cd!8m2!3d47.9153226!4d106.9205583!16s%2Fg%2F11ss8zbb4r?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D";
const OYU_INTELLIGENCE_URL = "https://www.oyu-intelligence.com/";

const CONTACTS = [
  { type: "email", label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { type: "phone", label: PRIMARY_PHONE.label, href: PRIMARY_PHONE.href },
  { type: "phone", label: "+976 9918 9317", href: "tel:+97699189317" },
] as const;

const FOOTER_COPY = {
  mn: {
    tagline: "Аяллын зөвлөх үйлчилгээ",
    menu: "Цэс",
    contacts: "Холбоо барих",
    socials: "Сошиал холбоос",
    rights: "Бүх эрх хуулиар хамгаалагдсан.",
    links: [
      { label: "Бидний тухай", href: "/about" },
      { label: "Түгээмэл асуултууд", href: "/faq" },
      { label: "Аяллууд", href: "/tours" },
      { label: "Захиалга", href: "/plan" },
    ],
    legal: [
      { label: "Үйлчилгээний нөхцөл", href: "/terms" },
      { label: "Нууцлалын бодлого", href: "/privacy" },
    ],
  },
  en: {
    tagline: "Travel consulting",
    menu: "Menu",
    contacts: "Contact",
    socials: "Social links",
    rights: "All rights reserved.",
    links: [
      { label: "About us", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Trips", href: "/tours" },
      { label: "Booking", href: "/plan" },
    ],
    legal: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
  zh: {
    tagline: "旅行咨询",
    menu: "菜单",
    contacts: "联系方式",
    socials: "社交链接",
    rights: "版权所有。",
    links: [
      { label: "关于我们", href: "/about" },
      { label: "常见问题", href: "/faq" },
      { label: "旅行", href: "/tours" },
      { label: "预订", href: "/plan" },
    ],
    legal: [
      { label: "服务条款", href: "/terms" },
      { label: "隐私政策", href: "/privacy" },
    ],
  },
  ja: {
    tagline: "旅行コンサルティング",
    menu: "メニュー",
    contacts: "連絡先",
    socials: "SNSリンク",
    rights: "無断転載を禁じます。",
    links: [
      { label: "私たちについて", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "ツアー", href: "/tours" },
      { label: "予約", href: "/plan" },
    ],
    legal: [
      { label: "利用規約", href: "/terms" },
      { label: "プライバシーポリシー", href: "/privacy" },
    ],
  },
  ko: {
    tagline: "여행 컨설팅",
    menu: "메뉴",
    contacts: "연락처",
    socials: "소셜 링크",
    rights: "모든 권리 보유.",
    links: [
      { label: "회사 소개", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "여행", href: "/tours" },
      { label: "예약", href: "/plan" },
    ],
    legal: [
      { label: "서비스 약관", href: "/terms" },
      { label: "개인정보 처리방침", href: "/privacy" },
    ],
  },
} as const;

type CtaFooterProps = {
  /** Renders the trip / villa request form above the footer (the /plan page). */
  showPlanningSection?: boolean;
};

export function CtaFooter({ showPlanningSection = false }: CtaFooterProps) {
  const { contentLocale } = useLanguage();
  const footer = FOOTER_COPY[contentLocale];

  return (
    <>
      {showPlanningSection ? <PlanningRequestSection /> : null}

      <footer className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_0.85fr_1.15fr_0.85fr]">
            <div>
              <Link href="/#home" aria-label="Nomadabe Travel" className="inline-flex">
                <Image
                  src="/nomadabe-logo-cropped.webp"
                  alt="Nomadabe Travel"
                  width={574}
                  height={615}
                  sizes="92px"
                  className="h-24 w-auto object-contain"
                />
              </Link>

              <a
                href={MINISTER_TOWER_MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-10 flex max-w-sm gap-4 text-sm text-white/72 transition-colors hover:text-accent"
              >
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <span>Minister Tower, Olympic Street 15, Ulaanbaatar, Mongolia</span>
              </a>

              <p className="mt-8 text-xs uppercase text-white/55">{footer.tagline}</p>
            </div>

            <nav aria-label={footer.menu}>
              <FooterColumnTitle>{footer.menu}</FooterColumnTitle>
              <ul className="space-y-4">
                {footer.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-base text-white/72 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <FooterColumnTitle>{footer.contacts}</FooterColumnTitle>
              <ul className="space-y-4">
                {CONTACTS.map((contact) => (
                  <li key={`${contact.type}-${contact.label}`}>
                    <a
                      href={contact.href}
                      className="group flex gap-3 text-base text-white/72"
                    >
                      <span className="footer-accent-icon mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center transition-transform group-hover:scale-110">
                        {contact.type === "phone" ? (
                          <Phone className="h-5 w-5" />
                        ) : (
                          <Mail className="h-5 w-5" />
                        )}
                      </span>
                      <span className="transition-colors group-hover:text-accent">
                        {contact.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <FooterColumnTitle>{footer.socials}</FooterColumnTitle>
              <ul className="space-y-4">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-3 text-base text-white/72"
                    >
                      <span className="footer-accent-icon flex h-6 w-6 items-center justify-center transition-transform group-hover:scale-110">
                        <SocialIcon icon={social.icon} />
                      </span>
                      <span className="transition-colors group-hover:text-accent">
                        {social.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative mt-14 border-t border-white/10 pt-7 text-xs text-white/60">
            <div className="relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <a
                href={OYU_INTELLIGENCE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-3 uppercase transition-colors hover:text-accent"
              >
                <span>
                  © {new Date().getFullYear()} OYU INTELLIGENCE LLC. {footer.rights}
                </span>
                <span className="relative h-10 w-10 shrink-0 opacity-90">
                  <Image
                    src="/oyu-intelligence-logo.webp"
                    alt="OYU Intelligence"
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </span>
              </a>
              <div className="flex flex-wrap gap-6">
                {footer.legal.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterColumnTitle({ children }: { children: string }) {
  return (
    <div className="mb-7">
      <h2 className="text-sm uppercase text-white/80">{children}</h2>
      <span className="mt-5 block h-px w-full bg-white/12" />
    </div>
  );
}

export function SocialIcon({ icon }: { icon: (typeof SOCIALS)[number]["icon"] }) {
  if (icon === "facebook") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
      >
        <path
          fill="currentColor"
          d="M18.9 13.5l.7-4.7h-4.5v-3c0-1.3.6-2.5 2.6-2.5h2.1V.2S17.9 0 16.1 0C12.3 0 9.8 2.3 9.8 6.5v2.3H5.6v4.7h4.2V24H15V13.5h3.9Z"
        />
      </svg>
    );
  }

  if (icon === "whatsapp") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
      >
        <path
          fill="currentColor"
          d="M20.5 3.5A11.2 11.2 0 0 0 12.6 0C6.5 0 1.5 4.9 1.5 11c0 1.9.5 3.8 1.5 5.5L1.4 22l5.7-1.5a11 11 0 0 0 5.5 1.4c6.1 0 11.1-4.9 11.1-11 0-2.9-1.1-5.6-3.2-7.4Zm-7.9 16.6c-1.7 0-3.4-.5-4.8-1.4l-.3-.2-3.4.9.9-3.3-.2-.3a9 9 0 0 1-1.4-4.8c0-5 4.1-9.1 9.2-9.1 2.4 0 4.7.9 6.4 2.7a9 9 0 0 1 2.7 6.4c0 5-4.1 9.1-9.1 9.1Zm5-6.8c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.3 3.4 1.4 3.6.2.2 2.5 3.8 6 5.3.8.4 1.5.6 2 .7.9.3 1.6.2 2.2.1.7-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5 0-.1-.3-.2-.6-.4Z"
        />
      </svg>
    );
  }

  if (icon === "wechat") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
      >
        <path
          fill="currentColor"
          d="M9.6 4.2C4.9 4.2 1.2 7.3 1.2 11c0 2.1 1.2 4 3.1 5.2l-.8 2.5 3-1.5c1 .3 2 .5 3.1.5h.4a6.5 6.5 0 0 1-.3-1.9c0-3.8 3.8-6.8 8.3-6.8h.3c-1-2.8-4.4-4.8-8.7-4.8Zm-2.9 3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5.6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5.7 2.6c-3.8 0-6.9 2.5-6.9 5.6s3.1 5.6 6.9 5.6c.8 0 1.6-.1 2.3-.3l2.4 1.2-.6-2c1.6-1 2.6-2.5 2.6-4.2 0-3-3.1-5.5-6.7-5.5Zm-2.3 3a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Zm4.6 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-[2]"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" className="stroke-none" />
    </svg>
  );
}
