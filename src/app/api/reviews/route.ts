import { revalidatePath } from "next/cache";
import { apiError, ok, rateLimitRequest } from "@/lib/server/api";
import { addSiteReviewFromForm } from "@/lib/server/admin-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = await rateLimitRequest(request, "reviews", {
    limit: 8,
    windowMs: 10 * 60 * 1000,
  });

  if (limited) {
    return limited;
  }

  try {
    const formData = await request.formData();
    const review = await addSiteReviewFromForm(formData);

    revalidatePath("/");

    return ok({ review }, { status: 201 });
  } catch (error) {
    return apiError("BAD_REQUEST", getErrorMessage(error), 400);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Сэтгэгдэл хадгалж чадсангүй.";
}
