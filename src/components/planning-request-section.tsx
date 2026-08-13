"use client";

import type { FormEvent, InputHTMLAttributes } from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
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
  const [planningAuthenticated, setPlanningAuthenticated] = useState<boolean | null>(null);
  const { contentLocale, t } = useLanguage();
  const villaPlanCopy = contentLocale === "mn" ? VILLA_PLAN_COPY.mn : VILLA_PLAN_COPY.en;
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

  const planningForm: PlanningForm = {
    name: "",
    email: "",
    destination: request.destination,
    preferredDate: "",
    travelers: "2",
    budget: "",
    inquiryType: planningMode === "villa" ? "villa" : "custom",
    note: request.destination
      ? planningMode === "villa"
        ? `Сонирхож буй вилла: ${request.destination}`
        : `Сонирхож буй аялал: ${request.destination}`
      : "",
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
      setPlanningAuthenticated(false);
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

        setPlanningAuthenticated(true);
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

    if (planningAuthenticated !== true) {
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
            onChange={(value) => setPlanningForm({ name: value })}
          />
          <PlanInput
            label={planCopy.email}
            type="email"
            value={planningForm.email}
            placeholder={planCopy.placeholders.email}
            required
            onChange={(value) => setPlanningForm({ email: value })}
          />
          <PlanInput
            label={planCopy.destination}
            value={planningForm.destination}
            placeholder={planCopy.placeholders.destination}
            required
            onChange={(value) =>
              setPlanningForm({ destination: value })
            }
          />
          <PlanInput
            label={planCopy.month}
            type="date"
            value={planningForm.preferredDate}
            onChange={(value) =>
              setPlanningForm({ preferredDate: value })
            }
          />
          <PlanInput
            label={planCopy.travelers}
            type="number"
            min="1"
            value={planningForm.travelers}
            required
            onChange={(value) =>
              setPlanningForm({ travelers: value })
            }
          />
          <PlanInput
            label={planCopy.budget}
            value={planningForm.budget}
            placeholder={planCopy.placeholders.budget}
            onChange={(value) => setPlanningForm({ budget: value })}
          />
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">
              {planCopy.type}
            </span>
            <select
              value={planningForm.inquiryType}
              onChange={(event) =>
                setPlanningForm({ inquiryType: event.target.value })
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
                setPlanningForm({ note: event.target.value })
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
  );
}

export function PlanningRequestSection() {
  return (
    <Suspense fallback={null}>
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
