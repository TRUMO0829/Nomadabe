"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

type ApiResult = {
  ok?: boolean;
  data?: {
    devCode?: string;
  };
  error?: {
    message?: string;
  };
};

type Message = { tone: "info" | "error"; text: string } | null;

const FIELD_WRAPPER_CLASS =
  "mt-2 flex items-center gap-3 rounded-md border border-[var(--border)] px-4 py-3 focus-within:border-[var(--foreground)] focus-within:ring-2 focus-within:ring-[var(--foreground)]";
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2";

/** Where to go after login: the admin page the middleware bounced us from. */
function getNextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin";
}

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState<Message>(null);
  const [loading, setLoading] = useState(false);

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as ApiResult;

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || "Код илгээж чадсангүй.");
      }

      setStep("code");
      setMessage({
        tone: "info",
        text: result.data?.devCode
          ? `Код илгээгдлээ. Туршилтын горимын код: ${result.data.devCode}`
          : "Нэвтрэх код и-мэйл рүү илгээгдлээ.",
      });
    } catch (error) {
      setMessage({ tone: "error", text: error instanceof Error ? error.message : "Код илгээж чадсангүй." });
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const result = (await response.json()) as ApiResult;

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || "Нэвтрэлт амжилтгүй боллоо.");
      }

      window.location.href = getNextPath();
    } catch (error) {
      setMessage({ tone: "error", text: error instanceof Error ? error.message : "Нэвтрэлт амжилтгүй боллоо." });
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-2xl">
      <div className="bg-[var(--primary)] px-7 py-8 text-white">
        <div aria-hidden="true" className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-foreground)]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)]">
          Nomadabe админ
        </p>
        <h2 className="mt-2 font-display text-4xl leading-none">Админ нэвтрэх</h2>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Зөвшөөрөгдсөн админ и-мэйлээр код авч вебсайт, хөтөлбөр, хэрэглэгчийн
          бүртгэлээ удирдана.
        </p>
      </div>

      <div className="p-7">
        {step === "email" ? (
          <form className="space-y-4" onSubmit={requestCode}>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                Админ и-мэйл
              </span>
              <span className={FIELD_WRAPPER_CLASS}>
                <Mail aria-hidden="true" className="h-4 w-4 text-[var(--accent-foreground)]" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@nomadabe.mn"
                  required
                  className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--muted-foreground)]"
                />
              </span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-black text-[var(--accent-foreground)] transition-colors hover:bg-[var(--secondary)] disabled:opacity-70 ${FOCUS_RING}`}
            >
              {loading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
              {loading ? "Илгээж байна…" : "Код авах"}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={verifyCode}>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                6 оронтой код
              </span>
              <span className={FIELD_WRAPPER_CLASS}>
                <LockKeyhole aria-hidden="true" className="h-4 w-4 text-[var(--accent-foreground)]" />
                <input
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  required
                  className="w-full bg-transparent text-sm font-semibold tracking-[0.25em] outline-none placeholder:tracking-normal placeholder:text-[var(--muted-foreground)]"
                />
              </span>
            </label>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-black text-[var(--accent-foreground)] transition-colors hover:bg-[var(--secondary)] disabled:opacity-70 ${FOCUS_RING}`}
            >
              {loading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ShieldCheck aria-hidden="true" className="h-4 w-4" />}
              {loading ? "Шалгаж байна…" : "Нэвтрэх"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setMessage(null);
              }}
              className={`w-full rounded-md border border-[var(--border)] px-4 py-3 text-sm font-bold text-[var(--foreground)] transition-colors hover:border-[var(--foreground)] ${FOCUS_RING}`}
            >
              И-мэйл солих
            </button>
          </form>
        )}

        {/* Always rendered so screen readers announce the message when it appears. */}
        <div aria-live="polite" role="status" className="mt-4 empty:hidden">
          {message ? (
            <p
              className={`rounded-md px-4 py-3 text-sm font-semibold ${
                message.tone === "error" ? "bg-red-50 text-red-800" : "bg-[var(--muted)] text-[var(--foreground)]"
              }`}
            >
              {message.tone === "error" ? <span className="sr-only">Алдаа: </span> : null}
              {message.text}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
