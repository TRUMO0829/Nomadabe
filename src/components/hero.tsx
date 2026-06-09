"use client";

import { motion } from "framer-motion";
import { useLanguage } from "./language-provider";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary px-6 py-24 lg:px-10">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: "url('/nomadabe-hero-panorama.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/85" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="max-w-5xl text-balance font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-8xl xl:text-9xl"
        >
          {t.hero.headingLine1}
          <br />
          <span className="italic text-accent">{t.hero.headingEmphasis}</span>{" "}
          {t.hero.headingLine2}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-5 max-w-2xl text-balance text-sm leading-relaxed text-white/82 sm:text-base lg:text-lg"
        >
          {t.hero.body}
        </motion.p>
      </div>

    </section>
  );
}
