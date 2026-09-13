"use client";

import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import type { Adventure, AdventureTranslation } from "@/lib/adventures";
import { LANGUAGES, type CopyLocale } from "@/lib/i18n";
import { AdminItineraryEditor } from "@/components/admin-itinerary-editor";
import { deleteTripAction, saveTripAction } from "../actions";
import { AdminForm, SubmitButton } from "./admin-form";
import { GalleryField, MediaSlot } from "./media-upload-field";
import { CheckboxField, Disclosure, SelectField, TextField, TextareaField } from "./primitives";
import { getDateInputValue, translationFieldName, type CategoryOption } from "./format";

const translationLanguages = LANGUAGES.filter(
  (language): language is typeof language & { code: Exclude<CopyLocale, "mn"> } =>
    language.code !== "mn"
);

const LIST_HINT = "Таслалаар тусгаарлана.";

export function TripForm({
  mode,
  trip,
  categoryOptions,
}: {
  mode: "create" | "edit";
  trip?: Adventure;
  categoryOptions: CategoryOption[];
}) {
  const router = useRouter();
  const isCreate = mode === "create";
  const submitIcon = isCreate ? <Plus aria-hidden="true" className="h-4 w-4" /> : <Save aria-hidden="true" className="h-4 w-4" />;

  return (
    <AdminForm
      action={saveTripAction}
      onSuccess={(result) => {
        // A new trip opens in its own edit page so the admin can keep going.
        if (isCreate && result.id) {
          router.push(`/admin/trips/${result.id}`);
        }
      }}
      className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4"
    >
      {trip ? <input type="hidden" name="id" defaultValue={trip.id} /> : null}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-base font-black text-[var(--primary)]">
            {isCreate ? "Цөөн мэдээллээр аяллаа нэмнэ" : "Гол мэдээллийг засах"}
          </h2>
          <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Нэр, ангилал, постер зураг оруулахад хангалттай. Байршил, үнэ, шошго, орчуулга зэрэг
            нэмэлт мэдээллийг доорх эвхэгддэг хэсгүүдээс нөхөж болно.
          </p>
        </div>
        <SubmitButton icon={submitIcon}>{isCreate ? "Хөтөлбөр нэмэх" : "Хадгалах"}</SubmitButton>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <MediaSlot
          kind="trip-image"
          fieldName="image"
          label="Постер зураг"
          initialSrc={trip?.image ?? ""}
          previewClassName="h-40 w-full sm:w-64"
          hint="JPG, PNG, WEBP — 8MB хүртэл. Сонгомогц шууд байршина, дараа нь хадгалах товчийг дарна уу. Шинэ зураг сонгоогүй бол одоогийн постер хэвээр үлдэнэ."
          className="rounded-md border border-dashed border-[var(--border)] bg-white p-4 lg:col-span-3"
        />
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

      <Disclosure
        className="mt-4"
        title="Дэлгэрэнгүй мэдээлэл"
        hint="Байршил, хугацаа, үнэ, шошго, багц"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <TextField label="Байршил / хот" name="location" defaultValue={trip?.location} placeholder="Өмнөговь" />
          <TextField label="Улс" name="country" defaultValue={trip?.country} placeholder="Монгол" />
          <TextField label="Хугацаа (өдөр)" name="days" type="number" min={1} defaultValue={String(trip?.days ?? 5)} />
          <TextField label="Дараагийн явах огноо" name="nextDeparture" type="date" defaultValue={getDateInputValue(trip?.nextDeparture)} />
          <TextareaField label="Хэрэглэгчид харагдах товч тайлбар" name="summary" defaultValue={trip?.summary} rows={3} className="lg:col-span-3" />
          <GalleryField
            kind="trip-image"
            label="Нэмэлт зургууд"
            initialImages={trip?.galleryImages ?? []}
            altPrefix={trip?.title ?? "Аялал"}
            hint="Аяллын дэлгэрэнгүй хуудасны баруун талд болон дэлгэрэнгүй цонхонд харагдана. Олон зураг зэрэг сонгож болно. Хассан зураг хадгалах үед жагсаалтаас гарна."
            className="lg:col-span-3"
          />
          <TextField
            label="Вэб хаяг (slug)"
            name="slug"
            defaultValue={trip?.slug}
            placeholder="gobi-adventure"
            hint="Хуудасны хаягийн төгсгөл. Хоосон бол нэрээс автоматаар үүснэ."
          />
          <TextField label="Шинэ ангилал нэмэх" name="categoryCustom" placeholder="Жишээ: Дотоод аялал" />
          <TextField
            label="Бүлэг / хэнд зориулсан"
            name="groupSize"
            defaultValue={trip?.groupSize}
            placeholder="Жишээ: Гэр бүл, найзуудын бүлэг"
          />
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
          <TextField label="Үнэ" name="price" type="number" min={0} defaultValue={String(trip?.price ?? 0)} hint="0 бол үнийн санал авна." />
          <TextField label="Валют" name="currency" defaultValue={trip?.currency ?? "MNT"} />
          <TextField label="Шошго" name="tags" defaultValue={trip?.tags.join(", ")} placeholder="Дотоод, Говь, Байгаль" hint={LIST_HINT} />
          <TextareaField label="Хэнд тохиромжтой" name="idealFor" defaultValue={trip?.idealFor.join(", ")} rows={2} hint={LIST_HINT} />
          <TextareaField label="Багцад багтах зүйлс" name="includes" defaultValue={trip?.includes.join(", ")} rows={2} hint={LIST_HINT} />
          <TextareaField label="Бизнес / үзэсгэлэнгийн нэмэлт дэмжлэг" name="businessSupport" defaultValue={trip?.businessSupport.join(", ")} rows={2} hint={LIST_HINT} />
        </div>
      </Disclosure>

      <Disclosure className="mt-4" title="Үнэлгээ ба сэтгэгдлийн тоо" hint="Зөвхөн бодит өгөгдөл">
        <p className="mb-4 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
          Эдгээр тоо аяллын хуудсанд болон Google-ийн хайлтын үр дүнд (од үнэлгээ) харагдана.
          Зөвхөн аялагчдын бодит сэтгэгдэл дээр үндэслэн бөглөнө үү. Сэтгэгдлийн тоо 0 бол үнэлгээ
          огт харагдахгүй.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Дундаж үнэлгээ (1–5)"
            name="rating"
            type="number"
            step="0.1"
            min={0}
            max={5}
            defaultValue={String(trip?.rating ?? 0)}
          />
          <TextField
            label="Бодит сэтгэгдлийн тоо"
            name="reviews"
            type="number"
            min={0}
            defaultValue={String(trip?.reviews ?? 0)}
          />
        </div>
      </Disclosure>

      <Disclosure className="mt-4" title="Аяллын хөтөлбөр (өдөр / цаг)" hint="Сонголттой">
        <AdminItineraryEditor defaultValue={trip?.itinerary} />
      </Disclosure>

      <Disclosure className="mt-4" title="Орчуулга хянах" hint="Сонголттой">
        <div className="space-y-3">
          <p className="text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Автомат орчуулга энд харагдана. Та засаж хадгалбал дараагийн автомат орчуулга тухайн
            засварыг дарж бичихгүй.
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
      </Disclosure>

      <CheckboxField className="mt-4" name="featured" defaultChecked={trip?.featured ?? false} label="Веб дээр онцлох" />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm font-medium text-[var(--muted-foreground)]">
          Хадгалах үед English, 中文, 日本語, 한국어 орчуулга автоматаар үүсэж хадгалагдана.
        </p>
        <SubmitButton icon={submitIcon}>{isCreate ? "Хөтөлбөр нэмэх" : "Өөрчлөлт хадгалах"}</SubmitButton>
      </div>
    </AdminForm>
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
    <Disclosure title={`${label} (${locale.toUpperCase()})`} hint="Засах">
      <div className="grid gap-4 lg:grid-cols-3">
        <TextField label="Гарчиг" name={translationFieldName(locale, "title")} defaultValue={translation?.title} />
        <TextField label="Байршил / хот" name={translationFieldName(locale, "location")} defaultValue={translation?.location} />
        <TextField label="Улс" name={translationFieldName(locale, "country")} defaultValue={translation?.country} />
        <TextField label="Бүлэг" name={translationFieldName(locale, "groupSize")} defaultValue={translation?.groupSize} />
        <TextField label="Түвшин" name={translationFieldName(locale, "difficulty")} defaultValue={translation?.difficulty} />
        <TextField label="Шошго" name={translationFieldName(locale, "tags")} defaultValue={translation?.tags?.join(", ")} hint={LIST_HINT} />
        <TextareaField label="Товч тайлбар" name={translationFieldName(locale, "summary")} defaultValue={translation?.summary} rows={3} className="lg:col-span-3" />
        <TextareaField label="Хэнд тохиромжтой" name={translationFieldName(locale, "idealFor")} defaultValue={translation?.idealFor?.join(", ")} rows={2} hint={LIST_HINT} />
        <TextareaField label="Багцад багтах зүйлс" name={translationFieldName(locale, "includes")} defaultValue={translation?.includes?.join(", ")} rows={2} hint={LIST_HINT} />
        <TextareaField label="Бизнес / үзэсгэлэнгийн дэмжлэг" name={translationFieldName(locale, "businessSupport")} defaultValue={translation?.businessSupport?.join(", ")} rows={2} hint={LIST_HINT} />
      </div>
    </Disclosure>
  );
}

export function TripDeleteForm({ tripId, title }: { tripId: string; title: string }) {
  const router = useRouter();

  return (
    <AdminForm action={deleteTripAction} onSuccess={() => router.replace("/admin/trips")}>
      <input type="hidden" name="id" value={tripId} />
      <SubmitButton
        variant="destructive"
        icon={<Trash2 aria-hidden="true" className="h-4 w-4" />}
        pendingLabel="Устгаж байна…"
        confirmMessage={`„${title}“ хөтөлбөрийг устгах уу? Энэ үйлдлийг буцаах боломжгүй.`}
      >
        Хөтөлбөр устгах
      </SubmitButton>
    </AdminForm>
  );
}
