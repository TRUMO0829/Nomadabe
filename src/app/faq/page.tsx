import type { Metadata } from "next";
import { CtaFooter } from "@/components/cta-footer";
import { FaqPage } from "@/components/faq-page";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { getSiteSettings } from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ | Nomadabe",
  description: "Nomadabe Travel-ийн түгээмэл асуулт, хариултууд.",
};

export default async function FrequentlyAskedQuestionsPage() {
  const { aboutSection } = await getSiteSettings();

  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar surface="light" />
      <main className="flex-1 bg-[#0b0a07]">
        <FaqPage aboutSection={aboutSection} />
        <CtaFooter />
      </main>
    </>
  );
}
