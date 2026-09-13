"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { AboutSectionSettings } from "@/lib/site-settings";
import { Container } from "./ui/section";
import { useLanguage } from "./language-provider";

type FaqPageProps = {
  aboutSection: AboutSectionSettings;
};

// next/image resizes from this master, so a 2400px source is plenty for a
// darkened full-bleed background.
const FAQ_BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80";

export function FaqPage({ aboutSection }: FaqPageProps) {
  const { contentLocale } = useLanguage();
  const copy = aboutSection[contentLocale] ?? aboutSection.mn;
  const faqItems = getVisibleOrderedItems(copy.faq.items);
  const subtitle = copy.faq.subtitle || copy.faq.eyebrow;

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-ink pb-20 pt-28 text-white lg:pb-28 lg:pt-36">
      <Image
        src={FAQ_BACKGROUND_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.56)_48%,rgba(0,0,0,0.36)_100%)]"
      />

      <Container>
        <div className="mx-auto max-w-4xl text-center">
          {/* Uppercase Cyrillic runs wide with the site's forced letter
              spacing, so the minimum size is small enough for a 390px screen
              and long words may break rather than overflow. */}
          <h1
            lang={contentLocale}
            className="text-balance break-words hyphens-auto font-display text-[clamp(1.9rem,6.6vw,5.9rem)] text-white"
          >
            {copy.faq.title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-7 max-w-3xl text-base text-white/72 lg:text-xl">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-5 sm:mt-24 lg:gap-6">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              className="group border border-white/18 bg-black/30 px-5 shadow-raised backdrop-blur-md transition-colors duration-300 open:bg-black/40 sm:px-8 lg:px-10"
              open={index === 0}
            >
              <summary className="grid min-h-[86px] cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-5 py-5 marker:hidden [&::-webkit-details-marker]:hidden lg:min-h-[114px]">
                <span className="min-w-0 break-words text-lg text-white lg:text-[1.65rem]">
                  {item.question}
                </span>
                <span className="flex h-10 w-10 items-center justify-center text-accent transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none">
                  <ChevronDown className="h-6 w-6" aria-hidden="true" />
                </span>
              </summary>
              <p className="max-w-4xl pb-7 text-sm text-white/72 lg:pb-9 lg:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

function getVisibleOrderedItems<T extends { order?: number; isVisible?: boolean }>(items: T[]) {
  return [...items]
    .filter((item) => item.isVisible !== false)
    .sort((left, right) => (left.order ?? 999) - (right.order ?? 999));
}
