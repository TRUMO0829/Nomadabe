import { Save } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";
import { saveSiteSettingsAction } from "../actions";

export function LandingVideoSettingsForm({ settings }: { settings: SiteSettings }) {
  const outboundImageFields = [
    { id: "zhangjiajie", label: "Жанжиажэ / Avatar" },
    { id: "shanghai", label: "Шанхай" },
    { id: "japan", label: "Япон 4 хот" },
    { id: "jeju", label: "Жэжү арал" },
    { id: "turkey", label: "Турк" },
    { id: "taiwan", label: "Тайвань" },
  ];
  const heroVideoSlots = Array.from({ length: 4 }, (_, index) => ({
    id: index,
    label: `Hero бичлэг ${index + 1}`,
    src: settings.heroVideos[index] ?? "",
  }));

  return (
    <form
      action={saveSiteSettingsAction}
      className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div>
          <h3 className="text-sm font-black text-[var(--primary)]">
            Hero бичлэгүүд upload хийх
          </h3>
          <p className="mt-1 text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Local-аас MP4, WEBM эсвэл MOV бичлэг сонгоно. Шинэ файл сонгоогүй slot
            одоогийн бичлэгээ хэвээр хадгална.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {heroVideoSlots.map((video) => (
              <label
                key={video.id}
                className="block rounded-md border border-[var(--border)] bg-[var(--background)] p-3"
              >
                <input
                  type="hidden"
                  name={`heroVideo_${video.id}`}
                  defaultValue={video.src}
                />
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                  {video.label}
                </span>
                {video.src ? (
                  <video
                    src={video.src}
                    muted
                    playsInline
                    controls
                    className="mt-2 h-28 w-full rounded-md bg-black object-cover ring-1 ring-[var(--border)]"
                  />
                ) : (
                  <div className="mt-2 flex h-28 w-full items-center justify-center rounded-md bg-[var(--muted)] text-xs font-semibold text-[var(--muted-foreground)]">
                    Бичлэг алга
                  </div>
                )}
                <input
                  type="file"
                  name={`heroVideoUpload_${video.id}`}
                  accept="video/mp4,video/webm,video/quicktime"
                  className="mt-3 block w-full text-xs text-[var(--foreground)] file:mr-2 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[var(--foreground)]"
                />
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
          <h3 className="text-sm font-black text-[var(--primary)]">
            Ашиглах заавар
          </h3>
          <p className="mt-2 text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Файл сонгоод хадгалахад бичлэг Supabase Storage руу upload хийгдээд,
            нүүр хэсгийн hero video жагсаалтад автоматаар хадгалагдана.
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            Зөвлөмж
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
            1080p, 5-15 секунд, 120MB-аас бага, дуугүй тоглоход ойлгомжтой
            бичлэг ашиглавал landing page хурдан ачаална.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
        <h3 className="text-sm font-black text-[var(--primary)]">
          Гадаад аяллын нүүр зураг солих
        </h3>
        <p className="mt-1 text-sm font-medium leading-6 text-[var(--muted-foreground)]">
          Local-аас JPG, PNG, WEBP зураг upload хийнэ. Шинэ файл сонгоогүй аяллын
          зураг одоогийнхоороо үлдэнэ.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {outboundImageFields.map((field) => {
            const currentImage = settings.outboundTripImages[field.id];

            return (
              <label
                key={field.id}
                className="block rounded-md border border-[var(--border)] bg-white p-3 shadow-sm"
              >
                <input
                  type="hidden"
                  name={`outboundTripImage_${field.id}`}
                  defaultValue={currentImage}
                />
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                  {field.label}
                </span>
                {currentImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentImage}
                    alt={`${field.label} зураг`}
                    className="mt-2 h-28 w-full rounded-md object-cover ring-1 ring-[var(--border)]"
                  />
                ) : null}
                <input
                  type="file"
                  name={`outboundTripImageUpload_${field.id}`}
                  accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                  className="mt-3 block w-full text-xs text-[var(--foreground)] file:mr-2 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[var(--foreground)]"
                />
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm font-medium leading-6 text-[var(--muted-foreground)]">
          Хадгалсны дараа нүүр хуудас revalidate хийгдэж, шинэ бичлэгүүд дараагийн
          ачаалалтаас тоглоно.
        </p>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--foreground)]"
        >
          <Save className="h-4 w-4" />
          Тохиргоо хадгалах
        </button>
      </div>
    </form>
  );
}
