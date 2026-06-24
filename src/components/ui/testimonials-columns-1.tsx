"use client";

import React from "react";

export type TestimonialColumnItem = {
  text: string;
  email: string;
  avatar: {
    initials: string;
    background: string;
    foreground: string;
  };
  role: string;
};

export function TestimonialsColumn(props: {
  className?: string;
  testimonials: TestimonialColumnItem[];
  duration?: number;
}) {
  return (
    <div className={`testimonial-column ${props.className ?? ""}`}>
      <div
        className="testimonial-column-track flex w-full flex-col gap-3 bg-white pb-3"
        style={
          {
            "--testimonial-duration": `${props.duration ?? 10}s`,
          } as React.CSSProperties
        }
      >
        {new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, email, avatar, role }, i) => (
              <div
                className="w-full rounded-xl border border-[#eadfac] bg-white p-4 shadow-sm shadow-primary/10"
                key={`${email}-${i}`}
              >
                <div className="text-xs leading-5 text-foreground/80">{text}</div>
                <div className="mt-3 flex items-center gap-2">
                  <div
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase shadow-sm"
                    style={{
                      background: avatar.background,
                      color: avatar.foreground,
                    }}
                  >
                    {avatar.initials}
                  </div>
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
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
