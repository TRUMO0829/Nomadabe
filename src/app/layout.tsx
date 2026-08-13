import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AiChatbot } from "@/components/ai-chatbot";
import { LanguageProvider } from "@/components/language-provider";
import { PlaneCursor } from "@/components/plane-cursor";
import { getSiteUrl } from "@/lib/site-url";
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

const SITE_NAME = "Nomadabe Travel";
const SITE_DESCRIPTION =
  "Бизнес, expo, амралт зугаалга болон захиалгат аяллыг Улаанбаатараас төлөвлөн зохион байгуулна.";

export const metadata: Metadata = {
  // Lets every page use relative OpenGraph/canonical URLs.
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "mn_MN",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/nomadabe-hero-panorama.webp",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/nomadabe-hero-panorama.webp"],
  },
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
