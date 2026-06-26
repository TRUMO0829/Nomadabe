"use client";

import React from "react";

export type TestimonialColumnItem = {
  text: string;
  email: string;
  avatar: {
    initials: string;
    background: string;
    foreground: string;
    gender: "male" | "female";
  };
  role: string;
};

function ReviewAvatarGraphic() {
  return (
    <div
      aria-hidden="true"
      className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-black shadow-[0_2px_6px_rgba(17,16,11,0.18)]"
    >
      <span className="absolute left-1/2 top-[9px] h-[18px] w-[18px] -translate-x-1/2 rounded-full bg-white" />
      <span className="absolute left-1/2 bottom-[-14px] h-[34px] w-[42px] -translate-x-1/2 rounded-t-full bg-white" />
    </div>
  );
}

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
            {props.testimonials.map(({ text, email, role }, i) => (
              <div
                className="w-full rounded-xl border border-[#eadfac] bg-white p-4 shadow-sm shadow-primary/10"
                key={`${email}-${i}`}
              >
                <div className="text-xs leading-5 text-foreground/80">{text}</div>
                <div className="mt-3 flex items-center gap-2">
                  <ReviewAvatarGraphic />
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
