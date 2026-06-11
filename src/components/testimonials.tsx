"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useLanguage } from "./language-provider";

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&q=80&auto=format&fit=crop&crop=faces",
];

const REVIEW_COPY = {
  mn: {
    eyebrow: "Сэтгэгдэл",
    title: "Аялагчдын үнэлгээ",
    body:
      "Манайхаар аяллаа төлөвлөсөн хүмүүсийн бодит туршлага, үйлчилгээний мэдрэмжийг эндээс уншаарай.",
    previous: "Өмнөх сэтгэгдэл",
    next: "Дараах сэтгэгдэл",
  },
  en: {
    eyebrow: "Reviews",
    title: "Traveller reviews",
    body:
      "Read real experiences from travellers who planned business, expo, leisure, and custom trips with us.",
    previous: "Previous review",
    next: "Next review",
  },
  zh: {
    eyebrow: "评价",
    title: "旅行者评价",
    body: "查看通过 Nomadabe 规划商务、展会、休闲和定制旅行的真实体验。",
    previous: "上一条评价",
    next: "下一条评价",
  },
  ja: {
    eyebrow: "レビュー",
    title: "旅行者レビュー",
    body:
      "ビジネス、展示会、レジャー、カスタム旅行を計画したお客様の実体験をご覧ください。",
    previous: "前のレビュー",
    next: "次のレビュー",
  },
  ko: {
    eyebrow: "후기",
    title: "여행자 후기",
    body:
      "비즈니스, 엑스포, 휴양, 맞춤 여행을 함께 계획한 고객들의 실제 경험을 확인하세요.",
    previous: "이전 후기",
    next: "다음 후기",
  },
} as const;

export function Testimonials() {
  const { contentLocale, t } = useLanguage();
  const copy = REVIEW_COPY[contentLocale];
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: "prev" | "next") {
    scrollerRef.current?.scrollBy({
      left: direction === "next" ? 460 : -460,
      behavior: "smooth",
    });
  }

  return (
    <section id="journal" className="bg-background px-6 py-16 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-foreground">
              {copy.eyebrow}
            </p>
            <h2 className="text-balance text-4xl font-black leading-tight text-foreground sm:text-5xl">
              {copy.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
              {copy.body}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              aria-label={copy.previous}
              onClick={() => scrollByCard("prev")}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-accent hover:bg-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={copy.next}
              onClick={() => scrollByCard("next")}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-accent hover:bg-accent"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-3 [scrollbar-width:none] lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {t.testimonials.quotes.map((quote, idx) => (
            <motion.figure
              key={quote.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex min-h-[280px] min-w-[82vw] snap-start flex-col rounded-lg border border-border bg-card p-7 shadow-sm sm:min-w-[440px] lg:min-w-[440px]"
            >
              <Quote className="h-8 w-8 text-accent" />
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-foreground/80 lg:text-base">
                {quote.body}
              </blockquote>
              <div className="mt-6 flex gap-1 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <figcaption className="mt-5 border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-11 w-11 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${AVATARS[idx]})` }}
                  />
                  <div>
                    <div className="text-sm font-bold">{quote.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {quote.trip}
                    </div>
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
