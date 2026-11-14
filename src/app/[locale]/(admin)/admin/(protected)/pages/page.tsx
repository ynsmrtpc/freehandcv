import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
import { BulkSelection, RowCheckbox, SelectAll } from "@/components/admin/BulkSelection";
import {
  AdminBody,
  AdminPageHeader,
  adminHref,
  Badge,
  EmptyState,
  FilterLinks,
  formatDate,
  SearchForm,
  Table,
  Td,
  Th,
  Toolbar,
} from "@/components/admin/kit";
import { Link } from "@/i18n/navigation";
import { HOME_SLUG, listPages } from "@/server/content/pages";
import { adminStatus } from "@/server/authz";
import { deletePagesAction, publishPagesAction, unpublishPagesAction } from "./actions";

const KIND_LABELS: Record<string, string> = { static: ADMIN_CONTENT.pagesPageStatic263, guide: ADMIN_CONTENT.examplesPageContent155, legal: ADMIN_CONTENT.pagesPageLegal264 };
const LOCALES: Record<string, string> = { tr: ADMIN_CONTENT.examplesExampleFormContent65, en: ADMIN_CONTENT.examplesExampleFormContent66 };

export default async function Pages({ searchParams }: PageProps<"/[locale]/admin/pages">) {
  const sp = await searchParams;
  const pick = (v: unknown, allowed: string[]) => (typeof v === "string" && allowed.includes(v) ? v : "");
  const locale = pick(sp.dil, ["tr", "en"]);
  const kind = pick(sp.tur, ["static", "guide", "legal"]);
  const status = pick(sp.durum, ["yayinda", "taslak"]);
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const [all, s] = await Promise.all([listPages(), adminStatus()]);
  const isAdmin = s.status === "ok" && s.user.role === "admin";

  const statusOf = (p: (typeof all)[number]) => (p.isPublished && !p.hasUnpublishedChanges ? "yayinda" : "taslak");
  const matches = (p: (typeof all)[number], except?: "dil" | "tur" | "durum") =>
    (except === "dil" || !locale || p.locale === locale) &&
    (except === "tur" || !kind || p.kind === kind) &&
    (except === "durum" || !status || statusOf(p) === status) &&
    (!q || `${p.title} ${p.slug}`.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")));
  const list = all.filter((p) => matches(p));
  // Each filter's counts follow the other filters, so a number always matches what a click shows.
  const countBy = (except: "dil" | "tur" | "durum", key: (p: (typeof all)[number]) => string) =>
    all.filter((p) => matches(p, except)).reduce<Record<string, number>>((acc, p) => ((acc[key(p)] = (acc[key(p)] ?? 0) + 1), (acc[""] = (acc[""] ?? 0) + 1), acc), {});
  const byLocale = countBy("dil", (p) => p.locale);
  const byKind = countBy("tur", (p) => p.kind);
  const byStatus = countBy("durum", statusOf);
  const query = { dil: locale, tur: kind, durum: status, q };
  const href = (patch: Record<string, string>) => adminHref("/admin/pages", { ...query, ...patch });

  const actions = [
    { label: ADMIN_CONTENT.examplesPublishToggleLabel96, run: publishPagesAction, confirm: ADMIN_CONTENT.pagesPageConfirm265 },
    { label: ADMIN_CONTENT.examplesPublishToggleLabel95, run: unpublishPagesAction, confirm: ADMIN_CONTENT.pagesPageConfirm266 },
    ...(isAdmin
      ? [{ label: ADMIN_CONTENT.examplesPageLabel140, run: deletePagesAction, danger: true, confirm: ADMIN_CONTENT.pagesPageConfirm267 }]
      : []),
  ];

  return (
    <>
      <AdminPageHeader title={ADMIN_CONTENT.pagesPageTitle268} description={ADMIN_CONTENT.pagesPageDescription269} />
      <AdminBody>
        <Toolbar>
          <SearchForm value={q} placeholder={ADMIN_CONTENT.pagesPagePlaceholder270} label={ADMIN_CONTENT.pagesPageLabel271} hidden={{ dil: locale, tur: kind, durum: status }} />
          <FilterLinks
            label={ADMIN_CONTENT.examplesExampleFormLabel63}
            current={locale}
            hrefFor={(v) => href({ dil: v })}
            options={[{ value: "", label: ADMIN_CONTENT.examplesPageLabel147, count: byLocale[""] ?? 0 }, ...Object.entries(LOCALES).map(([v, l]) => ({ value: v, label: l, count: byLocale[v] ?? 0 }))]}
          />
          <FilterLinks
            label={ADMIN_CONTENT.pagesPageLabel272}
            current={kind}
            hrefFor={(v) => href({ tur: v })}
            options={[{ value: "", label: ADMIN_CONTENT.pagesPageLabel273, count: byKind[""] ?? 0 }, ...Object.entries(KIND_LABELS).map(([v, l]) => ({ value: v, label: l, count: byKind[v] ?? 0 }))]}
          />
          <FilterLinks
            label={ADMIN_CONTENT.examplesPageLabel148}
            current={status}
            hrefFor={(v) => href({ durum: v })}
            options={[
              { value: "", label: ADMIN_CONTENT.examplesPageLabel136, count: byStatus[""] ?? 0 },
              { value: "yayinda", label: ADMIN_CONTENT.examplesIdPageLabel97, count: byStatus.yayinda ?? 0 },
              { value: "taslak", label: ADMIN_CONTENT.pagesPageLabel274, count: byStatus.taslak ?? 0 },
            ]}
          />
        </Toolbar>

        {!list.length ? (
          <EmptyState title={ADMIN_CONTENT.pagesPageTitle275}>
            <Link href="/admin/pages" className="font-semibold text-primary-text underline underline-offset-4">
              {ADMIN_CONTENT.examplesPageContent153}</Link>
          </EmptyState>
        ) : (
          <BulkSelection ids={list.map((p) => p.id)} noun={ADMIN_CONTENT.pagesPageNoun276} actions={actions}>
            <Table label={ADMIN_CONTENT.pagesPageTitle268}>
              <thead>
                <tr>
                  <Th className="w-12">
                    <SelectAll />
                  </Th>
                  <Th>{ADMIN_CONTENT.auditLogAuditLogTablePage38}</Th>
                  <Th className="max-md:hidden">{ADMIN_CONTENT.pagesPageLabel272}</Th>
                  <Th>{ADMIN_CONTENT.examplesPageLabel148}</Th>
                  <Th className="max-lg:hidden">{ADMIN_CONTENT.pagesPageContent277}</Th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-2/60">
                    <Td>
                      <RowCheckbox id={p.id} label={p.title} />
                    </Td>
                    <Td className="max-w-96">
                      <Link
                        href={{ pathname: "/admin/pages/[id]", params: { id: p.id } }}
                        className="block truncate font-semibold text-foreground hover:text-primary-text"
                      >
                        {p.title}
                      </Link>
                      <p className="truncate text-sm text-muted">
                        {p.locale.toUpperCase()} · {p.slug === HOME_SLUG ? "Ana sayfa" : `/${p.slug}`}
                      </p>
                    </Td>
                    <Td className="text-muted max-md:hidden">{KIND_LABELS[p.kind] ?? p.kind}</Td>
                    <Td>
                      {!p.isPublished ? (
                        <Badge>{ADMIN_CONTENT.examplesPageLabel149}</Badge>
                      ) : p.hasUnpublishedChanges ? (
                        <Badge tone="warning">{ADMIN_CONTENT.pagesPageLabel274}</Badge>
                      ) : (
                        <Badge tone="success">{ADMIN_CONTENT.examplesIdPageLabel97}</Badge>
                      )}
                    </Td>
                    <Td className="whitespace-nowrap text-muted tabular-nums max-lg:hidden">{formatDate(p.updatedAt, true)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </BulkSelection>
        )}
      </AdminBody>
    </>
  );
}
