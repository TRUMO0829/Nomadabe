"use client";

import { type FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail, Phone, UserRound, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

const COPY = {
  mn: {
    title: "Nomadabe Travel-д тавтай морил",
    body:
      "Аяллын санал, хуваарь, хөнгөлөлтийн мэдээллийг түрүүлж авах бол нэвтэрч эсвэл бүртгүүлж болно.",
    login: "Нэвтрэх",
    register: "Бүртгүүлэх",
    name: "Таны нэр",
    email: "И-мэйл",
    phone: "Утас",
    password: "Нууц үг",
    submitLogin: "Нэвтрэх",
    submitRegister: "Бүртгүүлэх",
    guest: "Зочиноор үргэлжлүүлэх",
    close: "Хаах",
    optional: "Заавал бүртгүүлэх шаардлагагүй.",
    success: "Баярлалаа. Та аяллаа үргэлжлүүлэн үзэж болно.",
  },
  en: {
    title: "Welcome to Nomadabe Travel",
    body:
      "Sign in or create an account if you want early trip offers, schedules, and updates.",
    login: "Sign in",
    register: "Register",
    name: "Your name",
    email: "Email",
    phone: "Phone",
    password: "Password",
    submitLogin: "Sign in",
    submitRegister: "Register",
    guest: "Continue as guest",
    close: "Close",
    optional: "Registration is optional.",
    success: "Thanks. You can continue browsing trips.",
  },
} as const;

export function SignupPromptModal() {
  const { locale } = useLanguage();
  const copy = COPY[locale];
  const [open, setOpen] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 px-4 py-8 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
          >
            <button
              type="button"
              aria-label={copy.close}
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-md bg-white/90 text-foreground shadow-sm transition-colors hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="bg-primary px-7 pb-7 pt-14 text-primary-foreground">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <UserRound className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl leading-tight">
                {copy.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">
                {copy.body}
              </p>
            </div>

            <div className="p-7">
              <div className="mb-5 grid grid-cols-2 rounded-lg border border-border bg-background p-1">
                {[
                  { key: "login", label: copy.login },
                  { key: "register", label: copy.register },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setMode(item.key as "login" | "register");
                      setSubmitted(false);
                    }}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-bold transition-colors",
                      mode === item.key
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                {mode === "register" && (
                  <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
                    <UserRound className="h-4 w-4 text-accent" />
                    <input
                      name="name"
                      placeholder={copy.name}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </label>
                )}
                <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
                  <Mail className="h-4 w-4 text-accent" />
                  <input
                    name="email"
                    type="email"
                    placeholder={copy.email}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </label>
                {mode === "register" && (
                  <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
                    <Phone className="h-4 w-4 text-accent" />
                    <input
                      name="phone"
                      placeholder={copy.phone}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </label>
                )}
                <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
                  <LockKeyhole className="h-4 w-4 text-accent" />
                  <input
                    name="password"
                    type="password"
                    placeholder={copy.password}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </label>

                <button className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3.5 text-sm font-bold text-accent-foreground transition-colors hover:bg-secondary">
                  {mode === "login" ? copy.submitLogin : copy.submitRegister}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 w-full rounded-md border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-accent"
              >
                {copy.guest}
              </button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                {submitted ? copy.success : copy.optional}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
