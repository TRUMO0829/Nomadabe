import { ArrowLeft } from "lucide-react";
import type { Adventure } from "@/lib/adventures";
import { getTrips } from "@/lib/server/admin-store";
import { getErrorMessage } from "@/lib/server/supabase-rest";
import { TripForm } from "../../../_components/trip-form";
import { ButtonLink, LoadErrorNotice, PageHeader } from "../../../_components/primitives";
import { getCategoryOptions } from "../../../_components/format";
import { requireAdmin } from "../../../_lib/require-admin";

export const dynamic = "force-dynamic";

export default async function NewTripPage() {
  await requireAdmin();

  // Only needed for the category list; the form still works without it.
  let trips: Adventure[] = [];
  let loadError = "";

  try {
    trips = await getTrips();
  } catch (error) {
    loadError = getErrorMessage(error);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Хөтөлбөрүүд"
        title="Шинэ аяллын хөтөлбөр"
        description="Хадгалсны дараа хөтөлбөрийн засах хуудас нээгдэж, хэрэглэгчийн веб дээр харагдана."
        actions={
          <ButtonLink href="/admin/trips" variant="secondary">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Жагсаалт руу буцах
          </ButtonLink>
        }
      />
      <LoadErrorNotice errors={loadError ? [loadError] : []} />
      <TripForm mode="create" categoryOptions={getCategoryOptions(trips)} />
    </div>
  );
}
