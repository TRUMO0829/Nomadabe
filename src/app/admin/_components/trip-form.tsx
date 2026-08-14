import { Plus, Save } from "lucide-react";
import type { Adventure, AdventureTranslation } from "@/lib/adventures";
import { LANGUAGES, type CopyLocale } from "@/lib/i18n";
import { AdminItineraryEditor } from "@/components/admin-itinerary-editor";
import { saveTripAction } from "../actions";
import { SelectField, TextField, TextareaField } from "./primitives";
import { getDateInputValue, translationFieldName, type CategoryOption } from "./format";

const translationLanguages = LANGUAGES.filter(
  (language): language is typeof language & { code: Exclude<CopyLocale, "mn"> } =>
    language.code !== "mn"
);

export function TripForm({
  mode,
  trip,
  categoryOptions,
}: {
  mode: "create" | "edit";
  trip?: Adventure;
  categoryOptions: CategoryOption[];
}) {
  return (
    <form action={saveTripAction} encType="multipart/form-data" className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
      {trip ? <input type="hidden" name="id" defaultValue={trip.id} /> : null}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
        <div>
          <h3 className="text-base font-black text-[var(--primary)]">
            {mode === "create" ? "Цөөн мэдээллээр аяллаа нэмнэ" : "Гол мэдээллийг засах"}
          </h3>
          <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Нэр, байршил, хугацаа, ангилал, зураг, товч тайлбараа оруулахад хангалттай.
            Үнэ, tag, орчуулга зэрэг нэмэлт мэдээллийг дараа нь эвхэгддэг хэсгээс нөхөж болно.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--foreground)]"
        >
          {mode === "create" ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Хөтөлбөр нэмэх" : "Хадгалах"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PosterField trip={trip} className="lg:col-span-3" />
        <SelectField
          label="Ангилал"
          name="category"
          defaultValue={trip?.category ?? "custom"}
          options={categoryOptions}
        />
        <TextField
          label="Аяллын нэр"
          name="title"
          defaultValue={trip?.title}
          placeholder="Говийн аялал"
          required
          className="lg:col-span-2"
        />
      </div>

      <details className="mt-4 rounded-md border border-[var(--border)] bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-black text-[var(--primary)]">Дэлгэрэнгүй мэдээлэл</span>
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Байршил, хугацаа, үнэ, tag, багц</span>
        </summary>
        <div className="grid gap-4 border-t border-[var(--border)] p-4 lg:grid-cols-3">
          <TextField label="Байршил / хот" name="location" defaultValue={trip?.location} placeholder="Өмнөговь" />
          <TextField label="Улс" name="country" defaultValue={trip?.country} placeholder="Mongolia" />
          <TextField label="Хугацаа / өдөр" name="days" type="number" defaultValue={String(trip?.days ?? 5)} />
          <TextField label="Дараагийн явах огноо" name="nextDeparture" type="date" defaultValue={getDateInputValue(trip?.nextDeparture)} />
          <TextareaField label="Хэрэглэгчид харагдах товч тайлбар" name="summary" defaultValue={trip?.summary} rows={3} className="lg:col-span-3" />
          <input type="hidden" name="image" defaultValue={trip?.image} />
          <GalleryUploadField trip={trip} className="lg:col-span-3" />
          <TextField label="Slug" name="slug" defaultValue={trip?.slug} placeholder="gobi-adventure" />
          <TextField label="Шинэ ангилал нэмэх" name="categoryCustom" placeholder="Жишээ: Дотоод аялал" />
          <TextField label="Групп / хэнд зориулсан" name="groupSize" defaultValue={trip?.groupSize ?? "Flexible"} placeholder="Family / Group" />
          <SelectField
            label="Аяллын түвшин"
            name="difficulty"
            defaultValue={trip?.difficulty ?? "Easy"}
            options={[
              { value: "Easy", label: "Хялбар" },
              { value: "Moderate", label: "Дунд" },
              { value: "Challenging", label: "Сорилттой" },
              { value: "Tough", label: "Хүнд" },
            ]}
          />
          <TextField label="Үнэ / 0 бол санал авах" name="price" type="number" defaultValue={String(trip?.price ?? 0)} />
          <TextField label="Валют" name="currency" defaultValue={trip?.currency ?? "MNT"} />
          <TextField label="Тагууд / comma-аар" name="tags" defaultValue={trip?.tags.join(", ")} placeholder="Domestic, Gobi, Nature" />
          <TextField label="Үнэлгээ" name="rating" type="number" step="0.1" defaultValue={String(trip?.rating ?? 4.8)} />
          <TextField label="Сэтгэгдлийн тоо" name="reviews" type="number" defaultValue={String(trip?.reviews ?? 0)} />
          <TextareaField label="Хэнд тохиромжтой / comma-аар" name="idealFor" defaultValue={trip?.idealFor.join(", ")} rows={2} />
          <TextareaField label="Багцад багтах зүйлс / comma-аар" name="includes" defaultValue={trip?.includes.join(", ")} rows={2} />
          <TextareaField label="Бизнес / expo нэмэлт дэмжлэг" name="businessSupport" defaultValue={trip?.businessSupport.join(", ")} rows={2} />
        </div>
      </details>

      <details className="mt-4 rounded-md border border-[var(--border)] bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-black text-[var(--primary)]">Аяллын хөтөлбөр (өдөр / цаг)</span>
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Уян хатан, оруулаагүй бол автоматаар</span>
        </summary>
        <div className="border-t border-[var(--border)] p-4">
          <AdminItineraryEditor defaultValue={trip?.itinerary} />
        </div>
      </details>

      <details className="mt-4 rounded-md border border-[var(--border)] bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-black text-[var(--primary)]">Орчуулга хянах</span>
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Сонголттой</span>
        </summary>
        <div className="space-y-3 border-t border-[var(--border)] p-4">
          <p className="text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Автомат орчуулга энд харагдана. Та засаж хадгалбал дараагийн автомат орчуулга тухайн засварыг дарж бичихгүй.
          </p>
          {translationLanguages.map((language) => (
            <TranslationEditor
              key={language.code}
              locale={language.code}
              label={language.label}
              translation={trip?.translations?.[language.code]}
            />
          ))}
        </div>
      </details>

      <label className="mt-4 flex w-fit items-center gap-2 text-sm font-semibold text-[var(--primary)]">
        <input type="checkbox" name="featured" defaultChecked={trip?.featured ?? false} className="h-4 w-4 accent-[var(--accent)]" />
        Веб дээр онцлох
      </label>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm font-medium text-[var(--muted-foreground)]">
          Хадгалах үед English, 中文, 日本語, 한국어 орчуулга автоматаар үүсэж Supabase-д хадгалагдана.
        </p>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--foreground)]"
        >
          {mode === "create" ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Хөтөлбөр нэмэх" : "Өөрчлөлт хадгалах"}
        </button>
      </div>
    </form>
  );
}

function TranslationEditor({
  locale,
  label,
  translation,
}: {
  locale: Exclude<CopyLocale, "mn">;
  label: string;
  translation?: AdventureTranslation;
}) {
  return (
    <details className="rounded-md border border-[var(--border)] bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
        <span className="text-sm font-black text-[var(--primary)]">
          {label} ({locale.toUpperCase()})
        </span>
        <span className="text-xs font-semibold text-[var(--muted-foreground)]">
          Засах
        </span>
      </summary>
      <div className="grid gap-4 border-t border-[var(--border)] p-4 lg:grid-cols-3">
        <TextField
          label="Гарчиг"
          name={translationFieldName(locale, "title")}
          defaultValue={translation?.title}
        />
        <TextField
          label="Байршил / хот"
          name={translationFieldName(locale, "location")}
          defaultValue={translation?.location}
        />
        <TextField
          label="Улс"
          name={translationFieldName(locale, "country")}
          defaultValue={translation?.country}
        />
        <TextField
          label="Групп"
          name={translationFieldName(locale, "groupSize")}
          defaultValue={translation?.groupSize}
        />
        <TextField
          label="Түвшин"
          name={translationFieldName(locale, "difficulty")}
          defaultValue={translation?.difficulty}
        />
        <TextField
          label="Тагууд / comma-аар"
          name={translationFieldName(locale, "tags")}
          defaultValue={translation?.tags?.join(", ")}
        />
        <TextareaField
          label="Товч тайлбар"
          name={translationFieldName(locale, "summary")}
          defaultValue={translation?.summary}
          rows={3}
          className="lg:col-span-3"
        />
        <TextareaField
          label="Хэнд тохиромжтой / comma-аар"
          name={translationFieldName(locale, "idealFor")}
          defaultValue={translation?.idealFor?.join(", ")}
          rows={2}
        />
        <TextareaField
          label="Багцад багтах зүйлс / comma-аар"
          name={translationFieldName(locale, "includes")}
          defaultValue={translation?.includes?.join(", ")}
          rows={2}
        />
        <TextareaField
          label="Бизнес / expo дэмжлэг"
          name={translationFieldName(locale, "businessSupport")}
          defaultValue={translation?.businessSupport?.join(", ")}
          rows={2}
        />
      </div>
    </details>
  );
}

function PosterField({ trip, className }: { trip?: Adventure; className?: string }) {
  return (
    <div className={`block ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        Постер зураг
      </span>
      <div className="mt-2 flex flex-col gap-3 rounded-md border border-dashed border-[var(--border)] bg-white p-4 sm:flex-row sm:items-center">
        {trip?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trip.image}
            alt={trip.title ? `${trip.title} постер` : "Одоогийн постер"}
            className="h-24 w-24 shrink-0 rounded-md object-cover ring-1 ring-[var(--border)]"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-[var(--muted)] text-xs font-semibold text-[var(--muted-foreground)]">
            Постер алга
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            name="poster"
            accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
            className="block w-full text-sm text-[var(--foreground)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--foreground)]"
          />
          <p className="mt-2 text-xs font-medium leading-5 text-[var(--muted-foreground)]">
            Зургаа сонгоно уу (JPG, PNG, WEBP — 8MB хүртэл). Постер оруулбал доорх URL-г дарж бичнэ.
            {trip ? " Шинэ зураг оруулаагүй бол одоогийн постер хэвээр үлдэнэ." : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function GalleryUploadField({ trip, className }: { trip?: Adventure; className?: string }) {
  const images = trip?.galleryImages ?? [];

  return (
    <div className={`block ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        Дэлгэрэнгүй gallery зурагнууд
      </span>
      <div className="mt-2 rounded-md border border-dashed border-[var(--border)] bg-white p-4">
        {images.length > 0 ? (
          <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="rounded-md border border-[var(--border)] bg-[var(--background)] p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${trip?.title ?? "Аялал"} gallery ${index + 1}`}
                  className="h-28 w-full rounded-md object-cover ring-1 ring-[var(--border)]"
                />
                <input type="hidden" name="galleryImageUrl" defaultValue={image} />
                <label className="mt-3 block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                    Local-аас энэ зургийг солих
                  </span>
                  <input
                    type="file"
                    name={`galleryImageReplacement_${index}`}
                    accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                    className="mt-1 block w-full text-xs text-[var(--foreground)] file:mr-2 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[var(--foreground)]"
                  />
                </label>
                <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
                  <input
                    type="checkbox"
                    name={`galleryImageRemove_${index}`}
                    className="h-4 w-4 accent-[var(--accent)]"
                  />
                  Энэ зургийг устгах
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-3 rounded-md bg-[var(--muted)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)]">
            Gallery зураг ороогүй байна.
          </div>
        )}
        <div className="rounded-md border border-[var(--border)] bg-[var(--background)] p-3">
          <span className="text-xs font-black uppercase tracking-[0.12em] text-[var(--primary)]">
            Шинэ gallery зураг нэмэх
          </span>
          <p className="mt-1 text-xs font-medium leading-5 text-[var(--muted-foreground)]">
            Detail page-ийн баруун тал болон popup detail дээр харагдах нэмэлт зургууд. Олон зураг зэрэг сонгож болно.
          </p>
          <input
            type="file"
            name="galleryImagesAdd"
            accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
            multiple
            className="mt-3 block w-full text-sm text-[var(--foreground)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--foreground)]"
          />
        </div>
        <input
          type="file"
          name="galleryImagesUpload"
          accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
          multiple
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        <p className="mt-2 text-xs font-medium leading-5 text-[var(--muted-foreground)]">
          Зөвхөн local-аас зураг upload хийж солино. Устгах сонголт идэвхжүүлсэн зураг хадгалахад gallery-аас хасагдана.
        </p>
      </div>
    </div>
  );
}
