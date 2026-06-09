"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MapPin, Mountain, Star, Users, X } from "lucide-react";
import type { Adventure } from "@/lib/adventures";

type Props = {
  adventure: Adventure | null;
  onClose: () => void;
};

type Customer = {
  id: string;
  email?: string;
  phone?: string;
};

export function AdventureModal({ adventure, onClose }: Props) {
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [authStatus, setAuthStatus] = useState<"idle" | "sending" | "sent" | "verifying" | "verified" | "error">("idle");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCustomer() {
      try {
        const response = await fetch("/api/auth/me");
        const result = (await response.json()) as { data?: { customer?: Customer | null } };

        if (mounted) {
          setCustomer(result.data?.customer ?? null);
        }
      } catch {
        if (mounted) {
          setCustomer(null);
        }
      }
    }

    if (adventure) {
      void loadCustomer();
    }

    return () => {
      mounted = false;
    };
  }, [adventure]);

  async function handleRequestCode() {
    setAuthStatus("sending");
    setAuthMessage("");

    try {
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: authIdentifier }),
      });
      const result = (await response.json()) as {
        ok: boolean;
        data?: { delivery: "email" | "phone"; devCode?: string };
        error?: { message: string };
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message ?? "Could not send code.");
      }

      setAuthStatus("sent");
      setAuthMessage(
        result.data?.devCode
          ? `Туршилтын код: ${result.data.devCode}`
          : result.data?.delivery === "email"
            ? "Кодыг таны имэйл рүү илгээлээ."
            : "Кодыг таны утас руу илгээлээ."
      );
    } catch (error) {
      setAuthStatus("error");
      setAuthMessage(error instanceof Error ? error.message : "Код илгээхэд алдаа гарлаа.");
    }
  }

  async function handleVerifyCode() {
    setAuthStatus("verifying");
    setAuthMessage("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: authIdentifier, code: authCode }),
      });
      const result = (await response.json()) as {
        ok: boolean;
        data?: { customer: Customer };
        error?: { message: string };
      };

      if (!response.ok || !result.ok || !result.data?.customer) {
        throw new Error(result.error?.message ?? "Could not verify code.");
      }

      setCustomer(result.data.customer);
      setAuthStatus("verified");
      setAuthMessage("Нэвтрэлт амжилттай. Одоо захиалгаа илгээнэ үү.");
    } catch (error) {
      setAuthStatus("error");
      setAuthMessage(error instanceof Error ? error.message : "Код баталгаажуулахад алдаа гарлаа.");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setCustomer(null);
    setAuthStatus("idle");
    setAuthCode("");
    setAuthMessage("");
  }

  async function handleBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adventure) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setBookingStatus("loading");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripSlug: adventure.slug,
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          travelers: Number(formData.get("travelers") ?? 1),
          preferredDate: String(formData.get("preferredDate") ?? ""),
          message: String(formData.get("message") ?? ""),
        }),
      });

      if (response.ok) {
        event.currentTarget.reset();
        setBookingStatus("success");
        return;
      }
    } catch {
      setBookingStatus("error");
      return;
    }

    setBookingStatus("error");
  }

  return (
    <AnimatePresence>
      {adventure ? (
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
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-6xl bg-background rounded-3xl overflow-hidden shadow-2xl my-auto"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-background/90 backdrop-blur text-foreground flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

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
                  {adventure.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-white/90 text-foreground"
                    >
                      {tag}
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
                    <span className="opacity-75">({adventure.reviews})</span>
                  </span>
                  <span className="flex items-center gap-1.5 opacity-90">
                    <MapPin className="w-4 h-4" />
                    {adventure.location}, {adventure.country}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-10 grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12">
              <div>
                <h4 className="font-display text-xl mb-3">Аяллын тухай</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {adventure.summary}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { icon: Mountain, label: "Хугацаа", value: `${adventure.days} өдөр` },
                    { icon: Users, label: "Групп", value: adventure.groupSize },
                    { icon: Calendar, label: "Явах", value: adventure.nextDeparture ?? "Тохиролцоно" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-border bg-card p-4">
                      <item.icon className="w-5 h-5 text-accent mb-2" />
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="font-semibold text-sm mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>

                <InfoList title="Хэнд тохиромжтой вэ?" items={adventure.idealFor} />
                <InfoList title="Багцад багтаж болох зүйлс" items={adventure.includes} />
                {adventure.businessSupport.length > 0 ? (
                  <InfoList title="Бизнес дэмжлэг" items={adventure.businessSupport} />
                ) : null}
              </div>

              <aside className="lg:sticky lg:top-6 rounded-2xl border border-border bg-card p-6 h-fit">
                <div className="text-xs text-muted-foreground">Үнэ</div>
                <div className="font-display text-4xl">
                  {adventure.price > 0 ? adventure.price.toLocaleString() : "Санал"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {adventure.price > 0 ? adventure.currency : "дэлгэрэнгүй авах"}
                </div>

                <form className="mt-6 space-y-3" onSubmit={handleBookingSubmit}>
                  <input
                    name="name"
                    required
                    placeholder="Нэр"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
                  />
                  {customer ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                      <div className="font-semibold">Нэвтэрсэн</div>
                      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                        <span>{customer.email ?? customer.phone}</span>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-950"
                        >
                          Солих
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-border bg-background p-3">
                      <div className="text-sm font-semibold">Имэйл эсвэл утсаар нэвтрэх</div>
                      <div className="mt-3 space-y-2">
                        <input
                          value={authIdentifier}
                          onChange={(event) => setAuthIdentifier(event.target.value)}
                          placeholder="example@gmail.com эсвэл 99112233"
                          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                        />
                        <button
                          type="button"
                          onClick={handleRequestCode}
                          disabled={authStatus === "sending"}
                          className="w-full rounded-xl bg-foreground px-3 py-2 text-sm font-semibold text-background disabled:opacity-70"
                        >
                          {authStatus === "sending" ? "Илгээж байна..." : "Код авах"}
                        </button>
                      </div>
                      {authStatus === "sent" || authStatus === "error" || authMessage ? (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-muted-foreground">{authMessage}</p>
                          <input
                            value={authCode}
                            onChange={(event) => setAuthCode(event.target.value)}
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="6 оронтой код"
                            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyCode}
                            disabled={authStatus === "verifying"}
                            className="w-full rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-70"
                          >
                            {authStatus === "verifying" ? "Шалгаж байна..." : "Нэвтрэх"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                  <input
                    name="email"
                    type="email"
                    placeholder="Нэмэлт имэйл"
                    defaultValue={customer?.email ?? ""}
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    name="phone"
                    placeholder="Нэмэлт утас"
                    defaultValue={customer?.phone ?? ""}
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="travelers"
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      name="preferredDate"
                      placeholder="2026-10"
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <textarea
                    name="message"
                    required
                    defaultValue={`I want to book ${adventure.title}.`}
                    className="min-h-24 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    disabled={bookingStatus === "loading" || !customer}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6 py-3.5 font-semibold transition-colors disabled:opacity-70"
                  >
                    {bookingStatus === "loading"
                      ? "Илгээж байна..."
                      : customer
                        ? "Бүртгүүлэх"
                        : "Эхлээд нэвтэрнэ үү"}
                  </button>
                </form>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  {bookingStatus === "success"
                    ? "Бүртгэл хадгалагдлаа. Nomadabe Travel баг тантай холбогдоно."
                    : bookingStatus === "error"
                      ? "Бүртгэл илгээхэд алдаа гарлаа. Дахин оролдоно уу."
                      : "Nomadabe Travel баг тантай холбогдож дэлгэрэнгүй мэдээлэл өгнө."}
                </p>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <>
      <h4 className="font-display text-xl mt-8 mb-3">{title}</h4>
      <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-accent">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
