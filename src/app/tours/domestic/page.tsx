import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { SignupPromptModal } from "@/components/signup-prompt-modal";
import { ToursExperience } from "@/components/tours-experience";
import { CtaFooter } from "@/components/cta-footer";
import { getAdminStore } from "@/lib/server/admin-store";

export const metadata: Metadata = {
  title: "Дотоод чиглэл",
  description:
    "Nomadabe Travel-ийн Монгол доторх амралт, байгаль, соёлын аяллууд.",
};

// Content changes only when an admin saves, and every admin action calls
// revalidatePath, so the page is rebuilt immediately on a change. The window
// below is just a backstop; it replaces force-dynamic, which made every single
// visitor trigger a fresh round of Supabase queries.
export const revalidate = 300;

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
