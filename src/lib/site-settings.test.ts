import { describe, expect, it } from "vitest";
import { getPublicReviews, isApprovedReview, type SiteReview } from "./site-settings";

function review(overrides: Partial<SiteReview>): SiteReview {
  return {
    id: "review-1",
    name: "Бат",
    message: "Маш сайн зохион байгуулалттай аялал байлаа.",
    rating: 5,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("review approval", () => {
  it("treats an explicit approval as visible", () => {
    expect(isApprovedReview(review({ isApproved: true }))).toBe(true);
  });

  it("hides reviews awaiting moderation", () => {
    expect(isApprovedReview(review({ isApproved: false }))).toBe(false);
  });

  // Reviews stored before moderation existed carry no flag and must stay live.
  it("treats a missing flag as approved", () => {
    expect(isApprovedReview(review({}))).toBe(true);
  });

  it("filters pending reviews out of the public list", () => {
    const reviews = [
      review({ id: "a", isApproved: true }),
      review({ id: "b", isApproved: false }),
      review({ id: "c" }),
    ];

    expect(getPublicReviews(reviews).map((item) => item.id)).toEqual(["a", "c"]);
  });
});
