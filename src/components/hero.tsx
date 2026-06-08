"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Users, Search } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1547531455-ccff21cdf2c4?w=2400&q=80&auto=format&fit=crop')",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />

      {/* Top tag */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-28 lg:top-32 left-6 lg:left-10 right-6 lg:right-10 flex items-center justify-between text-white/80"
      >
        <span className="text-xs lg:text-sm tracking-[0.2em] uppercase">
          ★★★★★ Rated by 1,200+ adventurers
        </span>
        <span className="hidden lg:block text-xs tracking-[0.2em] uppercase">
          Est. 2025 · Ulaanbaatar
        </span>
      </motion.div>

      {/* Main content */}
      <div className="relative mx-auto max-w-7xl w-full px-6 lg:px-10 pb-16 lg:pb-24 pt-32">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display text-white text-5xl sm:text-6xl lg:text-8xl xl:text-9xl leading-[0.95] tracking-tight text-balance max-w-5xl"
        >
          Adventure the
          <br />
          <span className="italic">nomad</span> way.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-6 text-white/85 text-lg lg:text-xl max-w-2xl"
        >
          Small-group trips across Mongolia and beyond. Led by local experts.
          Built for travellers who&apos;d rather ride than read about it.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-10 lg:mt-14 bg-background/95 backdrop-blur rounded-2xl lg:rounded-full p-2 lg:p-2 shadow-2xl max-w-4xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_auto] gap-1">
            <div className="flex items-center gap-3 px-5 py-3 lg:py-2 hover:bg-muted rounded-xl lg:rounded-full transition-colors cursor-pointer">
              <MapPin className="w-5 h-5 text-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Where
                </div>
                <div className="text-sm font-medium truncate">
                  Anywhere · Mongolia, Asia, Europe
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 lg:py-2 hover:bg-muted rounded-xl lg:rounded-full transition-colors cursor-pointer border-t lg:border-t-0 lg:border-l border-border/50">
              <Calendar className="w-5 h-5 text-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  When
                </div>
                <div className="text-sm font-medium truncate">
                  Any month
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 lg:py-2 hover:bg-muted rounded-xl lg:rounded-full transition-colors cursor-pointer border-t lg:border-t-0 lg:border-l border-border/50">
              <Users className="w-5 h-5 text-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Who
                </div>
                <div className="text-sm font-medium truncate">
                  2 travellers
                </div>
              </div>
            </div>
            <button className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl lg:rounded-full px-6 py-3.5 font-semibold transition-colors">
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {["Gobi 7-day", "Altai trekking", "Eagle hunters", "Reindeer tribe", "Japan ski"].map(
            (q) => (
              <button
                key={q}
                className="text-xs lg:text-sm text-white/90 border border-white/30 hover:bg-white hover:text-foreground rounded-full px-4 py-1.5 transition-colors backdrop-blur-sm"
              >
                {q}
              </button>
            )
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 right-6 lg:right-10 text-white/70 text-xs tracking-[0.3em] uppercase rotate-90 origin-bottom-right hidden lg:flex items-center gap-3">
        <span>Scroll</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </section>
  );
}
