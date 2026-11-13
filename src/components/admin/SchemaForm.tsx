"use client";

// Generates a form from a Zod schema (plan 7.1: "the admin form is generated from this schema").
// Labels and display hints are read from the schema's `.meta()` (FieldMeta).
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import type { z } from "zod";
import { Input, IconButton, Textarea, Checkbox } from "@/components/editor/ui";
import type { FieldMeta } from "@/lib/blocks";
import { cn } from "@/lib/cn";

type Path = (string | number)[];
export type FieldErrors = Record<string, string>;
export const pathKey = (path: Path) => path.join(".");

type Definition = { type: string; shape?: Record<string, z.ZodType>; element?: z.ZodType; entries?: Record<string, string> };

function definition(s: z.ZodType): Definition {
  const d = (s as unknown as { def: Definition & { innerType?: z.ZodType } }).def;
  if (d.type === "optional" || d.type === "default" || d.type === "nullable") return definition(d.innerType!);
  if (d.type === "object") return { type: "object", shape: (s as unknown as z.ZodObject).shape as Record<string, z.ZodType> };
  if (d.type === "array") return { type: "array", element: (s as unknown as z.ZodArray<z.ZodType>).element };
  return d;
}

function meta(s: z.ZodType): FieldMeta {
  return ((s as unknown as { meta: () => FieldMeta | undefined }).meta?.() ?? { label: "" }) as FieldMeta;
}

function move<T>(list: T[], i: number, direction: -1 | 1): T[] {
  const next = [...list];
  const j = i + direction;
  if (j < 0 || j >= next.length) return next;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function ErrorMessage({ error }: { error?: string }) {
  return error ? (
    <p role="alert" className="mt-1 text-sm font-medium text-danger">
      {error}
    </p>
  ) : null;
}

export function SchemaForm({
  schema,
  value,
  onChange,
  errors = {},
  path = [],
}: {
  schema: z.ZodType;
  value: unknown;
  onChange: (v: unknown) => void;
  errors?: FieldErrors;
  path?: Path;
}) {
  const def = definition(schema);
  const m = meta(schema);
  const error = errors[pathKey(path)];
  const id = useId();

  if (def.type === "object") {
    const obj = (value ?? {}) as Record<string, unknown>;
    const fields = (
      <div className="grid gap-4">
        {Object.entries(def.shape!).map(([k, child]) => (
          <SchemaForm
            key={k}
            schema={child}
            value={obj[k]}
            onChange={(v) => onChange({ ...obj, [k]: v })}
            errors={errors}
            path={[...path, k]}
          />
        ))}
      </div>
    );
    // The root object and array items are unframed; named nested objects (e.g. a button) are grouped.
    if (!m.label) return fields;
    return (
      <fieldset className="rounded-xl border border-border p-4">
        <legend className="px-1.5 text-[15px] font-semibold text-foreground">{m.label}</legend>
        {fields}
      </fieldset>
    );
  }

  if (def.type === "array") {
    const list = Array.isArray(value) ? value : [];
    const itemDefinition = definition(def.element!);
    const primitive = itemDefinition.type !== "object";
    return (
      <div>
        <p className="mb-1.5 text-[15px] font-semibold text-foreground">{m.label}</p>
        {m.hint && <p className="-mt-1 mb-2 text-sm text-muted">{m.hint}</p>}
        <div className="space-y-2">
          {list.map((item, i) =>
            primitive ? (
              <div key={i} className="flex gap-1">
                <Input
                  aria-label={`${m.label} ${i + 1}`}
                  value={String(item ?? "")}
                  onChange={(e) => onChange(list.map((x, j) => (j === i ? e.target.value : x)))}
                />
                <ListTools list={list} i={i} onChange={onChange} label={`${m.label} ${i + 1}`} />
              </div>
            ) : (
              <ArrayItem
                key={i}
                title={String((item as Record<string, unknown>)?.[m.summaryField ?? ""] ?? "") || `${m.label} ${i + 1}`}
                tools={<ListTools list={list} i={i} onChange={onChange} label={`${m.label} ${i + 1}`} />}
                hasError={Object.keys(errors).some((e) => e.startsWith(pathKey([...path, i]) + "."))}
              >
                <SchemaForm
                  schema={def.element!}
                  value={item}
                  onChange={(v) => onChange(list.map((x, j) => (j === i ? v : x)))}
                  errors={errors}
                  path={[...path, i]}
                />
              </ArrayItem>
            ),
          )}
        </div>
        <button
          type="button"
          onClick={() => onChange([...list, emptyItem(def.element!)])}
          className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-primary-text hover:bg-primary-soft"
        >
          <Plus className="size-4" />
          Ekle
        </button>
        <ErrorMessage error={error} />
      </div>
    );
  }

  if (def.type === "boolean")
    return <Checkbox label={m.label} checked={!!value} onChange={(v) => onChange(v)} />;

  if (def.type === "enum") {
    const options = Object.values(def.entries ?? {});
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-[15px] font-semibold text-foreground">
          {m.label}
        </label>
        <select
          id={id}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-border-strong bg-surface px-3 text-[15px] text-foreground"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {m.optionLabels?.[o] ?? o}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // text
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[15px] font-semibold text-foreground">
        {m.label}
      </label>
      {m.display === "long" ? (
        <Textarea
          id={id}
          rows={3}
          value={String(value ?? "")}
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          id={id}
          value={String(value ?? "")}
          aria-invalid={!!error}
          className={cn(error && "border-danger")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {m.hint && <p className="mt-1 text-sm text-muted">{m.hint}</p>}
      <ErrorMessage error={error} />
    </div>
  );
}

function emptyItem(s: z.ZodType): unknown {
  const def = definition(s);
  if (def.type === "object") return Object.fromEntries(Object.entries(def.shape!).map(([k, child]) => [k, emptyItem(child)]));
  if (def.type === "array") return [];
  if (def.type === "boolean") return false;
  return "";
}

function ListTools({
  list,
  i,
  onChange,
  label,
}: {
  list: unknown[];
  i: number;
  onChange: (v: unknown) => void;
  label: string;
}) {
  return (
    <span className="flex shrink-0 items-center">
      <IconButton label={`Yukarı: ${label}`} disabled={i === 0} onClick={() => onChange(move(list, i, -1))}>
        <ChevronUp className="size-4" />
      </IconButton>
      <IconButton label={`Aşağı: ${label}`} disabled={i === list.length - 1} onClick={() => onChange(move(list, i, 1))}>
        <ChevronDown className="size-4" />
      </IconButton>
      <IconButton label={`Sil: ${label}`} danger onClick={() => onChange(list.filter((_, j) => j !== i))}>
        <Trash2 className="size-4" />
      </IconButton>
    </span>
  );
}

function ArrayItem({
  title,
  tools,
  hasError,
  children,
}: {
  title: string;
  tools: React.ReactNode;
  hasError: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("rounded-lg border bg-background/60", hasError ? "border-danger" : "border-border")}>
      <div className="flex min-h-11 items-center pe-1">
        <button
          type="button"
          aria-expanded={open || hasError}
          onClick={() => setOpen(!open)}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-2 ps-3 text-start text-sm font-semibold text-foreground"
        >
          <ChevronDown className={cn("size-3.5 shrink-0 text-muted transition-transform", !(open || hasError) && "-rotate-90")} />
          <span className="truncate">{title}</span>
        </button>
        {tools}
      </div>
      {(open || hasError) && <div className="border-t border-border p-3">{children}</div>}
    </div>
  );
}
