"use client";

import { useEffect, useMemo, useState } from "react";

interface WordData {
  text: string;
  duration: number;
  delay: number;
  blur: number;
  scale?: number;
}

interface BlurTextAnimationProps {
  text: string;
  words?: WordData[];
  className?: string;
}

function stableVariation(index: number) {
  return Math.sin(index * 12.9898) * 43758.5453 % 1;
}

export function BlurTextAnimation({
  text,
  words,
  className = "",
}: BlurTextAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const textWords = useMemo(() => {
    if (words) return words;

    const splitWords = text.split(" ");
    const totalWords = Math.max(splitWords.length, 1);

    return splitWords.map((word, index) => {
      const progress = index / totalWords;
      const exponentialDelay = Math.pow(progress, 0.8) * 0.34;
      const baseDelay = index * 0.035;
      const variation = stableVariation(index) * 0.025;

      return {
        text: word,
        duration: 0.82 + Math.cos(index * 0.3) * 0.1,
        delay: baseDelay + exponentialDelay + variation,
        blur: 0,
        scale: 1,
      };
    });
  }, [text, words]);

  useEffect(() => {
    const resetTimer = window.setTimeout(() => {
      setIsAnimating(false);
    }, 0);
    const revealTimer = window.setTimeout(() => {
      setIsAnimating(true);
    }, 120);

    return () => {
      window.clearTimeout(resetTimer);
      window.clearTimeout(revealTimer);
    };
  }, [textWords]);

  return (
    <span className={className}>
      {textWords.map((word, index) => (
        <span
          key={`${word.text}-${index}`}
          className={`inline-block transition-all ${isAnimating ? "opacity-100" : "opacity-0"}`}
          style={{
            transitionDuration: `${word.duration}s`,
            transitionDelay: `${word.delay}s`,
            transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            filter: "blur(0px) brightness(1)",
            transform: isAnimating
              ? "translateY(0) scale(1) rotateX(0deg)"
              : `translateY(1.15em) scale(${word.scale ?? 1}) rotateX(0deg)`,
            marginRight: "0.35em",
            willChange: "filter, transform, opacity",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {word.text}
        </span>
      ))}
    </span>
  );
}
