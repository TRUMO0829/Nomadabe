"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "./language-provider";

const SOCIALS = [
  {
    label: "FB",
    href: "https://www.facebook.com/p/Nomadabe-Travel-61564497080885/",
  },
  { label: "IG", href: "https://www.instagram.com/nomadabe.travel/" },
];

const CONTACT_EMAIL = "ariunbold.nar@gmail.com";
const MINISTER_TOWER_ADDRESS =
  "Minister Tower, Olympic Street 15, Ulaanbaatar, Mongolia, Ulaanbaatar, Mongolia, 976";
const MINISTER_TOWER_MAP_URL =
  "https://www.google.com/maps/place/Minister+Tower/@47.9153226,106.917978,425m/data=!3m2!1e3!4b1!4m6!3m5!1s0x5d9693649ea1b323:0x8bb14a35346801cd!8m2!3d47.9153226!4d106.9205583!16s%2Fg%2F11ss8zbb4r?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D";
const MINISTER_TOWER_EMBED_URL =
  "https://maps.google.com/maps?q=47.9153226,106.9205583&z=17&ie=UTF8&iwloc=&output=embed";

const CONTACTS = [
  { type: "email", label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { type: "phone", label: "9910 3258", href: "tel:+97699103258" },
  { type: "phone", label: "9918 9317", href: "tel:+97699189317" },
  {
    type: "address",
    label: MINISTER_TOWER_ADDRESS,
    href: MINISTER_TOWER_MAP_URL,
  },
] as const;

const INQUIRY_MESSAGE = {
  mn: "Nomadabe Travel-ийн аяллын төлөвлөлтийн мэдээлэл авах хүсэлтэй байна.",
  en: "I want to receive Nomadabe Travel trip planning information.",
  zh: "我想获取 Nomadabe Travel 的旅行规划信息。",
  ja: "Nomadabe Travel の旅行計画情報を受け取りたいです。",
  ko: "Nomadabe Travel 여행 계획 정보를 받고 싶습니다.",
} as const;

const FOOTER_COPY = {
  mn: {
    tagline: "Аяллын мэргэжлийн зөвлөх",
    description:
      "Монгол болон дэлхийн чиглэлүүдэд бизнес, expo, амралт зугаалга, захиалгат аяллыг төлөвлөж зохион байгуулна.",
    linksTitle: "Холбоосууд",
    contactTitle: "Холбоо барих",
    mapTitle: "Байршил",
    links: [
      { label: "Бидний тухай", href: "/#about" },
      { label: "Аяллууд", href: "/tours" },
      { label: "Сэтгэл ханамж", href: "/#journal" },
      { label: "Холбоо барих", href: "/plan" },
    ],
    contacts: CONTACTS,
    mapButton: "Google Maps нээх",
    copyright: "Бүх эрх хуулиар хамгаалагдсан.",
    legal: ["Үйлчилгээний нөхцөл", "Нууцлалын бодлого"],
  },
  en: {
    tagline: "Professional travel consulting",
    description:
      "Business, expo, leisure, and custom travel across Mongolia and global destinations, planned with care.",
    linksTitle: "Links",
    contactTitle: "Contact",
    mapTitle: "Location",
    links: [
      { label: "About us", href: "/#about" },
      { label: "Trips", href: "/tours" },
      { label: "Satisfaction", href: "/#journal" },
      { label: "Contact", href: "/plan" },
    ],
    contacts: CONTACTS,
    mapButton: "Open in Google Maps",
    copyright: "All rights reserved.",
    legal: ["Terms of service", "Privacy policy"],
  },
  zh: {
    tagline: "专业旅行顾问",
    description:
      "为蒙古和全球目的地规划商务、展会、休闲和定制旅行。",
    linksTitle: "链接",
    contactTitle: "联系方式",
    mapTitle: "位置",
    links: [
      { label: "关于我们", href: "/#about" },
      { label: "旅行", href: "/tours" },
      { label: "满意度", href: "/#journal" },
      { label: "联系", href: "/plan" },
    ],
    contacts: CONTACTS,
    mapButton: "打开 Google Maps",
    copyright: "版权所有。",
    legal: ["服务条款", "隐私政策"],
  },
  ja: {
    tagline: "プロの旅行コンサルティング",
    description:
      "モンゴルと世界各地へのビジネス、展示会、レジャー、カスタム旅行を丁寧に計画します。",
    linksTitle: "リンク",
    contactTitle: "お問い合わせ",
    mapTitle: "所在地",
    links: [
      { label: "私たちについて", href: "/#about" },
      { label: "ツアー", href: "/tours" },
      { label: "満足度", href: "/#journal" },
      { label: "お問い合わせ", href: "/plan" },
    ],
    contacts: CONTACTS,
    mapButton: "Google Maps を開く",
    copyright: "All rights reserved.",
    legal: ["利用規約", "プライバシーポリシー"],
  },
  ko: {
    tagline: "전문 여행 컨설팅",
    description:
      "몽골과 전 세계 목적지의 비즈니스, 엑스포, 휴양, 맞춤 여행을 세심하게 계획합니다.",
    linksTitle: "링크",
    contactTitle: "연락처",
    mapTitle: "위치",
    links: [
      { label: "회사 소개", href: "/#about" },
      { label: "여행", href: "/tours" },
      { label: "만족도", href: "/#journal" },
      { label: "연락하기", href: "/plan" },
    ],
    contacts: CONTACTS,
    mapButton: "Google Maps 열기",
    copyright: "All rights reserved.",
    legal: ["서비스 약관", "개인정보 처리방침"],
  },
} as const;

type CtaFooterProps = {
  showPlanningSection?: boolean;
};

export function CtaFooter({ showPlanningSection = false }: CtaFooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const { contentLocale, t } = useLanguage();
  const footer = FOOTER_COPY[contentLocale];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Website visitor",
          email,
          inquiryType: "general",
          message: INQUIRY_MESSAGE[contentLocale],
        }),
      });

      if (response.ok) {
        setEmail("");
        setStatus("success");
        return;
      }
    } catch {
      setStatus("error");
      return;
    }

    setStatus("error");
  }

  return (
    <>
      {showPlanningSection && (
        <section
          id="contact"
          className="relative overflow-hidden bg-primary px-6 pb-24 pt-32 text-primary-foreground lg:px-10 lg:pb-32 lg:pt-40"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000&q=80&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/85 to-primary/60" />

          <div className="relative mx-auto max-w-5xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-4xl text-balance sm:text-5xl lg:text-7xl"
            >
              {t.cta.headingLine1}
              <br />
              <span className="italic text-accent">{t.cta.headingLine2}</span>
            </motion.h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/75 lg:text-lg">
              {t.cta.body}
            </p>

            <form
              className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder={t.cta.placeholder}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-6 py-4 text-white placeholder:text-white/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-accent px-7 py-4 font-semibold text-accent-foreground transition-colors hover:bg-secondary disabled:cursor-wait disabled:opacity-70"
              >
                {status === "loading" ? t.cta.loading : t.cta.button}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-4 text-xs text-primary-foreground/60">
              {status === "success"
                ? t.cta.success
                : status === "error"
                  ? t.cta.error
                  : t.cta.idle}
            </p>
          </div>
        </section>
      )}

      <footer className="bg-[#141414] text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.65fr_1fr_0.95fr]">
            <div>
              <Link href="/#home" className="inline-flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1.5">
                  <Image
                    src="/nomadabe-mark.png"
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full rounded-md object-cover [object-position:center_35%]"
                  />
                </span>
                <span>
                  <span className="block text-xl font-black uppercase tracking-wide text-accent">
                    Nomadabe
                  </span>
                  <span className="block text-xs font-bold uppercase tracking-[0.2em] text-white">
                    {footer.tagline}
                  </span>
                </span>
              </Link>

              <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
                {footer.description}
              </p>

              <div className="mt-7 flex gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs font-black text-white transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            <nav>
              <h3 className="mb-6 text-sm font-black uppercase tracking-[0.16em] text-accent">
                {footer.linksTitle}
              </h3>
              <ul className="space-y-3">
                {footer.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/72 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className="mb-6 text-sm font-black uppercase tracking-[0.16em] text-accent">
                {footer.contactTitle}
              </h3>
              <ul className="space-y-4">
                {CONTACTS.map((contact) => (
                  <li key={`${contact.type}-${contact.label}`}>
                    <a
                      href={contact.href}
                      className="group flex gap-3 text-sm leading-6 text-white/72"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                        {contact.type === "phone" ? (
                          <Phone className="h-4 w-4" />
                        ) : contact.type === "address" ? (
                          <MapPin className="h-4 w-4" />
                        ) : (
                          <Mail className="h-4 w-4" />
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
              <h3 className="mb-6 text-sm font-black uppercase tracking-[0.16em] text-accent">
                {footer.mapTitle}
              </h3>
              <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <iframe
                  title={footer.mapTitle}
                  src={MINISTER_TOWER_EMBED_URL}
                  className="h-52 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={MINISTER_TOWER_MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-white/65 transition-colors hover:text-accent"
              >
                {footer.mapButton}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="mt-14 flex flex-col justify-between gap-5 border-t border-white/10 pt-8 text-xs text-white/45 lg:flex-row lg:items-center">
            <div>
              © {new Date().getFullYear()} Nomadabe.mn — {footer.copyright}
            </div>
            <div className="flex flex-wrap gap-6">
              {footer.legal.map((link) => (
                <a key={link} href="#" className="hover:text-accent">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
