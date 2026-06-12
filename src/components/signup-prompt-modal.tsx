"use client";

import { type FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail, UserRound, X } from "lucide-react";
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
    password: "Нууц үг",
    submitLogin: "Нэвтрэх",
    submitRegister: "Бүртгүүлэх",
    guest: "Зочиноор үргэлжлүүлэх",
    close: "Хаах",
    optional: "Заавал бүртгүүлэх шаардлагагүй.",
    success: "Баярлалаа. Та аяллаа үргэлжлүүлэн үзэж болно.",
    codeSent: "Амжилттай нэвтэрлээ.",
    verificationSent: "Баталгаажуулах холбоос таны и-мэйл рүү илгээгдлээ.",
    error: "Илгээж чадсангүй. Мэдээллээ шалгаад дахин оролдоно уу.",
  },
  en: {
    title: "Welcome to Nomadabe Travel",
    body:
      "Sign in or create an account if you want early trip offers, schedules, and updates.",
    login: "Sign in",
    register: "Register",
    name: "Your name",
    email: "Email",
    password: "Password",
    submitLogin: "Sign in",
    submitRegister: "Register",
    guest: "Continue as guest",
    close: "Close",
    optional: "Registration is optional.",
    success: "Thanks. You can continue browsing trips.",
    codeSent: "Signed in successfully.",
    verificationSent: "A verification link has been sent to your email.",
    error: "Could not send. Please check your details and try again.",
  },
  zh: {
    title: "欢迎来到 Nomadabe Travel",
    body:
      "如果想优先获取旅行优惠、出发日期和更新，可以登录或创建账户。",
    login: "登录",
    register: "注册",
    name: "您的姓名",
    email: "邮箱",
    password: "密码",
    submitLogin: "登录",
    submitRegister: "注册",
    guest: "以访客身份继续",
    close: "关闭",
    optional: "注册不是必需的。",
    success: "谢谢。您可以继续浏览旅行。",
    codeSent: "登录成功。",
    verificationSent: "验证链接已发送到您的邮箱。",
    error: "无法发送。请检查您的信息后重试。",
  },
  ja: {
    title: "Nomadabe Travel へようこそ",
    body:
      "旅行オファー、日程、最新情報を早めに受け取りたい場合は、ログインまたは登録できます。",
    login: "ログイン",
    register: "登録",
    name: "お名前",
    email: "メール",
    password: "パスワード",
    submitLogin: "ログイン",
    submitRegister: "登録",
    guest: "ゲストとして続ける",
    close: "閉じる",
    optional: "登録は必須ではありません。",
    success: "ありがとうございます。引き続きツアーをご覧いただけます。",
    codeSent: "ログインしました。",
    verificationSent: "確認リンクをメールに送信しました。",
    error: "送信できませんでした。入力内容を確認してもう一度お試しください。",
  },
  ko: {
    title: "Nomadabe Travel에 오신 것을 환영합니다",
    body:
      "여행 혜택, 일정, 업데이트를 먼저 받고 싶다면 로그인하거나 계정을 만들 수 있습니다.",
    login: "로그인",
    register: "회원가입",
    name: "이름",
    email: "이메일",
    password: "비밀번호",
    submitLogin: "로그인",
    submitRegister: "회원가입",
    guest: "게스트로 계속하기",
    close: "닫기",
    optional: "가입은 필수가 아닙니다.",
    success: "감사합니다. 계속 여행을 둘러보실 수 있습니다.",
    codeSent: "로그인되었습니다.",
    verificationSent: "인증 링크를 이메일로 보냈습니다.",
    error: "전송할 수 없습니다. 정보를 확인한 뒤 다시 시도해 주세요.",
  },
} as const;

let hasShownSignupPrompt = false;
const OPEN_SIGNUP_PROMPT_EVENT = "nomadabe:open-signup-prompt";

type SignupPromptModalProps = {
  autoOpen?: boolean;
};

export function SignupPromptModal({ autoOpen = true }: SignupPromptModalProps) {
  const { contentLocale } = useLanguage();
  const copy = COPY[contentLocale];
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleOpenPrompt() {
      hasShownSignupPrompt = true;
      setOpen(true);
    }

    window.addEventListener(OPEN_SIGNUP_PROMPT_EVENT, handleOpenPrompt);

    if (hasShownSignupPrompt || !autoOpen) {
      return () => {
        window.removeEventListener(OPEN_SIGNUP_PROMPT_EVENT, handleOpenPrompt);
      };
    }

    const timerId = window.setTimeout(() => {
      hasShownSignupPrompt = true;
      setOpen(true);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener(OPEN_SIGNUP_PROMPT_EVENT, handleOpenPrompt);
    };
  }, [autoOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch(mode === "register" ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        data?: { emailVerificationRequired?: boolean };
        error?: { message?: string };
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message ?? copy.error);
      }

      setSubmitted(true);
      setMessage(
        mode === "register" && result.data?.emailVerificationRequired
          ? copy.verificationSent
          : copy.codeSent
      );
    } catch (error) {
      setSubmitted(false);
      setMessage(error instanceof Error ? error.message : copy.error);
    } finally {
      setLoading(false);
    }
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
                      setMessage("");
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
                <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
                  <LockKeyhole className="h-4 w-4 text-accent" />
                  <input
                    name="password"
                    type="password"
                    placeholder={copy.password}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </label>

                <button
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3.5 text-sm font-bold text-accent-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "..." : mode === "login" ? copy.submitLogin : copy.submitRegister}
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
                {message || (submitted ? copy.success : copy.optional)}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
