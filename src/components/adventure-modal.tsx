"use client";

import {
  type CSSProperties,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Mail,
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
import { getHighResolutionImageUrl } from "@/lib/image-quality";
import { useLanguage } from "./language-provider";

type Props = {
  adventure: Adventure | null;
  onClose: () => void;
  onRegisterClick?: (adventure: Adventure) => boolean | void;
};

type AuthCustomer = {
  id?: string;
  name?: string;
  email: string;
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

type BookingResponse = {
  ok?: boolean;
  data?: {
    booking?: {
      id?: string;
      status?: string;
    };
  };
  error?: { message?: string };
};

const PRICE_FALLBACK_COPY = {
  mn: {
    value: "Үнийн мэдээлэл",
    detail: "Аяллын багц, хүний тоо, хугацаанаас хамаарч баталгаажна.",
  },
  en: {
    value: "Price details",
    detail: "Final price depends on package, group size, and travel dates.",
  },
  zh: {
    value: "价格信息",
    detail: "最终价格取决于套餐、人数和出行日期。",
  },
  ja: {
    value: "料金情報",
    detail: "最終料金は内容、人数、日程によって決まります。",
  },
  ko: {
    value: "가격 정보",
    detail: "최종 가격은 구성, 인원, 여행 날짜에 따라 달라집니다.",
  },
} as const;

const HERO_AUTOPLAY_MS = 3000;

type ModalHeroSlide = {
  image: string;
};

async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    return {
      ok: false,
      error: { message: text.slice(0, 160) || response.statusText },
    } as T;
  }
}

export function AdventureModal({ adventure, onClose, onRegisterClick }: Props) {
  const [heroImageState, setHeroImageState] = useState<{
    adventureId: Adventure["id"] | null;
    index: number;
  }>({ adventureId: null, index: 0 });
  const [heroProgressKey, setHeroProgressKey] = useState(0);
  const [customer, setCustomer] = useState<AuthCustomer | null>(null);
  const [bookingMode, setBookingMode] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const { contentLocale, t } = useLanguage();
  const copy = DETAIL_COPY[contentLocale];
  const bookingCopy = BOOKING_COPY[contentLocale];
  const priceFallback = PRICE_FALLBACK_COPY[contentLocale];
  const text = adventure ? getAdventureText(adventure, contentLocale) : null;
  const details = adventure
    ? getAdventureDetailInfo(adventure, contentLocale)
    : null;
  const adventureId = adventure?.id ?? null;
  const heroSlides = useMemo<ModalHeroSlide[]>(() => {
    if (!adventure || !text || !details) {
      return [];
    }

    const images = Array.from(
      new Set(
        [adventure.image, ...getAdventureGalleryImages(adventure)].filter(
          (image) => image.length > 0
        )
      )
    );
    const fallbackImages = images.length > 0 ? images : [adventure.image];

    return fallbackImages.map((image) => ({ image }));
  }, [adventure, details, text]);
  const heroImageIndex =
    adventureId !== null && heroImageState.adventureId === adventureId
      ? heroImageState.index
      : 0;

  const handleModalClose = useCallback(() => {
    setBookingMode(false);
    setBookingStatus(null);
    setBookingSubmitting(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomer() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const result = await readJsonResponse<{
          ok?: boolean;
          data?: { customer?: AuthCustomer | null };
        }>(response);
        const loadedCustomer =
          response.ok && result.ok ? (result.data?.customer ?? null) : null;

        if (!cancelled) {
          setCustomer(loadedCustomer);
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

  const advanceHeroImage = useCallback(() => {
    if (adventureId === null || heroSlides.length <= 1) {
      return;
    }

    setHeroImageState((current) => {
      const currentIndex = current.adventureId === adventureId ? current.index : 0;

      return {
        adventureId,
        index: (currentIndex + 1) % heroSlides.length,
      };
    });
    setHeroProgressKey((current) => current + 1);
  }, [adventureId, heroSlides.length]);

  useEffect(() => {
    if (!adventure) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleModalClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [adventure, handleModalClose]);

  function handleHeroSlideSelect(index: number) {
    if (adventureId === null) {
      return;
    }

    setHeroImageState({ adventureId, index });
    setHeroProgressKey((current) => current + 1);
  }

  function handleRegisterClick() {
    if (!adventure) {
      return;
    }

    if (onRegisterClick?.(adventure)) {
      return;
    }

    setBookingMode(true);
    setBookingStatus(
      customer ? null : { type: "info", message: bookingCopy.body }
    );

    if (!customer) {
      window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
    }
  }

  function handleBookingBack() {
    setBookingMode(false);
    setBookingStatus(null);
  }

  async function handleBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adventure || !text) {
      return;
    }

    if (!customer) {
      setBookingStatus({ type: "info", message: bookingCopy.body });
      window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
      return;
    }

    const formData = new FormData(event.currentTarget);
    setBookingSubmitting(true);
    setBookingStatus(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripSlug: adventure.slug,
          tripTitle: text.title,
          name: String(formData.get("name") ?? "").trim(),
          email: String(formData.get("email") ?? "").trim() || customer.email,
          travelers: Number(formData.get("travelers") ?? 1) || 1,
          preferredDate: String(formData.get("preferredDate") ?? "").trim(),
          message: String(formData.get("message") ?? "").trim(),
        }),
      });
      const result = await readJsonResponse<BookingResponse>(response);

      if (response.status === 401) {
        setBookingStatus({ type: "info", message: bookingCopy.body });
        window.dispatchEvent(new Event("nomadabe:open-signup-prompt"));
        return;
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message ?? bookingCopy.error);
      }

      setBookingStatus({ type: "success", message: bookingCopy.success });
    } catch (error) {
      setBookingStatus({
        type: "error",
        message: error instanceof Error ? error.message : bookingCopy.error,
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
          onClick={handleModalClose}
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
              onClick={handleModalClose}
              aria-label={t.modal.close}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-md bg-background/90 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="relative min-h-[420px] w-full overflow-hidden bg-[#050505] sm:min-h-[500px] lg:min-h-[560px]"
            >
              <div className="absolute inset-0 overflow-hidden">
                {heroSlides.length > 0 ? (
                  heroSlides.map((slide, index) => {
                    const selected = index === heroImageIndex;

                    return (
                      <div
                        key={`${slide.image}-${index}`}
                        aria-hidden="true"
                        className={[
                          "absolute inset-0 bg-cover bg-center transition-opacity duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform]",
                          selected ? "opacity-100" : "opacity-0",
                        ].join(" ")}
                        style={{
                          animation: selected
                            ? "premiumHeroDrift 7200ms ease-out forwards"
                            : undefined,
                          backgroundImage: `url(${getHighResolutionImageUrl(slide.image)})`,
                        }}
                      />
                    );
                  })
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${getHighResolutionImageUrl(adventure.image)})` }}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/58 via-black/18 to-black/24" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/18 to-black/10" />
              <div
                className={[
                  "absolute left-6 right-6 z-[2] text-white sm:left-8 sm:right-8 lg:left-10 lg:right-10",
                  heroSlides.length > 1 ? "bottom-24 sm:bottom-28 lg:bottom-32" : "bottom-8 lg:bottom-10",
                ].join(" ")}
              >
                <h3 className="max-w-4xl text-balance font-display text-[clamp(1.5rem,3.4vw,3.25rem)] leading-[1.02] text-white [text-shadow:0_16px_46px_rgba(0,0,0,0.64)]">
                  {text.title}
                </h3>
              </div>
              {heroSlides.length > 1 ? (
                <div className="absolute inset-x-8 bottom-6 z-[3] sm:inset-x-12 lg:inset-x-16 lg:bottom-9">
                  <div className="flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {heroSlides.map((slide, index) => {
                      const selected = index === heroImageIndex;

                      return (
                        <button
                          key={`${slide.image}-${index}`}
                          type="button"
                          aria-label={`${copy.morePhotos} ${index + 1}`}
                          aria-current={selected ? "true" : undefined}
                          onClick={() => handleHeroSlideSelect(index)}
                          className="group flex min-w-[4.5rem] flex-1 items-center py-2 sm:min-w-[6rem] lg:min-w-0"
                        >
                          <span className="block h-1 w-full overflow-hidden rounded-full bg-white/28">
                            {selected ? (
                              <span
                                key={`${adventureId}-${heroImageIndex}-${heroProgressKey}`}
                                className="block h-full origin-left rounded-full bg-gradient-to-r from-cyan-200 via-white to-cyan-100"
                                onAnimationEnd={advanceHeroImage}
                                style={
                                  {
                                    animation: `premiumHeroProgress ${HERO_AUTOPLAY_MS}ms linear forwards`,
                                  } as CSSProperties
                                }
                              />
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div
              className={
                bookingMode
                  ? "p-6 lg:p-10"
                  : "grid gap-8 p-6 lg:grid-cols-2 lg:gap-10 lg:p-10"
              }
            >
              <div className={bookingMode ? "hidden" : ""}>
                <h4 className="mb-3 font-display text-xl">{t.modal.about}</h4>
                <p className="leading-relaxed text-[#11100b]">
                  {text.summary}
                </p>

                <div className="mt-6 rounded-lg border border-border bg-card p-5">
                  <div className="text-xs uppercase tracking-wider text-[#11100b]">
                    {t.modal.price}
                  </div>
                  {adventure.price > 0 ? (
                    <>
                      <div className="mt-2 font-display text-4xl">
                        {adventure.price.toLocaleString()}
                      </div>
                      <div className="mt-1 text-xs text-[#11100b]">
                        {adventure.currency}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mt-2 font-display text-3xl">
                        {priceFallback.value}
                      </div>
                      <div className="mt-1 text-xs leading-relaxed text-[#11100b]">
                        {priceFallback.detail}
                      </div>
                    </>
                  )}
                </div>

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
                      <div className="text-[11px] uppercase tracking-wider text-[#11100b]">
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
                <ul className="grid gap-x-6 gap-y-3 text-sm text-[#11100b] sm:grid-cols-2 lg:grid-cols-3">
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
                    <ul className="space-y-3 text-sm text-[#11100b]">
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
                    <ul className="space-y-3 text-sm text-[#11100b]">
                      {details.excluded.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <aside
                className={
                  bookingMode
                    ? "mx-auto w-full rounded-lg border border-border bg-card p-6 lg:p-8"
                    : "h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-6"
                }
              >
                {bookingMode ? (
                  <form
                    onSubmit={handleBookingSubmit}
                    className="mx-auto flex w-full max-w-5xl flex-col"
                  >
                    <button
                      type="button"
                      onClick={handleBookingBack}
                      className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#11100b] transition-colors hover:text-[#11100b]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {contentLocale === "mn" ? "Буцах" : "Back"}
                    </button>

                    <p className="trip-meta-text text-xs uppercase tracking-[0.18em] text-accent">
                      {contentLocale === "mn" ? "Баталгаажуулалт" : bookingCopy.title}
                    </p>
                    <h5 className="mt-2 font-display text-2xl leading-tight">
                      {contentLocale === "mn"
                        ? "Доорх мэдээллээр аяллын бүртгэлээ баталгаажуулна."
                        : bookingCopy.body}
                    </h5>

                    <div className="mt-8 grid gap-5 lg:grid-cols-2">
                      <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#11100b]">
                        {bookingCopy.name}
                        <input
                          required
                          name="name"
                          minLength={2}
                          defaultValue={customer?.name ?? ""}
                          className="mt-2 h-12 w-full rounded-md border border-border bg-background px-4 text-base font-medium text-foreground outline-none transition-colors focus:border-foreground"
                        />
                      </label>

                      <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#11100b]">
                        {bookingCopy.email}
                        <span className="relative mt-2 block">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
                          <input
                            required
                            name="email"
                            type="email"
                            defaultValue={customer?.email ?? ""}
                            className="h-12 w-full rounded-md border border-border bg-background px-11 text-base font-medium text-foreground outline-none transition-colors focus:border-foreground"
                          />
                        </span>
                      </label>

                      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#11100b]">
                          {bookingCopy.travelers}
                          <input
                            required
                            name="travelers"
                            inputMode="numeric"
                            min={1}
                            type="number"
                            defaultValue={2}
                            className="mt-2 h-12 w-full rounded-md border border-border bg-background px-4 text-base font-medium text-foreground outline-none transition-colors focus:border-foreground"
                          />
                        </label>
                        <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#11100b]">
                          {bookingCopy.preferredDate}
                          <input
                            name="preferredDate"
                            type="date"
                            className="mt-2 h-12 w-full rounded-md border border-border bg-background px-4 text-base font-medium text-foreground outline-none transition-colors focus:border-foreground"
                          />
                        </label>
                      </div>

                      <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#11100b] lg:col-span-2">
                        {bookingCopy.message}
                        <textarea
                          required
                          name="message"
                          minLength={10}
                          rows={4}
                          defaultValue={bookingCopy.defaultMessage}
                          placeholder={bookingCopy.messagePlaceholder}
                          className="mt-2 w-full resize-none rounded-md border border-border bg-background px-4 py-3 text-base font-medium leading-7 text-foreground outline-none transition-colors focus:border-foreground"
                        />
                      </label>
                    </div>

                    {bookingStatus ? (
                      <p
                        className={[
                          "mt-4 rounded-md px-4 py-3 text-sm leading-6",
                          bookingStatus.type === "success"
                            ? "bg-green-50 text-green-700"
                            : bookingStatus.type === "error"
                              ? "bg-red-50 text-red-700"
                              : "bg-accent/12 text-foreground/75",
                        ].join(" ")}
                      >
                        {bookingStatus.message}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={bookingSubmitting}
                      className="mt-5 block w-full rounded-lg bg-accent px-6 py-3.5 text-center font-semibold text-accent-foreground transition-colors hover:bg-secondary disabled:cursor-wait disabled:opacity-70 lg:mt-6"
                    >
                      {bookingSubmitting
                        ? bookingCopy.sending
                        : contentLocale === "mn"
                          ? "Баталгаажуулах"
                          : bookingCopy.submit}
                    </button>
                  </form>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleRegisterClick}
                      className="block w-full rounded-lg bg-accent px-6 py-3.5 text-center font-semibold text-accent-foreground transition-colors hover:bg-secondary"
                    >
                      {t.modal.register}
                    </button>

                    <div className="mt-6 rounded-lg border border-border bg-background/70 p-5">
                      <h5 className="font-display text-xl">{copy.itinerary}</h5>
                      <div className="mt-4 space-y-3">
                        {details.itinerary.map((step) => (
                          <details
                            key={`${step.day}-${step.title}`}
                            className="group rounded-lg border border-border bg-card"
                          >
                            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                                {step.day}
                              </span>
                              <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-[#11100b]">
                                {step.title}
                              </span>
                              <ChevronDown className="h-4 w-4 shrink-0 text-[#11100b] transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-4 pb-4 pl-[3.75rem] text-sm leading-relaxed text-[#11100b]">
                              {step.body ? (
                                <p className="whitespace-pre-line">{step.body}</p>
                              ) : null}
                              {step.items && step.items.length > 0 ? (
                                <ul className="mt-1 space-y-2">
                                  {step.items.map((item, index) => (
                                    <li key={index} className="flex gap-3">
                                      {item.time ? (
                                        <span className="shrink-0 font-semibold tabular-nums text-accent-foreground">
                                          {item.time}
                                        </span>
                                      ) : null}
                                      <span className="min-w-0">{item.text}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
