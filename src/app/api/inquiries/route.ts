import { apiError, ok } from "@/lib/server/api";
import { getInquiryStats, saveInquiry, validateInquiry } from "@/lib/server/inquiries";

export const runtime = "nodejs";

export async function GET() {
  const stats = await getInquiryStats();

  return ok({
    inquiries: stats,
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return apiError("BAD_REQUEST", "Invalid JSON body.", 400);
  }

  const validation = validateInquiry(payload);

  if (!validation.ok) {
    return apiError("BAD_REQUEST", "Inquiry validation failed.", 400, validation.errors);
  }

  try {
    const inquiry = await saveInquiry(validation.value);

    return ok(
      {
        inquiry: {
          id: inquiry.id,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch {
    return apiError("INTERNAL_ERROR", "Could not save inquiry.", 500);
  }
}
