"use client";

import { Eye, EyeOff, Trash2 } from "lucide-react";
import { isApprovedReview, type SiteReview } from "@/lib/site-settings";
import { deleteReviewAction, setReviewApprovalAction } from "../actions";
import { AdminForm, SubmitButton } from "./admin-form";
import { StatusPill } from "./primitives";
import { formatDate } from "./format";

export function ReviewCard({ review }: { review: SiteReview }) {
  const approved = isApprovedReview(review);

  return (
    <article className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[var(--primary)]">{review.name}</h3>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {[review.trip, review.location].filter(Boolean).join(" · ") || "Аялал заагаагүй"}
          </p>
        </div>
        <StatusPill label={approved ? "нийтлэгдсэн" : "хүлээгдэж буй"} />
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">{review.message}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
        <span>{review.rating}/5 од</span>
        <span>{formatDate(review.createdAt)}</span>
        {review.imageUrl ? (
          <a href={review.imageUrl} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
            Зураг харах
          </a>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-3">
        <AdminForm action={setReviewApprovalAction}>
          <input type="hidden" name="id" value={review.id} />
          <input type="hidden" name="approve" value={approved ? "false" : "true"} />
          <SubmitButton
            size="sm"
            variant={approved ? "secondary" : "primary"}
            icon={approved ? <EyeOff aria-hidden="true" className="h-3.5 w-3.5" /> : <Eye aria-hidden="true" className="h-3.5 w-3.5" />}
          >
            {approved ? "Нуух" : "Нийтлэх"}
          </SubmitButton>
        </AdminForm>
        <AdminForm action={deleteReviewAction}>
          <input type="hidden" name="id" value={review.id} />
          <SubmitButton
            size="sm"
            variant="destructive"
            icon={<Trash2 aria-hidden="true" className="h-3.5 w-3.5" />}
            pendingLabel="Устгаж байна…"
            confirmMessage={`${review.name}-ийн сэтгэгдлийг устгах уу?`}
          >
            Устгах
          </SubmitButton>
        </AdminForm>
      </div>
    </article>
  );
}
