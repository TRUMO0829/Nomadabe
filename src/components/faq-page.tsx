"use client";

import { ChevronDown } from "lucide-react";
import type { AboutSectionSettings } from "@/lib/site-settings";
import { useLanguage } from "./language-provider";

type FaqPageProps = {
  aboutSection: AboutSectionSettings;
};

export function FaqPage({ aboutSection }: FaqPageProps) {
  const { contentLocale } = useLanguage();
  const copy = aboutSection[contentLocale] ?? aboutSection.mn;
  const faqItems = getVisibleOrderedItems(copy.faq.items);
  const subtitle = copy.faq.subtitle || copy.faq.eyebrow;

  return (
    <section className="relative min-h-screen bg-white px-6 pb-20 pt-28 text-[#151c2d] sm:px-10 lg:px-16 lg:pb-28 lg:pt-36">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance font-display text-[clamp(3.1rem,6.6vw,5.9rem)] leading-[0.95] text-[#151c2d]">
            {copy.faq.title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-[#68758a] lg:text-xl">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-5 sm:mt-24 lg:gap-6">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              className="group rounded-[24px] border border-[#e7ebf2] bg-[#fafbfc] px-6 transition-colors duration-300 open:bg-white open:shadow-[0_18px_60px_rgba(21,28,45,0.07)] sm:px-8 lg:rounded-[28px] lg:px-10"
              open={index === 0}
            >
              <summary className="grid min-h-[86px] cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-5 py-5 marker:hidden [&::-webkit-details-marker]:hidden lg:min-h-[114px]">
                <span className="text-lg font-semibold leading-snug text-[#202a3d] lg:text-[1.65rem] lg:leading-snug">
                  {item.question}
                </span>
                <span className="flex h-10 w-10 items-center justify-center text-[#95a0b3] transition-transform duration-300 group-open:rotate-180">
                  <ChevronDown className="h-6 w-6" aria-hidden="true" />
                </span>
              </summary>
              <p className="max-w-4xl pb-7 text-sm leading-7 text-[#59667a] lg:pb-9 lg:text-base lg:leading-8">
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
