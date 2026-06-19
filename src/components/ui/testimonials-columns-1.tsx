"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Clapperboard,
  Film,
  Palette,
  Popcorn,
  Sparkles,
  Star,
  Video,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

type TestimonialAvatarIcon =
  | "camera"
  | "clapperboard"
  | "film"
  | "palette"
  | "popcorn"
  | "sparkles"
  | "star"
  | "video"
  | "wand";

export type TestimonialColumnItem = {
  text: string;
  email: string;
  avatar: {
    icon: TestimonialAvatarIcon;
    gradient: string;
    foreground: string;
  };
  role: string;
};

const AVATAR_ICONS: Record<TestimonialAvatarIcon, LucideIcon> = {
  camera: Camera,
  clapperboard: Clapperboard,
  film: Film,
  palette: Palette,
  popcorn: Popcorn,
  sparkles: Sparkles,
  star: Star,
  video: Video,
  wand: WandSparkles,
};

export function TestimonialsColumn(props: {
  className?: string;
  testimonials: TestimonialColumnItem[];
  duration?: number;
}) {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex w-full flex-col gap-3 bg-white pb-3"
      >
        {new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, email, avatar, role }, i) => {
              const Icon = AVATAR_ICONS[avatar.icon];

              return (
                <div
                  className="w-full rounded-xl border border-[#eadfac] bg-white p-4 shadow-sm shadow-primary/10"
                  key={`${email}-${i}`}
                >
                  <div className="text-xs leading-5 text-foreground/80">{text}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <motion.div
                      aria-hidden="true"
                      animate={{ y: [0, -2, 0], rotate: [0, -2, 2, 0] }}
                      transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.12,
                      }}
                      className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl p-[2px] shadow-sm"
                      style={{ background: avatar.gradient }}
                    >
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.78),transparent_25%)]" />
                      <span className="relative flex h-full w-full items-center justify-center rounded-[14px] bg-white/86 shadow-inner">
                        <Icon className="h-5 w-5" style={{ color: avatar.foreground }} strokeWidth={2.3} />
                      </span>
                    </motion.div>
                    <div className="min-w-0 flex flex-col">
                      <div className="truncate text-sm font-semibold leading-5 tracking-tight text-foreground">
                        {email}
                      </div>
                      <div className="text-xs leading-5 tracking-tight opacity-60">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
