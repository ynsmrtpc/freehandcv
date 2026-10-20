import { getLocale } from "next-intl/server";
import { getPublishedExamples } from "@/server/content/examples";
import { getPublishedGuides } from "@/server/content/pages";
import { SiteHeader } from "./SiteHeader";

/** Reads which sections have published content (cached) and passes it to the client header. */
export async function SiteHeaderContainer() {
  const locale = await getLocale();
  const [examples, guides] = await Promise.all([getPublishedExamples(locale), getPublishedGuides()]);
  return <SiteHeader showExamples={examples.length > 0} showGuides={guides.some((g) => g.locale === locale)} />;
}
