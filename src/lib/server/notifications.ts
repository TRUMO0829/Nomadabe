import { getAllowedAdminEmails } from "@/lib/server/admin-auth";
import { sendEmail } from "@/lib/server/mail";
import type { InquiryRecord } from "@/lib/server/inquiries";

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  trip: "Аяллын хүсэлт",
  business: "Бизнес аялал",
  expo: "Expo / үзэсгэлэн",
  custom: "Захиалгат аялал",
  villa: "Вилла захиалга",
  general: "Ерөнхий асуулт",
};

/**
 * Where new leads are announced. Falls back to the admin allow-list so a
 * deployment that only sets ADMIN_EMAILS still gets notified.
 */
function getNotificationRecipients() {
  const configured = (process.env.INQUIRY_NOTIFICATION_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  return configured.length > 0 ? configured : getAllowedAdminEmails();
}

/**
 * Tell the team a lead arrived, and confirm receipt to the person who sent it.
 *
 * Never throws: a mail outage must not turn a saved inquiry into an error the
 * visitor sees. Failures are already recorded in the email log by sendEmail.
 */
export async function notifyNewInquiry(inquiry: InquiryRecord) {
  await Promise.allSettled([
    notifyTeam(inquiry),
    confirmToCustomer(inquiry),
  ]);
}

async function notifyTeam(inquiry: InquiryRecord) {
  const recipients = getNotificationRecipients();

  if (recipients.length === 0) {
    return;
  }

  const label = INQUIRY_TYPE_LABELS[inquiry.inquiryType] ?? inquiry.inquiryType;
  const body = [
    `Шинэ хүсэлт ирлээ: ${label}`,
    "",
    `Нэр: ${inquiry.name}`,
    `И-мэйл: ${inquiry.email ?? "—"}`,
    `Аялал: ${inquiry.tripSlug ?? "—"}`,
    `Хүний тоо: ${inquiry.travelers ?? "—"}`,
    `Хүссэн огноо: ${inquiry.preferredDate ?? "—"}`,
    "",
    "Мессеж:",
    inquiry.message,
    "",
    `Хүсэлтийн дугаар: ${inquiry.id}`,
  ].join("\n");

  await Promise.allSettled(
    recipients.map((to) =>
      sendEmail({
        to,
        subject: `[Nomadabe] ${label} — ${inquiry.name}`,
        body,
      })
    )
  );
}

async function confirmToCustomer(inquiry: InquiryRecord) {
  if (!inquiry.email) {
    return;
  }

  await sendEmail({
    to: inquiry.email,
    subject: "Nomadabe Travel — хүсэлтийг тань хүлээн авлаа",
    body: [
      `Сайн байна уу ${inquiry.name},`,
      "",
      "Таны хүсэлтийг хүлээн авлаа. Манай баг ажлын 1 өдөрт багтаан тантай холбогдож, боломжит хувилбар, үнийн санал болон дараагийн алхмыг тайлбарлана.",
      "",
      "Илгээсэн мэдээлэл:",
      inquiry.message,
      "",
      "Хэрэв яаралтай бол энэ и-мэйлд шууд хариу бичээрэй.",
      "",
      "Nomadabe Travel",
    ].join("\n"),
  });
}
