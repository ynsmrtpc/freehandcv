import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminBody, AdminPageHeader, Badge, formatDate } from "@/components/admin/kit";
import { DefinitionPreview } from "@/components/resume/TemplatePreview";
import { Link } from "@/i18n/navigation";
import { designSchema } from "@/lib/resume/design";
import { templateSlug } from "@/lib/templates";
import { getTemplateForModeration } from "@/server/admin/templates";
import { VISIBILITY_NAMES, REASON_NAMES } from "../labels";
import { ModerationActions } from "./ModerationActions";

export default async function TemplateModeration({ params }: PageProps<"/[locale]/admin/templates/[id]">) {
  const { id } = await params;
  const t = /^[0-9a-f-]{36}$/.test(id) ? await getTemplateForModeration(id) : null;
  if (!t) notFound();
  const definition = designSchema.safeParse(t.definition);
  const open = t.reports.filter((r) => r.status === "open");
  const live = t.status === "active" && t.visibility !== "private";

  return (
    <>
      <AdminPageHeader
        title={t.name}
        description={
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{t.ownerUsername ? `@${t.ownerUsername}` : t.ownerEmail}</span>
            {t.status === "hidden" ? <Badge tone="warning">{ADMIN_CONTENT.templatesIdPageContent317}</Badge> : <Badge>{VISIBILITY_NAMES[t.visibility]}</Badge>}
            {t.featured && <Badge tone="info">{ADMIN_CONTENT.templatesIdPageContent318}</Badge>}
            {open.length > 0 && <Badge tone="danger">{open.length} {ADMIN_CONTENT.templatesIdPageContent319}</Badge>}
          </span>
        }
      >
        <Link href="/admin/templates" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-primary-text hover:underline">
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {ADMIN_CONTENT.templatesIdPageContent320}</Link>
      </AdminPageHeader>
      <AdminBody className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="min-w-0 space-y-6">
          <section aria-labelledby="reports-title">
            <h2 id="reports-title" className="text-lg font-bold text-foreground">
              {ADMIN_CONTENT.templatesIdPageContent321}</h2>
            {t.reports.length ? (
              <ul className="mt-3 divide-y divide-border border-y border-border">
                {t.reports.map((r) => (
                  <li key={r.id} className="py-3">
                    <p className="flex flex-wrap items-center gap-2 text-[15px]">
                      <span className="font-semibold text-foreground">{REASON_NAMES[r.reason] ?? r.reason}</span>
                      {r.status === "open" ? <Badge tone="danger">{ADMIN_CONTENT.templatesIdPageContent322}</Badge> : <Badge>{ADMIN_CONTENT.templatesIdPageContent323}</Badge>}
                      <span className="text-muted tabular-nums">{formatDate(r.createdAt, true)}</span>
                    </p>
                    {r.details && <p className="mt-1 text-[15px] leading-relaxed text-foreground">{r.details}</p>}
                    <p className="mt-1 text-sm text-muted">{ADMIN_CONTENT.templatesIdPageContent324}{r.reporter ? `@${r.reporter}` : (r.reporterEmail ?? ADMIN_CONTENT.templatesIdPageLabel325)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[15px] text-muted">{ADMIN_CONTENT.templatesIdPageContent326}</p>
            )}
          </section>

          <ModerationActions
            id={t.id}
            hidden={t.status === "hidden"}
            openReports={open.length}
            featured={t.featured}
            canFeature={t.status === "active" && t.visibility === "public"}
          />

          {t.description && (
            <section aria-labelledby="desc-title">
              <h2 id="desc-title" className="text-lg font-bold text-foreground">
                {ADMIN_CONTENT.templatesIdPageContent327}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground">{t.description}</p>
            </section>
          )}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-y border-border py-4 text-[15px] sm:grid-cols-3">
            {[
              [ADMIN_CONTENT.templatesIdPageLabel328, formatDate(t.createdAt)],
              [ADMIN_CONTENT.templatesIdPageLabel329, formatDate(t.updatedAt)],
              [ADMIN_CONTENT.examplesPageContent156, String(t.usageCount)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-muted">{k}</dt>
                <dd className="font-semibold text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
          {live && (
            <Link
              href={{ pathname: "/resume-templates/[slug]", params: { slug: templateSlug({ kind: "user", id: t.id }, t.name) } }}
              target="_blank"
              className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-primary-text hover:underline"
            >
              {ADMIN_CONTENT.templatesIdPageContent330}<ExternalLink className="size-4" aria-hidden />
            </Link>
          )}
        </div>
        <div className="min-w-0">
          <p className="mb-2 text-sm font-semibold text-muted">{ADMIN_CONTENT.templatesIdPageContent331}</p>
          {definition.success ? (
            <div className="overflow-hidden rounded-lg border border-border bg-desk p-4">
              <DefinitionPreview definition={definition.data} locale="tr" initialScale={0.42} />
            </div>
          ) : (
            <p className="text-[15px] text-danger">{ADMIN_CONTENT.templatesIdPageContent332}</p>
          )}
        </div>
      </AdminBody>
    </>
  );
}
