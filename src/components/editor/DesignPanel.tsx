"use client";

import { Check, Pipette, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useEffect, useRef, useState } from "react";
import { TemplatePreview } from "@/components/resume/TemplatePreview";
import { useEditor } from "@/client/editor/store";
import { cn } from "@/lib/cn";
import { RESUME_LOCALES } from "@/lib/resume/labels";
import { SPACINGS, SIZES, PAPERS, type TemplateId } from "@/lib/resume/schema";
import {
  FONTS,
  SYSTEM_TEMPLATE_LIST,
  SYSTEM_TEMPLATES,
  ACCENT_COLORS,
  hasSidebar,
  type FontId,
  type SystemTemplate,
} from "@/lib/resume/design";
import { Checkbox, Segmented } from "./ui";

function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-xs font-bold tracking-wider text-muted uppercase">{children}</h3>;
}

const selectClass =
  "h-10 w-full rounded-lg border border-border-strong bg-surface px-3 text-[15px] text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15";

export function DesignPanel() {
  const t = useTranslations("Editor.design");
  const s = useEditor((st) => st.data!.settings);
  const update = useEditor((st) => st.update);
  const set = <K extends keyof typeof s>(k: K, value: (typeof s)[K]) =>
    update((v) => void (v.settings[k] = value), false);

  const template = SYSTEM_TEMPLATES[s.template];
  const monochrome = template.definition.monochrome;
  const customColor = !ACCENT_COLORS.some((c) => c.toLowerCase() === s.color.toLowerCase());
  const photoUnsupported = template.definition.header.photo === "none";

  return (
    <div className="space-y-8 p-4 sm:p-5">
      <TemplatePicker selected={s.template} locale={s.locale === "tr" ? "tr" : "en"} />

      <section>
        <Heading>{t("color")}</Heading>
        <div className={cn("flex flex-wrap items-center gap-2", monochrome && "pointer-events-none opacity-40")}>
          {ACCENT_COLORS.map((c) => {
            const selected = c.toLowerCase() === s.color.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                aria-pressed={selected}
                aria-label={c}
                onClick={() => set("color", c)}
                className={cn(
                  "grid size-9 place-items-center rounded-full ring-offset-2 ring-offset-surface transition-shadow",
                  selected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-border-strong",
                )}
                style={{ background: c }}
              >
                {selected && <Check className="size-4 text-white" strokeWidth={3} />}
              </button>
            );
          })}
          <label
            className={cn(
              "relative grid size-9 cursor-pointer place-items-center rounded-full border border-dashed border-border-strong text-muted ring-offset-2 ring-offset-surface hover:text-foreground",
              customColor && "border-solid ring-2 ring-primary",
            )}
            style={customColor ? { background: s.color, color: "#fff" } : undefined}
            title={t("customColor")}
          >
            <Pipette className="size-4" />
            <input
              type="color"
              aria-label={t("customColor")}
              className="absolute inset-0 cursor-pointer opacity-0"
              value={s.color}
              onChange={(e) => {
                const value = e.target.value;
                update((v) => void (v.settings.color = value));
              }}
            />
          </label>
        </div>
        {monochrome && <p className="mt-2 text-[13px] text-muted">{t("monochrome")}</p>}
      </section>

      <section className="space-y-4">
        <Heading>{t("typography")}</Heading>
        <div>
          <label htmlFor="setting-font" className="mb-1.5 block text-[13px] font-semibold text-foreground">
            {t("font")}
          </label>
          <select id="setting-font" className={selectClass} value={s.font} onChange={(e) => set("font", e.target.value)}>
            <option value="">{t("fontDefault", { name: FONTS[template.definition.typography.font].name })}</option>
            {(Object.keys(FONTS) as FontId[]).map((f) => (
              <option key={f} value={f}>
                {FONTS[f].name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          <Segmented
            label={t("size")}
            value={s.size}
            options={SIZES.map((v) => ({ value: v, label: t(`sizes.${v}`) }))}
            onChange={(v) => set("size", v)}
          />
          <Segmented
            label={t("spacing")}
            value={s.spacing}
            options={SPACINGS.map((v) => ({ value: v, label: t(`spacings.${v}`) }))}
            onChange={(v) => set("spacing", v)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <Heading>{t("document")}</Heading>
        <div>
          <label htmlFor="setting-locale" className="mb-1.5 block text-[13px] font-semibold text-foreground">
            {t("resumeLocale")}
          </label>
          <select id="setting-locale" className={selectClass} value={s.locale} onChange={(e) => set("locale", e.target.value)}>
            {Object.entries(RESUME_LOCALES).map(([k, l]) => (
              <option key={k} value={k}>
                {l.name}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{t("resumeLocaleHint")}</p>
        </div>
        <div>
          <Segmented
            label={t("paper")}
            value={s.paper}
            options={PAPERS.map((p) => ({ value: p, label: p }))}
            onChange={(v) => set("paper", v)}
          />
          <p className="mt-1.5 text-xs text-muted">{t("paperHint")}</p>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-foreground">{t("photo")}</p>
          <Checkbox
            label={photoUnsupported ? t("photoUnsupported") : t("showPhoto")}
            checked={s.showPhoto && !photoUnsupported}
            disabled={photoUnsupported}
            onChange={(v) => set("showPhoto", v)}
          />
        </div>
      </section>
    </div>
  );
}

const FILTERS = {
  all: () => true,
  ats: (s: SystemTemplate) => s.ats === 5,
  photo: (s: SystemTemplate) => s.definition.header.photo !== "none",
  twoColumn: (s: SystemTemplate) => hasSidebar(s.definition),
} as const;
type Filter = keyof typeof FILTERS;

// Thumbnails re-render only when the template or locale changes (the editor re-renders on every keystroke).
const Thumbnail = memo(TemplatePreview);

/**
 * Template picker: thumbnails from the real rendering engine, a scrollable grid and filters.
 * When switching templates, a resume still in the previous template's default colour moves to the
 * new template's colour; a colour the user picked is kept.
 */
function TemplatePicker({ selected, locale }: { selected: TemplateId; locale: "tr" | "en" }) {
  const t = useTranslations("Editor.design");
  const tt = useTranslations("Templates");
  const update = useEditor((s) => s.update);
  const [filter, setFilter] = useState<Filter>("all");
  const gridRef = useRef<HTMLUListElement>(null);
  const list = SYSTEM_TEMPLATE_LIST.filter(FILTERS[filter]);

  // On open, bring the selected template into view (only the grid scrolls, not the panel).
  useEffect(() => {
    const grid = gridRef.current;
    const el = grid?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (grid && el) grid.scrollTop = el.offsetTop - grid.offsetTop - 8;
  }, []);

  const choose = (id: TemplateId) =>
    update((v) => {
      const previous = SYSTEM_TEMPLATES[v.settings.template].definition;
      const next = SYSTEM_TEMPLATES[id].definition;
      const onDefault =
        previous.monochrome || v.settings.color.toLowerCase() === previous.colors.accent.toLowerCase();
      if (onDefault && !next.monochrome) v.settings.color = next.colors.accent;
      v.settings.template = id;
    }, false);

  return (
    <section>
      <Heading>{t("template")}</Heading>
      <div role="group" aria-label={t("filter.label")} className="mb-3 flex flex-wrap gap-1.5">
        {(Object.keys(FILTERS) as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={f === filter}
            onClick={() => setFilter(f)}
            className={cn(
              "h-8 rounded-full border px-3 text-xs font-semibold transition-colors",
              f === filter
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
            )}
          >
            {t(`filter.${f}`)}
            <span className={cn("ms-1 tabular-nums", f === filter ? "text-white/80" : "text-muted/80")}>
              {SYSTEM_TEMPLATE_LIST.filter(FILTERS[f]).length}
            </span>
          </button>
        ))}
      </div>
      <ul
        ref={gridRef}
        className="-mx-1 grid max-h-[min(36rem,62vh)] grid-cols-2 gap-2.5 overflow-y-auto overscroll-contain px-1 py-1 min-[420px]:grid-cols-3"
      >
        {list.map((s) => {
          const isSelected = s.id === selected;
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => choose(s.id)}
                className={cn(
                  "group relative block w-full rounded-xl border-2 bg-surface p-1.5 text-start transition-[border-color,box-shadow]",
                  isSelected ? "border-primary shadow-elevated" : "border-border hover:border-border-strong",
                )}
              >
                <div className="overflow-hidden rounded-md ring-1 ring-black/5">
                  <Thumbnail templateId={s.id} locale={locale} initialScale={0.16} />
                </div>
                <span className="mt-1.5 block truncate px-0.5 text-xs font-semibold text-foreground">
                  {tt(`names.${s.id}`)}
                </span>
                <span className="flex items-center gap-1 px-0.5 pb-0.5 text-[11px] font-medium text-accent">
                  <ShieldCheck className="size-3" aria-hidden />
                  {t("ats", { score: s.ats })}
                </span>
                {isSelected && (
                  <span className="absolute end-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-primary text-white shadow-card">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        <span className="font-semibold text-foreground">{tt(`names.${selected}`)}:</span>{" "}
        {tt(`descriptions.${selected}`)}
      </p>
    </section>
  );
}
