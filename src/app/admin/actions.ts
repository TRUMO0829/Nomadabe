"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/server/admin-auth";
import {
  deleteTripById,
  deleteServiceById,
  deleteTeamMemberById,
  updateSiteSettingsFromForm,
  upsertTeamMemberFromForm,
  upsertServiceFromForm,
  upsertTripFromForm,
} from "@/lib/server/admin-store";
import { getInquiries, isInquiryStatus, updateInquiryStatus } from "@/lib/server/inquiries";
import { sendEmail, sendEmailFromForm } from "@/lib/server/mail";
import { getErrorMessage } from "@/lib/server/supabase-rest";
import { isTripTranslationConfigured } from "@/lib/server/translate-trip";

export async function saveTripAction(formData: FormData) {
  await assertAdminAction();
  const error = await getActionError(() => upsertTripFromForm(formData));

  if (error) {
    redirectWithStatus(error);
  }

  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/admin");
  revalidatePath("/api/trips");
  redirectWithStatus(
    isTripTranslationConfigured()
      ? "Хөтөлбөр хадгалагдаж, орчуулгууд шинэчлэгдлээ."
      : "Хөтөлбөр хадгалагдлаа. LibreTranslate URL тохируулбал дараагийн хадгалалтаар орчуулга автоматаар үүснэ."
  );
}

export async function deleteTripAction(formData: FormData) {
  await assertAdminAction();
  const error = await getActionError(async () => {
    const id = formData.get("id");

    if (typeof id === "string" && id) {
      await deleteTripById(id);
    }
  });

  if (error) {
    redirectWithStatus(error);
  }

  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/admin");
  revalidatePath("/api/trips");
  redirectWithStatus("Хөтөлбөр устгагдлаа.");
}

export async function saveSiteSettingsAction(formData: FormData) {
  await assertAdminAction();
  const error = await getActionError(() => updateSiteSettingsFromForm(formData));

  if (error) {
    redirectWithStatus(error);
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/faq");
  revalidatePath("/admin");
  redirectWithStatus("Вебийн тохиргоо хадгалагдлаа.");
}

export async function saveServiceAction(formData: FormData) {
  await assertAdminAction();
  const error = await getActionError(() => upsertServiceFromForm(formData));

  if (error) {
    redirectWithStatus(error);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/api/services");
  redirectWithStatus("Үйлчилгээ хадгалагдлаа.");
}

export async function deleteServiceAction(formData: FormData) {
  await assertAdminAction();
  const error = await getActionError(async () => {
    const id = formData.get("id");

    if (typeof id === "string" && id) {
      await deleteServiceById(id);
    }
  });

  if (error) {
    redirectWithStatus(error);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/api/services");
  redirectWithStatus("Үйлчилгээ устгагдлаа.");
}

export async function saveTeamMemberAction(formData: FormData) {
  await assertAdminAction();
  const error = await getActionError(() => upsertTeamMemberFromForm(formData));

  if (error) {
    redirectWithStatus(error);
  }

  revalidatePath("/about");
  revalidatePath("/admin");
  redirectWithStatus("Багийн гишүүн хадгалагдлаа.");
}

export async function deleteTeamMemberAction(formData: FormData) {
  await assertAdminAction();
  const error = await getActionError(async () => {
    const id = formData.get("id");

    if (typeof id === "string" && id) {
      await deleteTeamMemberById(id);
    }
  });

  if (error) {
    redirectWithStatus(error);
  }

  revalidatePath("/about");
  revalidatePath("/admin");
  redirectWithStatus("Багийн гишүүн устгагдлаа.");
}

export async function updateInquiryStatusAction(formData: FormData) {
  await assertAdminAction();
  const error = await getActionError(async () => {
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
  });

  if (error) {
    redirectWithStatus(error);
  }

  revalidatePath("/admin");
  revalidatePath("/api/inquiries");
  redirectWithStatus("Бүртгэлийн төлөв шинэчлэгдлээ.");
}

export async function sendAdminEmailAction(formData: FormData) {
  await assertAdminAction();
  const error = await getActionError(() => sendEmailFromForm(formData));

  if (error) {
    redirectWithStatus(error);
  }

  revalidatePath("/admin");
  redirectWithStatus("Мэйл илгээх хүсэлт боловсруулагдлаа.");
}

export async function emailLatestInquiryAction(formData: FormData) {
  await assertAdminAction();
  const error = await getActionError(async () => {
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
  });

  if (error) {
    redirectWithStatus(error);
  }

  revalidatePath("/admin");
  redirectWithStatus("Сүүлийн бүртгэл рүү хурдан хариу илгээгдлээ.");
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

export async function refreshAdminAction() {
  await assertAdminAction();
  revalidatePath("/admin");
  revalidatePath("/api/admin/dashboard");
  revalidatePath("/api/admin/inquiries");
  redirectWithStatus("Админ самбар шинэчлэгдлээ.");
}

async function assertAdminAction() {
  const cookieStore = await cookies();
  const admin = verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!admin) {
    redirect("/admin/login");
  }
}

function redirectWithStatus(message: string) {
  redirect(`/admin?status=${encodeURIComponent(message)}`);
}

async function getActionError(work: () => Promise<unknown>) {
  try {
    await work();
    return "";
  } catch (error) {
    return `Алдаа: ${getErrorMessage(error)}`;
  }
}
