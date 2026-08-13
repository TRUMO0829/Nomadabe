import { randomUUID } from "node:crypto";
import { isSupabaseConfigured, supabaseRest } from "@/lib/server/supabase-rest";
import { isApprovedReview, type SiteReview } from "@/lib/site-settings";

type SiteReviewRow = {
  id: string;
  name: string;
  location: string | null;
  trip: string | null;
  message: string;
  rating: number;
  image_url: string | null;
  is_approved: boolean;
  created_at: string;
};

const MAX_APPROVED_REVIEWS = 60;
const MAX_PENDING_REVIEWS = 40;

export type NewReviewInput = {
  name: string;
  location?: string;
  trip?: string;
  message: string;
  rating: number;
  imageUrl?: string;
};

/**
 * Reviews live in their own table. Before that they were stored inside the
 * site_settings JSON blob; `legacyReviews` is whatever is still sitting there,
 * used once to migrate a project that has not been converted yet.
 */
export async function getReviews(legacyReviews: SiteReview[]): Promise<SiteReview[]> {
  if (!isSupabaseConfigured()) {
    return legacyReviews;
  }

  const rows = await supabaseRest<SiteReviewRow[]>(
    "/site_reviews?select=*&order=created_at.desc"
  );

  if (rows.length > 0) {
    return rows.map(fromRow);
  }

  if (legacyReviews.length === 0) {
    return [];
  }

  await supabaseRest<null>("/site_reviews", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: JSON.stringify(legacyReviews.map(toRow)),
  });

  return legacyReviews;
}

export async function createReview(input: NewReviewInput): Promise<SiteReview> {
  const review: SiteReview = {
    id: randomUUID(),
    name: input.name,
    location: input.location,
    trip: input.trip,
    message: input.message,
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    imageUrl: input.imageUrl,
    createdAt: new Date().toISOString(),
    // Anyone can post here, so nothing goes live until an admin approves it.
    isApproved: false,
  };

  if (!isSupabaseConfigured()) {
    return review;
  }

  await supabaseRest<null>("/site_reviews", {
    method: "POST",
    prefer: "return=minimal",
    body: JSON.stringify(toRow(review)),
  });

  await pruneReviews();

  return review;
}

export async function setReviewApproval(id: string, isApproved: boolean) {
  if (!isSupabaseConfigured()) {
    throw new Error("Сэтгэгдлийн санг тохируулаагүй байна.");
  }

  const updated = await supabaseRest<SiteReviewRow[]>(
    `/site_reviews?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: JSON.stringify({ is_approved: isApproved }),
    }
  );

  if (!updated?.length) {
    throw new Error("Сэтгэгдэл олдсонгүй.");
  }
}

export async function deleteReview(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Сэтгэгдлийн санг тохируулаагүй байна.");
  }

  await supabaseRest<null>(`/site_reviews?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });
}

/**
 * Approved and pending reviews are capped separately. Under a single shared cap
 * a burst of spam would push every genuine, approved review out of the list.
 */
async function pruneReviews() {
  const [approvedIds, pendingIds] = await Promise.all([
    getReviewIdsToDrop(true, MAX_APPROVED_REVIEWS),
    getReviewIdsToDrop(false, MAX_PENDING_REVIEWS),
  ]);
  const stale = [...approvedIds, ...pendingIds];

  if (stale.length === 0) {
    return;
  }

  const list = stale.map((id) => `"${encodeURIComponent(id)}"`).join(",");
  await supabaseRest<null>(`/site_reviews?id=in.(${list})`, {
    method: "DELETE",
    prefer: "return=minimal",
  });
}

async function getReviewIdsToDrop(isApproved: boolean, keep: number) {
  const rows = await supabaseRest<Array<{ id: string }>>(
    `/site_reviews?select=id&is_approved=is.${isApproved}` +
      `&order=created_at.desc&offset=${keep}&limit=200`
  );

  return rows.map((row) => row.id);
}

export function splitReviews(reviews: SiteReview[]) {
  return {
    approved: reviews.filter(isApprovedReview),
    pending: reviews.filter((review) => !isApprovedReview(review)),
  };
}

function toRow(review: SiteReview) {
  return {
    id: review.id,
    name: review.name,
    location: review.location ?? null,
    trip: review.trip ?? null,
    message: review.message,
    rating: review.rating,
    image_url: review.imageUrl ?? null,
    is_approved: isApprovedReview(review),
    created_at: review.createdAt,
  };
}

function fromRow(row: SiteReviewRow): SiteReview {
  return {
    id: row.id,
    name: row.name,
    location: row.location ?? undefined,
    trip: row.trip ?? undefined,
    message: row.message,
    rating: row.rating,
    imageUrl: row.image_url ?? undefined,
    createdAt: row.created_at,
    isApproved: row.is_approved,
  };
}
