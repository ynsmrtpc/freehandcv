import { Megaphone } from "lucide-react";
import NextLink from "next/link";
import { getSiteSettings } from "@/server/content/siteSettings";

// Thin strip toggled from site settings (admin panel) (plan 7.3).
export async function AnnouncementBar({ locale }: { locale: string }) {
  const { announcement } = (await getSiteSettings(locale)).localized;
  if (!announcement.enabled || !announcement.text) return null;
  const inner = (
    <>
      <Megaphone className="size-4 shrink-0" aria-hidden />
      <span>{announcement.text}</span>
    </>
  );
  const className = "flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium";
  return (
    <div className="bg-primary text-white">
      {announcement.href ? (
        <NextLink href={announcement.href} className={`${className} underline-offset-4 hover:underline`}>
          {inner}
        </NextLink>
      ) : (
        <p className={className}>{inner}</p>
      )}
    </div>
  );
}
