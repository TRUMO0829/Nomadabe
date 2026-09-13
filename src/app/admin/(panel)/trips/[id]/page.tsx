import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTrips } from "@/lib/server/admin-store";
import { TripDeleteForm, TripForm } from "../../../_components/trip-form";
import { ButtonLink, PageHeader, SectionHeader } from "../../../_components/primitives";
import { getCategoryOptions } from "../../../_components/format";
import { requireAdmin } from "../../../_lib/require-admin";

export const dynamic = "force-dynamic";

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const { id } = await params;
  const trips = await getTrips();
  const trip = trips.find((item) => item.id === id);

  if (!trip) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Хөтөлбөр засах"
        title={trip.title}
        actions={
          <>
            <ButtonLink href="/admin/trips" variant="secondary">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Жагсаалт руу буцах
            </ButtonLink>
            <ButtonLink href={`/tours/${trip.slug}`} variant="secondary" external>
              Вебэд харах
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">(шинэ цонхонд)</span>
            </ButtonLink>
          </>
        }
      />

      {/* Keyed so moving between trips never carries one trip's typed values into another. */}
      <TripForm key={trip.id} mode="edit" trip={trip} categoryOptions={getCategoryOptions(trips)} />

      <section className="space-y-3 rounded-md border border-red-200 bg-white p-4 shadow-sm">
        <SectionHeader title="Хөтөлбөр устгах" />
        <p className="text-sm text-[var(--muted-foreground)]">
          Устгасан хөтөлбөр вебээс шууд алга болно. Энэ үйлдлийг буцаах боломжгүй.
        </p>
        <TripDeleteForm tripId={trip.id} title={trip.title} />
      </section>
    </div>
  );
}
