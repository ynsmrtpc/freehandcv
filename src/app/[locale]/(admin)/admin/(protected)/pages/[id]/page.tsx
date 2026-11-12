import { notFound } from "next/navigation";
import { z } from "zod";
import { listPageVersions, getPageForAdmin, parseBlocks } from "@/server/content/pages";
import { migrateLegacyBlocks } from "@/lib/legacyContent";
import { PageEditor } from "./PageEditor";

export default async function EditPage({ params }: PageProps<"/[locale]/admin/pages/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const [p, versions] = await Promise.all([getPageForAdmin(id), listPageVersions(id)]);
  if (!p) notFound();

  return (
    <PageEditor
      // The editor is rebuilt from server data after every saved version.
      key={p.version}
      page={{
        id: p.id,
        slug: p.slug,
        locale: p.locale,
        kind: p.kind,
        version: p.version,
        meta: {
          title: p.title,
          metaTitle: p.metaTitle ?? "",
          metaDescription: p.metaDescription ?? "",
          indexable: p.indexable,
        },
        blocks: parseBlocks(p.draftBlocks),
        hasUnpublishedChanges:
          JSON.stringify(migrateLegacyBlocks(p.draftBlocks)) !== JSON.stringify(migrateLegacyBlocks(p.publishedBlocks)),
      }}
      versions={versions.map((v) => ({
        id: v.id,
        createdAt: v.createdAt.toISOString(),
        publishedBy: v.publishedBy || v.publishedByEmail || "—",
      }))}
    />
  );
}
