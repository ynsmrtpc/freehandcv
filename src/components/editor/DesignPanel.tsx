"use client";

import { Check, Pencil, Pipette, Plus, RefreshCw, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useEffect, useRef, useState } from "react";
import {
  applyTemplateAction,
  clearResumeTemplateAction,
  listOwnTemplatesAction,
  templateUpdateAction,
  type OwnTemplateItem,
} from "@/actions/template";
import { DefinitionPreview, TemplatePreview } from "@/components/resume/TemplatePreview";
import { Link } from "@/i18n/navigation";
import { useEditor } from "@/client/editor/store";
import { cn } from "@/lib/cn";
import { RESUME_LOCALES } from "@/lib/resume/labels";
import { SPACINGS, SIZES, PAPERS, type ResumeData, type TemplateId } from "@/lib/resume/schema";
import {
  FONTS,
  SYSTEM_TEMPLATE_LIST,
  SYSTEM_TEMPLATES,
  ACCENT_COLORS,
  hasSidebar,
  resumeDefinition,
  type DesignDefinition,
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

  const definition = useEditor((st) => resumeDefinition(st.data!));
  const monochrome = definition.monochrome;
  const customColor = !ACCENT_COLORS.some((c) => c.toLowerCase() === s.color.toLowerCase());
  const photoUnsupported = definition.header.photo === "none";

  return (
    <div className="space-y-8 p-4 sm:p-5">
      <TemplatePicker locale={s.locale === "tr" ? "tr" : "en"} />

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
            <option value="">{t("fontDefault", { name: FONTS[definition.typography.font].name })}</option>
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
 * Switching designs: a resume still in the previous design's default colour moves to the new one's
 * colour; a colour the user picked is kept.
 */
function switchColor(v: ResumeData, next: DesignDefinition) {
  const previous = resumeDefinition(v);
  const onDefault = previous.monochrome || v.settings.color.toLowerCase() === previous.colors.accent.toLowerCase();
  if (onDefault && !next.monochrome) v.settings.color = next.colors.accent;
}

const MemoDefinitionPreview = memo(DefinitionPreview);

/**
 * Template picker: thumbnails from the real rendering engine, a scrollable grid and filters.
 * In an account resume, "My templates" lists the user's own templates; applying one goes through
 * the server (access check, plan 11.2) and stores a copy of its definition in the resume.
 */
function TemplatePicker({ locale }: { locale: "tr" | "en" }) {
  const t = useTranslations("Editor.design");
  const tt = useTranslations("Templates");
  const update = useEditor((s) => s.update);
  const selected = useEditor((s) => s.data!.settings.template);
  const custom = useEditor((s) => s.data!.settings.customTemplate);
  const resumeId = useEditor((s) => (s.source.kind === "account" ? s.source.id : null));
  const [filter, setFilter] = useState<Filter | "mine">(custom ? "mine" : "all");
  const [mine, setMine] = useState<OwnTemplateItem[] | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  /** Which applied template (id:version) the server reported a newer version for. */
  const [outdated, setOutdated] = useState<string | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const list = filter === "mine" ? [] : SYSTEM_TEMPLATE_LIST.filter(FILTERS[filter]);

  useEffect(() => {
    if (!resumeId) return;
    let cancelled = false;
    void listOwnTemplatesAction().then((r) => !cancelled && setMine(r.ok ? r.templates : []));
    return () => {
      cancelled = true;
    };
  }, [resumeId]);

  // "A new version is available — apply" (plan 11.2): never applied automatically.
  const customId = custom?.id;
  const customVersion = custom?.version;
  const appliedKey = customId ? `${customId}:${customVersion}` : null;
  const newVersion = !!appliedKey && outdated === appliedKey;
  useEffect(() => {
    if (!resumeId || !customId || !customVersion) return;
    let cancelled = false;
    void templateUpdateAction(customId, customVersion).then(
      (r) => !cancelled && r.ok && r.update && setOutdated(`${customId}:${customVersion}`),
    );
    return () => {
      cancelled = true;
    };
  }, [resumeId, customId, customVersion]);

  // On open, bring the selected template into view (only the grid scrolls, not the panel).
  useEffect(() => {
    const grid = gridRef.current;
    const el = grid?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (grid && el) grid.scrollTop = el.offsetTop - grid.offsetTop - 8;
  }, [mine]);

  const choose = (id: TemplateId) => {
    if (custom && resumeId) void clearResumeTemplateAction(resumeId);
    update((v) => {
      switchColor(v, SYSTEM_TEMPLATES[id].definition);
      v.settings.template = id;
      v.settings.customTemplate = null;
    }, false);
  };

  const chooseCustom = async (id: string) => {
    if (!resumeId || pending) return;
    setPending(id);
    setFailed(false);
    const r = await applyTemplateAction(id, resumeId);
    setPending(null);
    if (!r.ok) return setFailed(true);
    update((v) => {
      switchColor(v, r.template.definition);
      v.settings.customTemplate = r.template;
    }, false);
  };

  const filters: (Filter | "mine")[] = [...(resumeId ? ["mine" as const] : []), ...(Object.keys(FILTERS) as Filter[])];
  const card = (isSelected: boolean) =>
    cn(
      "group relative block w-full rounded-xl border-2 bg-surface p-1.5 text-start transition-[border-color,box-shadow]",
      isSelected ? "border-primary shadow-elevated" : "border-border hover:border-border-strong",
    );
  const tick = (
    <span className="absolute end-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-primary text-white shadow-card">
      <Check className="size-3" strokeWidth={3} aria-hidden />
    </span>
  );

  return (
    <section>
      <Heading>{t("template")}</Heading>
      <div role="group" aria-label={t("filter.label")} className="mb-3 flex flex-wrap gap-1.5">
        {filters.map((f) => (
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
              {f === "mine" ? (mine?.length ?? "…") : SYSTEM_TEMPLATE_LIST.filter(FILTERS[f]).length}
            </span>
          </button>
        ))}
      </div>
      <ul
        ref={gridRef}
        aria-busy={filter === "mine" && !mine}
        className="-mx-1 grid max-h-[min(36rem,62vh)] grid-cols-2 gap-2.5 overflow-y-auto overscroll-contain px-1 py-1 min-[420px]:grid-cols-3"
      >
        {list.map((s) => {
          const isSelected = !custom && s.id === selected;
          return (
            <li key={s.id}>
              <button type="button" aria-pressed={isSelected} onClick={() => choose(s.id)} className={card(isSelected)}>
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
                {isSelected && tick}
              </button>
            </li>
          );
        })}
        {filter === "mine" &&
          mine?.map((m) => {
            const isSelected = custom?.id === m.id;
            return (
              <li key={m.id} className="relative">
                <button
                  type="button"
                  aria-pressed={isSelected}
                  aria-busy={pending === m.id}
                  disabled={!!pending}
                  onClick={() => void chooseCustom(m.id)}
                  className={cn(card(isSelected), pending === m.id && "opacity-60")}
                >
                  <div className="overflow-hidden rounded-md ring-1 ring-black/5">
                    <MemoDefinitionPreview definition={m.definition} locale={locale} initialScale={0.16} />
                  </div>
                  <span className="mt-1.5 block truncate px-0.5 pe-6 text-xs font-semibold text-foreground">{m.name}</span>
                  <span className="flex items-center gap-1 px-0.5 pb-0.5 text-[11px] font-medium text-accent">
                    <ShieldCheck className="size-3" aria-hidden />
                    {t("ats", { score: m.atsScore ?? 1 })}
                  </span>
                  {isSelected && tick}
                </button>
                <Link
                  href={{ pathname: "/template-editor/[id]", params: { id: m.id } }}
                  aria-label={t("mine.edit", { name: m.name })}
                  title={t("mine.edit", { name: m.name })}
                  className="absolute end-2 bottom-2 grid size-6 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-foreground"
                >
                  <Pencil className="size-3.5" aria-hidden />
                </Link>
              </li>
            );
          })}
        {filter === "mine" && mine && (
          <li>
            <Link
              href="/template-editor/new"
              className="grid h-full min-h-32 w-full place-items-center rounded-xl border-2 border-dashed border-border-strong p-3 text-center text-xs font-semibold text-muted transition-colors hover:border-primary hover:text-primary-text"
            >
              <span className="flex flex-col items-center gap-2">
                <Plus className="size-5" aria-hidden />
                {t("mine.create")}
              </span>
            </Link>
          </li>
        )}
      </ul>
      {filter === "mine" && mine?.length === 0 && (
        <p className="mt-3 text-[13px] leading-relaxed text-muted">{t("mine.empty")}</p>
      )}
      {failed && (
        <p role="alert" className="mt-3 text-[13px] font-medium text-danger">
          {t("mine.applyError")}
        </p>
      )}
      {custom ? (
        <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted">
          <p>
            <span className="font-semibold text-foreground">{custom.name}:</span> {t("mine.applied")}
          </p>
          {newVersion && (
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-surface-2 px-3 py-2">
              {t("mine.newVersion")}
              <button
                type="button"
                onClick={() => void chooseCustom(custom.id)}
                disabled={!!pending}
                className="inline-flex items-center gap-1 font-semibold text-primary-text hover:underline"
              >
                <RefreshCw className="size-3.5" aria-hidden />
                {t("mine.applyNewVersion")}
              </button>
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          <span className="font-semibold text-foreground">{tt(`names.${selected}`)}:</span>{" "}
          {tt(`descriptions.${selected}`)}
        </p>
      )}
    </section>
  );
}
