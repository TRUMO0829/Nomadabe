"use client";

import { ChevronDown } from "lucide-react";
import type { AboutSectionSettings } from "@/lib/site-settings";
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
    <section
      className="relative min-h-screen overflow-hidden bg-cover bg-center px-6 pb-20 pt-28 text-white sm:px-10 lg:px-16 lg:pb-28 lg:pt-36"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.56) 48%, rgba(0,0,0,0.36) 100%), url(${FAQ_BACKGROUND_IMAGE})`,
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance font-display text-[clamp(3.1rem,6.6vw,5.9rem)] leading-[0.95] text-white">
            {copy.faq.title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-white/72 lg:text-xl">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-5 sm:mt-24 lg:gap-6">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              className="group rounded-[24px] border border-white/18 bg-black/28 px-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-md transition-colors duration-300 open:bg-black/38 sm:px-8 lg:rounded-[28px] lg:px-10"
              open={index === 0}
            >
              <summary className="grid min-h-[86px] cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-5 py-5 marker:hidden [&::-webkit-details-marker]:hidden lg:min-h-[114px]">
                <span className="text-lg font-semibold leading-snug text-white lg:text-[1.65rem] lg:leading-snug">
                  {item.question}
                </span>
                <span className="flex h-10 w-10 items-center justify-center text-accent transition-transform duration-300 group-open:rotate-180">
                  <ChevronDown className="h-6 w-6" aria-hidden="true" />
                </span>
              </summary>
              <p className="max-w-4xl pb-7 text-sm leading-7 text-white/72 lg:pb-9 lg:text-base lg:leading-8">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function getVisibleOrderedItems<T extends { order?: number; isVisible?: boolean }>(items: T[]) {
  return [...items]
    .filter((item) => item.isVisible !== false)
    .sort((left, right) => (left.order ?? 999) - (right.order ?? 999));
}
