"use client";

import type { FC } from "react";
import Image from "next/image";

interface iCardItem {
  title: string;
  description: string;
  tag: string;
  src: string;
  link: string;
  color: string;
  textColor: string;
  actionLabel?: string;
}

interface iCardProps extends iCardItem {
  i: number;
  onSelect?: () => void;
}

const Card: FC<iCardProps> = ({
  title,
  description,
  src,
  link,
  color,
  textColor,
  actionLabel,
  i,
  onSelect,
}) => {
  return (
    <div className="sticky top-0 flex h-[calc(100svh/var(--site-scale))] w-full items-stretch justify-center">
      <article
        className="relative flex h-full w-full overflow-hidden"
        style={{ backgroundColor: color, color: textColor }}
      >
        <Image
          src={src}
          alt={title}
          fill
          priority={i === 0}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/62 via-black/22 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-black/12" />
        <div className="absolute bottom-[clamp(3rem,9vh,6rem)] left-[clamp(1.5rem,8vw,8rem)] right-[clamp(1.5rem,12vw,16rem)] z-10">
          <div className="max-w-[min(58rem,78vw)] text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.48)]">
            <h3
              className="max-w-[15ch] text-balance text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.98] text-white"
              style={{ textTransform: "none" }}
            >
              {title}
            </h3>
            <div className="mt-2 h-px w-full max-w-[min(46rem,78vw)] bg-white/88" />
            {description ? (
              <p className="trip-copy-text mt-6 max-w-[46rem] text-sm leading-6 text-white sm:text-base lg:text-lg lg:leading-7">
                {description}
              </p>
            ) : null}
            {onSelect ? (
              <button
                type="button"
                onClick={onSelect}
                className="trip-meta-text mt-7 inline-flex text-base text-accent transition-colors hover:text-white lg:text-lg"
                style={{ textTransform: "none" }}
              >
                {actionLabel}
              </button>
            ) : (
              <a
                href={link}
                className="trip-meta-text mt-7 inline-flex text-base text-accent transition-colors hover:text-white lg:text-lg"
                style={{ textTransform: "none" }}
              >
                {actionLabel}
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

interface iCardSlideProps {
  items: iCardItem[];
  onItemSelect?: (item: iCardItem, index: number) => void;
}

const CardsParallax: FC<iCardSlideProps> = ({ items, onItemSelect }) => {
  return (
    <div className="min-h-screen">
      {items.map((project, i) => (
        <Card
          key={`${project.title}-${i}`}
          {...project}
          i={i}
          onSelect={
            onItemSelect
              ? () => {
                  onItemSelect(project, i);
                }
              : undefined
          }
        />
      ))}
    </div>
  );
};

export { CardsParallax, type iCardItem };
