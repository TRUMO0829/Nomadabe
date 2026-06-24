import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AiChatbot } from "@/components/ai-chatbot";
import { LanguageProvider } from "@/components/language-provider";
import { PlaneCursor } from "@/components/plane-cursor";
import "./globals.css";

// Self-hosted via next/font so Cyrillic + Latin load reliably (no flaky
// external @import). Exposed as a CSS variable consumed by --site-font.
// CJK glyphs (zh/ja/ko) are not in Montserrat — system CJK fonts in the
// --site-font fallback stack render them per-glyph (see globals.css).
const siteFont = Montserrat({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-site",
});

export const metadata: Metadata = {
  title: "Nomadabe",
  description:
    "Бизнес, expo, амралт зугаалга болон захиалгат аяллыг Улаанбаатараас төлөвлөн зохион байгуулна.",
};

// Temporarily disabled while the n8n AI gateway is offline.
// Re-enable by setting NEXT_PUBLIC_CHATBOT_ENABLED=1 (in Vercel env) and redeploying.
const CHATBOT_ENABLED = process.env.NEXT_PUBLIC_CHATBOT_ENABLED === "1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className={`${siteFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LanguageProvider>
          <PlaneCursor />
          {children}
          {CHATBOT_ENABLED ? <AiChatbot /> : null}
        </LanguageProvider>
      </body>
    </html>
  );
}
