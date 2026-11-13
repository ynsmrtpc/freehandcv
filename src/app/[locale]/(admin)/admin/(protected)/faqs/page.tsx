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
  const categoryOptions = [{ value: "", label: "Tümü" }, ...categories.map((c) => ({ value: c.category, label: `${c.category} (${c.n})` }))];

  return (
    <>
      <AdminPageHeader
        title="SSS"
        description="Soru havuzu. Bir sayfadaki SSS bloğuna kategori yazınca o kategorinin yayındaki soruları sırasıyla orada görünür; Google için SSS işaretlemesi de buradan üretilir."
      >
        <Link href="/admin/faqs/new" className={buttonClass("primary", "sm")}>
          <Plus className="size-4" aria-hidden />
          Yeni soru
        </Link>
      </AdminPageHeader>
      <AdminBody>
        <ImportFaqsButton />
        <Toolbar>
          <SearchForm value={q} placeholder="Soru ya da cevapta ara" label="SSS ara" hidden={{ dil: locale, kategori: category }} />
          <SelectFilter
            label="Kategori"
            value={category}
            options={categoryOptions}
            hrefs={Object.fromEntries(categoryOptions.map((o) => [o.value, href({ kategori: o.value })]))}
          />
          <FilterLinks
            label="Dil"
            current={locale}
            hrefFor={(v) => href({ dil: v })}
            options={[
              { value: "", label: "Tüm diller" },
              { value: "tr", label: "Türkçe" },
              { value: "en", label: "İngilizce" },
            ]}
          />
        </Toolbar>

        {!rows.length ? (
          <EmptyState title={q || category || locale ? "Bu filtreye uyan soru yok." : "Havuzda henüz soru yok."}>
            {q || category || locale ? (
              <Link href="/admin/faqs" className="font-semibold text-primary-text underline underline-offset-4">
                Filtreleri temizle
              </Link>
            ) : (
              "Yeni soru ekleyebilir ya da sayfalardaki SSS bloklarında yazılı soruları “Sayfalardan aktar” ile havuza alabilirsin."
            )}
          </EmptyState>
        ) : (
          <BulkSelection
            ids={rows.map((r) => r.id)}
            noun="soru"
            actions={[
              { label: "Yayına al", run: publishFaqsAction },
              { label: "Gizle", run: unpublishFaqsAction },
              { label: "Sil", run: deleteFaqsAction, danger: true, confirm: "{n} soru kalıcı olarak silinsin mi? Bu soruları kullanan sayfalardan da kalkar." },
            ]}
          >
            <Table label="Sorular">
              <thead>
                <tr>
                  <Th className="w-12">
                    <SelectAll />
                  </Th>
                  <Th>Soru</Th>
                  <Th className="max-md:hidden">Kategori</Th>
                  <Th className="text-end max-lg:hidden">Sıra</Th>
                  <Th>Durum</Th>
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
                    <Td>{r.active ? <Badge tone="success">Yayında</Badge> : <Badge>Gizli</Badge>}</Td>
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
