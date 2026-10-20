import { ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";

type Crumb = { name: string; href: Parameters<typeof absoluteUrl>[0] };

/** Visible breadcrumb + BreadcrumbList JSON-LD (plan 6.4). The last item is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const locale = useLocale() as Locale;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: absoluteUrl(c.href, locale),
          })),
        }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
          {items.map((c, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight aria-hidden className="size-3.5 rtl:rotate-180" />}
              {i < items.length - 1 ? (
                <Link href={c.href} className="hover:text-foreground">
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-foreground">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
