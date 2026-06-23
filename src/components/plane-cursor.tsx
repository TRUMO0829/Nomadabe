"use client";

import { useEffect, useRef } from "react";
import { Plane } from "lucide-react";

export function PlaneCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({
    x: -80,
    y: -80,
    rawX: -80,
    rawY: -80,
    angle: -28,
    scale: 1,
  });
  const pressScaleRef = useRef(1);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) return;

    const finePointer = window.matchMedia("(pointer: fine)");

    const getPageScale = () => {
      const cssScale = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--site-scale"),
      );
      const zoomIsApplied = window.CSS?.supports?.("zoom", "1") ?? false;

      return zoomIsApplied && Number.isFinite(cssScale) && cssScale > 0
        ? cssScale
        : 1;
    };

    const render = () => {
      const { x, y, angle, scale } = positionRef.current;
      const pageScale = getPageScale();
      const correctedX = x / pageScale;
      const correctedY = y / pageScale;
      const finalScale = scale * pressScaleRef.current;

      cursor.style.transform = `translate3d(${correctedX}px, ${correctedY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${finalScale})`;
      frameRef.current = null;
    };

    const requestRender = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(render);
      }
    };

    const syncEnabled = () => {
      const enabled = finePointer.matches;

      document.body.classList.toggle("plane-cursor-enabled", enabled);
      cursor.style.display = enabled ? "flex" : "none";
      if (!enabled) {
        cursor.style.opacity = "0";
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointer.matches) return;

      syncEnabled();

      const previous = positionRef.current;
      const dx = event.clientX - previous.rawX;
      const dy = event.clientY - previous.rawY;
      const distance = Math.hypot(dx, dy);
      const angle =
        distance > 3
          ? Math.atan2(dy, dx) * (180 / Math.PI) + 45
          : previous.angle;

      positionRef.current = {
        x: event.clientX,
        y: event.clientY,
        rawX: event.clientX,
        rawY: event.clientY,
        angle,
        scale: 1,
      };
      cursor.style.opacity = "1";
      requestRender();
    };

    const handlePointerLeave = () => {
      cursor.style.opacity = "0";
    };

    const handlePointerDown = () => {
      pressScaleRef.current = 0.86;
      requestRender();
    };

    const handlePointerUp = () => {
      pressScaleRef.current = 1;
      requestRender();
    };

    syncEnabled();
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("scroll", syncEnabled, { passive: true });
    finePointer.addEventListener("change", syncEnabled);

    return () => {
      document.body.classList.remove("plane-cursor-enabled");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("scroll", syncEnabled);
      finePointer.removeEventListener("change", syncEnabled);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[2147483647] hidden h-8 w-8 items-center justify-center text-[#ffd400] opacity-0 drop-shadow-[0_0_12px_rgba(255,212,0,0.85)] transition-opacity duration-150 will-change-transform"
    >
      <Plane className="h-7 w-7 fill-[#ffd400] stroke-[#11100b] stroke-[1.8]" />
    </div>
  );
}
