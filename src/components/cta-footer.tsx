"use client";

import type { FormEvent, InputHTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LEGAL_COPY, type LegalPageKind } from "@/components/legal-page";
import { useLanguage } from "./language-provider";

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
    href: "https://wa.me/97699103258",
  },
  {
    label: "WeChat",
    icon: "wechat",
    href: "weixin://dl/chat?Ariunbold",
  },
] as const;

const CONTACT_EMAIL = "info@nomadabe.mn";
const MINISTER_TOWER_ADDRESS =
  "Minister Tower, Olympic Street 15, Ulaanbaatar, Mongolia, Ulaanbaatar, Mongolia, 976";
const MINISTER_TOWER_MAP_URL =
  "https://www.google.com/maps/place/Minister+Tower/@47.9153226,106.917978,425m/data=!3m2!1e3!4b1!4m6!3m5!1s0x5d9693649ea1b323:0x8bb14a35346801cd!8m2!3d47.9153226!4d106.9205583!16s%2Fg%2F11ss8zbb4r?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D";
const OYU_INTELLIGENCE_URL = "https://www.oyu-intelligence.com/";

const CONTACTS = [
  { type: "email", label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { type: "whatsapp", label: "WhatsApp +976 9910 3258", href: "https://wa.me/97699103258" },
  { type: "wechat", label: "WeChat Ariunbold", href: "weixin://dl/chat?Ariunbold" },
  { type: "phone", label: "+976 9910 3258", href: "tel:+97699103258" },
  { type: "phone", label: "+976 9918 9317", href: "tel:+97699189317" },
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

const VILLA_INQUIRY_MESSAGE = {
  mn: "Nomadabe Travel-ийн вилла захиалгын мэдээлэл авах хүсэлтэй байна.",
  en: "I want to receive Nomadabe Travel villa booking information.",
  zh: "我想获取 Nomadabe Travel 的别墅预订信息。",
  ja: "Nomadabe Travel のヴィラ予約情報を受け取りたいです。",
  ko: "Nomadabe Travel 빌라 예약 정보를 받고 싶습니다.",
} as const;

const PLAN_COPY = {
  mn: {
    eyebrow: "Хүсэлт",
    name: "Нэр",
    email: "И-мэйл",
    destination: "Чиглэл",
    month: "Явах огноо",
    travelers: "Хүний тоо",
    budget: "Төсөв",
    type: "Аяллын төрөл",
    note: "Нэмэлт хүсэлт",
    submit: "Хүсэлт илгээх",
    loading: "Илгээж байна...",
    success: "Хүсэлт хадгалагдлаа. Манай баг тантай холбогдоно.",
    error: "Илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
    placeholders: {
      name: "Таны нэр",
      email: "name@example.com",
      destination: "Жишээ: Говь, Япон, Canton Fair",
      budget: "Жишээ: 3,000,000 MNT",
      note: "Аяллын зорилго, хүүхэдтэй эсэх, буудлын түвшин гэх мэт",
    },
    types: [
      { value: "custom", label: "Захиалгат аялал" },
      { value: "business", label: "Бизнес аялал" },
      { value: "expo", label: "Expo / үзэсгэлэн" },
      { value: "general", label: "Ерөнхий зөвлөгөө" },
    ],
  },
  en: {
    eyebrow: "Request",
    name: "Name",
    email: "Email",
    destination: "Destination",
    month: "Travel date",
    travelers: "Travelers",
    budget: "Budget",
    type: "Trip type",
    note: "Notes",
    submit: "Send request",
    loading: "Sending...",
    success: "Request saved. Our team will contact you.",
    error: "Could not send. Please try again.",
    placeholders: {
      name: "Your name",
      email: "name@example.com",
      destination: "Example: Gobi, Japan, Canton Fair",
      budget: "Example: 3,000,000 MNT",
      note: "Purpose, hotel level, children, timing, or other preferences",
    },
    types: [
      { value: "custom", label: "Custom trip" },
      { value: "business", label: "Business trip" },
      { value: "expo", label: "Expo / fair" },
      { value: "general", label: "General advice" },
    ],
  },
} as const;

const VILLA_PLAN_COPY = {
  mn: {
    headingLine1: "Вилла захиалах хүсэлт",
    headingLine2: "байршил, хоног, хүний тоогоо үлдээгээрэй.",
    body: "Манай баг боломжит вилла, үнэ болон нөхцөлийг шалгаад тантай холбогдоно.",
    eyebrow: "Вилла хүсэлт",
    name: "Нэр",
    email: "И-мэйл",
    destination: "Вилла / байршил",
    month: "Орох огноо",
    travelers: "Хүний тоо",
    budget: "Төсөв / хоног",
    type: "Захиалгын төрөл",
    note: "Нэмэлт хүсэлт",
    submit: "Вилла хүсэлт илгээх",
    loading: "Илгээж байна...",
    success: "Вилла захиалгын хүсэлт хадгалагдлаа. Манай баг тантай холбогдоно.",
    error: "Илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
    idle: "Спам байхгүй. Зөвхөн вилла захиалгын бодит санал илгээнэ.",
    placeholders: {
      name: "Таны нэр",
      email: "name@example.com",
      destination: "Жишээ: Тэрэлж гэр бүлийн вилла",
      budget: "Жишээ: 650,000 MNT / хоног",
      note: "Орох/гарах өдөр, өрөөний тоо, хүүхэдтэй эсэх, нэмэлт үйлчилгээ гэх мэт",
    },
    types: [
      { value: "villa", label: "Вилла захиалга" },
      { value: "family-villa", label: "Гэр бүлийн вилла" },
      { value: "group-villa", label: "Групп вилла" },
      { value: "villa-advice", label: "Вилла зөвлөгөө" },
    ],
  },
  en: {
    headingLine1: "Villa booking request",
    headingLine2: "share your stay dates and guest count.",
    body: "Our team will check available villas, pricing, and terms, then contact you.",
    eyebrow: "Villa request",
    name: "Name",
    email: "Email",
    destination: "Villa / location",
    month: "Check-in date",
    travelers: "Guests",
    budget: "Budget / night",
    type: "Booking type",
    note: "Notes",
    submit: "Send villa request",
    loading: "Sending...",
    success: "Villa booking request saved. Our team will contact you.",
    error: "Could not send. Please try again.",
    idle: "No spam. We only send real villa booking proposals.",
    placeholders: {
      name: "Your name",
      email: "name@example.com",
      destination: "Example: Terelj family villa",
      budget: "Example: 650,000 MNT / night",
      note: "Check-in/out dates, rooms, children, extra services, or other preferences",
    },
    types: [
      { value: "villa", label: "Villa booking" },
      { value: "family-villa", label: "Family villa" },
      { value: "group-villa", label: "Group villa" },
      { value: "villa-advice", label: "Villa advice" },
    ],
  },
} as const;

const FOOTER_COPY = {
  mn: {
    tagline: "Аяллын мэргэжлийн зөвлөх",
    description:
      "Монгол болон дэлхийн чиглэлүүдэд бизнес, expo, амралт зугаалга, захиалгат аяллыг төлөвлөж зохион байгуулна.",
    linksTitle: "Холбоосууд",
    contactTitle: "Төлөвлөх",
    mapTitle: "Байршил",
    links: [
      { label: "Бидний тухай", href: "/about" },
      { label: "Түгээмэл асуултууд", href: "/faq" },
      { label: "Аяллууд", href: "/tours" },
      { label: "Төлөвлөх", href: "/plan" },
    ],
    contacts: CONTACTS,
    mapButton: "Google Maps нээх",
    legal: [
      { label: "Үйлчилгээний нөхцөл", href: "/terms" },
      { label: "Нууцлалын бодлого", href: "/privacy" },
    ],
  },
  en: {
    tagline: "Professional travel consulting",
    description:
      "Business, expo, leisure, and custom travel across Mongolia and global destinations, planned with care.",
    linksTitle: "Links",
    contactTitle: "Contact",
    mapTitle: "Location",
    links: [
      { label: "About us", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Trips", href: "/tours" },
      { label: "Contact", href: "/plan" },
    ],
    contacts: CONTACTS,
    mapButton: "Open in Google Maps",
    legal: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
  zh: {
    tagline: "专业旅行顾问",
    description:
      "我们为蒙古及全球目的地提供商务考察、展会行程、休闲度假和定制旅行规划。",
    linksTitle: "链接",
    contactTitle: "联系方式",
    mapTitle: "位置",
    links: [
      { label: "关于我们", href: "/about" },
      { label: "常见问题", href: "/faq" },
      { label: "旅行", href: "/tours" },
      { label: "联系", href: "/plan" },
    ],
    contacts: CONTACTS,
    mapButton: "打开 Google Maps",
    legal: [
      { label: "服务条款", href: "/terms" },
      { label: "隐私政策", href: "/privacy" },
    ],
  },
  ja: {
    tagline: "旅の専門コンサルタント",
    description:
      "モンゴル国内外のビジネス視察、展示会、レジャー、オーダーメイド旅行を丁寧にプランニングします。",
    linksTitle: "リンク",
    contactTitle: "お問い合わせ",
    mapTitle: "所在地",
    links: [
      { label: "私たちについて", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "ツアー", href: "/tours" },
      { label: "お問い合わせ", href: "/plan" },
    ],
    contacts: CONTACTS,
    mapButton: "Google Maps を開く",
    legal: [
      { label: "利用規約", href: "/terms" },
      { label: "プライバシーポリシー", href: "/privacy" },
    ],
  },
  ko: {
    tagline: "전문 여행 컨설팅",
    description:
      "몽골 국내외 비즈니스 답사, 엑스포 일정, 휴양, 맞춤 여행을 목적에 맞게 세심하게 설계합니다.",
    linksTitle: "링크",
    contactTitle: "연락처",
    mapTitle: "위치",
    links: [
      { label: "회사 소개", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "여행", href: "/tours" },
      { label: "연락하기", href: "/plan" },
    ],
    contacts: CONTACTS,
    mapButton: "Google Maps 열기",
    legal: [
      { label: "서비스 약관", href: "/terms" },
      { label: "개인정보 처리방침", href: "/privacy" },
    ],
  },
} as const;

const FOOTER_COLUMN_COPY = {
  mn: {
    menu: "Цэс",
    contacts: "Холбоосууд",
    socials: "Сошиал холбоос",
  },
  en: {
    menu: "Menu",
    contacts: "Contacts",
    socials: "Social links",
  },
  zh: {
    menu: "菜单",
    contacts: "联系方式",
    socials: "社交链接",
  },
  ja: {
    menu: "メニュー",
    contacts: "連絡先",
    socials: "SNSリンク",
  },
  ko: {
    menu: "메뉴",
    contacts: "연락처",
    socials: "소셜 링크",
  },
} as const;

const LEGAL_DIALOG_COPY = {
  mn: {
    close: "Хаах",
    agree: "Зөвшөөрөх",
    readAll: "Зөвшөөрөхөөс өмнө бүх нөхцөлийг уншина уу.",
  },
  en: {
    close: "Cancel",
    agree: "I agree",
    readAll: "Read all terms before accepting.",
  },
  zh: {
    close: "关闭",
    agree: "同意",
    readAll: "接受前请阅读全部内容。",
  },
  ja: {
    close: "閉じる",
    agree: "同意する",
    readAll: "同意する前にすべてお読みください。",
  },
  ko: {
    close: "닫기",
    agree: "동의",
    readAll: "동의하기 전에 전체 내용을 읽어 주세요.",
  },
} as const;

type CtaFooterProps = {
  showPlanningSection?: boolean;
};

export function CtaFooter({ showPlanningSection = false }: CtaFooterProps) {
  const authPromptedRef = useRef(false);
  const [planningMode, setPlanningMode] = useState<"trip" | "villa">(() => {
    if (typeof window === "undefined") {
      return "trip";
    }

    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode")?.trim();
    const tripSlug = params.get("trip")?.trim() ?? "";

    return mode === "villa" || tripSlug.startsWith("villa-") ? "villa" : "trip";
  });
  const [planningForm, setPlanningForm] = useState(() => {
    const params =
      typeof window === "undefined"
        ? null
        : new URLSearchParams(window.location.search);
    const mode = params?.get("mode")?.trim();
    const tripSlug = params?.get("trip")?.trim() ?? "";
    const isVillaRequest = mode === "villa" || tripSlug.startsWith("villa-");
    const baseForm = {
      name: "",
      email: "",
      destination: "",
      preferredDate: "",
      travelers: "2",
      budget: "",
      inquiryType: isVillaRequest ? "villa" : "custom",
      note: "",
    };

    if (!params) {
      return baseForm;
    }

    const tripTitle = params.get("title")?.trim();
    const destination = tripTitle || tripSlug;

    if (!destination) {
      return baseForm;
    }

    return {
      ...baseForm,
      destination,
      note: isVillaRequest
        ? `Сонирхож буй вилла: ${destination}`
        : `Сонирхож буй аялал: ${destination}`,
    };
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [planningAuthenticated, setPlanningAuthenticated] = useState<boolean | null>(
    null
  );
  const { contentLocale, t } = useLanguage();
  const footer = FOOTER_COPY[contentLocale];
  const footerColumns = FOOTER_COLUMN_COPY[contentLocale];
  const villaPlanCopy =
    contentLocale === "mn" ? VILLA_PLAN_COPY.mn : VILLA_PLAN_COPY.en;
  const planCopy =
    planningMode === "villa"
      ? villaPlanCopy
      : contentLocale === "mn"
        ? PLAN_COPY.mn
        : PLAN_COPY.en;
  const planHeadingLine1 =
    planningMode === "villa" ? villaPlanCopy.headingLine1 : t.cta.headingLine1;
  const planHeadingLine2 =
    planningMode === "villa" ? villaPlanCopy.headingLine2 : t.cta.headingLine2;
  const planBody = planningMode === "villa" ? villaPlanCopy.body : t.cta.body;
  const idleText = planningMode === "villa" ? villaPlanCopy.idle : t.cta.idle;

  useEffect(() => {
    if (!showPlanningSection) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode")?.trim();
    const tripSlug = params.get("trip")?.trim() ?? "";
    const tripTitle = params.get("title")?.trim();
    const destination = tripTitle || tripSlug;
    const isVillaRequest = mode === "villa" || tripSlug.startsWith("villa-");

    setPlanningMode(isVillaRequest ? "villa" : "trip");

    if (!destination) {
      return;
    }

    setPlanningForm((form) => ({
      ...form,
      destination,
      inquiryType: isVillaRequest ? "villa" : form.inquiryType,
      note:
        form.note && !form.note.startsWith("Сонирхож буй ")
          ? form.note
          : isVillaRequest
            ? `Сонирхож буй вилла: ${destination}`
            : `Сонирхож буй аялал: ${destination}`,
    }));
  }, [showPlanningSection]);

  // Prefill the planning form with the signed-in customer's email/name so they
  // don't have to retype it. Only fills empty fields — never overwrites input.
  useEffect(() => {
    if (!showPlanningSection) {
      return;
    }

    let active = true;

    async function loadCustomer() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "include",
        });
        const payload = response.ok ? await response.json() : null;
        const customer = payload?.data?.customer;

        if (!active || !customer?.email) {
          if (active) {
            setPlanningAuthenticated(false);
            if (!authPromptedRef.current) {
              authPromptedRef.current = true;
              window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
            }
          }
          return;
        }

        setPlanningAuthenticated(true);
        setPlanningForm((form) => ({
          ...form,
          email: form.email || customer.email,
          name: form.name || customer.name || "",
        }));
      } catch {
        if (active) {
          setPlanningAuthenticated(false);
          if (!authPromptedRef.current) {
            authPromptedRef.current = true;
            window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
          }
        }
      }
    }

    void loadCustomer();
    window.addEventListener("nomadabe:auth-changed", loadCustomer);

    return () => {
      active = false;
      window.removeEventListener("nomadabe:auth-changed", loadCustomer);
    };
  }, [showPlanningSection]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (showPlanningSection && planningAuthenticated !== true) {
      authPromptedRef.current = true;
      window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
      setStatus("idle");
      return;
    }

    setStatus("loading");

    const message = [
      planningMode === "villa"
        ? VILLA_INQUIRY_MESSAGE[contentLocale]
        : INQUIRY_MESSAGE[contentLocale],
      `${planningMode === "villa" ? "Вилла / байршил" : "Чиглэл"}: ${
        planningForm.destination || "Тодорхойгүй"
      }`,
      `Төсөв: ${planningForm.budget || "Тодорхойгүй"}`,
      `Тайлбар: ${planningForm.note || "Нэмэлт тайлбаргүй"}`,
    ].join("\n");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: planningForm.name,
          email: planningForm.email,
          inquiryType: planningForm.inquiryType,
          travelers: Number(planningForm.travelers),
          preferredDate: planningForm.preferredDate,
          message,
        }),
      });

      if (response.ok) {
        setPlanningForm({
          name: "",
          email: "",
          destination: "",
          preferredDate: "",
          travelers: "2",
          budget: "",
          inquiryType: planningMode === "villa" ? "villa" : "custom",
          note: "",
        });
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
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=3200&q=90&fit=crop&fm=webp')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/34 to-black/12" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.20),transparent_32%,transparent_68%,rgba(0,0,0,0.22))]" />

          <div className="relative mx-auto max-w-5xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-3xl text-balance sm:text-4xl lg:text-5xl"
            >
              {planHeadingLine1}
              <br />
              <span className="italic text-accent">{planHeadingLine2}</span>
            </motion.h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/75 lg:text-lg">
              {planBody}
            </p>

            <form
              className="mx-auto mt-10 grid max-w-4xl gap-4 rounded-md border border-white/35 bg-black/30 p-4 text-left shadow-[0_24px_90px_rgba(0,0,0,0.34)] backdrop-blur-[2px] sm:grid-cols-2 lg:p-6"
              onSubmit={handleSubmit}
            >
              <div className="sm:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  {planCopy.eyebrow}
                </span>
              </div>
              <PlanInput
                label={planCopy.name}
                value={planningForm.name}
                placeholder={planCopy.placeholders.name}
                required
                onChange={(value) => setPlanningForm((form) => ({ ...form, name: value }))}
              />
              <PlanInput
                label={planCopy.email}
                type="email"
                value={planningForm.email}
                placeholder={planCopy.placeholders.email}
                required
                onChange={(value) => setPlanningForm((form) => ({ ...form, email: value }))}
              />
              <PlanInput
                label={planCopy.destination}
                value={planningForm.destination}
                placeholder={planCopy.placeholders.destination}
                required
                onChange={(value) =>
                  setPlanningForm((form) => ({ ...form, destination: value }))
                }
              />
              <PlanInput
                label={planCopy.month}
                type="date"
                value={planningForm.preferredDate}
                onChange={(value) =>
                  setPlanningForm((form) => ({ ...form, preferredDate: value }))
                }
              />
              <PlanInput
                label={planCopy.travelers}
                type="number"
                min="1"
                value={planningForm.travelers}
                required
                onChange={(value) =>
                  setPlanningForm((form) => ({ ...form, travelers: value }))
                }
              />
              <PlanInput
                label={planCopy.budget}
                value={planningForm.budget}
                placeholder={planCopy.placeholders.budget}
                onChange={(value) => setPlanningForm((form) => ({ ...form, budget: value }))}
              />
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">
                  {planCopy.type}
                </span>
                <select
                  value={planningForm.inquiryType}
                  onChange={(event) =>
                    setPlanningForm((form) => ({
                      ...form,
                      inquiryType: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-md border border-white/20 bg-white px-4 text-sm font-semibold text-primary outline-none focus:ring-2 focus:ring-accent"
                >
                  {planCopy.types.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">
                  {planCopy.note}
                </span>
                <textarea
                  value={planningForm.note}
                  onChange={(event) =>
                    setPlanningForm((form) => ({ ...form, note: event.target.value }))
                  }
                  placeholder={planCopy.placeholders.note}
                  rows={4}
                  className="mt-2 w-full rounded-md border border-white/20 bg-white px-4 py-3 text-sm text-primary outline-none placeholder:text-primary/45 focus:ring-2 focus:ring-accent"
                />
              </label>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-accent px-7 font-semibold text-accent-foreground transition-colors hover:bg-secondary disabled:cursor-wait disabled:opacity-70 sm:col-span-2"
              >
                {status === "loading" ? planCopy.loading : planCopy.submit}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-4 text-xs text-primary-foreground/60">
              {status === "success"
                ? planCopy.success
                : status === "error"
                  ? planCopy.error
                  : idleText}
            </p>
          </div>
        </section>
      )}

      <footer className="bg-[#080807] text-white">
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
                className="mt-10 flex max-w-sm gap-4 text-sm leading-7 text-white/56 transition-colors hover:text-accent"
              >
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <span>Minister Tower, Olympic Street 15, Ulaanbaatar, Mongolia</span>
              </a>

              <p className="mt-8 text-xs uppercase tracking-[0.44em] text-white/28">
                Travel consulting
              </p>
            </div>

            <nav>
              <FooterColumnTitle>{footerColumns.menu}</FooterColumnTitle>
              <ul className="space-y-4">
                {footer.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-base text-white/44 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <FooterColumnTitle>{footerColumns.contacts}</FooterColumnTitle>
              <ul className="space-y-4">
                {CONTACTS.filter(
                  (contact) => contact.type === "email" || contact.type === "phone"
                ).map((contact) => (
                  <li key={`${contact.type}-${contact.label}`}>
                    <a
                      href={contact.href}
                      className="group flex gap-3 text-base leading-6 text-white/44"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-accent transition-transform group-hover:scale-110">
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
              <FooterColumnTitle>{footerColumns.socials}</FooterColumnTitle>
              <ul className="space-y-4">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-3 text-base text-white/44"
                    >
                      <span className="flex h-6 w-6 items-center justify-center text-accent transition-transform group-hover:scale-110">
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

          <div className="relative mt-14 border-t border-white/10 pt-7 text-xs text-white/45">
            <div className="relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <a
                href={OYU_INTELLIGENCE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-3 transition-colors hover:text-accent"
              >
                <span>
                  © {new Date().getFullYear()} OYU INTELLIGENCE LLC. БҮХ ЭРХ ХУУЛИАР
                  ХАМГААЛАГДСАН.
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
                  <LegalDialogLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    locale={contentLocale}
                  />
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
      <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/68">
        {children}
      </h3>
      <span className="mt-5 block h-px w-full bg-white/12" />
    </div>
  );
}

function LegalDialogLink({
  href,
  label,
  locale,
}: {
  href: string;
  label: string;
  locale: keyof typeof LEGAL_DIALOG_COPY;
}) {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const kind: LegalPageKind = href === "/privacy" ? "privacy" : "terms";
  const copy = LEGAL_COPY[locale]?.[kind] ?? LEGAL_COPY.mn[kind];
  const dialogCopy = LEGAL_DIALOG_COPY[locale] ?? LEGAL_DIALOG_COPY.mn;

  const handleScroll = () => {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    const maxScroll = content.scrollHeight - content.clientHeight;
    const scrollPercentage = maxScroll <= 0 ? 1 : content.scrollTop / maxScroll;

    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      return;
    }

    setHasReadToBottom(false);
    window.setTimeout(handleScroll, 0);
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-left transition-colors hover:text-accent"
        >
          {label}
        </button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[min(700px,86vh)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">
            {copy.title}
          </DialogTitle>
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="overflow-y-auto"
          >
            <DialogDescription asChild>
              <div className="px-6 py-4">
                <p className="text-sm leading-6 text-foreground/72">{copy.subtitle}</p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">{copy.updated}</p>
                <div className="mt-6 space-y-5 text-sm leading-6 text-foreground/78">
                  {copy.sections.map((section) => (
                    <section key={section.title} className="space-y-1.5">
                      <p className="font-semibold text-foreground">{section.title}</p>
                      <p>{section.body}</p>
                    </section>
                  ))}
                </div>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="border-t border-border px-6 py-4 sm:items-center">
          {!hasReadToBottom ? (
            <span className="grow text-xs text-muted-foreground max-sm:text-center">
              {dialogCopy.readAll}
            </span>
          ) : null}
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {dialogCopy.close}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" disabled={!hasReadToBottom}>
              {dialogCopy.agree}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SocialIcon({ icon }: { icon: (typeof SOCIALS)[number]["icon"] }) {
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

function PlanInput({
  label,
  value,
  onChange,
  type = "text",
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-md border border-white/20 bg-white px-4 text-sm text-primary outline-none placeholder:text-primary/45 focus:ring-2 focus:ring-accent"
        {...props}
      />
    </label>
  );
}
