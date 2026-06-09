"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Language } from "@/lib/i18n";

const SOCIALS = [
  { label: "IG", href: "#contact" },
  { label: "FB", href: "#contact" },
  { label: "YT", href: "#contact" },
  { label: "TT", href: "#contact" },
];

const FOOTER_HREFS: Record<string, string> = {
  Mongolia: "#destinations",
  Монгол: "#destinations",
  "Central Asia": "#destinations",
  "Төв Ази": "#destinations",
  Outbound: "#destinations",
  "Гадаад аялал": "#destinations",
  "Custom trips": "#contact",
  "Custom trip": "#contact",
  "Group bookings": "#contact",
  "Групп захиалга": "#contact",
  About: "#about",
  "Бидний тухай": "#about",
  Guides: "#about",
  Хөтөч: "#about",
  Sustainability: "#about",
  "Тогтвортой аялал": "#about",
  Press: "#journal",
  Хэвлэл: "#journal",
  Careers: "#contact",
  Ажил: "#contact",
  FAQ: "#contact",
  "Booking T&Cs": "#contact",
  "Захиалгын нөхцөл": "#contact",
  Insurance: "#contact",
  Даатгал: "#contact",
  Contact: "#contact",
  "Холбоо барих": "#contact",
  Login: "#adventures",
  Нэвтрэх: "#adventures",
};

const TEXT = {
  mn: {
    title: "Аяллын санаа байна уу?",
    accent: "Бидэнд хэлээрэй.",
    subtitle:
      "Та хүссэн аяллынхаа тухай товч бичээрэй. Бид 24 цагийн дотор чиглэл, огноо, ойролцоо үнийн саналтай хариу өгнө.",
    sending: "Илгээж байна...",
    submit: "Төлөвлөж эхлэх",
    success: "Баярлалаа. Таны хүсэлтийг хадгаллаа, бид удахгүй холбогдоно.",
    error: "Одоогоор илгээж чадсангүй. Дахин оролдоно уу.",
    idle: "Спам байхгүй. Зөвхөн хэрэгтэй аяллын санаа.",
    footer:
      "Монгол болон гадаад чиглэлийн жижиг групп аяллууд. Улаанбаатарт бүтээгдэж, аялалдаа дуртай хүмүүс ажиллуулдаг.",
    columns: [
      { title: "Аяллууд", links: ["Монгол", "Төв Ази", "Гадаад аялал", "Custom trip", "Групп захиалга"] },
      { title: "Компани", links: ["Бидний тухай", "Хөтөч", "Тогтвортой аялал", "Хэвлэл", "Ажил"] },
      { title: "Тусламж", links: ["FAQ", "Захиалгын нөхцөл", "Даатгал", "Холбоо барих", "Нэвтрэх"] },
    ],
  },
  en: {
    title: "Got a half-formed dream of a trip?",
    accent: "Tell us about it.",
    subtitle:
      "We build custom adventures too. Send a paragraph, we'll reply within 24 hours with ideas, dates and a rough quote. No bots.",
    sending: "Sending...",
    submit: "Start planning",
    success: "Thanks. We saved your request and will get back to you.",
    error: "Could not send right now. Please try again.",
    idle: "No spam. Just one useful trip idea.",
    footer:
      "Small-group adventures from Mongolia to the rest of the world. Built in Ulaanbaatar, run by people who'd rather be outside.",
    columns: [
      { title: "Adventures", links: ["Mongolia", "Central Asia", "Outbound", "Custom trips", "Group bookings"] },
      { title: "Company", links: ["About", "Guides", "Sustainability", "Press", "Careers"] },
      { title: "Help", links: ["FAQ", "Booking T&Cs", "Insurance", "Contact", "Login"] },
    ],
  },
};

export function CtaFooter({ language }: { language: Language }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const text = TEXT[language];

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
          message: "I want to receive Nomadabe Travel trip planning information.",
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
      <section id="contact" className="relative py-24 lg:py-32 overflow-hidden bg-foreground text-primary-foreground scroll-mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000&q=80&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/85 to-foreground/60" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl tracking-tight text-balance"
          >
            {text.title}
            <br />
            <span className="italic text-accent">{text.accent}</span>
          </motion.h2>
          <p className="mt-6 text-lg text-primary-foreground/75 max-w-2xl mx-auto">
            {text.subtitle}
          </p>
          <form
            className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="flex-1 bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-white/50 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-7 py-4 font-semibold transition-colors whitespace-nowrap"
            >
              {status === "loading" ? text.sending : text.submit}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="mt-4 text-xs text-primary-foreground/50">
            {status === "success"
              ? text.success
              : status === "error"
                ? text.error
                : text.idle}
          </p>
        </div>
      </section>

      <footer className="bg-foreground text-primary-foreground border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="col-span-2">
              <div className="font-display text-3xl mb-4">Nomadabe</div>
              <p className="text-primary-foreground/60 max-w-xs text-sm leading-relaxed">
                {text.footer}
              </p>
              <div className="flex gap-3 mt-6">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold tracking-wider hover:bg-accent hover:border-accent transition-colors"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {text.columns.map((column) => (
              <div key={column.title}>
                <div className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/90">
                  {column.title}
                </div>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
	                      <a
	                        href={FOOTER_HREFS[link] ?? "#contact"}
	                        className="text-sm text-primary-foreground/60 hover:text-accent transition-colors"
	                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between gap-4 text-xs text-primary-foreground/50">
            <div>© {new Date().getFullYear()} Nomadabe LLC · Ulaanbaatar, Mongolia</div>
            <div className="flex gap-6">
              <a href="#contact" className="hover:text-accent">Privacy</a>
              <a href="#contact" className="hover:text-accent">Terms</a>
              <a href="#contact" className="hover:text-accent">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
