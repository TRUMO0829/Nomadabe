import Link from "next/link";
import { CalendarDays, CheckCircle2, Pencil, Plane, Plus, Users } from "lucide-react";
import { getTrips } from "@/lib/server/admin-store";
import { getInquiries } from "@/lib/server/inquiries";
import {
  ButtonLink,
  EmptyState,
  FOCUS_RING,
  LoadErrorNotice,
  PageHeader,
  TypePill,
} from "../../_components/primitives";
import { getCategoryLabel } from "../../_components/format";
import { settledErrors, settledValue } from "../../_lib/page-data";
import { requireAdmin } from "../../_lib/require-admin";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  await requireAdmin();

  const results = await Promise.allSettled([getTrips(), getInquiries()]);
  const trips = settledValue(results[0], []);
  const inquiries = settledValue(results[1], []);
  const bookingCounts = new Map<string, number>();

  for (const inquiry of inquiries) {
    if (inquiry.tripSlug) {
      bookingCounts.set(inquiry.tripSlug, (bookingCounts.get(inquiry.tripSlug) ?? 0) + 1);
    }
  }

  const newTripLink = (
    <ButtonLink href="/admin/trips/new">
      <Plus aria-hidden="true" className="h-4 w-4" />
      Шинэ хөтөлбөр нэмэх
    </ButtonLink>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Удирдлага"
        title="Хөтөлбөрүүд"
        description={`Хэрэглэгчийн веб дээр харагдах аяллууд. Нийт ${trips.length} хөтөлбөр.`}
        actions={newTripLink}
      />

      <LoadErrorNotice errors={settledErrors(results)} />

      {trips.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="Хөтөлбөр алга"
          message="Эхний аяллаа нэмбэл вебийн аяллын хэсэгт шууд харагдана."
          action={newTripLink}
        />
      ) : (
        <ul className="space-y-3">
          {trips.map((trip) => (
            <li key={trip.id}>
              <Link
                href={`/admin/trips/${trip.id}`}
                className={`flex items-center gap-4 rounded-md border border-[var(--border)] bg-white p-4 shadow-sm transition-colors hover:border-[var(--foreground)] ${FOCUS_RING}`}
              >
                {trip.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trip.image}
                    alt=""
                    className="hidden h-20 w-28 shrink-0 rounded-md object-cover ring-1 ring-[var(--border)] sm:block"
                  />
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <TypePill label={getCategoryLabel(trip.category)} />
                    {trip.featured ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
                        <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                        Онцолсон
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                      <Users aria-hidden="true" className="h-3.5 w-3.5" />
                      {bookingCounts.get(trip.slug) ?? 0} бүртгэл
                    </span>
                    {trip.nextDeparture ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                        <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                        {trip.nextDeparture}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-2 block truncate text-base font-semibold text-[var(--primary)]">{trip.title}</span>
                  <span className="mt-1 line-clamp-1 block text-sm text-[var(--muted-foreground)]">{trip.summary}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--primary)]">
                  <Pencil aria-hidden="true" className="h-4 w-4" />
                  Засах
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
