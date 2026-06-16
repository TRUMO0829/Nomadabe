"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

function createFlightPath(width: number, height: number, isMobile: boolean) {
  if (isMobile) {
    return [
      `M ${width * 0.6} ${height * 0.32}`,
      `C ${width * 0.74} ${height * 0.38}, ${width * 0.26} ${height * 0.5}, ${width * 0.52} ${height * 0.64}`,
      `C ${width * 0.78} ${height * 0.78}, ${width * 0.46} ${height * 0.82}, ${width * 0.52} ${height * 0.76}`,
    ].join(" ");
  }

  // Adjust these viewport-relative points to tune the route through the trip photos.
  // The first two featured trips keep the image on the left; later trips swap sides.
  return [
    `M ${width * 0.34} ${height * 0.3}`,
    `C ${width * 0.45} ${height * 0.24}, ${width * 0.2} ${height * 0.42}, ${width * 0.32} ${height * 0.58}`,
    `C ${width * 0.45} ${height * 0.76}, ${width * 0.72} ${height * 0.46}, ${width * 0.66} ${height * 0.63}`,
    `C ${width * 0.62} ${height * 0.76}, ${width * 0.53} ${height * 0.8}, ${width * 0.5} ${height * 0.73}`,
  ].join(" ");
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

function getPlaneViewportSpace() {
  const pageScale = getPageScale();

  return {
    height: window.innerHeight / pageScale,
    pageScale,
    width: window.innerWidth / pageScale,
  };
}

function setStaticPlanePosition(plane: HTMLDivElement) {
  const { width, height } = getPlaneViewportSpace();

  plane.style.transform = `translate3d(${width * 0.34}px, ${height * 0.3}px, 0) translate(-50%, -50%) rotate(-7deg) scale(${window.innerWidth < 768 ? 0.58 : 0.82})`;
}

export function AirplaneScrollAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const planeBodyRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    async function setupAnimation() {
      const [{ gsap }, { ScrollTrigger }, { MotionPathPlugin }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("gsap/MotionPathPlugin"),
        ]);

      if (cancelled) return;

      const root = rootRef.current;
      const svg = svgRef.current;
      const plane = planeRef.current;
      const planeBody = planeBodyRef.current;
      const path = pathRef.current;
      const trips = document.getElementById("trips");
      const about = document.getElementById("about");
      const featuredFlow = document.querySelector<HTMLElement>("[data-featured-flow]");
      const triggerElement = featuredFlow ?? trips;

      if (!root || !svg || !plane || !planeBody || !path || !trips || !about) return;

      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

      const setPath = () => {
        const { width, height } = getPlaneViewportSpace();

        root.style.height = `${height}px`;
        root.style.width = `${width}px`;
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        path.setAttribute("d", createFlightPath(width, height, window.innerWidth < 768));
      };

      setPath();

      const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

      if (reducedMotionQuery.matches) {
        const onReducedResize = () => setStaticPlanePosition(plane);

        gsap.set(root, { autoAlpha: 1 });
        setStaticPlanePosition(plane);

        window.addEventListener("resize", onReducedResize);
        cleanup = () => {
          window.removeEventListener("resize", onReducedResize);
        };
        return;
      }

      const onResize = () => {
        setPath();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", onResize);

      gsap.set(root, { autoAlpha: 0 });
      gsap.set(plane, {
        xPercent: -50,
        yPercent: -50,
        willChange: "transform",
      });
      gsap.set(planeBody, {
        rotate: -7,
        scale: window.innerWidth < 768 ? 0.58 : 0.82,
        transformOrigin: "50% 50%",
        transformPerspective: 900,
        willChange: "transform, filter",
      });

      const matchMedia = gsap.matchMedia();
      let aboutExit: ReturnType<typeof gsap.timeline> | undefined;

      matchMedia.add("(min-width: 768px)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: "top top+=112",
            endTrigger: about,
            end: "top center",
            scrub: 2.15,
            invalidateOnRefresh: true,
            onEnter: () => gsap.to(root, { autoAlpha: 1, duration: 0.32 }),
            onEnterBack: () => gsap.to(root, { autoAlpha: 1, duration: 0.32 }),
            onLeave: () => gsap.to(root, { autoAlpha: 1, duration: 0.2 }),
            onLeaveBack: () => gsap.to(root, { autoAlpha: 0, duration: 0.18 }),
          },
        });

        aboutExit = gsap.timeline({
          scrollTrigger: {
            trigger: about,
            start: "top center",
            end: "bottom center",
            scrub: 1.6,
            invalidateOnRefresh: true,
            onEnter: () => gsap.to(root, { autoAlpha: 1, duration: 0.2 }),
            onEnterBack: () => gsap.to(root, { autoAlpha: 1, duration: 0.2 }),
            onLeave: () => gsap.to(root, { autoAlpha: 0, duration: 0.18 }),
          },
        });
        aboutExit.fromTo(
          plane,
          {
            x: () => getPlaneViewportSpace().width * 0.5,
            y: () => getPlaneViewportSpace().height * 0.73,
          },
          {
            duration: 1,
            ease: "power2.in",
            x: () => getPlaneViewportSpace().width * 1.18,
            y: () => getPlaneViewportSpace().height * 0.44,
          },
          0,
        );
        aboutExit.to(
          planeBody,
          {
            duration: 1,
            ease: "none",
            filter: "blur(0.65px) drop-shadow(0 22px 34px rgba(0,0,0,0.42))",
            rotate: 12,
            rotationX: -6,
            rotationY: 18,
            scale: 0.62,
          },
          0,
        );
        aboutExit.to(root, { autoAlpha: 0, duration: 0.2, ease: "power1.out" }, 0.82);

        timeline.to(
          plane,
          {
            duration: 1,
            ease: "none",
            motionPath: {
              align: path,
              alignOrigin: [0.5, 0.5],
              path,
            },
          },
          0,
        );
        timeline.to(
          planeBody,
          {
            duration: 1,
            ease: "none",
            keyframes: [
              { filter: "blur(0px) drop-shadow(0 20px 30px rgba(0,0,0,0.48))", rotate: -7, rotationX: 2, rotationY: -10, scale: 0.76 },
              { filter: "blur(0.25px) drop-shadow(0 24px 34px rgba(0,0,0,0.52))", rotate: 10, rotationX: -4, rotationY: 14, scale: 0.94 },
              { filter: "blur(0.1px) drop-shadow(0 28px 38px rgba(0,0,0,0.58))", rotate: -8, rotationX: 5, rotationY: -16, scale: 1.04 },
              { filter: "blur(0px) drop-shadow(0 18px 28px rgba(0,0,0,0.5))", rotate: 2, rotationX: 0, rotationY: 8, scale: 0.84 },
            ],
          },
          0,
        );

        return () => {
          timeline.kill();
          aboutExit?.kill();
        };
      });

      matchMedia.add("(max-width: 767px)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: "top top+=84",
            endTrigger: about,
            end: "top center",
            scrub: 2.2,
            invalidateOnRefresh: true,
            onEnter: () => gsap.to(root, { autoAlpha: 1, duration: 0.2 }),
            onEnterBack: () => gsap.to(root, { autoAlpha: 1, duration: 0.2 }),
            onLeave: () => gsap.to(root, { autoAlpha: 1, duration: 0.18 }),
            onLeaveBack: () => gsap.to(root, { autoAlpha: 0, duration: 0.15 }),
          },
        });

        aboutExit = gsap.timeline({
          scrollTrigger: {
            trigger: about,
            start: "top center",
            end: "bottom center",
            scrub: 1.8,
            invalidateOnRefresh: true,
            onEnter: () => gsap.to(root, { autoAlpha: 1, duration: 0.18 }),
            onEnterBack: () => gsap.to(root, { autoAlpha: 1, duration: 0.18 }),
            onLeave: () => gsap.to(root, { autoAlpha: 0, duration: 0.16 }),
          },
        });
        aboutExit.fromTo(
          plane,
          {
            x: () => getPlaneViewportSpace().width * 0.52,
            y: () => getPlaneViewportSpace().height * 0.76,
          },
          {
            duration: 1,
            ease: "power2.in",
            x: () => getPlaneViewportSpace().width * 1.16,
            y: () => getPlaneViewportSpace().height * 0.52,
          },
          0,
        );
        aboutExit.to(
          planeBody,
          {
            duration: 1,
            ease: "none",
            filter: "blur(0.45px) drop-shadow(0 18px 28px rgba(0,0,0,0.42))",
            rotate: 10,
            rotationX: -4,
            rotationY: 14,
            scale: 0.44,
          },
          0,
        );
        aboutExit.to(root, { autoAlpha: 0, duration: 0.18, ease: "power1.out" }, 0.78);

        timeline.to(
          plane,
          {
            duration: 1,
            ease: "none",
            motionPath: {
              align: path,
              alignOrigin: [0.5, 0.5],
              path,
            },
          },
          0,
        );
        timeline.to(
          planeBody,
          {
            duration: 1,
            ease: "none",
            keyframes: [
              { rotate: -7, rotationX: 2, rotationY: -8, scale: 0.5 },
              { rotate: 8, rotationX: -3, rotationY: 11, scale: 0.62 },
              { rotate: 1, rotationX: 0, rotationY: 6, scale: 0.56 },
            ],
          },
          0,
        );

        return () => {
          timeline.kill();
          aboutExit?.kill();
        };
      });

      ScrollTrigger.refresh();

      cleanup = () => {
        matchMedia.revert();
        window.removeEventListener("resize", onResize);
      };
    }

    setupAnimation();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] opacity-0"
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <path ref={pathRef} d="" fill="none" stroke="transparent" />
      </svg>

      <div
        ref={planeRef}
        className="absolute left-0 top-0 h-[96px] w-[210px] sm:h-[128px] sm:w-[280px] lg:h-[154px] lg:w-[336px]"
      >
        <div ref={planeBodyRef} className="relative h-full w-full [transform-style:preserve-3d]">
          <span className="absolute left-8 top-[47%] h-1 w-32 -translate-x-full rounded-full bg-gradient-to-l from-white/50 via-white/18 to-transparent blur-[1px] sm:w-44" />
          <span className="absolute left-8 top-[58%] h-0.5 w-24 -translate-x-full rounded-full bg-gradient-to-l from-[#fff8ea]/38 via-white/14 to-transparent blur-[1px] sm:w-32" />
          <span className="absolute left-1/2 top-[58%] h-7 w-24 -translate-x-1/2 rounded-full bg-[#d8bb72]/22 blur-2xl sm:w-36" />
          <Image
            src="/airplanes/plane-diagonal-up.webp"
            alt=""
            fill
            sizes="(max-width: 640px) 210px, (max-width: 1024px) 280px, 336px"
            className="object-contain"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
