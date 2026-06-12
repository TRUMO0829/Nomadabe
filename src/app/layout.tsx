import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AiChatbot } from "@/components/ai-chatbot";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nomadabe",
  description:
    "Бизнес, expo, амралт зугаалга болон захиалгат аяллыг Улаанбаатараас төлөвлөн зохион байгуулна.",
  icons: {
    icon: [{ url: "/nomadabe-mark.png", type: "image/png" }],
    shortcut: "/nomadabe-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn-MN" className={`${montserrat.variable} h-full antialiased`}>
      <body
        className={`${montserrat.className} min-h-full flex flex-col bg-background text-foreground`}
      >
        <LanguageProvider>
          {children}
          <AiChatbot />
        </LanguageProvider>
      </body>
    </html>
  );
}
