"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type FlightDirection = "next" | "previous";
type FlightVariant = "hero" | "compact";
type PlaneAngleKey =
  | "front"
  | "sideLeftToRight"
  | "sideRightToLeft"
  | "diagonalUp"
  | "diagonalDown"
  | "rear"
  | "bankLeft"
  | "bankRight";

type FlyingPlaneTransitionProps = {
  isActive: boolean;
  direction: FlightDirection;
  slideIndex: number;
  planeSrc: string;
  variant?: FlightVariant;
  angleSources?: Partial<Record<PlaneAngleKey, string>>;
};

function pickPlaneSource({
  angleSources,
  direction,
  planeSrc,
}: {
  angleSources?: FlyingPlaneTransitionProps["angleSources"];
  direction: FlightDirection;
  planeSrc: string;
}) {
  if (!angleSources) return planeSrc;

  return direction === "next"
    ? angleSources.diagonalUp ?? angleSources.bankRight ?? angleSources.sideLeftToRight ?? planeSrc
    : angleSources.diagonalDown ?? angleSources.bankLeft ?? angleSources.sideRightToLeft ?? planeSrc;
}

function getPath(direction: FlightDirection, variant: FlightVariant) {
  const compact = variant === "compact";

  if (direction === "previous") {
    return {
      opacity: [0, 1, 1, 0],
      rotate: [8, -9, 6, -14],
      rotateX: [-3, 4, -5, 0],
      rotateY: [-18, 14, -10, 20],
      scale: compact ? [0.44, 0.58, 0.52, 0.36] : [0.54, 0.9, 0.72, 0.42],
      x: ["112vw", "74vw", "36vw", "-22vw"],
      y: ["-10vh", "16vh", "3vh", "46vh"],
    };
  }

  return {
    opacity: [0, 1, 1, 0],
    rotate: [-12, 7, -6, 12],
    rotateX: [3, -4, 5, -2],
    rotateY: [18, -14, 12, -22],
    scale: compact ? [0.42, 0.6, 0.54, 0.38] : [0.5, 0.94, 0.78, 0.44],
    x: ["-22vw", "26vw", "64vw", "112vw"],
    y: ["42vh", "8vh", "18vh", "-12vh"],
  };
}

export function FlyingPlaneTransition({
  angleSources,
  direction,
  isActive,
  planeSrc,
  slideIndex,
  variant = "hero",
}: FlyingPlaneTransitionProps) {
  const reducedMotion = useReducedMotion();
  const selectedPlane = pickPlaneSource({ angleSources, direction, planeSrc });
  const path = getPath(direction, variant);
  const sizeClass =
    variant === "compact"
      ? "h-[86px] w-[188px] sm:h-[112px] sm:w-[244px]"
      : "h-[104px] w-[228px] sm:h-[142px] sm:w-[310px] lg:h-[164px] lg:w-[358px]";

  if (reducedMotion) {
    return null;
  }

  return (
    <AnimatePresence mode="popLayout">
      {isActive ? (
        <motion.div
          key={`${slideIndex}-${direction}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
        >
          <motion.div
            initial={{
              filter: "blur(1.8px) drop-shadow(0 16px 26px rgba(0,0,0,0.34))",
              opacity: 0,
              rotate: path.rotate[0],
              rotateX: path.rotateX[0],
              rotateY: path.rotateY[0],
              scale: path.scale[0],
              x: path.x[0],
              y: path.y[0],
            }}
            animate={{
              filter: [
                "blur(1.4px) drop-shadow(0 16px 26px rgba(0,0,0,0.34))",
                "blur(0px) drop-shadow(0 26px 38px rgba(0,0,0,0.48))",
                "blur(0.25px) drop-shadow(0 22px 34px rgba(0,0,0,0.42))",
                "blur(1.2px) drop-shadow(0 12px 24px rgba(0,0,0,0.28))",
              ],
              opacity: path.opacity,
              rotate: path.rotate,
              rotateX: path.rotateX,
              rotateY: path.rotateY,
              scale: path.scale,
              x: path.x,
              y: path.y,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.75,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.34, 0.72, 1],
            }}
            className={`${sizeClass} relative will-change-transform [transform-style:preserve-3d]`}
          >
            <span className="absolute left-8 top-[48%] h-1 w-36 -translate-x-full rounded-full bg-gradient-to-l from-white/42 via-white/16 to-transparent blur-[1px]" />
            <span className="absolute left-1/2 top-[58%] h-8 w-28 -translate-x-1/2 rounded-full bg-[#d8bb72]/18 blur-2xl" />
            <Image
              src={selectedPlane}
              alt=""
              fill
              sizes="(max-width: 640px) 228px, (max-width: 1024px) 310px, 358px"
              className="object-contain"
              loading="eager"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
