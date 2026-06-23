"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  words: string[];
  speed?: number;
  delayBetweenWords?: number;
  cursor?: boolean;
  cursorChar?: string;
  loop?: boolean;
}

export function Typewriter({
  words,
  speed = 100,
  delayBetweenWords = 2000,
  cursor = true,
  cursorChar = "|",
  loop = true,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const currentWord = words[wordIndex] ?? "";
  const isComplete = !isDeleting && charIndex >= currentWord.length;

  useEffect(() => {
    if (words.length === 0) return;

    const isWordComplete = !isDeleting && charIndex >= currentWord.length;
    if (isWordComplete && !loop) return;

    const timeoutDelay = isWordComplete ? delayBetweenWords : isDeleting ? speed / 2 : speed;

    const timeout = window.setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentWord.length) {
          setDisplayText(currentWord.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setIsDeleting(true);
        }
      } else if (charIndex > 0) {
        setDisplayText(currentWord.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, timeoutDelay);

    return () => window.clearTimeout(timeout);
  }, [charIndex, currentWord, delayBetweenWords, isDeleting, loop, speed, wordIndex, words]);

  useEffect(() => {
    if (!cursor) return;

    const cursorInterval = window.setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => window.clearInterval(cursorInterval);
  }, [cursor]);

  return (
    <span className="inline-block">
      {displayText}
      {cursor && (loop || !isComplete) ? (
        <span
          className="ml-1 transition-opacity duration-75"
          style={{ opacity: showCursor ? 1 : 0 }}
        >
          {cursorChar}
        </span>
      ) : null}
    </span>
  );
}
