'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';

interface WordData {
  text: string;
  duration: number;
  delay: number;
  blur: number;
  scale?: number;
}

interface BlurTextAnimationProps {
  text?: string;
  words?: WordData[];
  className?: string;
  innerClassName?: string;
  fontSize?: string;
  fontFamily?: string;
  textColor?: string;
  animationDelay?: number;
  active?: boolean;
  compact?: boolean;
  loop?: boolean;
}

function seededVariation(index: number) {
  const value = Math.sin((index + 1) * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export default function BlurTextAnimation({
  text = 'Elegant blur animation that brings your words to life with cinematic transitions.',
  words,
  className = '',
  innerClassName = '',
  fontSize = 'text-4xl md:text-5xl lg:text-6xl',
  fontFamily = "font-['Avenir_Next',_'Avenir',_system-ui,_sans-serif]",
  textColor = 'text-white',
  animationDelay = 4000,
  active = true,
  compact = false,
  loop = true
}: BlurTextAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const textWords = useMemo(() => {
    if (words) return words;

    const splitWords = text.split(' ');
    const totalWords = splitWords.length;

    return splitWords.map((word, index) => {
      const progress = index / totalWords;

      const exponentialDelay = Math.pow(progress, 0.8) * 0.5;

      const baseDelay = index * 0.06;

      const variation = seededVariation(index);
      const microVariation = (variation - 0.5) * 0.05;

      return {
        text: word,
        duration: 2.2 + Math.cos(index * 0.3) * 0.3,
        delay: baseDelay + exponentialDelay + microVariation,
        blur: 12 + Math.floor(variation * 8),
        scale: 0.9 + Math.sin(index * 0.2) * 0.05
      };
    });
  }, [text, words]);

  useEffect(() => {
    if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

    if (!active) {
      resetTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 0);
      return;
    }

    const startAnimation = () => {
      resetTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 0);

      startTimeoutRef.current = setTimeout(() => {
        setIsAnimating(true);
      }, 200);

      let maxTime = 0;
      textWords.forEach(word => {
        const totalTime = word.delay + word.duration;
        maxTime = Math.max(maxTime, totalTime);
      });

      if (!loop) return;

      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        resetTimeoutRef.current = setTimeout(() => {
          startAnimation();
        }, animationDelay);
      }, (maxTime + 1) * 1000);
    };
    startAnimation();

    return () => {
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [active, animationDelay, loop, textWords]);

  return (
    <div
      className={
        compact
          ? className
          : `flex min-h-screen items-center justify-center bg-black ${className}`
      }
    >
      <div className={compact ? innerClassName : `max-w-5xl px-8 text-center ${innerClassName}`}>
        <p className={`${textColor} ${fontSize} ${fontFamily} font-light leading-relaxed tracking-wide`}>
          {textWords.map((word, index) => (
            <span
              key={index}
              className={`inline-block transition-all ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
              style={{
                transitionDuration: `${word.duration}s`,
                transitionDelay: `${word.delay}s`,
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                filter: isAnimating 
                  ? 'blur(0px) brightness(1)' 
                  : `blur(${word.blur}px) brightness(0.6)`,
                transform: isAnimating 
                  ? 'translateY(0) scale(1) rotateX(0deg)' 
                  : `translateY(20px) scale(${word.scale || 1}) rotateX(-15deg)`,
                marginRight: '0.35em',
                willChange: 'filter, transform, opacity',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                textShadow: isAnimating 
                  ? '0 2px 8px rgba(255,255,255,0.1)' 
                  : '0 0 40px rgba(255,255,255,0.4)'
              }}
            >
              {word.text}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export function Component() {
  return <BlurTextAnimation />;
}
