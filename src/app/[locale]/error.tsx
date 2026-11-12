"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default function ErrorPage({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const t = useTranslations("Site");
  const [pending, startTransition] = useTransition();
  return (
    <main className="mx-auto flex min-h-[60dvh] max-w-xl flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t("errorTitle")}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        {t("errorDescription")}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          aria-busy={pending}
          onClick={() => startTransition(() => retry())}
          className={buttonClass("primary")}
        >
          {t("retry")}
        </button>
        <Link href="/" className={buttonClass("secondary")}>
          {t("home")}
        </Link>
      </div>
    </main>
  );
}
