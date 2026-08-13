import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { AboutShowcase } from "@/components/about-showcase";
import { CtaFooter } from "@/components/cta-footer";
import { getSiteSettings } from "@/lib/server/admin-store";

// Content changes only when an admin saves, and every admin action calls
// revalidatePath, so the page is rebuilt immediately on a change. The window
// below is just a backstop; it replaces force-dynamic, which made every single
// visitor trigger a fresh round of Supabase queries.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Бидний тухай",
  description:
    "Nomadabe Travel-ийн аялал төлөвлөлт, бодит зохион байгуулалт, дотоод болон гадаад чиглэлийн ажиллах зарчим.",
};

export default async function AboutPage() {
  const { aboutSection, teamMembers } = await getSiteSettings();

  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar surface="light" logoPlacement="center" logoSize="compact" />
      <main className="flex-1 bg-[#0b0a07]">
        <AboutShowcase aboutSection={aboutSection} teamMembers={teamMembers} />
        <CtaFooter />
      </main>
    </>
  );
}
