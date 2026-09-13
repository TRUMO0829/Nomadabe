"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { ImagePlus, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import type { SiteReview } from "@/lib/site-settings";

type TestimonialsProps = {
  reviews?: SiteReview[];
};

const MAX_VISIBLE_REVIEWS = 6;

const REVIEW_COPY = {
  mn: {
    kicker: "Бодит сэтгэгдэл",
    empty:
      "Одоогоор нийтлэгдсэн сэтгэгдэл алга. Манайхаар аялсан бол анхны сэтгэгдлийг та үлдээгээрэй.",
    write: "Сэтгэгдэл үлдээх",
    name: "Нэр",
    trip: "Аяллын нэр",
    rating: "Үнэлгээ",
    star: "од",
    message: "Сэтгэгдэл",
    image: "Зураг нэмэх",
    location: "Хот / улс",
    saving: "Хадгалж байна",
    saved: "Баярлалаа. Сэтгэгдлийг чинь хянаад удахгүй нийтэлнэ.",
    error: "Сэтгэгдэл хадгалж чадсангүй.",
  },
  en: {
    kicker: "Real reviews",
    empty: "No reviews published yet. If you have travelled with us, be the first to leave one.",
    write: "Write a review",
    name: "Name",
    trip: "Trip name",
    rating: "Rating",
    star: "stars",
    message: "Your review",
    image: "Add a photo",
    location: "City / country",
    saving: "Saving",
    saved: "Thank you. Your review will appear once our team reviews it.",
    error: "Could not save the review.",
  },
  zh: {
    kicker: "真实评价",
    empty: "暂无已发布的评价。如果您曾与我们同行，欢迎留下第一条评价。",
    write: "留下评价",
    name: "姓名",
    trip: "行程名称",
    rating: "评分",
    star: "星",
    message: "您的评价",
    image: "添加照片",
    location: "城市 / 国家",
    saving: "正在保存",
    saved: "谢谢。您的评价将在审核后显示。",
    error: "无法保存评价。",
  },
  ja: {
    kicker: "お客様の声",
    empty: "まだ公開されたレビューはありません。ご旅行された方はぜひ最初のレビューをお寄せください。",
    write: "レビューを書く",
    name: "お名前",
    trip: "ツアー名",
    rating: "評価",
    star: "つ星",
    message: "レビュー",
    image: "写真を追加",
    location: "都市 / 国",
    saving: "保存中",
    saved: "ありがとうございます。確認後に公開されます。",
    error: "レビューを保存できませんでした。",
  },
  ko: {
    kicker: "실제 후기",
    empty: "아직 게시된 후기가 없습니다. 함께 여행하셨다면 첫 후기를 남겨 주세요.",
    write: "후기 작성",
    name: "이름",
    trip: "여행명",
    rating: "평점",
    star: "점",
    message: "후기",
    image: "사진 추가",
    location: "도시 / 국가",
    saving: "저장 중",
    saved: "감사합니다. 확인 후 게시됩니다.",
    error: "후기를 저장할 수 없습니다.",
  },
} as const;

const FIELD_CLASS =
  "mt-1.5 h-12 w-full border border-input bg-white px-4 text-sm text-foreground";
const LABEL_CLASS = "block text-xs uppercase text-muted-foreground";

/**
 * Only reviews real travellers submitted and an admin approved. The section
 * used to pad itself with nine written-in-house quotes under masked Gmail
 * addresses; showing those as customer reviews misleads visitors.
 */
export function Testimonials({ reviews = [] }: TestimonialsProps) {
  const { contentLocale, t } = useLanguage();
  const copy = REVIEW_COPY[contentLocale];
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const visibleReviews = reviews.slice(0, MAX_VISIBLE_REVIEWS);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error?.message || copy.error);
      }

      // Not added to the list: reviews stay hidden until an admin approves them.
      formRef.current?.reset();
      setStatus(copy.saved);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : copy.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function openReviewForm() {
    setIsReviewFormOpen(true);
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ block: "center" });
      nameInputRef.current?.focus();
    }, 80);
  }

  return (
    <section id="journal" className="bg-card py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading tone="light" eyebrow={copy.kicker} title={t.testimonials.eyebrow} />
          <Button type="button" variant="dark" onClick={openReviewForm} className="self-start lg:self-auto">
            {copy.write}
          </Button>
        </div>

        {visibleReviews.length > 0 ? (
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleReviews.map((review) => (
              <li key={review.id} className="flex flex-col border border-border bg-white p-5 shadow-card">
                {review.imageUrl ? (
                  <div className="relative mb-4 aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={review.imageUrl}
                      alt={[review.name, review.trip].filter(Boolean).join(" — ")}
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 92vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <StarRating rating={review.rating} />
                <p className="mt-3 flex-1 text-sm text-foreground/85">{review.message}</p>
                <div className="mt-4 border-t border-border pt-3">
                  <p className="text-sm text-foreground">{review.name}</p>
                  {review.trip || review.location ? (
                    <p className="text-xs text-muted-foreground">
                      {[review.trip, review.location].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 max-w-2xl text-base text-muted-foreground">{copy.empty}</p>
        )}

        {isReviewFormOpen ? (
          <form
            id="write-review"
            ref={formRef}
            onSubmit={submitReview}
            className="mt-10 grid scroll-mt-28 gap-4 border border-border bg-background p-5 shadow-card md:grid-cols-[1fr_1fr_12rem]"
          >
            <label className={LABEL_CLASS}>
              {copy.name}
              <input
                ref={nameInputRef}
                name="name"
                required
                minLength={2}
                autoComplete="name"
                className={FIELD_CLASS}
              />
            </label>
            <label className={LABEL_CLASS}>
              {copy.trip}
              <input name="trip" className={FIELD_CLASS} />
            </label>
            <label className={LABEL_CLASS}>
              {copy.rating}
              <select name="rating" defaultValue="5" className={FIELD_CLASS}>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} {copy.star}
                  </option>
                ))}
              </select>
            </label>
            <label className={cn(LABEL_CLASS, "md:col-span-2")}>
              {copy.message}
              <textarea
                name="message"
                required
                minLength={8}
                className="mt-1.5 min-h-28 w-full border border-input bg-white px-4 py-3 text-sm text-foreground"
              />
            </label>
            <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-input bg-white px-4 text-center text-xs uppercase text-muted-foreground transition-colors hover:text-foreground md:mt-6">
              <ImagePlus className="h-5 w-5" aria-hidden="true" />
              {copy.image}
              <input name="image" type="file" accept="image/*" className="sr-only" />
            </label>
            <div className="flex flex-col gap-4 md:col-span-3 md:flex-row md:items-end">
              <label className={cn(LABEL_CLASS, "flex-1")}>
                {copy.location}
                <input name="location" className={FIELD_CLASS} />
              </label>
              <Button type="submit" variant="dark" disabled={isSubmitting}>
                {isSubmitting ? copy.saving : copy.write}
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <p role="status" className="text-sm text-foreground/75 md:col-span-3">
              {status}
            </p>
          </form>
        ) : null}
      </Container>
    </section>
  );
}

function StarRating({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={cn(
            "h-4 w-4",
            star <= value ? "fill-accent text-accent-text" : "text-border"
          )}
        />
      ))}
    </div>
  );
}
