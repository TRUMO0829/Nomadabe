"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatResponse = {
  ok?: boolean;
  data?: {
    reply?: string;
  };
  error?: {
    message?: string;
  };
};

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Сайн байна уу? Би Nomadabe Travel-ийн AI туслах. Аяллын чиглэл, хугацаа, төсөв, хүмүүсийн тоогоо хэлбэл танд тохирох төлөвлөгөө санал болгоё.",
};

const QUICK_PROMPTS = [
  "Гэр бүлээрээ 5 өдөр Монголд аялах төлөвлөгөө гарга",
  "Expo бизнес аялалд юу бэлдэх вэ?",
  "Говь руу анх удаа явахад зөвлөгөө өгөөч",
];

export function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, open]);

  async function sendMessage(content: string) {
    const text = content.trim();
    if (!text || loading) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const result = (await response.json()) as ChatResponse;

      if (!response.ok || !result.ok || !result.data?.reply) {
        throw new Error(result.error?.message || "AI туслах түр хариулах боломжгүй байна.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.data?.reply ?? "" },
      ]);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "AI туслахтай холбогдож чадсангүй.";
      setError(message);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Уучлаарай, яг одоо холболт амжилтгүй боллоо. Та дахин оролдоно уу эсвэл аяллын багтай шууд холбогдоорой.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-4 z-[110] flex flex-col items-end gap-3 sm:right-6">
      {open && (
        <section
          aria-label="AI туслах чатбот"
          className="w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border bg-card shadow-2xl sm:w-[390px]"
        >
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-black">AI туслах чатбот</h2>
                <p className="truncate text-xs text-primary-foreground/70">
                  Аяллын зөвлөгөө, төлөвлөгөө
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Чат хаах"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-primary-foreground/80 transition-colors hover:bg-white/10 hover:text-primary-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[52vh] min-h-[320px] overflow-y-auto bg-background px-4 py-4">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[84%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-foreground"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Бодож байна...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-border bg-card p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  disabled={loading}
                  className="shrink-0 rounded-md border border-border bg-background px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {error && <p className="mb-2 text-xs font-semibold text-red-600">{error}</p>}

            <form className="flex items-end gap-2" onSubmit={handleSubmit}>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage(input);
                  }
                }}
                rows={1}
                maxLength={1200}
                placeholder="Аяллынхаа талаар асуугаарай..."
                className="max-h-28 min-h-11 flex-1 resize-none rounded-md border border-border bg-background px-3 py-3 text-sm font-medium outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
              />
              <button
                type="submit"
                disabled={loading || input.trim().length === 0}
                aria-label="Илгээх"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-label="AI туслах чатбот нээх"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-14 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg border border-yellow-300 bg-accent px-4 text-sm font-black text-accent-foreground shadow-2xl transition-transform hover:-translate-y-0.5 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </span>
        <span className="leading-tight">AI туслах чатбот</span>
        <Sparkles className="h-4 w-4" />
      </button>
    </div>
  );
}
