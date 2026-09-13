import { MessageSquare } from "lucide-react";
import { isApprovedReview, type SiteReview } from "@/lib/site-settings";
import { getAdminStore } from "@/lib/server/admin-store";
import { getReviews } from "@/lib/server/reviews";
import { getErrorMessage } from "@/lib/server/supabase-rest";
import { ReviewCard } from "../../_components/review-card";
import {
  EmptyState,
  LoadErrorNotice,
  PageHeader,
  paginate,
  Pagination,
  SectionHeader,
} from "../../_components/primitives";
import { firstParam, type SearchParams } from "../../_lib/page-data";
import { requireAdmin } from "../../_lib/require-admin";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function ReviewsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();

  const params = await searchParams;
  let reviews: SiteReview[] = [];
  let loadError = "";

  try {
    const store = await getAdminStore();
    reviews = await getReviews(store.siteSettings.reviews);
  } catch (error) {
    loadError = getErrorMessage(error);
  }

  const pending = reviews.filter((review) => !isApprovedReview(review));
  const approved = reviews.filter(isApprovedReview);
  const approvedPage = paginate(approved, firstParam(params.page), PAGE_SIZE);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Модерац"
        title="Сэтгэгдэл хянах"
        description="Сайтад сэтгэгдэл нэвтрэлтгүйгээр илгээгддэг тул та зөвшөөрөх хүртэл нүүр хуудсанд харагдахгүй."
        actions={
          <span className="text-sm font-semibold text-[var(--muted-foreground)]">
            {pending.length} хүлээгдэж буй · {approved.length} нийтлэгдсэн
          </span>
        }
      />

      <LoadErrorNotice errors={loadError ? [loadError] : []} />

      {reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Одоогоор сэтгэгдэл алга"
          message="Зочдын үлдээсэн сэтгэгдэл энд ирж, таны зөвшөөрлийг хүлээнэ."
        />
      ) : (
        <>
          <section className="space-y-4">
            <SectionHeader title="Хүлээгдэж буй" action={`${pending.length}`} />
            {pending.length === 0 ? (
              <p className="rounded-md border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted-foreground)] shadow-sm">
                Хүлээгдэж буй сэтгэгдэл алга — бүгдийг хянасан байна.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {pending.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <SectionHeader title="Нийтлэгдсэн" action={`${approved.length}`} />
            {approved.length === 0 ? (
              <p className="rounded-md border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted-foreground)] shadow-sm">
                Нийтлэгдсэн сэтгэгдэл алга.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {approvedPage.items.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
            <Pagination page={approvedPage.page} totalPages={approvedPage.totalPages} basePath="/admin/reviews" />
          </section>
        </>
      )}
    </div>
  );
}
