"use client";

import { useState } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";
import type { AdventureItineraryStep } from "@/lib/adventures";

type EditableItem = { time: string; text: string };
type EditableDay = { title: string; items: EditableItem[] };

function toEditable(steps?: AdventureItineraryStep[]): EditableDay[] {
  if (!Array.isArray(steps) || steps.length === 0) {
    return [];
  }

  return steps.map((step) => ({
    title: step.title ?? "",
    items:
      step.items && step.items.length > 0
        ? step.items.map((item) => ({ time: item.time ?? "", text: item.text ?? "" }))
        : step.body
          ? [{ time: "", text: step.body }]
          : [{ time: "", text: "" }],
  }));
}

function serialize(days: EditableDay[]): string {
  const steps = days
    .map((day, index) => {
      const items = day.items
        .map((item) => ({ time: item.time.trim() || undefined, text: item.text.trim() }))
        .filter((item) => item.text);

      return {
        day: `${index + 1}`,
        title: day.title.trim(),
        ...(items.length > 0 ? { items } : {}),
      };
    })
    .filter((step) => step.title || (step.items && step.items.length > 0));

  return steps.length > 0 ? JSON.stringify(steps) : "";
}

export function AdminItineraryEditor({
  defaultValue,
}: {
  defaultValue?: AdventureItineraryStep[];
}) {
  const [days, setDays] = useState<EditableDay[]>(() => toEditable(defaultValue));

  function update(next: EditableDay[]) {
    setDays(next);
  }

  function addDay() {
    update([...days, { title: "", items: [{ time: "", text: "" }] }]);
  }

  function removeDay(dayIndex: number) {
    update(days.filter((_, index) => index !== dayIndex));
  }

  function setDayTitle(dayIndex: number, title: string) {
    update(days.map((day, index) => (index === dayIndex ? { ...day, title } : day)));
  }

  function addItem(dayIndex: number) {
    update(
      days.map((day, index) =>
        index === dayIndex ? { ...day, items: [...day.items, { time: "", text: "" }] } : day
      )
    );
  }

  function removeItem(dayIndex: number, itemIndex: number) {
    update(
      days.map((day, index) =>
        index === dayIndex
          ? { ...day, items: day.items.filter((_, i) => i !== itemIndex) }
          : day
      )
    );
  }

  function setItem(dayIndex: number, itemIndex: number, patch: Partial<EditableItem>) {
    update(
      days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              items: day.items.map((item, i) =>
                i === itemIndex ? { ...item, ...patch } : item
              ),
            }
          : day
      )
    );
  }

  return (
    <div className="lg:col-span-3">
      <input type="hidden" name="itinerary" value={serialize(days)} />

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
          Аяллын хөтөлбөр (өдөр / цагаар)
        </span>
        <span className="text-xs font-medium text-[var(--muted-foreground)]">
          Хоосон бол автоматаар үүснэ
        </span>
      </div>

      <div className="mt-3 space-y-3">
        {days.length === 0 ? (
          <p className="rounded-md border border-dashed border-[var(--border)] bg-white px-4 py-4 text-sm font-medium text-[var(--muted-foreground)]">
            Өдөр бүрийн маршрут, цагийн хуваарийг өөрөө оруулах бол доороос &laquo;Өдөр нэмэх&raquo; дарна уу.
            Оруулаагүй бол аялал автоматаар үүснэ.
          </p>
        ) : null}

        {days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="rounded-md border border-[var(--border)] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)]">
                {dayIndex + 1}
              </span>
              <input
                value={day.title}
                onChange={(event) => setDayTitle(dayIndex, event.target.value)}
                placeholder={`Өдөр ${dayIndex + 1} — гарчиг (ж: Улаанбаатар → Бээжин)`}
                className="h-10 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
              />
              <button
                type="button"
                onClick={() => removeDay(dayIndex)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                aria-label="Өдрийг устгах"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 pl-11">
              {day.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-2">
                  <div className="relative w-28 shrink-0">
                    <Clock className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
                    <input
                      value={item.time}
                      onChange={(event) => setItem(dayIndex, itemIndex, { time: event.target.value })}
                      placeholder="09:00"
                      className="h-9 w-full rounded-md border border-[var(--border)] bg-white pl-7 pr-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                    />
                  </div>
                  <input
                    value={item.text}
                    onChange={(event) => setItem(dayIndex, itemIndex, { text: event.target.value })}
                    placeholder="Хөтөлбөр (ж: Нисэх буудал, зочид буудалд байрлах)"
                    className="h-9 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(dayIndex, itemIndex)}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    aria-label="Цагийг устгах"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItem(dayIndex)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <Plus className="h-3.5 w-3.5" />
                Цаг нэмэх
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addDay}
        className="mt-3 inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--foreground)]"
      >
        <Plus className="h-4 w-4" />
        Өдөр нэмэх
      </button>
    </div>
  );
}
