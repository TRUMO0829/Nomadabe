"use client";

import { useMemo, useState, useTransition } from "react";
import type { ReactNode } from "react";
import { ImageIcon, Layers, Palette, Save, SlidersHorizontal, Type } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { saveSiteSettingsAction } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/site-settings";

type Props = {
  settings: SiteSettings;
};

export function AdminVisualEditor({ settings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState(settings);

  const previewOverlay = useMemo(
    () =>
      `linear-gradient(to bottom, rgba(0, 0, 0, ${draft.heroOverlayOpacity * 0.55}), rgba(0, 0, 0, ${
        draft.heroOverlayOpacity * 0.25
      }), rgba(0, 0, 0, ${draft.heroOverlayOpacity}))`,
    [draft.heroOverlayOpacity]
  );

  function updateDraft<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function save(formData: FormData) {
    startTransition(async () => {
      await saveSiteSettingsAction(formData);
    });
  }

  return (
    <form action={save} className="overflow-hidden rounded-md border border-[#ded7ca] bg-[#151b18] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0f1a17] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#e85d2c]">
            <Palette className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f6b79f]">Visual editor</p>
            <h3 className="text-base font-semibold">Homepage hero canvas</h3>
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-[#0f1a17] hover:bg-[#f4efe6] disabled:opacity-70"
          disabled={isPending}
        >
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save design"}
        </button>
      </div>

      <div className="grid gap-0 xl:grid-cols-[340px_1fr]">
        <div className="border-b border-white/10 bg-[#111713] p-4 text-white xl:border-b-0 xl:border-r">
          <div className="space-y-4">
            <EditorField icon={Type} label="Badge">
              <input
                name="heroBadge"
                value={draft.heroBadge}
                onChange={(event) => updateDraft("heroBadge", event.target.value)}
                className="h-10 w-full rounded-md border border-white/10 bg-white/10 px-3 text-sm outline-none focus:border-[#f6b79f]"
              />
            </EditorField>

            <EditorField icon={Type} label="Hero title">
              <textarea
                name="heroTitle"
                value={draft.heroTitle}
                onChange={(event) => updateDraft("heroTitle", event.target.value)}
                rows={3}
                className="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm outline-none focus:border-[#f6b79f]"
              />
            </EditorField>

            <EditorField icon={Type} label="Subtitle">
              <textarea
                name="heroSubtitle"
                value={draft.heroSubtitle}
                onChange={(event) => updateDraft("heroSubtitle", event.target.value)}
                rows={4}
                className="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm outline-none focus:border-[#f6b79f]"
              />
            </EditorField>

            <EditorField icon={ImageIcon} label="Background image URL">
              <input
                name="heroImage"
                value={draft.heroImage}
                onChange={(event) => updateDraft("heroImage", event.target.value)}
                className="h-10 w-full rounded-md border border-white/10 bg-white/10 px-3 text-sm outline-none focus:border-[#f6b79f]"
              />
            </EditorField>

            <div className="grid grid-cols-2 gap-3">
              <EditorField icon={Palette} label="Accent">
                <input
                  name="accentColor"
                  type="color"
                  value={draft.accentColor}
                  onChange={(event) => updateDraft("accentColor", event.target.value)}
                  className="h-10 w-full cursor-pointer rounded-md border border-white/10 bg-white/10 p-1"
                />
              </EditorField>
              <EditorField icon={Palette} label="Text">
                <input
                  name="heroTextColor"
                  type="color"
                  value={draft.heroTextColor}
                  onChange={(event) => updateDraft("heroTextColor", event.target.value)}
                  className="h-10 w-full cursor-pointer rounded-md border border-white/10 bg-white/10 p-1"
                />
              </EditorField>
            </div>

            <EditorField icon={SlidersHorizontal} label={`Overlay ${Math.round(draft.heroOverlayOpacity * 100)}%`}>
              <input
                name="heroOverlayOpacity"
                type="range"
                min="0.2"
                max="0.9"
                step="0.01"
                value={draft.heroOverlayOpacity}
                onChange={(event) => updateDraft("heroOverlayOpacity", Number(event.target.value))}
                className="w-full accent-[#e85d2c]"
              />
            </EditorField>
          </div>
        </div>

        <div className="bg-[#202622] p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Layers className="h-4 w-4 text-[#f6b79f]" />
              Live preview
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#6bd48f]" />
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-md border border-white/10 bg-cover bg-center shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${draft.heroImage}')` }}
            />
            <div className="absolute inset-0" style={{ background: previewOverlay }} />
            <div className="relative flex min-h-[520px] flex-col justify-between p-5 sm:p-8">
              <div className="flex items-center justify-between gap-4" style={{ color: draft.heroTextColor }}>
                <span className="max-w-[60%] text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
                  {draft.heroBadge}
                </span>
                <span className="hidden text-[11px] uppercase tracking-[0.18em] opacity-80 sm:block">
                  Est. 2025 · Ulaanbaatar
                </span>
              </div>

              <div>
                <h4
                  className="max-w-3xl whitespace-pre-line font-display text-5xl leading-[0.95] tracking-normal sm:text-7xl"
                  style={{ color: draft.heroTextColor }}
                >
                  {draft.heroTitle}
                </h4>
                <p className="mt-5 max-w-xl text-base leading-7 opacity-85" style={{ color: draft.heroTextColor }}>
                  {draft.heroSubtitle}
                </p>

                <div className="mt-8 max-w-3xl rounded-full bg-[#f6f2ea] p-2 shadow-xl">
                  <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-1 text-[#111713]">
                    <PreviewSearchItem label="Where" value="Mongolia, Asia, Europe" accent={draft.accentColor} />
                    <PreviewSearchItem label="When" value="Any month" accent={draft.accentColor} />
                    <span
                      className="inline-flex h-14 items-center justify-center rounded-full px-5 text-sm font-semibold text-white"
                      style={{ backgroundColor: draft.accentColor }}
                    >
                      Search
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function EditorField({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#d9d2c3]">
        <Icon className="h-3.5 w-3.5 text-[#f6b79f]" />
        {label}
      </span>
      {children}
    </label>
  );
}

function PreviewSearchItem({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <span className="min-w-0 border-r border-[#ded7ca] px-4 py-2">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#706b62]">{label}</span>
      <span className="mt-1 block truncate text-sm font-semibold" style={{ color: accent }}>
        {value}
      </span>
    </span>
  );
}
