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
  const categoryOptions = [{ value: "", label: "Tümü" }, ...Object.entries(CATEGORY_NAMES).map(([value, label]) => ({ value, label }))];

  const actions = [
    { label: "Yayınla", run: publishExamplesAction, confirm: "{n} örnek yayınlansın mı? Örnek sayfaları ve listede hemen görünür." },
    { label: "Taslağa al", run: unpublishExamplesAction, confirm: "{n} örnek yayından kaldırılsın mı? Sayfaları 404 verir." },
    ...(isAdmin
      ? [{ label: "Sil", run: deleteExamplesAction, danger: true, confirm: "{n} örnek kalıcı olarak silinsin mi? Bu örnekten başlatılmış CV'ler etkilenmez. Geri alınamaz." }]
      : []),
  ];

  return (
    <>
      <AdminPageHeader title="Örnek CV'ler" description={`${all.length} örnek, ${published} yayında. Taslakları gözden geçirip yayınla; rehber metni ${MIN_GUIDE_WORDS} kelimenin altındaysa uyarı görünür.`}>
        <Link href="/admin/examples/new" className={buttonClass("primary", "sm")}>
          <Plus className="size-4" aria-hidden />
          Yeni örnek
        </Link>
      </AdminPageHeader>
      <AdminBody>
        <Toolbar>
          <SearchForm value={q} placeholder="Başlık, meslek ya da adres" label="Örnek ara" hidden={{ dil: locale, kategori: category, durum: status }} />
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
          <FilterLinks
            label="Durum"
            current={status}
            hrefFor={(v) => href({ durum: v })}
            options={[
              { value: "", label: "Tümü" },
              { value: "yayinda", label: "Yayında" },
              { value: "taslak", label: "Taslak" },
              { value: "kisa", label: "Rehberi kısa" },
            ]}
          />
        </Toolbar>

        <p className="text-sm text-muted" aria-live="polite">
          {filtered.length} örnek
        </p>

        {!list.length ? (
          <EmptyState title="Bu filtreye uyan örnek yok.">
            <Link href="/admin/examples" className="font-semibold text-primary-text underline underline-offset-4">
              Filtreleri temizle
            </Link>
          </EmptyState>
        ) : (
          <BulkSelection ids={list.map((r) => r.id)} noun="örnek" actions={actions}>
            <Table label="Örnek CV'ler">
              <thead>
                <tr>
                  <Th className="w-12">
                    <SelectAll />
                  </Th>
                  <Th>Örnek</Th>
                  <Th className="max-md:hidden">Kategori</Th>
                  <Th className="text-end max-lg:hidden">Rehber</Th>
                  <Th className="text-end max-lg:hidden">Kullanım</Th>
                  <Th>Durum</Th>
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
                        {r.locale.toUpperCase()} · /{r.slug}
                        {r.experienceLevel && ` · ${LEVEL_NAMES[r.experienceLevel] ?? r.experienceLevel}`}
                      </p>
                    </Td>
                    <Td className="text-muted max-md:hidden">{CATEGORY_NAMES[r.category] ?? r.category}</Td>
                    <Td className={cn("text-end whitespace-nowrap tabular-nums max-lg:hidden", r.words < MIN_GUIDE_WORDS ? "font-semibold text-warning" : "text-muted")}>
                      {r.words} kelime
                    </Td>
                    <Td className="text-end text-muted tabular-nums max-lg:hidden">{r.usageCount}</Td>
                    <Td>{r.active ? <Badge tone="success">Yayında</Badge> : <Badge>Taslak</Badge>}</Td>
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
