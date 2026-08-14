import { Plus, Save, Trash2 } from "lucide-react";
import type { TravelService } from "@/lib/adventures";
import { ConfirmSubmitButton } from "@/components/admin-confirm-button";
import { deleteServiceAction, saveServiceAction } from "../actions";
import { TextField, TextareaField } from "./primitives";

/**
 * Travel services (the "what we arrange" list). Like the team editor, the
 * actions existed but had no form behind them.
 */
export function ServiceForm({ service }: { service?: TravelService }) {
  const isEdit = Boolean(service);

  return (
    <form
      action={saveServiceAction}
      className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4"
    >
      {isEdit ? <input type="hidden" name="id" defaultValue={service?.id} /> : null}

      <div className="grid gap-3">
        <TextField label="Нэр" name="title" defaultValue={service?.title} required />
        <TextareaField
          label="Тайлбар"
          name="description"
          defaultValue={service?.description}
          rows={2}
        />
        <TextareaField
          label="Онцлох зүйлс"
          name="highlights"
          defaultValue={service?.highlights?.join(", ")}
          rows={2}
          placeholder="Таслалаар тусгаарлана. Жишээ: Виз, Даатгал, Орчуулга"
        />
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white"
        >
          {isEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isEdit ? "Хадгалах" : "Үйлчилгээ нэмэх"}
        </button>
      </div>
    </form>
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

      <details>
        <summary className="cursor-pointer text-sm font-semibold text-[var(--muted-foreground)]">
          Засах
        </summary>
        <div className="mt-3">
          <ServiceForm service={service} />
        </div>
      </details>

      <form action={deleteServiceAction}>
        <input type="hidden" name="id" defaultValue={service.id} />
        <ConfirmSubmitButton
          className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border)] px-3 text-xs font-semibold text-[var(--foreground)]"
          message={`${service.title}-г устгах уу?`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Устгах
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
