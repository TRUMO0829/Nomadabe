"use client";

import { ChevronDown } from "lucide-react";
import type { AboutSectionSettings } from "@/lib/site-settings";
import { Surface } from "@/components/ui/surface";
import { useLanguage } from "./language-provider";

type FaqPageProps = {
  aboutSection: AboutSectionSettings;
};

const FAQ_BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=90";

export function FaqPage({ aboutSection }: FaqPageProps) {
  const { contentLocale } = useLanguage();
  const copy = aboutSection[contentLocale] ?? aboutSection.mn;
  const faqItems = getVisibleOrderedItems(copy.faq.items);
  const subtitle = copy.faq.subtitle || copy.faq.eyebrow;

  return (
    <>
      {/* Dark photographic head — the same opening move every page makes. */}
      <Surface
        tone="dark"
        height="band"
        photo={FAQ_BACKGROUND_IMAGE}
        hairline={false}
        navSentinel
        innerClassName="max-w-6xl items-center pt-28 text-center lg:pt-36"
      >
        <h1 className="text-balance font-display text-[clamp(3.1rem,6.6vw,5.9rem)] leading-[0.95] text-foreground">
          {copy.faq.title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-muted-foreground lg:text-xl">
            {subtitle}
          </p>
        ) : null}
      </Surface>

      {/* Light reading column. */}
      <Surface hairline={false} innerClassName="max-w-5xl">
        <div className="grid gap-5 lg:gap-6">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              className="group rounded-[24px] border border-border bg-card px-6 shadow-[0_18px_50px_rgba(17,16,11,0.08)] transition-colors duration-300 open:bg-muted sm:px-8 lg:rounded-[28px] lg:px-10"
              open={index === 0}
            >
              <summary className="grid min-h-[86px] cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-5 py-5 marker:hidden [&::-webkit-details-marker]:hidden lg:min-h-[114px]">
                <span className="text-lg font-semibold leading-snug text-foreground lg:text-[1.65rem] lg:leading-snug">
                  {item.question}
                </span>
                <span
                  className="flex h-10 w-10 items-center justify-center transition-transform duration-300 group-open:rotate-180"
                  style={{ color: "var(--accent-text)" }}
                >
                  <ChevronDown className="h-6 w-6" aria-hidden="true" />
                </span>
              </summary>
              <p className="max-w-4xl pb-7 text-sm leading-7 text-muted-foreground lg:pb-9 lg:text-base lg:leading-8">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Surface>
    </>
  );
}

function getVisibleOrderedItems<T extends { order?: number; isVisible?: boolean }>(items: T[]) {
  return [...items]
    .filter((item) => item.isVisible !== false)
    .sort((left, right) => (left.order ?? 999) - (right.order ?? 999));
}
