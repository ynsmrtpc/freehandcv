import { adminContent as ADMIN_CONTENT, formatAdminContent } from "@/lib/adminContent";
import { Plus } from "lucide-react";
import { BulkSelection, RowCheckbox, SelectAll } from "@/components/admin/BulkSelection";
import { SelectFilter } from "@/components/admin/SelectFilter";
import {
  AdminBody,
  AdminPageHeader,
  adminHref,
  Badge,
  EmptyState,
  FilterLinks,
  Pagination,
  SearchForm,
  Table,
  Td,
  Th,
  Toolbar,
} from "@/components/admin/kit";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { guideWordCount } from "@/lib/examples";
import { cn } from "@/lib/cn";
import { listExamplesForAdmin, parseGuide } from "@/server/content/examples";
import { adminStatus } from "@/server/authz";
import { deleteExamplesAction, publishExamplesAction, unpublishExamplesAction } from "./actions";
import { CATEGORY_NAMES, LEVEL_NAMES } from "./labels";

const PAGE_SIZE = 50;
/** Below this many words the writing guide is too thin for the example page (plan 6.4). */
const MIN_GUIDE_WORDS = 400;

export default async function Examples({ searchParams }: PageProps<"/[locale]/admin/examples">) {
  const sp = await searchParams;
  const pick = (v: unknown, allowed: string[]) => (typeof v === "string" && allowed.includes(v) ? v : "");
  const locale = pick(sp.dil, ["tr", "en"]);
  const category = pick(sp.kategori, Object.keys(CATEGORY_NAMES));
  const status = pick(sp.durum, ["yayinda", "taslak", "kisa"]);
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const page = Math.max(0, Number(sp.sayfa) || 0);
  const [rows, s] = await Promise.all([listExamplesForAdmin(), adminStatus()]);
  const isAdmin = s.status === "ok" && s.user.role === "admin";

  const all = rows.map((r) => ({ ...r, words: guideWordCount(parseGuide(r.guide)) }));
  const needle = q.toLocaleLowerCase("tr");
  const filtered = all.filter(
    (r) =>
      (!locale || r.locale === locale) &&
      (!category || r.category === category) &&
      (!status || (status === "yayinda" ? r.active : status === "taslak" ? !r.active : r.words < MIN_GUIDE_WORDS)) &&
      (!q || `${r.title} ${r.occupation} ${r.slug}`.toLocaleLowerCase("tr").includes(needle)),
  );
  const list = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const published = all.filter((r) => r.active).length;
  const query = { dil: locale, kategori: category, durum: status, q };
  const href = (patch: Record<string, string | number | undefined>) => adminHref("/admin/examples", { ...query, sayfa: undefined, ...patch });
  const categoryOptions = [{ value: "", label: ADMIN_CONTENT.examplesPageLabel136 }, ...Object.entries(CATEGORY_NAMES).map(([value, label]) => ({ value, label }))];

  const actions = [
    { label: ADMIN_CONTENT.examplesPublishToggleLabel96, run: publishExamplesAction, confirm: ADMIN_CONTENT.examplesPageConfirm137 },
    { label: ADMIN_CONTENT.examplesPageLabel138, run: unpublishExamplesAction, confirm: ADMIN_CONTENT.examplesPageConfirm139 },
    ...(isAdmin
      ? [{ label: ADMIN_CONTENT.examplesPageLabel140, run: deleteExamplesAction, danger: true, confirm: ADMIN_CONTENT.examplesPageConfirm141 }]
      : []),
  ];

  return (
    <>
      <AdminPageHeader title={ADMIN_CONTENT.examplesPageTitle142} description={formatAdminContent(ADMIN_CONTENT.examplesPageMessage143, {value0: all.length,value1: published,value2: MIN_GUIDE_WORDS})}>
        <Link href="/admin/examples/new" className={buttonClass("primary", "sm")}>
          <Plus className="size-4" aria-hidden />
          {ADMIN_CONTENT.examplesPageContent144}</Link>
      </AdminPageHeader>
      <AdminBody>
        <Toolbar>
          <SearchForm value={q} placeholder={ADMIN_CONTENT.examplesPagePlaceholder145} label={ADMIN_CONTENT.examplesPageLabel146} hidden={{ dil: locale, kategori: category, durum: status }} />
          <SelectFilter
            label={ADMIN_CONTENT.examplesExampleFormLabel68}
            value={category}
            options={categoryOptions}
            hrefs={Object.fromEntries(categoryOptions.map((o) => [o.value, href({ kategori: o.value })]))}
          />
          <FilterLinks
            label={ADMIN_CONTENT.examplesExampleFormLabel63}
            current={locale}
            hrefFor={(v) => href({ dil: v })}
            options={[
              { value: "", label: ADMIN_CONTENT.examplesPageLabel147 },
              { value: "tr", label: ADMIN_CONTENT.examplesExampleFormContent65 },
              { value: "en", label: ADMIN_CONTENT.examplesExampleFormContent66 },
            ]}
          />
          <FilterLinks
            label={ADMIN_CONTENT.examplesPageLabel148}
            current={status}
            hrefFor={(v) => href({ durum: v })}
            options={[
              { value: "", label: ADMIN_CONTENT.examplesPageLabel136 },
              { value: "yayinda", label: ADMIN_CONTENT.examplesIdPageLabel97 },
              { value: "taslak", label: ADMIN_CONTENT.examplesPageLabel149 },
              { value: "kisa", label: ADMIN_CONTENT.examplesPageLabel150 },
            ]}
          />
        </Toolbar>

        <p className="text-sm text-muted" aria-live="polite">
          {filtered.length} {ADMIN_CONTENT.examplesPageContent151}</p>

        {!list.length ? (
          <EmptyState title={ADMIN_CONTENT.examplesPageTitle152}>
            <Link href="/admin/examples" className="font-semibold text-primary-text underline underline-offset-4">
              {ADMIN_CONTENT.examplesPageContent153}</Link>
          </EmptyState>
        ) : (
          <BulkSelection ids={list.map((r) => r.id)} noun={ADMIN_CONTENT.examplesPageContent151} actions={actions}>
            <Table label={ADMIN_CONTENT.examplesPageTitle142}>
              <thead>
                <tr>
                  <Th className="w-12">
                    <SelectAll />
                  </Th>
                  <Th>{ADMIN_CONTENT.examplesPageContent154}</Th>
                  <Th className="max-md:hidden">{ADMIN_CONTENT.examplesExampleFormLabel68}</Th>
                  <Th className="text-end max-lg:hidden">{ADMIN_CONTENT.examplesPageContent155}</Th>
                  <Th className="text-end max-lg:hidden">{ADMIN_CONTENT.examplesPageContent156}</Th>
                  <Th>{ADMIN_CONTENT.examplesPageLabel148}</Th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-2/60">
                    <Td>
                      <RowCheckbox id={r.id} label={r.title} />
                    </Td>
                    <Td className="max-w-96">
                      <Link
                        href={{ pathname: "/admin/examples/[id]", params: { id: r.id } }}
                        className="block truncate font-semibold text-foreground hover:text-primary-text"
                      >
                        {r.title}
                      </Link>
                      <p className="truncate text-sm text-muted">
                        {r.locale.toUpperCase()} {ADMIN_CONTENT.examplesPageContent157}{r.slug}
                        {r.experienceLevel && ` · ${LEVEL_NAMES[r.experienceLevel] ?? r.experienceLevel}`}
                      </p>
                    </Td>
                    <Td className="text-muted max-md:hidden">{CATEGORY_NAMES[r.category] ?? r.category}</Td>
                    <Td className={cn("text-end whitespace-nowrap tabular-nums max-lg:hidden", r.words < MIN_GUIDE_WORDS ? "font-semibold text-warning" : "text-muted")}>
                      {r.words} {ADMIN_CONTENT.examplesPageContent158}</Td>
                    <Td className="text-end text-muted tabular-nums max-lg:hidden">{r.usageCount}</Td>
                    <Td>{r.active ? <Badge tone="success">{ADMIN_CONTENT.examplesIdPageLabel97}</Badge> : <Badge>{ADMIN_CONTENT.examplesPageLabel149}</Badge>}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </BulkSelection>
        )}

        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} hrefFor={(p) => href({ sayfa: p || undefined })} />
      </AdminBody>
    </>
  );
}
