import { FileQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("Site");
  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-xl flex-col justify-center px-4 py-12 sm:px-6">
      <Link href="/" className="mb-10 self-start rounded-lg">
        <Logo />
      </Link>
      <FileQuestion className="mb-5 size-8 text-primary-text" aria-hidden />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        {t("notFoundDescription")}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className={buttonClass("primary")}>
          {t("home")}
        </Link>
        <Link href="/resume-examples" className={buttonClass("secondary")}>
          {t("resumeExamples")}
        </Link>
      </div>
    </main>
  );
}
