"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type FlightPoint = {
  x: number;
  y: number;
  scale: number;
  angle: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function mixPoint(from: FlightPoint, to: FlightPoint, progress: number) {
  return {
    x: lerp(from.x, to.x, progress),
    y: lerp(from.y, to.y, progress),
    scale: lerp(from.scale, to.scale, progress),
    angle: lerp(from.angle, to.angle, progress),
  };
}

function pointInRect(
  rect: DOMRect,
  x: number,
  y: number,
  scale: number,
  angle: number,
) {
  return {
    x: rect.left + rect.width * x,
    y: rect.top + rect.height * y,
    scale,
    angle,
  };
}

function getPageScale() {
  const cssScale = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--site-scale"),
  );
  const zoomIsApplied = window.CSS?.supports?.("zoom", "1") ?? false;

  return zoomIsApplied && Number.isFinite(cssScale) && cssScale > 0
    ? cssScale
    : 1;
}

export function JourneyPlaneController() {
  const frameRef = useRef<number | null>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hidePlane = () => {
      const clip = clipRef.current;

      if (clip) {
        clip.style.opacity = "0";
      }
    };

    const positionViewportFrame = (
      point: FlightPoint,
      viewportWidth: number,
      viewportHeight: number,
      pageScale: number,
    ) => {
      const clip = clipRef.current;
      const plane = planeRef.current;

      if (!clip || !plane) return;

      clip.style.height = `${viewportHeight / pageScale}px`;
      clip.style.opacity = "1";
      clip.style.transform = "translate3d(0, 0, 0)";
      clip.style.width = `${viewportWidth / pageScale}px`;
      plane.style.transform = `translate3d(${clamp(point.x, 0, viewportWidth) / pageScale}px, ${clamp(point.y, 0, viewportHeight) / pageScale}px, 0) translate(-50%, -50%) rotate(${point.angle}deg) scale(${point.scale})`;
    };

    const positionImageFrame = (
      point: FlightPoint,
      imageRect: DOMRect,
      pageScale: number,
    ) => {
      const clip = clipRef.current;
      const plane = planeRef.current;

      if (!clip || !plane) return;

      const localX = (point.x - imageRect.left) / pageScale;
      const localY = (point.y - imageRect.top) / pageScale;

      clip.style.height = `${imageRect.height / pageScale}px`;
      clip.style.opacity = "1";
      clip.style.transform = `translate3d(${imageRect.left / pageScale}px, ${imageRect.top / pageScale}px, 0)`;
      clip.style.width = `${imageRect.width / pageScale}px`;
      plane.style.transform = `translate3d(${localX}px, ${localY}px, 0) translate(-50%, -50%) rotate(${point.angle}deg) scale(${point.scale})`;
    };

    const updatePlane = () => {
      frameRef.current = null;

      const featured = document.getElementById("featured-trips");
      const about = document.getElementById("about");
      const featuredFlow = featured?.querySelector<HTMLElement>("[data-featured-flow]");
      const imageZone = featured?.querySelector<HTMLElement>("[data-featured-plane-zone]");

      if (!featured || !about || !featuredFlow || !imageZone) {
        hidePlane();
        return;
      }

      const scrollY = window.scrollY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const pageScale = getPageScale();
      const featuredTop = featured.getBoundingClientRect().top + scrollY;
      const featuredBottom = featuredTop + featured.offsetHeight;
      const featuredFlowTop = featuredFlow.getBoundingClientRect().top + scrollY;
      const featuredFlowBottom = featuredFlowTop + featuredFlow.offsetHeight;
      const aboutTop = about.getBoundingClientRect().top + scrollY;
      const aboutBottom = aboutTop + about.offsetHeight;
      const start = featuredTop - viewportHeight * 0.1;
      const imageFlightStart = featuredFlowTop - viewportHeight * 0.08;
      const imageFlightEnd = featuredFlowBottom - viewportHeight * 0.88;
      const end = aboutTop + viewportHeight * 0.18;
      const active =
        scrollY >= start - viewportHeight * 0.08 &&
        scrollY <= aboutBottom - viewportHeight * 0.18;

      if (!active || scrollY > featuredBottom + viewportHeight * 0.75) {
        hidePlane();
        return;
      }

      const imageRect = imageZone.getBoundingClientRect();

      if (scrollY < imageFlightStart || imageRect.top > viewportHeight * 0.06) {
        hidePlane();
        return;
      }

      const landingTarget = about.querySelector<HTMLElement>("[data-plane-landing]");
      const landingRect = landingTarget?.getBoundingClientRect();
      const landingPoint: FlightPoint = landingRect
        ? {
            x: landingRect.left + landingRect.width * 0.52,
            y: landingRect.top + landingRect.height * 0.16,
            scale: 1.05,
            angle: 10,
          }
        : {
            x: viewportWidth * 0.5,
            y: viewportHeight * 0.74,
            scale: 1.05,
            angle: 10,
          };
      const imagePoints: FlightPoint[] = [
        pointInRect(imageRect, 0.68, 0.23, 0.78, -3),
        pointInRect(imageRect, 0.83, 0.3, 0.9, 6),
        pointInRect(imageRect, 0.16, 0.44, 1.04, -6),
        pointInRect(imageRect, 0.76, 0.56, 1.18, 7),
        pointInRect(imageRect, 0.34, 0.74, 1.34, -3),
      ];

      const imageProgress = clamp(
        (scrollY - imageFlightStart) / Math.max(imageFlightEnd - imageFlightStart, 1),
      );
      const landingProgress = clamp(
        (scrollY - imageFlightEnd) / Math.max(end - imageFlightEnd, 1),
      );
      let point: FlightPoint;
      let shouldClipToImage = false;

      if (landingProgress > 0) {
        const lastImagePoint = imagePoints[imagePoints.length - 1];
        const easedLanding = 1 - Math.pow(1 - landingProgress, 3);

        point = mixPoint(lastImagePoint, landingPoint, easedLanding);
      } else {
        const scaledProgress = imageProgress * (imagePoints.length - 1);
        const pointIndex = Math.min(
          Math.floor(scaledProgress),
          imagePoints.length - 2,
        );
        const pointProgress = scaledProgress - pointIndex;
        const easedProgress = 1 - Math.pow(1 - pointProgress, 3);

        shouldClipToImage = true;
        point = mixPoint(imagePoints[pointIndex], imagePoints[pointIndex + 1], easedProgress);
      }

      if (shouldClipToImage) {
        positionImageFrame(point, imageRect, pageScale);
      } else {
        positionViewportFrame(point, viewportWidth, viewportHeight, pageScale);
      }
    };

    const requestUpdate = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updatePlane);
      }
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      document.body.classList.remove("featured-journey-active");

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={clipRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[95] overflow-hidden opacity-0 transition-opacity duration-200 will-change-[height,opacity,transform,width]"
    >
      <div
        ref={planeRef}
        className="absolute left-0 top-0 h-[160px] w-[340px] drop-shadow-[0_22px_30px_rgba(0,0,0,0.5)] will-change-transform"
      >
        <span className="absolute left-9 top-[47%] h-1 w-40 -translate-x-full rounded-full bg-gradient-to-l from-white/54 via-white/20 to-transparent blur-[1px]" />
        <span className="absolute left-9 top-[59%] h-0.5 w-28 -translate-x-full rounded-full bg-gradient-to-l from-white/40 via-white/16 to-transparent blur-[1px]" />
        <Image
          src="/featured-plane-real.webp"
          alt=""
          fill
          sizes="340px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
