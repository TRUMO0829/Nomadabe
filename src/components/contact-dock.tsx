"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { PRIMARY_PHONE, SocialIcon, WHATSAPP_URL } from "./cta-footer";
import { useLanguage } from "./language-provider";

const DOCK_COPY = {
  mn: { whatsapp: "WhatsApp-аар бичих", call: "Утсаар залгах" },
  en: { whatsapp: "Chat on WhatsApp", call: "Call us" },
  zh: { whatsapp: "通过 WhatsApp 联系", call: "致电我们" },
  ja: { whatsapp: "WhatsAppで問い合わせ", call: "電話する" },
  ko: { whatsapp: "WhatsApp으로 문의", call: "전화하기" },
} as const;

const DOCK_BUTTON =
  "flex h-12 w-12 items-center justify-center bg-ink text-white shadow-floating transition-colors hover:bg-accent hover:text-accent-foreground";

/**
 * Phone and WhatsApp used to live only in the footer. This keeps one tap to a
 * human on every public page, which matters most on phones.
 */
export function ContactDock({ raised = false }: { raised?: boolean }) {
  const pathname = usePathname();
  const { contentLocale } = useLanguage();
  const copy = DOCK_COPY[contentLocale];

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      className={
        raised
          ? "fixed bottom-24 right-4 z-40 flex flex-col gap-2 sm:right-6"
          : "fixed bottom-4 right-4 z-40 flex flex-col gap-2 sm:bottom-6 sm:right-6"
      }
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={copy.whatsapp}
        title={copy.whatsapp}
        className={DOCK_BUTTON}
      >
        <SocialIcon icon="whatsapp" />
      </a>
      <a href={PRIMARY_PHONE.href} aria-label={copy.call} title={copy.call} className={DOCK_BUTTON}>
        <Phone className="h-5 w-5" aria-hidden="true" />
      </a>
    </div>
  );
}
