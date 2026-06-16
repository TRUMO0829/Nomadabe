"use client";

import { motion } from "motion/react";
import {
  TestimonialsColumn,
  type TestimonialColumnItem,
} from "@/components/ui/testimonials-columns-1";
import { useLanguage } from "./language-provider";

const REVIEW_IMAGES = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&q=80",
];

export function Testimonials() {
  const { t } = useLanguage();
  const copy = t.testimonials;

  const testimonials: TestimonialColumnItem[] = Array.from({ length: 9 }, (_, index) => {
    const quote = copy.quotes[index % copy.quotes.length];

    return {
      text: quote.body,
      image: REVIEW_IMAGES[index],
      name: quote.name,
      role: quote.trip,
    };
  });

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section id="journal" className="relative bg-background px-6 py-12 lg:px-10 lg:py-16">
      <div className="container z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[520px] flex-col items-center justify-center text-center"
        >
          <div className="flex justify-center">
            <div className="rounded-lg border bg-card px-3 py-1 text-xs font-bold text-foreground">
              {copy.eyebrow}
            </div>
          </div>

          <h2 className="mt-4 text-lg font-black tracking-tighter text-foreground sm:text-xl md:text-2xl lg:text-3xl">
            {copy.titleStart}{" "}
            <span className="text-accent-foreground [text-shadow:0_1px_0_var(--accent)]">
              {copy.titleEmphasis}
            </span>{" "}
            {copy.titleEnd}
          </h2>
          <p className="mt-3 text-center text-xs font-semibold text-muted-foreground opacity-90 sm:text-sm">
            {copy.rating}
          </p>
        </motion.div>

        <div className="mt-8 flex max-h-[520px] justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
}
