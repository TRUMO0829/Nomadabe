"use client";

import { Save } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";
import { saveSiteSettingsAction } from "../actions";
import { AdminForm, SubmitButton } from "./admin-form";
import { MediaSlot, VIDEO_ACCEPT } from "./media-upload-field";

const OUTBOUND_IMAGE_FIELDS = [
  { id: "zhangjiajie", label: "Жанжиажэ (Аватар уул)" },
  { id: "shanghai", label: "Шанхай" },
  { id: "japan", label: "Япон 4 хот" },
  { id: "jeju", label: "Жэжү арал" },
  { id: "turkey", label: "Турк" },
  { id: "taiwan", label: "Тайвань" },
];

export function LandingVideoSettingsForm({ settings }: { settings: SiteSettings }) {
  const heroVideoSlots = Array.from({ length: 4 }, (_, index) => ({
    id: index,
    label: `Нүүр бичлэг ${index + 1}`,
    src: settings.heroVideos[index] ?? "",
  }));

  return (
    <AdminForm
      action={saveSiteSettingsAction}
      aria-label="Нүүр хуудасны тохиргоо"
      className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div>
          <h2 className="text-sm font-black text-[var(--primary)]">Нүүр хэсгийн бичлэгүүд</h2>
          <p className="mt-1 text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Компьютерээсээ MP4, WEBM эсвэл MOV бичлэг сонгоно. Шинэ файл сонгоогүй хэсэг одоогийн
            бичлэгээ хэвээр хадгална.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {heroVideoSlots.map((video) => (
              <MediaSlot
                key={video.id}
                kind="hero-video"
                fieldName={`heroVideo_${video.id}`}
                label={video.label}
                initialSrc={video.src}
                accept={VIDEO_ACCEPT}
                className="rounded-md border border-[var(--border)] bg-[var(--background)] p-3"
              />
            ))}
          </div>
        </div>
        <div className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
          <h2 className="text-sm font-black text-[var(--primary)]">Ашиглах заавар</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Файл сонгомогц хадгалах сан руу шууд байршина. Дууссаны дараа &ldquo;Тохиргоо
            хадгалах&rdquo; дарахад нүүр хэсгийн бичлэгийн жагсаалтад хадгалагдана.
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            Зөвлөмж
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
            1080p, 5–15 секунд, 120MB-аас бага, дуугүй тоглоход ойлгомжтой бичлэг ашиглавал нүүр
            хуудас хурдан ачаална.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
        <h2 className="text-sm font-black text-[var(--primary)]">Гадаад аяллын нүүр зураг солих</h2>
        <p className="mt-1 text-sm font-medium leading-6 text-[var(--muted-foreground)]">
          Компьютерээсээ JPG, PNG, WEBP зураг сонгоно. Шинэ файл сонгоогүй аяллын зураг
          одоогийнхоороо үлдэнэ.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {OUTBOUND_IMAGE_FIELDS.map((field) => (
            <MediaSlot
              key={field.id}
              kind="outbound-image"
              fieldName={`outboundTripImage_${field.id}`}
              label={field.label}
              initialSrc={settings.outboundTripImages[field.id] ?? ""}
              className="rounded-md border border-[var(--border)] bg-white p-3 shadow-sm"
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm font-medium leading-6 text-[var(--muted-foreground)]">
          Хадгалсны дараа нүүр хуудас шинэчлэгдэж, шинэ бичлэгүүд дараагийн ачаалалтаас тоглоно.
        </p>
        <SubmitButton icon={<Save aria-hidden="true" className="h-4 w-4" />}>Тохиргоо хадгалах</SubmitButton>
      </div>
    </AdminForm>
  );
}
