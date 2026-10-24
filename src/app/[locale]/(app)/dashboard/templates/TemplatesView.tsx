"use client";

import { Copy, EyeOff, Globe, Link2, Lock, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { copyTemplateAction, deleteTemplateAction } from "@/actions/template";
import { UserMenu } from "@/components/account/UserMenu";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { IconButton } from "@/components/editor/ui";
import { DefinitionPreview } from "@/components/resume/TemplatePreview";
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui/Button";
import { Link, useRouter } from "@/i18n/navigation";
import type { DesignDefinition } from "@/lib/resume/design";

type TemplateCard = {
  id: string;
  name: string;
  definition: DesignDefinition;
  visibility: "private" | "unlisted" | "public";
  status: "active" | "under_review" | "hidden";
  atsScore: number;
  usageCount: number;
  updatedAt: string;
};

const VISIBILITY_ICON = { private: Lock, unlisted: Link2, public: Globe } as const;

export function TemplatesView({ templates }: { templates: TemplateCard[] }) {
  const t = useTranslations("Dashboard.templates");
  const te = useTranslations("TemplateEditor");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; reason?: string }>) =>
    startTransition(async () => {
      setError(null);
      const r = await fn();
      if (!r.ok) setError(r.reason === "limit" ? te("errors.limit") : te("errors.error"));
      router.refresh();
    });

  const formatDate = (iso: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso));

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="rounded-lg">
            <Logo />
          </Link>
          <div className="ms-auto">
            <UserMenu />
          </div>
        </div>
      </header>
      <DashboardNav current="templates" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
            <p className="mt-1 max-w-2xl text-muted">{t("subtitle")}</p>
          </div>
          <Link href="/template-editor/new" className={buttonClass("primary", "md")}>
            <Plus className="size-4" />
            {t("new")}
          </Link>
        </div>

        {error && (
          <p role="alert" className="mt-6 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        {templates.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border-strong px-6 py-14 text-center">
            <p className="mx-auto max-w-md text-muted">{t("empty")}</p>
          </div>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-busy={pending}>
            {templates.map((tpl) => {
              const Icon = VISIBILITY_ICON[tpl.visibility];
              return (
                <li key={tpl.id} className="flex flex-col rounded-2xl border border-border bg-surface p-3 shadow-card">
                  <Link
                    href={{ pathname: "/template-editor/[id]", params: { id: tpl.id } }}
                    className="block overflow-hidden rounded-lg ring-1 ring-black/5"
                  >
                    <DefinitionPreview definition={tpl.definition} locale={locale} initialScale={0.3} />
                    <span className="sr-only">{t("edit", { name: tpl.name })}</span>
                  </Link>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{tpl.name}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Icon className="size-3.5" aria-hidden />
                          {te(`visibility.${tpl.visibility}`)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-accent">
                          <ShieldCheck className="size-3.5" aria-hidden />
                          {tpl.atsScore}/5
                        </span>
                        <span>{t("usage", { n: tpl.usageCount })}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted">{t("updated", { date: formatDate(tpl.updatedAt) })}</p>
                      {tpl.status !== "active" && (
                        <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-warning">
                          <EyeOff className="size-3.5" aria-hidden />
                          {t(`status.${tpl.status}`)}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0">
                      <IconButton label={t("duplicate")} disabled={pending} onClick={() => run(() => copyTemplateAction(tpl.id))}>
                        <Copy className="size-4" />
                      </IconButton>
                      <IconButton
                        label={te("delete")}
                        danger
                        disabled={pending}
                        onClick={() => confirm(te("deleteConfirm", { name: tpl.name })) && run(() => deleteTemplateAction(tpl.id))}
                      >
                        <Trash2 className="size-4" />
                      </IconButton>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
