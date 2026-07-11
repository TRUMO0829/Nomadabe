import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { ToursExperience } from "@/components/tours-experience";
import { CtaFooter } from "@/components/cta-footer";
import { getAdminStore } from "@/lib/server/admin-store";

export const metadata: Metadata = {
  title: "Дотоод чиглэл | Nomadabe",
  description:
    "Nomadabe Travel-ийн Монгол доторх амралт, байгаль, соёлын аяллууд.",
};

export const dynamic = "force-dynamic";

export default async function DomesticToursPage() {
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
          pageMode="domestic"
        />
        <CtaFooter />
      </main>
    </>
  );
}
