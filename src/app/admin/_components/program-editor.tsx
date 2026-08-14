import { CheckCircle2, Trash2, Users } from "lucide-react";
import type { Adventure } from "@/lib/adventures";
import { ConfirmSubmitButton } from "@/components/admin-confirm-button";
import { deleteTripAction } from "../actions";
import { TripForm } from "./trip-form";
import { TypePill } from "./primitives";
import { getCategoryLabel, type CategoryOption } from "./format";

export function ProgramEditor({
  trip,
  bookingCount,
  categoryOptions,
}: {
  trip: Adventure;
  bookingCount: number;
  categoryOptions: CategoryOption[];
}) {
  return (
    <details className="rounded-md border border-[var(--border)] bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
        <div className="flex min-w-0 items-center gap-4">
          <div
            aria-hidden="true"
            className="hidden h-20 w-28 shrink-0 rounded-md border border-[var(--border)] bg-cover bg-center sm:block"
            style={{ backgroundImage: `url('${trip.image}')` }}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
            <TypePill label={getCategoryLabel(trip.category)} />
              {trip.featured ? (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Онцолсон
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                <Users className="h-3.5 w-3.5" />
                {bookingCount} бүртгэл
              </span>
            </div>
            <h3 className="mt-2 truncate text-base font-semibold text-[var(--primary)]">{trip.title}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-[var(--muted-foreground)]">{trip.summary}</p>
          </div>
        </div>
        <span className="text-sm text-[var(--muted-foreground)]">Засах</span>
      </summary>
      <div className="border-t border-[var(--border)] p-4">
        <TripForm mode="edit" trip={trip} categoryOptions={categoryOptions} />
        <form action={deleteTripAction} className="mt-3">
          <input type="hidden" name="id" defaultValue={trip.id} />
          <ConfirmSubmitButton
            message="Энэ хөтөлбөрийг устгах уу?"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)] px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--foreground)]"
          >
            <Trash2 className="h-4 w-4" />
            Хөтөлбөр устгах
          </ConfirmSubmitButton>
        </form>
      </div>
    </details>
  );
}
