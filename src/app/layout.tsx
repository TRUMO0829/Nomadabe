import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nomadabe — Adventures across Mongolia and beyond",
  description:
    "Small-group adventures led by local experts. Trek the Altai, ride with eagle hunters, and explore the world the nomad way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
