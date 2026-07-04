import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { AboutShowcase } from "@/components/about-showcase";
import { CtaFooter } from "@/components/cta-footer";
import { getSiteSettings } from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Бидний тухай | Nomadabe",
  description:
    "Nomadabe Travel-ийн аялал төлөвлөлт, бодит зохион байгуулалт, дотоод болон гадаад чиглэлийн ажиллах зарчим.",
};

export default async function AboutPage() {
  const { aboutSection, teamMembers } = await getSiteSettings();

  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar surface="light" />
      <main className="flex-1 bg-[#0b0a07]">
        <AboutShowcase aboutSection={aboutSection} teamMembers={teamMembers} />
        <CtaFooter />
      </main>
    </>
  );
}
