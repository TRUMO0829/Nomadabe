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

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

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
      setMessage(
        result.data?.devCode
          ? `Код илгээгдлээ. Dev code: ${result.data.devCode}`
          : "Нэвтрэх код и-мэйл рүү илгээгдлээ."
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Код илгээж чадсангүй.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

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

      window.location.href = "/admin";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Нэвтрэлт амжилтгүй боллоо.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-2xl">
      <div className="bg-[var(--primary)] px-7 py-8 text-white">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-foreground)]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)]">
          Nomadabe Admin
        </p>
        <h1 className="mt-2 font-display text-4xl leading-none">Админ нэвтрэх</h1>
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
              <span className="mt-2 flex items-center gap-3 rounded-md border border-[var(--border)] px-4 py-3">
                <Mail className="h-4 w-4 text-[var(--accent-foreground)]" />
                <input
                  type="email"
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
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-black text-[var(--accent-foreground)] transition-colors hover:bg-[var(--secondary)] disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Код авах
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={verifyCode}>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                6 оронтой код
              </span>
              <span className="mt-2 flex items-center gap-3 rounded-md border border-[var(--border)] px-4 py-3">
                <LockKeyhole className="h-4 w-4 text-[var(--accent-foreground)]" />
                <input
                  inputMode="numeric"
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
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-black text-[var(--accent-foreground)] transition-colors hover:bg-[var(--secondary)] disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Нэвтрэх
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setMessage("");
              }}
              className="w-full rounded-md border border-[var(--border)] px-4 py-3 text-sm font-bold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
            >
              И-мэйл солих
            </button>
          </form>
        )}

        {message ? (
          <p className="mt-4 rounded-md bg-[var(--muted)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
