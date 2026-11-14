import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
import { Plus } from "lucide-react";
import { BulkSelection, RowCheckbox, SelectAll } from "@/components/admin/BulkSelection";
import { SelectFilter } from "@/components/admin/SelectFilter";
import { AdminBody, AdminPageHeader, adminHref, Badge, EmptyState, FilterLinks, SearchForm, Table, Td, Th, Toolbar } from "@/components/admin/kit";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { listFaqCategories, listFaqsForAdmin } from "@/server/content/faqs";
import { deleteFaqsAction, publishFaqsAction, unpublishFaqsAction } from "./actions";
import { ImportFaqsButton } from "./FaqForm";

export default async function Faqs({ searchParams }: PageProps<"/[locale]/admin/faqs">) {
  const sp = await searchParams;
  const locale = typeof sp.dil === "string" && ["tr", "en"].includes(sp.dil) ? sp.dil : "";
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const categories = await listFaqCategories();
  const category = typeof sp.kategori === "string" && categories.some((c) => c.category === sp.kategori) ? sp.kategori : "";
  const rows = await listFaqsForAdmin({ locale: locale || undefined, category: category || undefined, search: q || undefined });
  const query = { dil: locale, kategori: category, q };
  const href = (patch: Record<string, string>) => adminHref("/admin/faqs", { ...query, ...patch });
  const categoryOptions = [{ value: "", label: ADMIN_CONTENT.examplesPageLabel136 }, ...categories.map((c) => ({ value: c.category, label: `${c.category} (${c.n})` }))];

  return (
    <>
      <AdminPageHeader
        title={ADMIN_CONTENT.auditLogAuditLogTableFaq43}
        description={ADMIN_CONTENT.faqsPageDescription175}
      >
        <Link href="/admin/faqs/new" className={buttonClass("primary", "sm")}>
          <Plus className="size-4" aria-hidden />
          {ADMIN_CONTENT.faqsNewPageTitle174}</Link>
      </AdminPageHeader>
      <AdminBody>
        <ImportFaqsButton />
        <Toolbar>
          <SearchForm value={q} placeholder={ADMIN_CONTENT.faqsPagePlaceholder176} label={ADMIN_CONTENT.faqsPageLabel177} hidden={{ dil: locale, kategori: category }} />
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
        </Toolbar>

        {!rows.length ? (
          <EmptyState title={q || category || locale ? "Bu filtreye uyan soru yok." : ADMIN_CONTENT.faqsPageLabel178}>
            {q || category || locale ? (
              <Link href="/admin/faqs" className="font-semibold text-primary-text underline underline-offset-4">
                {ADMIN_CONTENT.examplesPageContent153}</Link>
            ) : (
              ADMIN_CONTENT.faqsPageLabel179
            )}
          </EmptyState>
        ) : (
          <BulkSelection
            ids={rows.map((r) => r.id)}
            noun={ADMIN_CONTENT.faqsPageNoun180}
            actions={[
              { label: ADMIN_CONTENT.faqsPageLabel181, run: publishFaqsAction },
              { label: ADMIN_CONTENT.faqsPageLabel182, run: unpublishFaqsAction },
              { label: ADMIN_CONTENT.examplesPageLabel140, run: deleteFaqsAction, danger: true, confirm: ADMIN_CONTENT.faqsPageConfirm183 },
            ]}
          >
            <Table label={ADMIN_CONTENT.faqsPageLabel184}>
              <thead>
                <tr>
                  <Th className="w-12">
                    <SelectAll />
                  </Th>
                  <Th>{ADMIN_CONTENT.faqsFaqFormLabel160}</Th>
                  <Th className="max-md:hidden">{ADMIN_CONTENT.examplesExampleFormLabel68}</Th>
                  <Th className="text-end max-lg:hidden">{ADMIN_CONTENT.examplesExampleFormLabel69}</Th>
                  <Th>{ADMIN_CONTENT.examplesPageLabel148}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-2/60">
                    <Td>
                      <RowCheckbox id={r.id} label={r.question} />
                    </Td>
                    <Td className="max-w-[36rem]">
                      <Link href={{ pathname: "/admin/faqs/[id]", params: { id: r.id } }} className="font-semibold text-foreground hover:text-primary-text">
                        {r.question}
                      </Link>
                      <p className="line-clamp-1 text-sm text-muted">
                        {r.locale.toUpperCase()} · {r.answer}
                      </p>
                    </Td>
                    <Td className="text-muted max-md:hidden">{r.category ?? "—"}</Td>
                    <Td className="text-end text-muted tabular-nums max-lg:hidden">{r.sortOrder}</Td>
                    <Td>{r.active ? <Badge tone="success">{ADMIN_CONTENT.examplesIdPageLabel97}</Badge> : <Badge>{ADMIN_CONTENT.faqsPageContent185}</Badge>}</Td>
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
