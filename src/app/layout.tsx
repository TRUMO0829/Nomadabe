import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nomadabe - Монгол болон олон улсын аялал",
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
    <html lang="mn" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
