"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Mountain,
  Star,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  getAdventureDetailInfo,
  getAdventureGalleryImages,
  getAdventureText,
  type Adventure,
} from "@/lib/adventures";
import { useLanguage } from "./language-provider";

type Props = {
  adventure: Adventure | null;
  onClose: () => void;
};

type AuthCustomer = {
  email: string;
  name?: string;
};

const DETAIL_COPY = {
  mn: {
    morePhotos: "Нэмэлт зургууд",
    highlights: "Аяллын онцлогууд",
    included: "Үнэд багтсан",
    excluded: "Үнэд багтаагүй",
    itinerary: "Аяллын хөтөлбөр",
  },
  en: {
    morePhotos: "More photos",
    highlights: "Trip highlights",
    included: "Included",
    excluded: "Not included",
    itinerary: "Itinerary",
  },
  zh: {
    morePhotos: "更多照片",
    highlights: "行程亮点",
    included: "费用包含",
    excluded: "费用不含",
    itinerary: "行程安排",
  },
  ja: {
    morePhotos: "追加写真",
    highlights: "ツアーの見どころ",
    included: "料金に含まれるもの",
    excluded: "料金に含まれないもの",
    itinerary: "旅程",
  },
  ko: {
    morePhotos: "추가 사진",
    highlights: "여행 하이라이트",
    included: "포함 사항",
    excluded: "불포함 사항",
    itinerary: "여행 일정",
  },
} as const;

const BOOKING_COPY = {
  mn: {
    title: "Холбогдох мэдээлэл",
    body: "Манай баг энэ мэдээллээр аяллын боломжит хугацаа, хүний тоо, дараагийн алхмыг баталгаажуулна.",
    name: "Нэр",
    email: "И-мэйл",
    travelers: "Явах хүний тоо",
    preferredDate: "Явах огноо",
    message: "Нэмэлт хүсэлт",
    messagePlaceholder: "Жишээ: хүүхэдтэй эсэх, буудлын түвшин, хоол, нислэгийн хэрэгцээ гэх мэт",
    defaultMessage: "Энэ аяллын талаар дэлгэрэнгүй мэдээлэл авмаар байна.",
    submit: "Хүсэлт илгээх",
    sending: "Илгээж байна...",
    success: "Хүсэлт илгээгдлээ. Манай баг удахгүй холбогдоно.",
    error: "Хүсэлт илгээхэд алдаа гарлаа. Мэдээллээ шалгаад дахин оролдоно уу.",
  },
  en: {
    title: "Contact details",
    body: "Our team will use this to confirm timing, group size, and next steps.",
    name: "Name",
    email: "Email",
    travelers: "Travelers",
    preferredDate: "Travel date",
    message: "Extra request",
    messagePlaceholder: "Example: children, hotel level, meals, flight needs, or other notes",
    defaultMessage: "I would like to receive more details about this trip.",
    submit: "Send request",
    sending: "Sending...",
    success: "Request sent. Our team will contact you soon.",
    error: "Could not send the request. Please check the fields and try again.",
  },
  zh: {
    title: "联系信息",
    body: "我们将根据这些信息确认出行时间、人数和下一步安排。",
    name: "姓名",
    email: "邮箱",
    travelers: "人数",
    preferredDate: "出行日期",
    message: "其他需求",
    messagePlaceholder: "例如：是否有儿童、酒店标准、餐饮、航班需求等",
    defaultMessage: "我想了解更多关于这个行程的信息。",
    submit: "发送请求",
    sending: "发送中...",
    success: "请求已发送。我们的团队会尽快联系您。",
    error: "请求发送失败。请检查信息后重试。",
  },
  ja: {
    title: "連絡先情報",
    body: "日程、人数、次のステップを確認するために使用します。",
    name: "名前",
    email: "メール",
    travelers: "人数",
    preferredDate: "出発日",
    message: "追加リクエスト",
    messagePlaceholder: "例：お子様の有無、ホテル希望、食事、航空券の希望など",
    defaultMessage: "この旅行について詳しい情報を知りたいです。",
    submit: "リクエスト送信",
    sending: "送信中...",
    success: "リクエストを送信しました。担当者よりご連絡します。",
    error: "送信できませんでした。内容を確認して再度お試しください。",
  },
  ko: {
    title: "연락 정보",
    body: "일정, 인원, 다음 단계를 확인하기 위해 사용합니다.",
    name: "이름",
    email: "이메일",
    travelers: "여행 인원",
    preferredDate: "출발일",
    message: "추가 요청",
    messagePlaceholder: "예: 어린이 동반, 호텔 수준, 식사, 항공권 요청 등",
    defaultMessage: "이 여행에 대해 자세한 정보를 받고 싶습니다.",
    submit: "요청 보내기",
    sending: "보내는 중...",
    success: "요청이 전송되었습니다. 담당자가 곧 연락드립니다.",
    error: "요청을 보낼 수 없습니다. 정보를 확인한 뒤 다시 시도해 주세요.",
  },
} as const;

export function AdventureModal({ adventure, onClose }: Props) {
  const [heroImageState, setHeroImageState] = useState<{
    adventureId: Adventure["id"] | null;
    index: number;
  }>({ adventureId: null, index: 0 });
  const [customer, setCustomer] = useState<AuthCustomer | null>(null);
  const [bookingAdventureId, setBookingAdventureId] = useState<
    Adventure["id"] | null
  >(null);
  const [bookingStatus, setBookingStatus] = useState<{
    adventureId: Adventure["id"];
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const pendingBookingAdventureIdRef = useRef<Adventure["id"] | null>(null);
  const { contentLocale, t } = useLanguage();
  const copy = DETAIL_COPY[contentLocale];
  const bookingCopy = BOOKING_COPY[contentLocale];
  const text = adventure ? getAdventureText(adventure, contentLocale) : null;
  const details = adventure
    ? getAdventureDetailInfo(adventure, contentLocale)
    : null;
  const adventureId = adventure?.id ?? null;
  const heroImages = useMemo(() => {
    if (!adventure) {
      return [];
    }

    return Array.from(
      new Set(
        [adventure.image, ...getAdventureGalleryImages(adventure)].filter(
          (image) => image.length > 0
        )
      )
    );
  }, [adventure]);
  const heroImageIndex =
    adventureId !== null && heroImageState.adventureId === adventureId
      ? heroImageState.index
      : 0;
  const showBookingForm =
    adventureId !== null &&
    bookingAdventureId === adventureId &&
    customer !== null;
  const activeBookingStatus =
    adventureId !== null && bookingStatus?.adventureId === adventureId
      ? bookingStatus
      : null;

  useEffect(() => {
    let cancelled = false;

    async function loadCustomer() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const result = (await response.json()) as {
          ok?: boolean;
          data?: { customer?: AuthCustomer | null };
        };
        const loadedCustomer =
          response.ok && result.ok ? (result.data?.customer ?? null) : null;

        if (cancelled) {
          return;
        }

        setCustomer(loadedCustomer);

        if (loadedCustomer && pendingBookingAdventureIdRef.current !== null) {
          setBookingAdventureId(pendingBookingAdventureIdRef.current);
          pendingBookingAdventureIdRef.current = null;
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

  useEffect(() => {
    if (adventureId === null || heroImages.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setHeroImageState((current) => {
        const currentIndex =
          current.adventureId === adventureId ? current.index : 0;

        return {
          adventureId,
          index: (currentIndex + 1) % heroImages.length,
        };
      });
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [adventureId, heroImages.length]);

  useEffect(() => {
    if (!adventure) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [adventure, onClose]);

  function handleRegisterClick() {
    if (adventureId === null) {
      return;
    }

    setBookingStatus(null);

    if (!customer) {
      pendingBookingAdventureIdRef.current = adventureId;
      window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
      return;
    }

    setBookingAdventureId(adventureId);
  }

  async function handleBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adventure || !customer) {
      if (adventureId !== null) {
        pendingBookingAdventureIdRef.current = adventureId;
      }
      window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
      return;
    }

    const formData = new FormData(event.currentTarget);
    const travelers = Number(formData.get("travelers") ?? 1);
    const payload = {
      tripSlug: adventure.slug,
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim() || customer.email,
      travelers: Number.isFinite(travelers) ? travelers : 1,
      preferredDate: String(formData.get("preferredDate") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    setBookingSubmitting(true);
    setBookingStatus(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: { message?: string };
      };

      if (!response.ok || !result.ok) {
        if (response.status === 401) {
          pendingBookingAdventureIdRef.current = adventure.id;
          window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
          return;
        }

        throw new Error(result.error?.message ?? bookingCopy.error);
      }

      setBookingStatus({
        adventureId: adventure.id,
        type: "success",
        text: bookingCopy.success,
      });
    } catch (error) {
      setBookingStatus({
        adventureId: adventure.id,
        type: "error",
        text: error instanceof Error ? error.message : bookingCopy.error,
      });
    } finally {
      setBookingSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {adventure && text && details && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm lg:p-8"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="relative my-auto w-full max-w-6xl overflow-hidden rounded-lg bg-background shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label={t.modal.close}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-md bg-background/90 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[16/9] w-full overflow-hidden lg:aspect-[21/9]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-700"
                style={{
                  backgroundImage: `url(${heroImages[heroImageIndex] ?? adventure.image})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-10">
                <h3 className="max-w-3xl text-balance font-display text-2xl leading-tight lg:text-4xl">
                  {text.title}
                </h3>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-current" />
                    <strong>{adventure.rating}</strong>
                    <span className="opacity-75">
                      ({adventure.reviews} {t.modal.reviews})
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 opacity-90">
                    <MapPin className="h-4 w-4" />
                    {text.location}, {text.country}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 lg:grid-cols-[1.5fr_1fr] lg:gap-12 lg:p-10">
              <div>
                <h4 className="mb-3 font-display text-xl">{t.modal.about}</h4>
                <p className="leading-relaxed text-muted-foreground">
                  {text.summary}
                </p>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: Mountain,
                      label: t.modal.duration,
                      value: `${adventure.days} ${t.featured.days}`,
                    },
                    { icon: Users, label: t.modal.group, value: text.groupSize },
                    {
                      icon: Calendar,
                      label: t.modal.departure,
                      value: text.nextDeparture ?? t.modal.flexible,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      <stat.icon className="mb-2 h-5 w-5 text-accent" />
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="mb-4 mt-9 font-display text-2xl">
                  {copy.highlights}
                </h4>
                <ul className="grid gap-x-6 gap-y-3 text-sm text-foreground/80 sm:grid-cols-2 lg:grid-cols-3">
                  {details.highlights.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Star className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-9 grid gap-7 lg:grid-cols-2">
                  <div>
                    <h4 className="mb-4 font-display text-2xl">
                      {copy.included}
                    </h4>
                    <ul className="space-y-3 text-sm text-foreground/80">
                      {details.included.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-4 font-display text-2xl">
                      {copy.excluded}
                    </h4>
                    <ul className="space-y-3 text-sm text-foreground/80">
                      {details.excluded.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <h4 className="mb-4 mt-10 font-display text-2xl">
                  {copy.itinerary}
                </h4>
                <div className="space-y-3">
                  {details.itinerary.map((step) => (
                    <details
                      key={`${step.day}-${step.title}`}
                      className="group rounded-lg border border-border bg-card"
                    >
                      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                          {step.day}
                        </span>
                        <span className="min-w-0 flex-1 text-sm font-bold text-foreground lg:text-base">
                          {step.title}
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="px-5 pb-5 pl-[4.75rem] text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

              <aside className="h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-6">
                {adventure.price > 0 ? (
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t.modal.price}
                      </div>
                      <div className="font-display text-4xl">
                        {adventure.price.toLocaleString()}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {adventure.currency}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div
                  className={
                    adventure.price > 0 ? "mt-6 space-y-3" : "space-y-3"
                  }
                >
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    className="block w-full rounded-lg bg-accent px-6 py-3.5 text-center font-semibold text-accent-foreground transition-colors hover:bg-secondary"
                  >
                    {t.modal.register}
                  </button>
                </div>

                {showBookingForm ? (
                  <form
                    onSubmit={handleBookingSubmit}
                    className="mt-5 space-y-3 rounded-lg border border-border bg-background/70 p-4"
                  >
                    <div>
                      <h5 className="font-display text-lg">
                        {bookingCopy.title}
                      </h5>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {bookingCopy.body}
                      </p>
                    </div>

                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {bookingCopy.name}
                      <input
                        name="name"
                        required
                        minLength={2}
                        defaultValue={customer.name ?? ""}
                        className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-ring"
                      />
                    </label>

                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {bookingCopy.email}
                      <input
                        name="email"
                        type="email"
                        required
                        defaultValue={customer.email}
                        className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-ring"
                      />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {bookingCopy.travelers}
                        <input
                          name="travelers"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                          defaultValue={2}
                          className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-ring"
                        />
                      </label>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {bookingCopy.preferredDate}
                        <input
                          name="preferredDate"
                          type="date"
                          className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-ring"
                        />
                      </label>
                    </div>

                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {bookingCopy.message}
                      <textarea
                        name="message"
                        required
                        minLength={10}
                        rows={4}
                        placeholder={bookingCopy.messagePlaceholder}
                        defaultValue={bookingCopy.defaultMessage}
                        className="mt-1 min-h-28 w-full resize-y rounded-md border border-border bg-background px-3 py-3 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
                      />
                    </label>

                    {activeBookingStatus ? (
                      <p
                        className={
                          activeBookingStatus.type === "success"
                            ? "text-sm font-semibold text-green-700"
                            : "text-sm font-semibold text-red-600"
                        }
                      >
                        {activeBookingStatus.text}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={bookingSubmitting}
                      className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {bookingSubmitting
                        ? bookingCopy.sending
                        : bookingCopy.submit}
                    </button>
                  </form>
                ) : (
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    {t.modal.note}
                  </p>
                )}
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
