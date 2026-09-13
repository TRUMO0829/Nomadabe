import { getSiteSettings } from "@/lib/server/admin-store";
import { LandingVideoSettingsForm } from "../../_components/landing-video-settings-form";
import { PageHeader } from "../../_components/primitives";
import { requireAdmin } from "../../_lib/require-admin";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();

  // A failed load goes to error.tsx rather than rendering a form with empty
  // values that would overwrite the real settings on save.
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Веб тохиргоо"
        title="Нүүр хуудасны бичлэг ба зураг"
        description="Энд хадгалсан өөрчлөлт нүүр хуудсанд шууд нөлөөлнө."
      />
      <LandingVideoSettingsForm settings={settings} />
    </div>
  );
}
