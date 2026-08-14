import { Trash2 } from "lucide-react";
import { isApprovedReview, type SiteReview } from "@/lib/site-settings";
import { ConfirmSubmitButton } from "@/components/admin-confirm-button";
import { deleteReviewAction, setReviewApprovalAction } from "../actions";
import { StatusPill } from "./primitives";
import { formatDate } from "./format";

export function ReviewCard({ review }: { review: SiteReview }) {
  const approved = isApprovedReview(review);

  return (
    <div className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-[var(--primary)]">{review.name}</h4>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {[review.trip, review.location].filter(Boolean).join(" · ") || "Аялал заагаагүй"}
          </p>
        </div>
        <StatusPill label={approved ? "нийтлэгдсэн" : "хүлээгдэж буй"} />
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">{review.message}</p>

      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
        <span>{review.rating}/5 од</span>
        <span>{formatDate(review.createdAt)}</span>
        {review.imageUrl ? <span>Зурагтай</span> : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-3">
        <form action={setReviewApprovalAction}>
          <input type="hidden" name="id" defaultValue={review.id} />
          <input type="hidden" name="approve" defaultValue={approved ? "false" : "true"} />
          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-md bg-[var(--primary)] px-3 text-xs font-semibold text-white"
          >
            {approved ? "Нуух" : "Нийтлэх"}
          </button>
        </form>
        <form action={deleteReviewAction}>
          <input type="hidden" name="id" defaultValue={review.id} />
          <ConfirmSubmitButton
            className="inline-flex h-9 items-center rounded-md border border-[var(--border)] px-3 text-xs font-semibold text-[var(--foreground)]"
            message="Энэ сэтгэгдлийг устгах уу?"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Устгах
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
