"use client";

import { motion } from "framer-motion";
import {
  TestimonialsColumn,
  type TestimonialColumnItem,
} from "@/components/ui/testimonials-columns-1";
import { useLanguage } from "./language-provider";

const REVIEW_EMAILS = [
  "nomin.bayar@gmail.com",
  "temuulen.ariun@gmail.com",
  "saruul.erdene@gmail.com",
  "enkhjin.travel@gmail.com",
  "munkhorgil.b@gmail.com",
  "anuka.nomad@gmail.com",
  "bilguun.expo@gmail.com",
  "oyuka.route@gmail.com",
  "tulga.trip@gmail.com",
];

const REVIEW_AVATARS: TestimonialColumnItem["avatar"][] = [
  { icon: "sparkles", gradient: "linear-gradient(135deg,#ff6b9d,#ffd166)", foreground: "#7a1238" },
  { icon: "clapperboard", gradient: "linear-gradient(135deg,#5b8cff,#8fffd2)", foreground: "#102a66" },
  { icon: "popcorn", gradient: "linear-gradient(135deg,#ffd166,#f97316)", foreground: "#5a2106" },
  { icon: "film", gradient: "linear-gradient(135deg,#a78bfa,#f0abfc)", foreground: "#3b1768" },
  { icon: "wand", gradient: "linear-gradient(135deg,#22d3ee,#818cf8)", foreground: "#0f2d5c" },
  { icon: "camera", gradient: "linear-gradient(135deg,#fb7185,#fef08a)", foreground: "#651524" },
  { icon: "video", gradient: "linear-gradient(135deg,#34d399,#60a5fa)", foreground: "#063d35" },
  { icon: "star", gradient: "linear-gradient(135deg,#facc15,#fb923c)", foreground: "#4d2c05" },
  { icon: "palette", gradient: "linear-gradient(135deg,#f472b6,#38bdf8)", foreground: "#4a1740" },
];

export function Testimonials() {
  const { t } = useLanguage();
  const copy = t.testimonials;

  const testimonials: TestimonialColumnItem[] = Array.from({ length: 9 }, (_, index) => {
    const quote = copy.quotes[index % copy.quotes.length];

    return {
      text: quote.body,
      email: REVIEW_EMAILS[index],
      avatar: REVIEW_AVATARS[index],
      role: quote.trip,
    };
  });

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section id="journal" className="relative bg-white px-4 py-10 lg:px-8 lg:py-12">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[520px] flex-col items-center justify-center text-center"
        >
          <h2 className="text-balance text-4xl font-black leading-none text-foreground sm:text-5xl lg:text-6xl">
            {copy.eyebrow}
          </h2>
          <p className="mt-3 text-center text-xs font-semibold text-muted-foreground opacity-90 sm:text-sm">
            {copy.rating}
          </p>
        </motion.div>

        <div className="mx-auto mt-8 grid max-h-[430px] w-full max-w-5xl grid-cols-1 gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_84%,transparent)] md:grid-cols-3">
          <TestimonialsColumn testimonials={firstColumn} className="w-full" duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden w-full md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden w-full md:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
}
