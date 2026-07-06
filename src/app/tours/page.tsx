import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { ToursExperience } from "@/components/tours-experience";
import { CtaFooter } from "@/components/cta-footer";
import { getAdminStore } from "@/lib/server/admin-store";

export const metadata: Metadata = {
  title: "Nomadabe",
  description:
    "Nomadabe Travel-ийн гадаад болон дотоод аяллуудыг нэг дороос хайж сонго.",
};

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const { trips: adventures, siteSettings } = await getAdminStore();

  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar logoPlacement="center" />
      <main className="flex-1">
        <ToursExperience
          adventures={adventures}
          outboundTripImages={siteSettings.outboundTripImages}
        />
        <CtaFooter />
      </main>
    </>
  );
}
