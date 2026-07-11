import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { ToursExperience } from "@/components/tours-experience";
import { CtaFooter } from "@/components/cta-footer";
import { getAdminStore } from "@/lib/server/admin-store";

export const metadata: Metadata = {
  title: "Гадаад чиглэл | Nomadabe",
  description:
    "Nomadabe Travel-ийн гадаад чиглэлүүд, байгууллагын аялал болон вилла сонголтууд.",
};

export const dynamic = "force-dynamic";

export default async function OutboundToursPage() {
  const { trips: adventures, siteSettings } = await getAdminStore();

  return (
    <>
      <SignupPromptModal autoOpen={false} />
      <Navbar logoPlacement="center" />
      <main className="flex-1">
        <ToursExperience
          adventures={adventures}
          outboundTripImages={siteSettings.outboundTripImages}
          stays={siteSettings.stays}
          pageMode="outbound"
        />
        <CtaFooter />
      </main>
    </>
  );
}
