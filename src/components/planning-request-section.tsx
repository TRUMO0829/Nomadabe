"use client";

import type { FormEvent, InputHTMLAttributes, ReactNode } from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import type { CopyLocale } from "@/lib/i18n";
import { Button } from "./ui/button";
import { useLanguage } from "./language-provider";

type PlanningForm = {
  name: string;
  email: string;
  destination: string;
  preferredDate: string;
  travelers: string;
  budget: string;
  inquiryType: string;
  note: string;
};

type PlanCopy = {
  eyebrow: string;
  name: string;
  email: string;
  destination: string;
  month: string;
  travelers: string;
  budget: string;
  type: string;
  note: string;
  submit: string;
  loading: string;
  success: string;
  error: string;
  /** Prefix for the note prefilled from `?trip=` / `?title=`. */
  interested: string;
  placeholders: {
    name: string;
    email: string;
    destination: string;
    budget: string;
    note: string;
  };
  types: ReadonlyArray<{ value: string; label: string }>;
};

type VillaPlanCopy = PlanCopy & {
  headingLine1: string;
  headingLine2: string;
  body: string;
  idle: string;
};

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

const PLAN_COPY: Record<CopyLocale, PlanCopy> = {
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
    interested: "Сонирхож буй аялал",
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
    interested: "Trip of interest",
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
  zh: {
    eyebrow: "咨询",
    name: "姓名",
    email: "电子邮箱",
    destination: "目的地",
    month: "出行日期",
    travelers: "人数",
    budget: "预算",
    type: "行程类型",
    note: "其他需求",
    submit: "提交咨询",
    loading: "发送中...",
    success: "已收到您的咨询，我们的团队会尽快与您联系。",
    error: "发送失败，请重试。",
    interested: "感兴趣的行程",
    placeholders: {
      name: "您的姓名",
      email: "name@example.com",
      destination: "例如：戈壁、日本、广交会",
      budget: "例如：3,000,000 MNT",
      note: "出行目的、酒店档次、是否携带儿童等",
    },
    types: [
      { value: "custom", label: "定制旅行" },
      { value: "business", label: "商务旅行" },
      { value: "expo", label: "展会 / Expo" },
      { value: "general", label: "一般咨询" },
    ],
  },
  ja: {
    eyebrow: "お問い合わせ",
    name: "お名前",
    email: "メールアドレス",
    destination: "行き先",
    month: "出発日",
    travelers: "人数",
    budget: "ご予算",
    type: "旅行の種類",
    note: "その他のご要望",
    submit: "問い合わせを送信",
    loading: "送信中...",
    success: "お問い合わせを受け付けました。担当者よりご連絡いたします。",
    error: "送信できませんでした。もう一度お試しください。",
    interested: "ご興味のあるツアー",
    placeholders: {
      name: "お名前",
      email: "name@example.com",
      destination: "例：ゴビ、日本、広州交易会",
      budget: "例：3,000,000 MNT",
      note: "旅行の目的、ホテルのランク、お子様連れかどうかなど",
    },
    types: [
      { value: "custom", label: "オーダーメイド旅行" },
      { value: "business", label: "ビジネス旅行" },
      { value: "expo", label: "見本市 / Expo" },
      { value: "general", label: "一般的なご相談" },
    ],
  },
  ko: {
    eyebrow: "문의",
    name: "이름",
    email: "이메일",
    destination: "여행지",
    month: "출발일",
    travelers: "인원",
    budget: "예산",
    type: "여행 유형",
    note: "추가 요청",
    submit: "문의 보내기",
    loading: "보내는 중...",
    success: "문의가 접수되었습니다. 담당자가 곧 연락드리겠습니다.",
    error: "전송하지 못했습니다. 다시 시도해 주세요.",
    interested: "관심 있는 여행",
    placeholders: {
      name: "이름을 입력하세요",
      email: "name@example.com",
      destination: "예: 고비, 일본, 캔톤 페어",
      budget: "예: 3,000,000 MNT",
      note: "여행 목적, 호텔 등급, 자녀 동반 여부 등",
    },
    types: [
      { value: "custom", label: "맞춤 여행" },
      { value: "business", label: "비즈니스 여행" },
      { value: "expo", label: "박람회 / Expo" },
      { value: "general", label: "일반 상담" },
    ],
  },
};

const VILLA_PLAN_COPY: Record<CopyLocale, VillaPlanCopy> = {
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
    interested: "Сонирхож буй вилла",
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
    interested: "Villa of interest",
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
  zh: {
    headingLine1: "别墅预订咨询",
    headingLine2: "请留下位置、入住天数和人数。",
    body: "我们的团队会核实可预订的别墅、价格和条件，然后与您联系。",
    eyebrow: "别墅咨询",
    name: "姓名",
    email: "电子邮箱",
    destination: "别墅 / 位置",
    month: "入住日期",
    travelers: "入住人数",
    budget: "预算 / 晚",
    type: "预订类型",
    note: "其他需求",
    submit: "提交别墅咨询",
    loading: "发送中...",
    success: "已收到您的别墅预订咨询，我们的团队会尽快与您联系。",
    error: "发送失败，请重试。",
    idle: "绝无垃圾信息，我们只发送真实的别墅预订方案。",
    interested: "感兴趣的别墅",
    placeholders: {
      name: "您的姓名",
      email: "name@example.com",
      destination: "例如：特日勒吉家庭别墅",
      budget: "例如：650,000 MNT / 晚",
      note: "入住/退房日期、房间数量、是否携带儿童、附加服务等",
    },
    types: [
      { value: "villa", label: "别墅预订" },
      { value: "family-villa", label: "家庭别墅" },
      { value: "group-villa", label: "团体别墅" },
      { value: "villa-advice", label: "别墅咨询" },
    ],
  },
  ja: {
    headingLine1: "ヴィラ予約のご相談",
    headingLine2: "場所、宿泊数、人数をお知らせください。",
    body: "ご利用可能なヴィラ、料金、条件を確認のうえ、担当者よりご連絡いたします。",
    eyebrow: "ヴィラのお問い合わせ",
    name: "お名前",
    email: "メールアドレス",
    destination: "ヴィラ / 場所",
    month: "チェックイン日",
    travelers: "宿泊人数",
    budget: "ご予算 / 泊",
    type: "予約の種類",
    note: "その他のご要望",
    submit: "ヴィラの問い合わせを送信",
    loading: "送信中...",
    success: "ヴィラ予約のお問い合わせを受け付けました。担当者よりご連絡いたします。",
    error: "送信できませんでした。もう一度お試しください。",
    idle: "迷惑メールはお送りしません。実際のヴィラ予約のご提案のみお届けします。",
    interested: "ご興味のあるヴィラ",
    placeholders: {
      name: "お名前",
      email: "name@example.com",
      destination: "例：テレルジのファミリーヴィラ",
      budget: "例：650,000 MNT / 泊",
      note: "チェックイン・チェックアウト日、部屋数、お子様連れかどうか、追加サービスなど",
    },
    types: [
      { value: "villa", label: "ヴィラ予約" },
      { value: "family-villa", label: "ファミリーヴィラ" },
      { value: "group-villa", label: "グループヴィラ" },
      { value: "villa-advice", label: "ヴィラのご相談" },
    ],
  },
  ko: {
    headingLine1: "빌라 예약 문의",
    headingLine2: "위치, 숙박 일수, 인원을 남겨 주세요.",
    body: "예약 가능한 빌라와 가격, 조건을 확인한 뒤 연락드리겠습니다.",
    eyebrow: "빌라 문의",
    name: "이름",
    email: "이메일",
    destination: "빌라 / 위치",
    month: "체크인 날짜",
    travelers: "투숙 인원",
    budget: "예산 / 1박",
    type: "예약 유형",
    note: "추가 요청",
    submit: "빌라 문의 보내기",
    loading: "보내는 중...",
    success: "빌라 예약 문의가 접수되었습니다. 담당자가 곧 연락드리겠습니다.",
    error: "전송하지 못했습니다. 다시 시도해 주세요.",
    idle: "스팸은 보내지 않습니다. 실제 빌라 예약 제안만 보내드립니다.",
    interested: "관심 있는 빌라",
    placeholders: {
      name: "이름을 입력하세요",
      email: "name@example.com",
      destination: "예: 테를지 가족 빌라",
      budget: "예: 650,000 MNT / 1박",
      note: "체크인/체크아웃 날짜, 객실 수, 자녀 동반 여부, 추가 서비스 등",
    },
    types: [
      { value: "villa", label: "빌라 예약" },
      { value: "family-villa", label: "가족 빌라" },
      { value: "group-villa", label: "단체 빌라" },
      { value: "villa-advice", label: "빌라 상담" },
    ],
  },
};

// next/image resizes from this master; 2400px / q80 is plenty for a
// background that sits under a dark scrim.
const PLANNING_BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2400&q=80&fit=crop&fm=webp";

const FIELD_CLASS =
  "mt-2 h-12 w-full border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground";

// The villa form offers four booking flavours, but the API and the database
// both store one coarse `villa` type. Keep the flavour as a human-readable line
// in the message so the sales team still sees which one was picked.
const VILLA_REQUEST_KINDS = new Set([
  "villa",
  "family-villa",
  "group-villa",
  "villa-advice",
]);

function toApiInquiryType(value: string) {
  return VILLA_REQUEST_KINDS.has(value) ? "villa" : value;
}

function getInquiryTypeLabel(
  value: string,
  types: ReadonlyArray<{ value: string; label: string }>
) {
  return types.find((type) => type.value === value)?.label ?? value;
}

/**
 * The planning form is seeded from the URL (`?mode=villa&trip=…&title=…`).
 *
 * Reading `window.location` inside a useState initializer rendered one thing on
 * the server and another in the browser, which is a hydration error, and the
 * effect that re-synced it afterwards caused a second render pass. useSearchParams
 * gives the same values during SSR and on the client, so the whole thing is
 * derived at render time instead.
 */
function getPlanningRequest(params: ReadonlyURLSearchParams) {
  const tripSlug = params.get("trip")?.trim() ?? "";
  const tripTitle = params.get("title")?.trim() ?? "";
  const isVilla = params.get("mode")?.trim() === "villa" || tripSlug.startsWith("villa-");

  return {
    mode: isVilla ? ("villa" as const) : ("trip" as const),
    destination: tripTitle || tripSlug,
  };
}

/**
 * Background, heading and body shared by the live form and its Suspense
 * fallback, so the statically rendered page shows the real heading and keeps
 * its height while the form hydrates.
 */
function PlanningSectionShell({
  headingLine1,
  headingLine2,
  body,
  children,
}: {
  headingLine1: string;
  headingLine2: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="contact"
        className="relative isolate overflow-hidden bg-primary px-5 pb-24 pt-32 text-primary-foreground sm:px-8 lg:px-12 lg:pb-32 lg:pt-40"
      >
        <Image
          src={PLANNING_BACKGROUND_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/62 via-black/34 to-black/12"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.20),transparent_32%,transparent_68%,rgba(0,0,0,0.22))]"
        />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Slide only, no fade: the H1 is server-rendered and must be
              readable before JavaScript loads. */}
          <motion.h1
            initial={{ y: 18 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7 }}
            className="break-words font-display text-3xl text-balance sm:text-4xl lg:text-5xl"
          >
            {headingLine1}
            <br />
            <span className="italic text-accent">{headingLine2}</span>
          </motion.h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-primary-foreground/75 lg:text-lg">
            {body}
          </p>
          {children}
        </div>
      </section>
    </MotionConfig>
  );
}

function PlanningRequestFallback() {
  const { t } = useLanguage();

  return (
    <PlanningSectionShell
      headingLine1={t.cta.headingLine1}
      headingLine2={t.cta.headingLine2}
      body={t.cta.body}
    >
      {/* Same footprint as the form, so nothing jumps when it arrives. */}
      <div
        aria-hidden="true"
        className="mx-auto mt-10 h-[38rem] max-w-4xl border border-white/35 bg-black/30 sm:h-[30rem]"
      />
    </PlanningSectionShell>
  );
}

/**
 * The planning request form, split out of CtaFooter because it is the only part
 * that reads the URL. Keeping useSearchParams in here means the rest of the
 * footer still renders statically on every page.
 */
function PlanningRequestForm() {
  const authPromptedRef = useRef(false);
  const searchParams = useSearchParams();
  const request = getPlanningRequest(searchParams);
  const planningMode = request.mode;
  // Only fields the visitor actually edited live in state. Everything else is
  // derived from the URL at render time, so there is no syncing effect and no
  // server/client mismatch.
  const [edits, setEdits] = useState<Partial<PlanningForm>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { contentLocale, t } = useLanguage();
  const villaPlanCopy = VILLA_PLAN_COPY[contentLocale] ?? VILLA_PLAN_COPY.mn;
  const planCopy: PlanCopy =
    planningMode === "villa" ? villaPlanCopy : (PLAN_COPY[contentLocale] ?? PLAN_COPY.mn);
  const planHeadingLine1 =
    planningMode === "villa" ? villaPlanCopy.headingLine1 : t.cta.headingLine1;
  const planHeadingLine2 =
    planningMode === "villa" ? villaPlanCopy.headingLine2 : t.cta.headingLine2;
  const planBody = planningMode === "villa" ? villaPlanCopy.body : t.cta.body;
  const idleText = planningMode === "villa" ? villaPlanCopy.idle : t.cta.idle;

  const planningForm: PlanningForm = {
    name: "",
    email: "",
    destination: request.destination,
    preferredDate: "",
    travelers: "2",
    budget: "",
    inquiryType: planningMode === "villa" ? "villa" : "custom",
    note: request.destination ? `${planCopy.interested}: ${request.destination}` : "",
    ...edits,
  };

  function setPlanningForm(update: Partial<PlanningForm>) {
    setEdits((current) => ({ ...current, ...update }));
  }

  // Prefill with the signed-in customer's email/name so they don't retype it.
  // Only fills fields the visitor has left untouched.
  useEffect(() => {
    let active = true;

    function promptSignup() {
      if (!authPromptedRef.current) {
        authPromptedRef.current = true;
        window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
      }
    }

    async function loadCustomer() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "include",
        });
        const payload = response.ok ? await response.json() : null;
        const customer = payload?.data?.customer;

        if (!active) {
          return;
        }

        if (!customer?.email) {
          promptSignup();
          return;
        }

        setEdits((current) => ({
          ...current,
          email: current.email || customer.email,
          name: current.name || customer.name || "",
        }));
      } catch {
        if (active) {
          promptSignup();
        }
      }
    }

    void loadCustomer();
    window.addEventListener("nomadabe:auth-changed", loadCustomer);

    return () => {
      active = false;
      window.removeEventListener("nomadabe:auth-changed", loadCustomer);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    // The message body goes to the Mongolian-speaking sales team, so its
    // field labels stay Mongolian whatever language the visitor reads.
    const message = [
      planningMode === "villa"
        ? VILLA_INQUIRY_MESSAGE[contentLocale]
        : INQUIRY_MESSAGE[contentLocale],
      `${planningMode === "villa" ? "Вилла / байршил" : "Чиглэл"}: ${
        planningForm.destination || "Тодорхойгүй"
      }`,
      `Хүсэлтийн төрөл: ${getInquiryTypeLabel(planningForm.inquiryType, planCopy.types)}`,
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
          inquiryType: toApiInquiryType(planningForm.inquiryType),
          travelers: Number(planningForm.travelers),
          preferredDate: planningForm.preferredDate,
          message,
        }),
      });

      if (response.ok) {
        setEdits({
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
    <PlanningSectionShell
      headingLine1={planHeadingLine1}
      headingLine2={planHeadingLine2}
      body={planBody}
    >
      <form
        className="mx-auto mt-10 grid max-w-4xl gap-4 border border-white/35 bg-black/30 p-4 text-left shadow-floating backdrop-blur-[2px] sm:grid-cols-2 lg:p-6"
        onSubmit={handleSubmit}
      >
        <p className="nav-text text-xs uppercase text-accent sm:col-span-2">
          {planCopy.eyebrow}
        </p>
        <PlanInput
          label={planCopy.name}
          name="name"
          autoComplete="name"
          value={planningForm.name}
          placeholder={planCopy.placeholders.name}
          required
          onChange={(value) => setPlanningForm({ name: value })}
        />
        <PlanInput
          label={planCopy.email}
          name="email"
          type="email"
          autoComplete="email"
          value={planningForm.email}
          placeholder={planCopy.placeholders.email}
          required
          onChange={(value) => setPlanningForm({ email: value })}
        />
        <PlanInput
          label={planCopy.destination}
          name="destination"
          value={planningForm.destination}
          placeholder={planCopy.placeholders.destination}
          required
          onChange={(value) => setPlanningForm({ destination: value })}
        />
        <PlanInput
          label={planCopy.month}
          name="preferredDate"
          type="date"
          value={planningForm.preferredDate}
          onChange={(value) => setPlanningForm({ preferredDate: value })}
        />
        <PlanInput
          label={planCopy.travelers}
          name="travelers"
          type="number"
          min="1"
          inputMode="numeric"
          value={planningForm.travelers}
          required
          onChange={(value) => setPlanningForm({ travelers: value })}
        />
        <PlanInput
          label={planCopy.budget}
          name="budget"
          value={planningForm.budget}
          placeholder={planCopy.placeholders.budget}
          onChange={(value) => setPlanningForm({ budget: value })}
        />
        <label className="block">
          <span className="text-xs uppercase text-white/70">{planCopy.type}</span>
          <select
            name="inquiryType"
            value={planningForm.inquiryType}
            onChange={(event) => setPlanningForm({ inquiryType: event.target.value })}
            className={FIELD_CLASS}
          >
            {planCopy.types.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs uppercase text-white/70">{planCopy.note}</span>
          <textarea
            name="note"
            value={planningForm.note}
            onChange={(event) => setPlanningForm({ note: event.target.value })}
            placeholder={planCopy.placeholders.note}
            rows={4}
            className={`${FIELD_CLASS} h-auto py-3`}
          />
        </label>
        <Button
          type="submit"
          size="lg"
          disabled={status === "loading"}
          className="disabled:cursor-wait sm:col-span-2"
        >
          {status === "loading" ? planCopy.loading : planCopy.submit}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </form>
      <p role="status" aria-live="polite" className="mt-4 text-xs text-primary-foreground/70">
        {status === "success"
          ? planCopy.success
          : status === "error"
            ? planCopy.error
            : idleText}
      </p>
    </PlanningSectionShell>
  );
}

export function PlanningRequestSection() {
  return (
    <Suspense fallback={<PlanningRequestFallback />}>
      <PlanningRequestForm />
    </Suspense>
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
      <span className="text-xs uppercase text-white/70">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={FIELD_CLASS}
        {...props}
      />
    </label>
  );
}
