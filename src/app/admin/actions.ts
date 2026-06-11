"use server";

import { revalidatePath } from "next/cache";
import {
  deleteTripById,
  deleteServiceById,
  updateSiteSettingsFromForm,
  upsertServiceFromForm,
  upsertTripFromForm,
} from "@/lib/server/admin-store";
import { getInquiries, isInquiryStatus, updateInquiryStatus } from "@/lib/server/inquiries";
import { sendEmail, sendEmailFromForm } from "@/lib/server/mail";

export async function saveTripAction(formData: FormData) {
  await upsertTripFromForm(formData);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteTripAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id === "string" && id) {
    await deleteTripById(id);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveSiteSettingsAction(formData: FormData) {
  await updateSiteSettingsFromForm(formData);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveServiceAction(formData: FormData) {
  await upsertServiceFromForm(formData);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/api/services");
}

export async function deleteServiceAction(formData: FormData) {
  const id = formData.get("id");

  if (typeof id === "string" && id) {
    await deleteServiceById(id);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/api/services");
}

export async function updateInquiryStatusAction(formData: FormData) {
  const id = formData.get("id");
  const status = formData.get("status");

  if (typeof id === "string" && typeof status === "string" && isInquiryStatus(status)) {
    const inquiry = await updateInquiryStatus(id, status);

    if (inquiry.email) {
      await sendEmail({
        to: inquiry.email,
        subject: `Nomadabe хүсэлтийн төлөв: ${status}`,
        body: `Сайн байна уу ${inquiry.name},\n\nТаны Nomadabe Travel-д илгээсэн хүсэлтийн төлөв шинэчлэгдлээ: ${status}.\n\nМанай баг аяллын дараагийн мэдээллээр тантай холбогдоно.\n\nNomadabe Travel`,
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/api/inquiries");
}

export async function sendAdminEmailAction(formData: FormData) {
  await sendEmailFromForm(formData);
  revalidatePath("/admin");
}

export async function emailLatestInquiryAction(formData: FormData) {
  const subject = formData.get("subject");
  const body = formData.get("body");
  const inquiries = await getInquiries();
  const latestWithEmail = inquiries.find((inquiry) => inquiry.email);

  if (
    latestWithEmail?.email &&
    typeof subject === "string" &&
    typeof body === "string" &&
    subject.trim() &&
    body.trim()
  ) {
    await sendEmail({
      to: latestWithEmail.email,
      subject,
      body,
    });
  }

  revalidatePath("/admin");
}
