"use client";

import { useConfirm } from "@/components/ui/ConfirmProvider";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  ImagePlus,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useEditor } from "@/client/editor/store";
import { cn } from "@/lib/cn";
import { resumeLabels } from "@/lib/resume/labels";
import { SUMMARY_MIN, SUMMARY_MAX } from "@/lib/resume/checks";
import {
  emptyEntry,
  LIST_SECTIONS,
  type SectionId,
  type ResumeData,
  type ListSection,
} from "@/lib/resume/schema";
import { Field, Input, IconButton, RowMenu, Textarea, Checkbox } from "./ui";
import { SampleNotice } from "./SampleNotice";

type FieldDef = {
  k: string;
  kind?: "text" | "long" | "bullets" | "checkbox";
  inputType?: "email" | "tel" | "url";
  half?: boolean;
  rows?: number;
  disabledIf?: string;
};

// Entry fields. Order = order in the form.
const FIELDS: Record<ListSection, FieldDef[]> = {
  experience: [
    { k: "position" },
    { k: "company" },
    { k: "location", half: true },
    { k: "current", kind: "checkbox", half: true },
    { k: "start", half: true },
    { k: "end", half: true, disabledIf: "current" },
    { k: "description", kind: "long", rows: 2 },
    { k: "bullets", kind: "bullets", rows: 7 },
  ],
  projects: [
    { k: "name", half: true },
    { k: "role", half: true },
    { k: "start", half: true },
    { k: "end", half: true },
    { k: "technologies" },
    { k: "link", inputType: "url" },
    { k: "description", kind: "long", rows: 2 },
    { k: "bullets", kind: "bullets", rows: 4 },
  ],
  skills: [{ k: "category" }, { k: "items", kind: "long", rows: 2 }],
  education: [
    { k: "school" },
    { k: "field", half: true },
    { k: "degree", half: true },
    { k: "start", half: true },
    { k: "end", half: true },
    { k: "gpa", half: true },
    { k: "location", half: true },
    { k: "description", kind: "long", rows: 2 },
  ],
  certifications: [{ k: "name" }, { k: "issuer", half: true }, { k: "date", half: true }, { k: "link", inputType: "url" }],
  languages: [{ k: "language", half: true }, { k: "level", half: true }],
  references: [
    { k: "name" },
    { k: "title", half: true },
    { k: "company", half: true },
    { k: "phone", half: true, inputType: "tel" },
    { k: "email", half: true, inputType: "email" },
  ],
};

/** Short name shown in the header of a collapsed entry. */
function entrySummary(section: ListSection, e: Record<string, unknown>) {
  const s = (a: string) => (typeof e[a] === "string" ? (e[a] as string) : "");
  switch (section) {
    case "experience":
      return [s("position"), s("company")].filter(Boolean).join(" — ");
    case "education":
      return [s("school"), s("field")].filter(Boolean).join(" — ");
    case "languages":
      return [s("language"), s("level")].filter(Boolean).join(" — ");
    case "skills":
      return s("category");
    default:
      return s("name");
  }
}

const PERSONAL_FIELDS: FieldDef[] = [
  { k: "name" },
  { k: "title" },
  { k: "email", half: true, inputType: "email" },
  { k: "phone", half: true, inputType: "tel" },
  { k: "location" },
];

// Not every job has a GitHub profile: links sit behind one disclosure instead of three empty fields.
const LINK_FIELDS: FieldDef[] = [
  { k: "linkedin", half: true },
  { k: "web", half: true },
  { k: "github", half: true },
];

function move<T>(list: T[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
}

/** Crops an image to a centred square and scales it down to a 480 px JPEG (for the localStorage quota). */
function cropPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const side = Math.min(img.naturalWidth, img.naturalHeight);
        const size = Math.min(480, side);
        const c = document.createElement("canvas");
        c.width = c.height = size;
        const x = c.getContext("2d")!;
        x.imageSmoothingQuality = "high";
        // Faces are usually in the upper part: crop vertically from a quarter.
        x.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 4, side, side, 0, 0, size, size);
        resolve(c.toDataURL("image/jpeg", 0.88));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

type Update = ReturnType<typeof useEditor.getState>["update"];

export function ContentPanel({ notify }: { notify: (text: string) => void }) {
  const t = useTranslations("Editor");
  const data = useEditor((s) => s.data)!;
  const update = useEditor((s) => s.update);
  const loads = useEditor((s) => s.loads);
  const [open, setOpen] = useState<Set<string>>(() => new Set(["personal"]));

  const toggle = (id: string, isOpen: boolean) =>
    setOpen((s) => {
      const next = new Set(s);
      if (isOpen) next.add(id);
      else next.delete(id);
      return next;
    });

  const order = data.settings.sectionOrder;

  return (
    <div className="space-y-3 p-4 sm:p-5">
      <SampleNotice />
      <p className="text-sm leading-relaxed text-muted">{t("sectionsHint")}</p>
      <PersonalSection key={loads} open={open.has("personal")} toggle={(o) => toggle("personal", o)} notify={notify} />
      {order.map((id, i) => (
        <SectionEditor
          key={id}
          id={id}
          index={i}
          total={order.length}
          data={data}
          update={update}
          open={open}
          toggle={toggle}
        />
      ))}
    </div>
  );
}

function Accordion({
  open,
  toggle,
  title,
  count,
  actions,
  hidden,
  children,
}: {
  open: boolean;
  toggle: (open: boolean) => void;
  title: React.ReactNode;
  count?: number;
  actions?: React.ReactNode;
  hidden?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface shadow-card", hidden && "opacity-60")}>
      <div className="flex min-h-13 items-center gap-1 pe-2">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => toggle(!open)}
          className="flex min-h-13 flex-1 items-center gap-2.5 rounded-xl ps-4 text-start text-[15px] font-semibold text-foreground"
        >
          <ChevronDown className={cn("size-4 shrink-0 text-muted transition-transform duration-200", !open && "-rotate-90 rtl:rotate-90")} />
          <span className="min-w-0 truncate">{title}</span>
          {count !== undefined && (
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-muted tabular-nums">{count}</span>
          )}
        </button>
        {actions}
      </div>
      {open && <div className="border-t border-border px-4 pt-4 pb-5">{children}</div>}
    </div>
  );
}

function PersonalSection({
  open,
  toggle,
  notify,
}: {
  open: boolean;
  toggle: (open: boolean) => void;
  notify: (text: string) => void;
}) {
  const t = useTranslations("Editor");
  const p = useEditor((s) => s.data!.personal);
  const update = useEditor((s) => s.update);
  const fileRef = useRef<HTMLInputElement>(null);

  // Opens on its own when a link is already filled; afterwards the user decides.
  const [linksOpen] = useState(() => LINK_FIELDS.some((f) => p[f.k as keyof typeof p]));
  const personalField = (f: FieldDef) => (
    <Field key={f.k} label={t(`fields.personal.${f.k}` as never)} half={f.half}>
      {(id) => (
        <Input
          id={id}
          type={f.inputType ?? "text"}
          value={p[f.k as keyof typeof p] as string}
          placeholder={t(`placeholders.personal.${f.k}` as never)}
          onChange={(e) => {
            const value = e.target.value;
            update((v) => void ((v.personal as Record<string, unknown>)[f.k] = value));
          }}
        />
      )}
    </Field>
  );

  return (
    <Accordion open={open} toggle={toggle} title={t("personal.title")}>
      <div className="mb-5 flex items-center gap-4">
        <div className="grid size-18 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 text-muted ring-1 ring-border">
          {p.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.photo} alt="" className="size-full object-cover" />
          ) : (
            <UserRound className="size-8" />
          )}
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border-strong px-3 text-sm font-semibold text-foreground hover:bg-surface-2"
            >
              <ImagePlus className="size-4" />
              {p.photo ? t("personal.changePhoto") : t("personal.uploadPhoto")}
            </button>
            {p.photo && (
              <button
                type="button"
                onClick={() => update((v) => void (v.personal.photo = ""), false)}
                className="h-9 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-foreground"
              >
                {t("personal.removePhoto")}
              </button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-muted">{t("personal.photoHint")}</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              try {
                const photo = await cropPhoto(file);
                update((v) => {
                  v.personal.photo = photo;
                  v.settings.showPhoto = true;
                }, false);
              } catch {
                notify(t("toast.imageError"));
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        {PERSONAL_FIELDS.map(personalField)}

        <details open={linksOpen} className="group col-span-2 border-y border-border">
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 text-[15px] font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            <ChevronDown className="size-4 shrink-0 -rotate-90 text-muted transition-transform group-open:rotate-0 rtl:rotate-90" aria-hidden />
            {t("personal.links")}
            <span className="min-w-0 truncate text-sm font-normal text-muted">{t("personal.linksHint")}</span>
          </summary>
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 pb-4">{LINK_FIELDS.map(personalField)}</div>
        </details>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
        <div className="col-span-2">
          <p className="text-[15px] font-semibold text-foreground">{t("personal.extras")}</p>
          <p className="mt-0.5 mb-2 text-sm text-muted">{t("personal.extrasHint")}</p>
          <div className="space-y-2">
            {p.extras.map((e, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  aria-label={`${t("personal.extraLabel")} ${i + 1}`}
                  placeholder={t("placeholders.extraLabel")}
                  value={e.label}
                  className="w-2/5"
                  onChange={(x) => {
                    const value = x.target.value;
                    update((v) => void (v.personal.extras[i].label = value));
                  }}
                />
                <Input
                  aria-label={`${t("personal.extraValue")} ${i + 1}`}
                  placeholder={t("placeholders.extraValue")}
                  value={e.value}
                  onChange={(x) => {
                    const value = x.target.value;
                    update((v) => void (v.personal.extras[i].value = value));
                  }}
                />
                <IconButton
                  label={t("personal.deleteExtra")}
                  danger
                  onClick={() => update((v) => void v.personal.extras.splice(i, 1), false)}
                >
                  <Trash2 className="size-4" />
                </IconButton>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => update((v) => void v.personal.extras.push({ label: "", value: "" }), false)}
            className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-primary-text hover:bg-primary-soft"
          >
            <Plus className="size-4" />
            {t("personal.addExtra")}
          </button>
        </div>
      </div>
    </Accordion>
  );
}

function SectionEditor({
  id,
  index,
  total,
  data,
  update,
  open,
  toggle,
}: {
  id: SectionId;
  index: number;
  total: number;
  data: ResumeData;
  update: Update;
  open: Set<string>;
  toggle: (id: string, open: boolean) => void;
}) {
  const t = useTranslations("Editor");
  const name = t(`sections.${id}`);
  const hidden = data.settings.hiddenSections.includes(id);
  const listSection = (LIST_SECTIONS as readonly string[]).includes(id) ? (id as ListSection) : null;
  const defaultTitle = resumeLabels(data.settings.locale).sectionTitles[id];

  const actions = (
    <span className="flex items-center">
      <IconButton
        label={`${hidden ? t("show") : t("hide")}: ${name}`}
        aria-pressed={hidden}
        onClick={() =>
          update((v) => {
            v.settings.hiddenSections = hidden
              ? v.settings.hiddenSections.filter((x) => x !== id)
              : [...v.settings.hiddenSections, id];
          }, false)
        }
      >
        {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </IconButton>
      <RowMenu
        label={t("rowMenu", { name })}
        items={[
          {
            label: t("moveUp"),
            icon: <ChevronUp />,
            disabled: index === 0,
            onSelect: () => update((v) => move(v.settings.sectionOrder, index, -1), false),
          },
          {
            label: t("moveDown"),
            icon: <ChevronDown />,
            disabled: index === total - 1,
            onSelect: () => update((v) => move(v.settings.sectionOrder, index, 1), false),
          },
        ]}
      />
    </span>
  );

  return (
    <Accordion
      open={open.has(id)}
      toggle={(o) => toggle(id, o)}
      title={name}
      count={listSection ? data[listSection].length : undefined}
      actions={actions}
      hidden={hidden}
    >
      <div className="space-y-4">
        <Field label={t("sectionTitle")}>
          {(fid) => (
            <Input
              id={fid}
              value={data.settings.sectionTitles[id] ?? ""}
              placeholder={defaultTitle}
              onChange={(e) => {
                const value = e.target.value;
                update((v) => void (v.settings.sectionTitles[id] = value));
              }}
            />
          )}
        </Field>

        {id === "summary" && <SummaryField />}
        {id === "interests" && (
          <Field label={t("interestsLabel")}>
            {(fid) => (
              <Textarea
                id={fid}
                rows={3}
                value={data.interests}
                placeholder={t("interestsPlaceholder")}
                onChange={(e) => {
                  const value = e.target.value;
                  update((v) => void (v.interests = value));
                }}
              />
            )}
          </Field>
        )}
        {listSection && <EntryList section={listSection} data={data} update={update} open={open} toggle={toggle} />}
      </div>
    </Accordion>
  );
}

function SummaryField() {
  const t = useTranslations("Editor");
  const summary = useEditor((s) => s.data!.summary);
  const update = useEditor((s) => s.update);
  const n = summary.length;
  const warn = n > 0 && (n < SUMMARY_MIN || n > SUMMARY_MAX);
  return (
    <Field
      label={t("summaryLabel")}
      hint={t("summaryHint")}
      extra={
        <span className={cn("text-xs font-medium tabular-nums", warn ? "text-warning" : "text-muted")}>
          {t("characters", { n })}
        </span>
      }
    >
      {(id) => (
        <Textarea
          id={id}
          rows={7}
          value={summary}
          placeholder={t("summaryPlaceholder")}
          onChange={(e) => {
            const value = e.target.value;
            update((v) => void (v.summary = value));
          }}
        />
      )}
    </Field>
  );
}

function EntryList({
  section,
  data,
  update,
  open,
  toggle,
}: {
  section: ListSection;
  data: ResumeData;
  update: Update;
  open: Set<string>;
  toggle: (id: string, open: boolean) => void;
}) {
  const t = useTranslations("Editor");
  const locale = useLocale();
  const confirm = useConfirm();
  const singular = t(`singular.${section}`);
  const entries = data[section] as (Record<string, unknown> & { id: string; hidden?: boolean })[];
  const list = (v: ResumeData) => v[section] as unknown as Record<string, unknown>[];

  return (
    <div className="space-y-2.5">
      {entries.map((e, i) => {
        const summary = entrySummary(section, e) || t("untitled", { kind: singular, n: i + 1 });
        const entryOpen = open.has(e.id);
        return (
          <div key={e.id} className={cn("rounded-lg border border-border bg-background/60", e.hidden && "opacity-60")}>
            <div className="flex min-h-11 items-center gap-0.5 pe-1">
              <button
                type="button"
                aria-expanded={entryOpen}
                onClick={() => toggle(e.id, !entryOpen)}
                className="flex min-h-11 min-w-0 flex-1 items-center gap-2 ps-3 text-start text-sm font-semibold text-foreground"
              >
                <ChevronDown className={cn("size-3.5 shrink-0 text-muted transition-transform", !entryOpen && "-rotate-90 rtl:rotate-90")} />
                <span className="truncate">{summary}</span>
              </button>
              <IconButton
                label={`${e.hidden ? t("show") : t("hide")}: ${summary}`}
                aria-pressed={!!e.hidden}
                onClick={() => update((v) => void (list(v)[i].hidden = !e.hidden), false)}
              >
                {e.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </IconButton>
              <RowMenu
                label={t("rowMenu", { name: summary })}
                items={[
                  {
                    label: t("moveUp"),
                    icon: <ChevronUp />,
                    disabled: i === 0,
                    onSelect: () => update((v) => move(list(v), i, -1), false),
                  },
                  {
                    label: t("moveDown"),
                    icon: <ChevronDown />,
                    disabled: i === entries.length - 1,
                    onSelect: () => update((v) => move(list(v), i, 1), false),
                  },
                  {
                    label: t("duplicate"),
                    icon: <Copy />,
                    onSelect: () => {
                      const copy = { ...structuredClone(e), id: emptyEntry(section).id };
                      update((v) => void list(v).splice(i + 1, 0, copy), false);
                      toggle(copy.id, true);
                    },
                  },
                  {
                    label: t("delete"),
                    icon: <Trash2 />,
                    danger: true,
                    onSelect: async () => {
                      if (!await confirm(t("confirm.deleteEntry", { name: summary }), { danger: true })) return;
                      update((v) => void list(v).splice(i, 1), false);
                    },
                  },
                ]}
              />
            </div>
            {entryOpen && (
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 border-t border-border px-3 pt-3 pb-4">
                {FIELDS[section].map((f) => {
                  const value = e[f.k];
                  const label = t(`fields.${section}.${f.k}` as never);
                  if (f.kind === "checkbox")
                    return (
                      <div key={f.k} className="col-span-1 flex items-end">
                        <Checkbox
                          label={label}
                          checked={!!value}
                          onChange={(checked) => update((v) => void (list(v)[i][f.k] = checked), false)}
                        />
                      </div>
                    );
                  const disabled = !!(f.disabledIf && e[f.disabledIf]);
                  const placeholder = t.has(`placeholders.${section}.${f.k}` as never)
                    ? t(`placeholders.${section}.${f.k}` as never)
                    : "";
                  const write = (text: string) => update((v) => void (list(v)[i][f.k] = text));
                  return (
                    <Field
                      key={f.k}
                      label={label}
                      half={f.half}
                      hint={f.kind === "bullets" ? t("bulletsHint") : undefined}
                    >
                      {(id) =>
                        f.kind === "long" || f.kind === "bullets" ? (
                          <Textarea
                            id={id}
                            rows={f.rows}
                            value={value as string}
                            placeholder={placeholder}
                            onChange={(x) => write(x.target.value)}
                          />
                        ) : (
                          <Input
                            id={id}
                            type={f.inputType ?? "text"}
                            value={disabled ? "" : (value as string)}
                            placeholder={
                              disabled ? t("present") : f.k === "end" && section === "projects" ? t("ongoing") : placeholder
                            }
                            disabled={disabled}
                            onChange={(x) => write(x.target.value)}
                          />
                        )
                      }
                    </Field>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          const entry = emptyEntry(section);
          update((v) => void (v[section] as unknown[]).push(entry), false);
          toggle(entry.id, true);
        }}
        className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong text-sm font-semibold text-primary-text transition-colors hover:border-primary hover:bg-primary-soft"
      >
        <Plus className="size-4" />
        {t("add", { kind: singular.toLocaleLowerCase(locale) })}
      </button>
    </div>
  );
}
