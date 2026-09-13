"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "@/lib/server/admin-auth";
import {
  deleteSiteReviewById,
  deleteTripById,
  deleteServiceById,
  deleteTeamMemberById,
  setSiteReviewApproval,
  updateSiteSettingsFromForm,
  upsertTeamMemberFromForm,
  upsertServiceFromForm,
  upsertTripFromForm,
} from "@/lib/server/admin-store";
import {
  getInquiries,
  INQUIRY_STATUS_LABELS,
  isInquiryStatus,
  updateInquiryStatus,
} from "@/lib/server/inquiries";
import { sendEmail, sendEmailFromForm, type EmailLog } from "@/lib/server/mail";
import { createSignedUpload } from "@/lib/server/storage";
import { getErrorMessage } from "@/lib/server/supabase-rest";
import { isTripTranslationConfigured } from "@/lib/server/translate-trip";
import type { ActionResult } from "./_components/action-state";
import { requireAdmin } from "./_lib/require-admin";

/*
 * Every form action has the useActionState signature (previousState, formData)
 * and returns { ok, message } instead of redirecting, so a failed save leaves
 * the admin's typed values in place. Only login/logout navigate.
 */

type PreviousState = ActionResult | null;
type Outcome = string | { ok?: boolean; message: string; id?: string };

export async function saveTripAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();

  return runAction(async () => {
    const trip = await upsertTripFromForm(formData);
    revalidateTripPages();
    revalidateAdmin();

    return {
      id: trip.id,
      message: isTripTranslationConfigured()
        ? "Хөтөлбөр хадгалагдаж, орчуулгууд шинэчлэгдлээ."
        : "Хөтөлбөр хадгалагдлаа. Орчуулгын үйлчилгээ (LibreTranslate) тохируулбал дараагийн хадгалалтаар орчуулга автоматаар үүснэ.",
    };
  });
}

export async function deleteTripAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();

  return runAction(async () => {
    await deleteTripById(requireId(formData));
    revalidateTripPages();
    revalidateAdmin();
    return "Хөтөлбөр устгагдлаа.";
  });
}

export async function saveSiteSettingsAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();

  return runAction(async () => {
    await updateSiteSettingsFromForm(formData);
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/faq");
    revalidateAdmin();
    return "Вебийн тохиргоо хадгалагдлаа.";
  });
}

/**
 * Called by media-upload-field before a file is sent: returns a one-time URL
 * the browser uploads to directly (see createSignedUpload). Not a form action.
 */
export async function createMediaUploadAction(kind: string, contentType: string, size: number) {
  await requireAdmin();

  try {
    return { ok: true as const, ...(await createSignedUpload(kind, contentType, size)) };
  } catch (error) {
    return { ok: false as const, error: getErrorMessage(error) };
  }
}

export async function saveServiceAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();

  return runAction(async () => {
    await upsertServiceFromForm(formData);
    revalidatePath("/");
    revalidateAdmin();
    return "Үйлчилгээ хадгалагдлаа.";
  });
}

export async function deleteServiceAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();

  return runAction(async () => {
    await deleteServiceById(requireId(formData));
    revalidatePath("/");
    revalidateAdmin();
    return "Үйлчилгээ устгагдлаа.";
  });
}

export async function saveTeamMemberAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();

  return runAction(async () => {
    await upsertTeamMemberFromForm(formData);
    revalidatePath("/about");
    revalidateAdmin();
    return "Багийн гишүүн хадгалагдлаа.";
  });
}

export async function deleteTeamMemberAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();

  return runAction(async () => {
    await deleteTeamMemberById(requireId(formData));
    revalidatePath("/about");
    revalidateAdmin();
    return "Багийн гишүүн устгагдлаа.";
  });
}

export async function setReviewApprovalAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();
  const approve = formData.get("approve") === "true";

  return runAction(async () => {
    await setSiteReviewApproval(requireId(formData), approve);
    revalidatePath("/");
    revalidateAdmin();
    return approve ? "Сэтгэгдэл нийтлэгдлээ." : "Сэтгэгдэл нуугдлаа.";
  });
}

export async function deleteReviewAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();

  return runAction(async () => {
    await deleteSiteReviewById(requireId(formData));
    revalidatePath("/");
    revalidateAdmin();
    return "Сэтгэгдэл устгагдлаа.";
  });
}

/**
 * Changing a status only emails the customer when the admin ticks
 * "notifyCustomer" — it used to email on every change, with the raw English
 * status in the text.
 */
export async function updateInquiryStatusAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();

  return runAction(async () => {
    const id = requireId(formData);
    const status = getString(formData, "status");
    const notify = formData.get("notifyCustomer") === "on";

    if (!isInquiryStatus(status)) {
      throw new Error("Төлөв буруу байна.");
    }

    const inquiry = await updateInquiryStatus(id, status);
    const label = INQUIRY_STATUS_LABELS[status];
    const saved = `${inquiry.name}: төлөв „${label}“ боллоо.`;
    revalidateAdmin();

    if (!notify) {
      return saved;
    }

    if (!inquiry.email) {
      return { ok: false, message: `${saved} Гэхдээ и-мэйл хаяггүй тул мэдэгдэл илгээгдсэнгүй.` };
    }

    const log = await sendEmail({
      to: inquiry.email,
      subject: `Nomadabe: таны хүсэлтийн төлөв — ${label}`,
      body: `Сайн байна уу, ${inquiry.name}.\n\nТаны Nomadabe Travel-д илгээсэн хүсэлтийн төлөв шинэчлэгдлээ: ${label}.\n\nМанай баг аяллын дараагийн мэдээллээр тантай холбогдоно.\n\nNomadabe Travel`,
    });
    const email = describeEmail(log);
    return { ok: email.ok, message: `${saved} ${email.message}` };
  });
}

export async function sendAdminEmailAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();

  return runAction(async () => {
    const log = await sendEmailFromForm(formData);
    revalidateAdmin();
    return describeEmail(log);
  });
}

/**
 * Sends the ready-made reply to the inquiry the admin saw on screen (its id is
 * in the form), not to whatever happens to be newest when the request lands.
 */
export async function sendQuickReplyAction(_previous: PreviousState, formData: FormData) {
  await requireAdmin();

  return runAction(async () => {
    const inquiryId = getString(formData, "inquiryId");
    const subject = getString(formData, "subject");
    const body = getString(formData, "body");
    const inquiry = inquiryId
      ? (await getInquiries()).find((item) => item.id === inquiryId)
      : undefined;

    if (!inquiry?.email) {
      return { ok: false, message: "И-мэйл хаягтай бүртгэл олдсонгүй. Мэйл илгээгдсэнгүй." };
    }

    if (!subject || !body) {
      throw new Error("Мэйлийн гарчиг болон агуулга хоосон байна.");
    }

    const log = await sendEmail({ to: inquiry.email, subject, body });
    revalidateAdmin();
    return describeEmail(log);
  });
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  redirect("/admin/login");
}

function describeEmail(log: EmailLog): { ok: boolean; message: string } {
  if (log.status === "sent") {
    return { ok: true, message: `${log.to} руу мэйл илгээгдлээ.` };
  }

  if (log.status === "queued") {
    return {
      ok: true,
      message: `Мэйл үйлчилгээ (Resend) тохируулаагүй тул ${log.to} руу илгээх мэйл зөвхөн түүхэнд хадгалагдлаа.`,
    };
  }

  return {
    ok: false,
    message: `${log.to} руу мэйл илгээж чадсангүй${log.error ? `: ${log.error}` : "."}`,
  };
}

async function runAction(work: () => Promise<Outcome>): Promise<ActionResult> {
  try {
    const outcome = await work();

    return typeof outcome === "string"
      ? { ok: true, message: outcome }
      : { ok: outcome.ok ?? true, message: outcome.message, id: outcome.id };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

function revalidateAdmin() {
  // Every admin sub-route shares this layout, so one call refreshes them all.
  revalidatePath("/admin", "layout");
}

function revalidateTripPages() {
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/tours/domestic");
  revalidatePath("/tours/outbound");
  revalidatePath("/tours/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function requireId(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Бичлэгийн дугаар (id) олдсонгүй.");
  }

  return id;
}
