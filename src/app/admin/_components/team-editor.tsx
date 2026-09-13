"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import type { TeamMember } from "@/lib/site-settings";
import { deleteTeamMemberAction, saveTeamMemberAction } from "../actions";
import { AdminForm, SubmitButton } from "./admin-form";
import { MediaSlot } from "./media-upload-field";
import { CheckboxField, Disclosure, TextField, TextareaField } from "./primitives";

/** Team members appear on /about. */
export function TeamMemberForm({ member }: { member?: TeamMember }) {
  const isEdit = Boolean(member);

  return (
    <AdminForm
      action={saveTeamMemberAction}
      resetOnSuccess={!isEdit}
      aria-label={isEdit ? `${member?.name} — засах` : "Шинэ багийн гишүүн"}
      className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4"
    >
      {isEdit ? <input type="hidden" name="id" defaultValue={member?.id} /> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Нэр" name="name" defaultValue={member?.name} required />
        <TextField label="Албан тушаал" name="role" defaultValue={member?.role} required />
        <MediaSlot
          kind="team-image"
          fieldName="image"
          label="Зураг"
          initialSrc={member?.image ?? ""}
          previewClassName="h-28 w-28"
          allowClear
          hint="JPG, PNG, WEBP — 8MB хүртэл. Сонгомогц шууд байршина."
          className="sm:col-span-2"
        />
        <TextField
          label="Зургийн тайлбар"
          name="imageAlt"
          defaultValue={member?.imageAlt}
          placeholder="Жишээ: Бат инээмсэглэж буй хөрөг"
          hint="Дэлгэц уншигч ашигладаг зочдод зориулсан. Хоосон бол нэрийг ашиглана."
        />
        <TextField
          label="Эрэмбэ"
          name="order"
          type="number"
          min={1}
          defaultValue={member?.order ? String(member.order) : ""}
          placeholder="1"
        />
        <CheckboxField name="isVisible" defaultChecked={member?.isVisible ?? true} label="Вебэд харуулах" />
        <TextareaField
          label="Товч танилцуулга"
          name="bio"
          defaultValue={member?.bio}
          rows={2}
          placeholder="Заавал биш"
          className="sm:col-span-2"
        />
      </div>

      <div className="mt-4">
        <SubmitButton
          icon={isEdit ? <Save aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4" />}
        >
          {isEdit ? "Хадгалах" : "Гишүүн нэмэх"}
        </SubmitButton>
      </div>
    </AdminForm>
  );
}

export function TeamMemberRow({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-3 rounded-md border border-[var(--border)] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {member.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.image} alt="" className="h-12 w-12 shrink-0 rounded-md object-cover ring-1 ring-[var(--border)]" />
          ) : null}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-[var(--primary)]">{member.name}</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{member.role}</p>
          </div>
        </div>
        <span className="whitespace-nowrap rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
          {member.isVisible === false ? "Нуугдсан" : `Эрэмбэ ${member.order ?? "-"}`}
        </span>
      </div>

      <Disclosure title="Засах">
        <TeamMemberForm member={member} />
      </Disclosure>

      <AdminForm action={deleteTeamMemberAction}>
        <input type="hidden" name="id" value={member.id} />
        <SubmitButton
          variant="destructive"
          size="sm"
          icon={<Trash2 aria-hidden="true" className="h-3.5 w-3.5" />}
          pendingLabel="Устгаж байна…"
          confirmMessage={`${member.name}-г багаас устгах уу?`}
        >
          Устгах
        </SubmitButton>
      </AdminForm>
    </div>
  );
}
