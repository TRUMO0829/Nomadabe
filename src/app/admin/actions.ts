"use server";

import { revalidatePath } from "next/cache";
import {
  deleteTripById,
  deleteServiceById,
  updateSiteSettingsFromForm,
  upsertServiceFromForm,
  upsertTripFromForm,
} from "@/lib/server/admin-store";
import { isInquiryStatus, updateInquiryStatus } from "@/lib/server/inquiries";

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
    await updateInquiryStatus(id, status);
  }

  revalidatePath("/admin");
  revalidatePath("/api/inquiries");
}
