"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Mountain, Users, MapPin, Calendar } from "lucide-react";
import type { Adventure } from "@/lib/adventures";

type Props = {
  adventure: Adventure | null;
  onClose: () => void;
};

export function AdventureModal({ adventure, onClose }: Props) {
  useEffect(() => {
    if (!adventure) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [adventure, onClose]);

  return (
    <AnimatePresence>
      {adventure && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl bg-background rounded-3xl overflow-hidden shadow-2xl my-auto"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-background/90 backdrop-blur text-foreground flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Big image */}
            <div className="relative aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${adventure.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 text-white">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-accent text-accent-foreground">
                    {adventure.difficulty}
                  </span>
                  {adventure.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-white/90 text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-3xl lg:text-5xl leading-tight text-balance max-w-3xl">
                  {adventure.title}
                </h3>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-current" />
                    <strong>{adventure.rating}</strong>
                    <span className="opacity-75">({adventure.reviews} reviews)</span>
                  </span>
                  <span className="flex items-center gap-1.5 opacity-90">
                    <MapPin className="w-4 h-4" />
                    {adventure.location}, {adventure.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 lg:p-10 grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12">
              <div>
                <h4 className="font-display text-xl mb-3">Аяллын тухай</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {adventure.summary}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { icon: Mountain, l: "Хугацаа", v: `${adventure.days} өдөр` },
                    { icon: Users, l: "Групп", v: adventure.groupSize },
                    { icon: Calendar, l: "Явах", v: adventure.nextDeparture ?? "Тохиролцоно" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-2xl border border-border bg-card p-4"
                    >
                      <s.icon className="w-5 h-5 text-accent mb-2" />
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {s.l}
                      </div>
                      <div className="font-semibold text-sm mt-0.5">{s.v}</div>
                    </div>
                  ))}
                </div>

                <h4 className="font-display text-xl mt-8 mb-3">Хэнд тохиромжтой вэ?</h4>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {adventure.idealFor.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span className="text-accent">✓</span>
                      {x}
                    </li>
                  ))}
                </ul>

                <h4 className="font-display text-xl mt-8 mb-3">Багцад багтаж болох зүйлс</h4>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {adventure.includes.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span className="text-accent">✓</span>
                      {x}
                    </li>
                  ))}
                </ul>

                {adventure.businessSupport.length > 0 && (
                  <>
                    <h4 className="font-display text-xl mt-8 mb-3">Бизнес дэмжлэг</h4>
                    <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {adventure.businessSupport.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="text-accent">✓</span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Sticky booking card */}
              <aside className="lg:sticky lg:top-6 rounded-2xl border border-border bg-card p-6 h-fit">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Үнэ</div>
                    <div className="font-display text-4xl">
                      {adventure.price > 0 ? `${adventure.price.toLocaleString()}` : "Санал"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {adventure.price > 0 ? adventure.currency : "дэлгэрэнгүй авах"}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <a
                    href={`#book-${adventure.slug}`}
                    className="block w-full text-center bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6 py-3.5 font-semibold transition-colors"
                  >
                    Бүртгүүлэх
                  </a>
                  <a
                    href={`#enquiry-${adventure.slug}`}
                    className="block w-full text-center border border-foreground/15 hover:border-foreground/40 text-foreground rounded-full px-6 py-3.5 font-semibold transition-colors"
                  >
                    Асуух
                  </a>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Nomadabe Travel баг тантай холбогдож дэлгэрэнгүй мэдээлэл өгнө.
                </p>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
