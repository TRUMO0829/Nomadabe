import type { Metadata } from "next";
import { CtaFooter } from "@/components/cta-footer";
import { FaqPage } from "@/components/faq-page";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { getSiteSettings } from "@/lib/server/admin-store";

// Content changes only when an admin saves, and every admin action calls
// revalidatePath, so the page is rebuilt immediately on a change. The window
// below is just a backstop; it replaces force-dynamic, which made every single
// visitor trigger a fresh round of Supabase queries.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Түгээмэл асуултууд",
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
