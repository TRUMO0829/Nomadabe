import type { Metadata } from "next";
import { AiChatbot } from "@/components/ai-chatbot";
import { LanguageProvider } from "@/components/language-provider";
import { PlaneCursor } from "@/components/plane-cursor";
import "./globals.css";

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
    <html lang="mn" className="h-full antialiased">
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
