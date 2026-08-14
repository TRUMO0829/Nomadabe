import { Plus, Save, Trash2 } from "lucide-react";
import type { TeamMember } from "@/lib/site-settings";
import { ConfirmSubmitButton } from "@/components/admin-confirm-button";
import { deleteTeamMemberAction, saveTeamMemberAction } from "../actions";
import { TextField, TextareaField } from "./primitives";

/**
 * Team members appear on /about. The save and delete actions already existed but
 * were never wired to a form, so the only way to change the team was to edit the
 * source and redeploy.
 */
export function TeamMemberForm({ member }: { member?: TeamMember }) {
  const isEdit = Boolean(member);

  return (
    <form
      action={saveTeamMemberAction}
      className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4"
    >
      {isEdit ? <input type="hidden" name="id" defaultValue={member?.id} /> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Нэр" name="name" defaultValue={member?.name} required />
        <TextField label="Албан тушаал" name="role" defaultValue={member?.role} required />
        <TextField
          label="Зургийн URL"
          name="image"
          defaultValue={member?.image}
          placeholder="https://..."
        />
        <TextField
          label="Зургийн alt"
          name="imageAlt"
          defaultValue={member?.imageAlt}
          placeholder="Зураг тайлбарлах текст"
        />
        <TextField
          label="Эрэмбэ"
          name="order"
          type="number"
          defaultValue={member?.order ? String(member.order) : ""}
          placeholder="1"
        />
        <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-[var(--foreground)]">
          <input
            type="checkbox"
            name="isVisible"
            defaultChecked={member?.isVisible ?? true}
            className="h-4 w-4"
          />
          Вебэд харуулах
        </label>
        <div className="sm:col-span-2">
          <TextareaField
            label="Товч танилцуулга"
            name="bio"
            defaultValue={member?.bio}
            rows={2}
            placeholder="Заавал биш"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white"
        >
          {isEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isEdit ? "Хадгалах" : "Гишүүн нэмэх"}
        </button>
      </div>
    </form>
  );
}

export function TeamMemberRow({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-3 rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[var(--primary)]">{member.name}</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{member.role}</p>
        </div>
        <span className="whitespace-nowrap rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
          {member.isVisible === false ? "Нуугдсан" : `Эрэмбэ ${member.order ?? "-"}`}
        </span>
      </div>

      <details>
        <summary className="cursor-pointer text-sm font-semibold text-[var(--muted-foreground)]">
          Засах
        </summary>
        <div className="mt-3">
          <TeamMemberForm member={member} />
        </div>
      </details>

      <form action={deleteTeamMemberAction}>
        <input type="hidden" name="id" defaultValue={member.id} />
        <ConfirmSubmitButton
          className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border)] px-3 text-xs font-semibold text-[var(--foreground)]"
          message={`${member.name}-г устгах уу?`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Устгах
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
