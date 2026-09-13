"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import type { TravelService } from "@/lib/adventures";
import { deleteServiceAction, saveServiceAction } from "../actions";
import { AdminForm, SubmitButton } from "./admin-form";
import { Disclosure, TextField, TextareaField } from "./primitives";

/** Travel services (the "what we arrange" list). */
export function ServiceForm({ service }: { service?: TravelService }) {
  const isEdit = Boolean(service);

  return (
    <AdminForm
      action={saveServiceAction}
      resetOnSuccess={!isEdit}
      aria-label={isEdit ? `${service?.title} — засах` : "Шинэ үйлчилгээ"}
      className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4"
    >
      {isEdit ? <input type="hidden" name="id" defaultValue={service?.id} /> : null}

      <div className="grid gap-3">
        <TextField label="Нэр" name="title" defaultValue={service?.title} required />
        <TextareaField label="Тайлбар" name="description" defaultValue={service?.description} rows={2} />
        <TextareaField
          label="Онцлох зүйлс"
          name="highlights"
          defaultValue={service?.highlights?.join(", ")}
          rows={2}
          placeholder="Виз, Даатгал, Орчуулга"
          hint="Таслалаар тусгаарлана."
        />
      </div>

      <div className="mt-4">
        <SubmitButton
          icon={isEdit ? <Save aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4" />}
        >
          {isEdit ? "Хадгалах" : "Үйлчилгээ нэмэх"}
        </SubmitButton>
      </div>
    </AdminForm>
  );
}

export function ServiceRow({ service }: { service: TravelService }) {
  return (
    <div className="space-y-3 rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[var(--primary)]">{service.title}</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{service.description}</p>
        </div>
        <span className="whitespace-nowrap rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
          {service.highlights.length} онцлох
        </span>
      </div>

      <Disclosure title="Засах">
        <ServiceForm service={service} />
      </Disclosure>

      <AdminForm action={deleteServiceAction}>
        <input type="hidden" name="id" value={service.id} />
        <SubmitButton
          variant="destructive"
          size="sm"
          icon={<Trash2 aria-hidden="true" className="h-3.5 w-3.5" />}
          pendingLabel="Устгаж байна…"
          confirmMessage={`„${service.title}“ үйлчилгээг устгах уу?`}
        >
          Устгах
        </SubmitButton>
      </AdminForm>
    </div>
  );
}
