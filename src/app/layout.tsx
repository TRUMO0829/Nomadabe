import type { Metadata } from "next";
import { LanguageProvider } from "@/components/language-provider";
import { PlaneCursor } from "@/components/plane-cursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nomadabe",
  description:
    "Бизнес, expo, амралт зугаалга болон захиалгат аяллыг Улаанбаатараас төлөвлөн зохион байгуулна.",
};

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
        </LanguageProvider>
      </body>
      </body>
    </html>
  );
}


