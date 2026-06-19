'use client';

import { type ElementType, useEffect, useRef, useState } from 'react';
import { motion, type MotionProps } from 'framer-motion';

type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = 'p',
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!trigger || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const steps = Math.max(1, Math.ceil(duration / speed));
    let step = 0;

    const interval = window.setInterval(() => {
      const progress = step / steps;
      let scrambled = '';

      for (let i = 0; i < children.length; i += 1) {
        if (children[i] === ' ') {
          scrambled += ' ';
        } else if (progress * children.length > i) {
          scrambled += children[i];
        } else {
          scrambled += characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);
      step += 1;

      if (step > steps) {
        window.clearInterval(interval);
        setDisplayText(children);
        isAnimatingRef.current = false;
        onScrambleComplete?.();
      }
    }, speed * 1000);

    return () => {
      isAnimatingRef.current = false;
      window.clearInterval(interval);
    };
  }, [characterSet, children, duration, onScrambleComplete, speed, trigger]);

  const MotionComponent =
    Component === 'h1'
      ? motion.h1
      : Component === 'h2'
        ? motion.h2
        : Component === 'h3'
          ? motion.h3
          : Component === 'span'
            ? motion.span
            : motion.p;

  return (
    <MotionComponent className={className} {...props}>
      {displayText}
    </MotionComponent>
  );
}
