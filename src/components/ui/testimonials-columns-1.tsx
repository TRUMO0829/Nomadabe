"use client";

import React from "react";
import { motion } from "motion/react";

export type TestimonialColumnItem = {
  text: string;
  image: string;
  name: string;
  role: string;
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
        className="flex flex-col gap-4 bg-background pb-4"
      >
        {new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="w-full max-w-[260px] rounded-2xl border bg-card p-6 shadow-md shadow-primary/10"
                key={`${name}-${i}`}
              >
                <div className="text-xs leading-6 text-foreground/80">{text}</div>
                <div className="mt-4 flex items-center gap-2">
                  <img
                    width={32}
                    height={32}
                    src={image}
                    alt={name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="text-sm font-medium leading-5 tracking-tight">
                      {name}
                    </div>
                    <div className="text-xs leading-5 tracking-tight opacity-60">
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
