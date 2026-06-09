"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "./language-provider";

const SOCIALS = [
  { label: "IG", href: "#" },
  { label: "FB", href: "#" },
  { label: "YT", href: "#" },
  { label: "TT", href: "#" },
];

type CtaFooterProps = {
  showPlanningSection?: boolean;
};

export function CtaFooter({ showPlanningSection = false }: CtaFooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const { locale, t } = useLanguage();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Website visitor",
          email,
          inquiryType: "general",
          message:
            locale === "mn"
              ? "Nomadabe Travel-ийн аяллын төлөвлөлтийн мэдээлэл авах хүсэлтэй байна."
              : "I want to receive Nomadabe Travel trip planning information.",
        }),
      });

      if (response.ok) {
        setEmail("");
        setStatus("success");
        return;
      }
    } catch {
      setStatus("error");
      return;
    }

    setStatus("error");
  }

  return (
    <>
      {showPlanningSection && (
        <section
          id="contact"
          className="relative overflow-hidden bg-primary px-6 pb-24 pt-32 text-primary-foreground lg:px-10 lg:pb-32 lg:pt-40"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000&q=80&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/85 to-primary/60" />

          <div className="relative mx-auto max-w-5xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-4xl text-balance sm:text-5xl lg:text-7xl"
            >
              {t.cta.headingLine1}
              <br />
              <span className="italic text-accent">{t.cta.headingLine2}</span>
            </motion.h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/75 lg:text-lg">
              {t.cta.body}
            </p>

            <form
              className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder={t.cta.placeholder}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-6 py-4 text-white placeholder:text-white/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-accent px-7 py-4 font-semibold text-accent-foreground transition-colors hover:bg-secondary disabled:cursor-wait disabled:opacity-70"
              >
                {status === "loading" ? t.cta.loading : t.cta.button}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-4 text-xs text-primary-foreground/60">
              {status === "success"
                ? t.cta.success
                : status === "error"
                  ? t.cta.error
                  : t.cta.idle}
            </p>
          </div>
        </section>
      )}

      <footer className="border-t border-white/10 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid grid-cols-2 gap-10 lg:grid-cols-5">
            <div className="col-span-2">
              <div className="mb-4 font-display text-3xl">Nomadabe</div>
              <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/65">
                {t.footer.description}
              </p>
              <div className="mt-6 flex gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-xs font-bold tracking-wider transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {t.footer.columns.map((column) => (
              <div key={column.title}>
                <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
                  {column.title}
                </div>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-primary-foreground/65 transition-colors hover:text-accent"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs text-primary-foreground/55 lg:flex-row">
            <div>
              © {new Date().getFullYear()} {t.footer.copyright}
            </div>
            <div className="flex gap-6">
              {t.footer.legal.map((link) => (
                <a key={link} href="#" className="hover:text-accent">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
