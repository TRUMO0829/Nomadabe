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
  tag,
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/26 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-7xl p-6 pb-10 sm:p-8 sm:pb-14 lg:p-10 lg:pb-16">
            {tag ? (
              <div className="mb-4 inline-flex rounded-md bg-accent px-3 py-1.5 text-xs font-black uppercase text-accent-foreground">
                {tag}
              </div>
            ) : null}
            <h3 className="max-w-4xl text-balance text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
              {title}
            </h3>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/84 sm:text-lg">
              {description}
            </p>
            {onSelect ? (
              <button
                type="button"
                onClick={onSelect}
                className="mt-6 inline-flex rounded-md bg-white px-5 py-3 text-sm font-black text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {actionLabel}
              </button>
            ) : (
              <a
                href={link}
                className="mt-6 inline-flex rounded-md bg-white px-5 py-3 text-sm font-black text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
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
