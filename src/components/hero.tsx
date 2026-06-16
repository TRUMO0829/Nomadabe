"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "./language-provider";

const HERO_BACKGROUNDS = [
  "/nomadabe-hero-panorama.png",
  "/hero-winter.jpg",
  "/hero-spring.jpg",
  "/hero-autumn.jpg",
];

export function Hero() {
  const { t } = useLanguage();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % HERO_BACKGROUNDS.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="home-hero-screen relative flex items-center justify-center overflow-hidden bg-primary px-5 py-24 sm:px-8 lg:px-12"
    >
      <span id="home" className="absolute left-0 top-0" aria-hidden="true" />
      {HERO_BACKGROUNDS.map((image, index) => (
        <motion.div
          key={image}
          aria-hidden="true"
          initial={false}
          animate={{ opacity: activeImage === index ? 1 : 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage: `url('${image}')`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/14" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.035)_90%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/70 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="hero-heading max-w-full whitespace-nowrap text-[15px] font-black leading-tight text-white sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
        >
          <span className="hero-title-mark">
            {t.hero.headingLine1} {t.hero.headingEmphasis} {t.hero.headingLine2}
          </span>
        </motion.h1>
      </div>
    </section>
  );
}
