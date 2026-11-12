"use client";

import { useConfirm } from "@/components/ui/ConfirmProvider";

import { AlertTriangle, ArrowLeft, Check, Loader2, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  createTemplateAction,
  deleteTemplateAction,
  setTemplateVisibilityAction,
  updateTemplateAction,
  type TemplateActionError,
} from "@/actions/template";
import { Checkbox, Field, Input, Textarea } from "@/components/editor/ui";
import { WorkspaceViewSwitch } from "@/components/editor/WorkspaceViewSwitch";
import { DefinitionPreview } from "@/components/resume/TemplatePreview";
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui/Button";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { atsScore } from "@/lib/resume/checks";
import {
  FONTS,
  SYSTEM_TEMPLATE_LIST,
  hasSidebar,
  hasWhiteTextOnAccent,
  withDefaults,
  type DesignDefinition,
  type FontId,
} from "@/lib/resume/design";
import { SECTIONS, type TemplateId } from "@/lib/resume/schema";
import { whiteContrast } from "@/lib/resume/utils";
import { OPTIONS, type OptionField } from "./options";

// Visual template editor (plan 11.1, 9 /sablon-editoru): settings on the left, the sample resume drawn
// by the real engine on the right. The user only picks values the design schema allows, so there is
// nothing executable in a template. Saving is explicit: each save is a new version that resumes using
// the template are offered (plan 11.2), so it should not happen on every click.

type Visibility = "private" | "unlisted" | "public";
export type EditableTemplate = {
  id: string;
  name: string;
  description: string;
  definition: DesignDefinition;
  visibility: Visibility;
};

const NAME_MAX = 60;
const DESCRIPTION_MAX = 300;

const selectClass =
  "h-11 w-full rounded-lg border border-border-strong bg-surface px-3 text-base text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15";


const DEFAULT_SIDEBAR_SECTIONS = ["skills", "languages", "certifications", "interests"];

export function TemplateEditor({
  template,
  initialDefinition,
}: {
  /** Absent for a new template. */
  template?: EditableTemplate;
  initialDefinition: DesignDefinition;
}) {
  const confirm = useConfirm();
  const t = useTranslations("TemplateEditor");
  const te = useTranslations("Editor");
  const tt = useTranslations("Templates");
  // Option keys are built from OPTIONS, which the message files mirror one to one.
  const tx = t as unknown as (key: string) => string;
  const locale = useLocale();
  const router = useRouter();
  const [saved, setSaved] = useState(() => ({
    name: template?.name ?? "",
    description: template?.description ?? "",
    definition: withDefaults(initialDefinition),
  }));
  const [name, setName] = useState(saved.name);
  const [description, setDescription] = useState(saved.description);
  const [d, setD] = useState<DesignDefinition>(saved.definition);
  const [visibility, setVisibility] = useState<Visibility>(template?.visibility ?? "private");
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved" } | { kind: "error"; reason: TemplateActionError }>({
    kind: "idle",
  });
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [previewLocale, setPreviewLocale] = useState(locale === "tr" ? "tr" : "en");

  const hasChanges =
    name !== saved.name ||
    description !== saved.description ||
    JSON.stringify(d) !== JSON.stringify(saved.definition);
  const dirty = !template || hasChanges;

  // Leaving with unsaved changes asks first (the browser's own dialog).
  useEffect(() => {
    if (!hasChanges) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasChanges]);

  const patch = (recipe: (draft: DesignDefinition) => void) =>
    setD((current) => {
      const draft = structuredClone(current);
      recipe(draft);
      return withDefaults(draft);
    });

  const setLayout = (layout: DesignDefinition["layout"]) =>
    patch((x) => {
      x.layout = layout;
      if (hasSidebar(x)) x.sidebar ??= { width: 62, sections: DEFAULT_SIDEBAR_SECTIONS };
      else delete x.sidebar;
      // The band default depends on the layout; a top band without a background makes no sense.
      if (layout === "top-band" && x.band === "none") x.band = "accent";
    });

  const startFrom = (id: TemplateId) => {
    const base = SYSTEM_TEMPLATE_LIST.find((s) => s.id === id);
    if (base) setD(withDefaults(base.definition));
  };

  const save = async () => {
    if (!name.trim()) return setStatus({ kind: "error", reason: "invalid" });
    setStatus({ kind: "saving" });
    const input = { name, description, definition: d };
    const r = template ? await updateTemplateAction(template.id, input) : await createTemplateAction(input);
    if (!r.ok) return setStatus({ kind: "error", reason: r.reason });
    setSaved({ name: name.trim(), description: description.trim(), definition: d });
    setName(name.trim());
    setDescription(description.trim());
    setStatus({ kind: "saved" });
    if (!template && "id" in r) router.replace({ pathname: "/template-editor/[id]", params: { id: r.id } });
  };

  const changeVisibility = async (next: Visibility) => {
    if (!template) return;
    const previous = visibility;
    setVisibility(next);
    const r = await setTemplateVisibilityAction(template.id, next);
    if (!r.ok) {
      setVisibility(previous);
      setStatus({ kind: "error", reason: r.reason });
    }
  };

  const remove = async () => {
    if (!template || !await confirm(t("deleteConfirm", { name: saved.name }), { danger: true })) return;
    const r = await deleteTemplateAction(template.id);
    if (r.ok) router.replace("/dashboard/templates");
    else setStatus({ kind: "error", reason: r.reason });
  };

  const ats = atsScore(d);
  const lowContrast = hasWhiteTextOnAccent(d) && whiteContrast(d.colors.accent) < 4.5;
  const sidebar = hasSidebar(d) ? d.sidebar : undefined;

  const choice = <F extends OptionField>(
    field: F,
    value: (typeof OPTIONS)[F][number],
    onChange: (v: (typeof OPTIONS)[F][number]) => void,
    label = tx(`fields.${field}`),
  ) => (
    <Field label={label} half>
      {(id) => (
        <select
          id={id}
          className={selectClass}
          value={value}
          onChange={(e) => onChange(e.target.value as (typeof OPTIONS)[F][number])}
        >
          {OPTIONS[field].map((o) => (
            <option key={o} value={o}>
              {tx(`options.${field}.${o}`)}
            </option>
          ))}
        </select>
      )}
    </Field>
  );

  const number = (label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void) => (
    <Field label={label} half extra={<span className="font-medium text-muted tabular-nums">{value}</span>}>
      {(id) => (
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(+e.target.value)}
          className="h-11 w-full accent-primary"
        />
      )}
    </Field>
  );

  const color = (key: keyof DesignDefinition["colors"]) => (
    <Field label={t(`colors.${key}`)} half>
      {(id) => (
        <div className="flex h-10 items-center gap-2 rounded-lg border border-border-strong bg-surface px-2">
          <input
            id={id}
            type="color"
            value={d.colors[key]}
            onChange={(e) => {
              const value = e.target.value;
              patch((x) => void (x.colors[key] = value));
            }}
            className="size-7 cursor-pointer rounded border-0 bg-transparent p-0"
          />
          <span className="font-mono text-[13px] text-muted uppercase">{d.colors[key]}</span>
        </div>
      )}
    </Field>
  );

  const group = (title: string, children: React.ReactNode) => (
    <section className="space-y-4 border-b border-border pb-6 last:border-0">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">{children}</div>
    </section>
  );

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 sm:px-4">
        <Link href="/dashboard/templates" aria-label={t("back")} className="grid size-11 shrink-0 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground pointer-fine:size-9">
          <ArrowLeft className="size-[18px]" />
        </Link>
        <Logo className="[&>span:last-child]:max-sm:hidden" />
        <h1 className="ms-2 min-w-0 truncate text-base font-semibold text-foreground max-sm:sr-only">
          {template ? saved.name : t("newTitle")}
        </h1>
        <div className="ms-auto flex items-center gap-2">
          <p className="hidden text-xs text-muted sm:block" aria-live="polite">
            {status.kind === "saving" ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="size-3.5 animate-spin" />
                {t("status.saving")}
              </span>
            ) : status.kind === "error" ? (
              <span className="font-medium text-danger">{t(`errors.${status.reason}`)}</span>
            ) : hasChanges ? (
              t("status.unsaved")
            ) : status.kind === "saved" ? (
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-accent" />
                {t("status.saved")}
              </span>
            ) : null}
          </p>
          <button
            type="button"
            onClick={() => void save()}
            disabled={status.kind === "saving" || !dirty || !name.trim()}
            className={buttonClass("primary", "sm", "max-sm:h-11")}
          >
            {template ? t("save") : t("create")}
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(380px,460px)_1fr]">
        <div className={cn("min-h-0 min-w-0 overflow-y-auto border-e border-border", view === "preview" && "max-lg:hidden")}>
          <div className="space-y-8 p-4 sm:p-5">
            {status.kind === "error" && (
              <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-[13px] font-medium text-danger sm:hidden">
                {t(`errors.${status.reason}`)}
              </p>
            )}
            {group(
              t("groups.about"),
              <>
                <Field label={t("fields.name")}>
                  {(id) => (
                    <Input id={id} value={name} maxLength={NAME_MAX} required onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} />
                  )}
                </Field>
                <Field label={t("fields.description")} hint={t("descriptionHint")}>
                  {(id) => (
                    <Textarea id={id} rows={2} value={description} maxLength={DESCRIPTION_MAX} onChange={(e) => setDescription(e.target.value)} />
                  )}
                </Field>
                <Field label={t("fields.startFrom")} hint={t("startFromHint")}>
                  {(id) => (
                    <select id={id} className={selectClass} value="" onChange={(e) => startFrom(e.target.value as TemplateId)}>
                      <option value="">{t("startFromPlaceholder")}</option>
                      {SYSTEM_TEMPLATE_LIST.map((s) => (
                        <option key={s.id} value={s.id}>
                          {tt(`names.${s.id}`)}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </>,
            )}

            {group(
              t("groups.layout"),
              <>
                {choice("layout", d.layout, setLayout)}
                {sidebar &&
                  number(t("fields.sidebarWidth"), sidebar.width, 45, 90, 1, (v) => patch((x) => void (x.sidebar!.width = v)))}
                {sidebar &&
                  choice("sidebarBackground", sidebar.background ?? "accent", (v) => patch((x) => void (x.sidebar!.background = v)))}
                {sidebar && (
                  <div className="col-span-2">
                    <Checkbox
                      label={t("fields.fullHeader")}
                      checked={!!sidebar.fullHeader}
                      onChange={(v) => patch((x) => void (x.sidebar!.fullHeader = v))}
                    />
                    <p className="mt-3 mb-1 text-[13px] font-semibold text-foreground">{t("fields.sidebarSections")}</p>
                    <div className="grid grid-cols-2">
                      {SECTIONS.map((s) => (
                        <Checkbox
                          key={s}
                          label={te(`sections.${s}`)}
                          checked={sidebar.sections.includes(s)}
                          onChange={(on) =>
                            patch((x) => {
                              const list = x.sidebar!.sections.filter((v) => v !== s);
                              x.sidebar!.sections = on ? [...list, s] : list;
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
                {!sidebar && choice("stripe", d.stripe ?? "none", (v) => patch((x) => void (x.stripe = v)))}
              </>,
            )}

            {group(
              t("groups.header"),
              <>
                {choice("align", d.header.align, (v) => patch((x) => void (x.header.align = v)))}
                {choice("photo", d.header.photo, (v) => patch((x) => void (x.header.photo = v)))}
                {choice("band", d.band ?? "none", (v) => patch((x) => void (x.band = v)))}
                {choice("divider", d.header.divider, (v) => patch((x) => void (x.header.divider = v)))}
                {choice("nameSize", d.header.nameSize ?? "medium", (v) => patch((x) => void (x.header.nameSize = v)))}
                {choice("nameStyle", d.header.nameStyle ?? "bold", (v) => patch((x) => void (x.header.nameStyle = v)))}
                {choice("nameColor", d.header.nameColor, (v) => patch((x) => void (x.header.nameColor = v)))}
                {choice("title", d.header.title, (v) => patch((x) => void (x.header.title = v)))}
                {choice("contact", d.contact, (v) => patch((x) => void (x.contact = v)))}
                {d.contact === "separated" && choice("separator", d.separator, (v) => patch((x) => void (x.separator = v)))}
              </>,
            )}

            {group(
              t("groups.colors"),
              <>
                {color("accent")}
                {color("text")}
                {color("muted")}
                {color("border")}
                <div className="col-span-2">
                  <Checkbox label={t("fields.monochrome")} checked={d.monochrome} onChange={(v) => patch((x) => void (x.monochrome = v))} />
                  <p className="text-xs leading-relaxed text-muted">{t("colorsHint")}</p>
                </div>
                {lowContrast && (
                  <p className="col-span-2 flex gap-2 rounded-lg bg-warning-soft px-3 py-2 text-[13px] text-warning">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {t("lowContrast", { ratio: whiteContrast(d.colors.accent).toFixed(1) })}
                  </p>
                )}
              </>,
            )}

            {group(
              t("groups.typography"),
              <>
                <Field label={t("fields.font")} half>
                  {(id) => (
                    <select
                      id={id}
                      className={selectClass}
                      value={d.typography.font}
                      onChange={(e) => {
                        const value = e.target.value as FontId;
                        patch((x) => void (x.typography.font = value));
                      }}
                    >
                      {(Object.keys(FONTS) as FontId[]).map((f) => (
                        <option key={f} value={f}>
                          {FONTS[f].name}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <Field label={t("fields.headingFont")} half>
                  {(id) => (
                    <select
                      id={id}
                      className={selectClass}
                      value={d.typography.headingFont ?? ""}
                      onChange={(e) => {
                        const value = e.target.value as FontId | "";
                        patch((x) => {
                          if (value) x.typography.headingFont = value;
                          else delete x.typography.headingFont;
                        });
                      }}
                    >
                      <option value="">{t("sameAsBody")}</option>
                      {(Object.keys(FONTS) as FontId[]).map((f) => (
                        <option key={f} value={f}>
                          {FONTS[f].name}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                {number(t("fields.size"), d.typography.size, 8.5, 12, 0.1, (v) => patch((x) => void (x.typography.size = v)))}
                {number(t("fields.lineHeight"), d.typography.lineHeight, 1.2, 1.7, 0.05, (v) =>
                  patch((x) => void (x.typography.lineHeight = v)),
                )}
              </>,
            )}

            {group(
              t("groups.sections"),
              <>
                {choice("sectionHeading", d.sectionHeading, (v) => patch((x) => void (x.sectionHeading = v)))}
                {choice("headingCase", d.headingCase ?? "uppercase", (v) => patch((x) => void (x.headingCase = v)))}
                {choice("sectionLayout", d.sectionLayout ?? "stacked", (v) => patch((x) => void (x.sectionLayout = v)))}
                {choice("datePosition", d.datePosition ?? "right", (v) => patch((x) => void (x.datePosition = v)))}
                {choice("company", d.company, (v) => patch((x) => void (x.company = v)))}
                {choice("bullets", d.bullets, (v) => patch((x) => void (x.bullets = v)))}
                {choice("skills", d.skills, (v) => patch((x) => void (x.skills = v)))}
                {d.skills === "tags" && choice("tagStyle", d.tagStyle ?? "filled", (v) => patch((x) => void (x.tagStyle = v)))}
                <div className="col-span-2">
                  <Checkbox label={t("fields.timeline")} checked={!!d.timeline} onChange={(v) => patch((x) => void (x.timeline = v))} />
                </div>
              </>,
            )}

            {group(
              t("groups.margins"),
              <>
                {number(t("fields.marginTop"), d.margins.top, 6, 25, 1, (v) => patch((x) => void (x.margins.top = v)))}
                {number(t("fields.marginBottom"), d.margins.bottom, 6, 25, 1, (v) => patch((x) => void (x.margins.bottom = v)))}
                {number(t("fields.marginHorizontal"), d.margins.horizontal, 10, 25, 1, (v) =>
                  patch((x) => void (x.margins.horizontal = v)),
                )}
              </>,
            )}

            {template && (
              <section className="space-y-4">
                <h2 className="text-xs font-bold tracking-wider text-muted uppercase">{t("groups.sharing")}</h2>
                <div role="radiogroup" aria-label={t("groups.sharing")} className="space-y-2">
                  {(["private", "unlisted", "public"] as const).map((v) => (
                    <label
                      key={v}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors",
                        visibility === v ? "border-primary bg-primary-soft" : "border-border hover:border-border-strong",
                      )}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        className="mt-1 accent-primary"
                        checked={visibility === v}
                        onChange={() => void changeVisibility(v)}
                      />
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{t(`visibility.${v}`)}</span>
                        <span className="block text-[13px] leading-relaxed text-muted">{t(`visibility.${v}Hint`)}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {status.kind === "error" && status.reason === "username_required" && (
                  <p className="text-[13px] text-muted">
                    <Link href="/account" className="font-semibold text-primary-text hover:underline">
                      {t("setUsername")}
                    </Link>
                  </p>
                )}
                <button type="button" onClick={() => void remove()} className={buttonClass("ghost", "sm", "text-danger hover:bg-danger-soft hover:text-danger")}>
                  <Trash2 className="size-4" aria-hidden />
                  {t("delete")}
                </button>
              </section>
            )}

            <button
              type="button"
              onClick={() => setD(saved.definition)}
              disabled={JSON.stringify(d) === JSON.stringify(saved.definition)}
              className={buttonClass("ghost", "sm")}
            >
              <RotateCcw className="size-4" aria-hidden />
              {t("reset")}
            </button>
          </div>
        </div>

        {/* min-w-0: the grid column must not grow to the paper's server-side width before it is scaled. */}
        <div className={cn("flex min-h-0 min-w-0 flex-col", view === "edit" && "max-lg:hidden")}>
          <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface px-3">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-accent" title={t("atsHint")}>
              <ShieldCheck className="size-4" aria-hidden />
              {t("ats", { score: ats })}
            </p>
            <div role="group" aria-label={t("previewLocale")} className="inline-flex rounded-lg border border-border-strong bg-surface-2 p-0.5">
              {(["tr", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={previewLocale === l}
                  onClick={() => setPreviewLocale(l)}
                  className={cn(
                    "h-11 rounded-md px-3 text-sm font-semibold uppercase transition-colors pointer-fine:h-8",
                    previewLocale === l ? "bg-surface text-foreground shadow-card" : "text-muted hover:text-foreground",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-desk p-4 sm:p-6">
            <div className="mx-auto max-w-[794px] shadow-paper">
              <DefinitionPreview definition={d} locale={previewLocale} initialScale={0.8} />
            </div>
            <p className="mx-auto mt-3 max-w-[794px] text-center text-xs text-muted">{t("previewHint")}</p>
          </div>
        </div>
      </div>

      <WorkspaceViewSwitch value={view} onChange={setView} labels={{ edit: t("view.edit"), preview: t("view.preview") }} />
    </div>
  );
}
