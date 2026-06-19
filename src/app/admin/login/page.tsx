import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--primary)] px-5 py-10 text-[var(--foreground)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/nomadabe-hero-panorama.webp')] bg-cover bg-center opacity-25"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/45 via-[var(--primary)]/90 to-[var(--primary)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 text-white">
            <span
              aria-hidden="true"
              className="h-11 w-11 rounded-md bg-black bg-[url('/nomadabe-mark.webp')] bg-center bg-no-repeat shadow-sm ring-1 ring-white/20 [background-position:center_35%] [background-size:175%]"
            />
            <span>
              <span className="block text-xl font-black leading-none text-[var(--accent)]">
                Nomadabe
              </span>
              <span className="mt-1 block text-xs font-bold uppercase text-white/70">Travel</span>
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/15"
          >
            Веб рүү буцах
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_440px]">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)]">
              Удирдлагын төв
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-5xl">
              Бүртгэлтэй админ и-мэйлээр нэвтэрнэ.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
              Нэвтэрсний дараа вебсайт засвар, хөтөлбөр нэмэх/хасах, хэрэглэгчийн
              бүртгэл хянах, мэйл илгээх хэсгүүдийг харна.
            </p>
          </div>
          <AdminLoginForm />
        </section>
      </div>
    </main>
  );
}
