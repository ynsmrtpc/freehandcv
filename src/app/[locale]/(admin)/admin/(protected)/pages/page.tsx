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

const KIND_LABELS: Record<string, string> = { static: "Sabit", guide: "Rehber", legal: "Yasal" };
const LOCALES: Record<string, string> = { tr: "Türkçe", en: "İngilizce" };

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
    { label: "Yayınla", run: publishPagesAction, confirm: "{n} sayfanın taslağı yayınlansın mı? Ziyaretçiler hemen yeni hâlini görür." },
    { label: "Yayından kaldır", run: unpublishPagesAction, confirm: "{n} sayfa yayından kaldırılsın mı? Adresleri 404 verir; taslak korunur." },
    ...(isAdmin
      ? [{ label: "Sil", run: deletePagesAction, danger: true, confirm: "{n} sayfa ve sürüm geçmişi kalıcı olarak silinsin mi? Bu işlem geri alınamaz." }]
      : []),
  ];

  return (
    <>
      <AdminPageHeader title="Sayfalar" description="Landing ve diğer sayfalar blok blok düzenlenir; değişiklikler “Yayınla” deyince sitede görünür." />
      <AdminBody>
        <Toolbar>
          <SearchForm value={q} placeholder="Başlık ya da adres" label="Sayfa ara" hidden={{ dil: locale, tur: kind, durum: status }} />
          <FilterLinks
            label="Dil"
            current={locale}
            hrefFor={(v) => href({ dil: v })}
            options={[{ value: "", label: "Tüm diller", count: byLocale[""] ?? 0 }, ...Object.entries(LOCALES).map(([v, l]) => ({ value: v, label: l, count: byLocale[v] ?? 0 }))]}
          />
          <FilterLinks
            label="Tür"
            current={kind}
            hrefFor={(v) => href({ tur: v })}
            options={[{ value: "", label: "Tüm türler", count: byKind[""] ?? 0 }, ...Object.entries(KIND_LABELS).map(([v, l]) => ({ value: v, label: l, count: byKind[v] ?? 0 }))]}
          />
          <FilterLinks
            label="Durum"
            current={status}
            hrefFor={(v) => href({ durum: v })}
            options={[
              { value: "", label: "Tümü", count: byStatus[""] ?? 0 },
              { value: "yayinda", label: "Yayında", count: byStatus.yayinda ?? 0 },
              { value: "taslak", label: "Yayınlanmamış değişiklik", count: byStatus.taslak ?? 0 },
            ]}
          />
        </Toolbar>

        {!list.length ? (
          <EmptyState title="Bu filtreye uyan sayfa yok.">
            <Link href="/admin/pages" className="font-semibold text-primary-text underline underline-offset-4">
              Filtreleri temizle
            </Link>
          </EmptyState>
        ) : (
          <BulkSelection ids={list.map((p) => p.id)} noun="sayfa" actions={actions}>
            <Table label="Sayfalar">
              <thead>
                <tr>
                  <Th className="w-12">
                    <SelectAll />
                  </Th>
                  <Th>Sayfa</Th>
                  <Th className="max-md:hidden">Tür</Th>
                  <Th>Durum</Th>
                  <Th className="max-lg:hidden">Son değişiklik</Th>
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
                        <Badge>Taslak</Badge>
                      ) : p.hasUnpublishedChanges ? (
                        <Badge tone="warning">Yayınlanmamış değişiklik</Badge>
                      ) : (
                        <Badge tone="success">Yayında</Badge>
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
