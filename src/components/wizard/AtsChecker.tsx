"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { pdfText } from "@/client/pdfImport";
import { resumeFromText } from "@/lib/resume/import";
import { normalizeResume } from "@/lib/resume/schema";
import { runChecks, checkScore, type CheckResult } from "@/lib/resume/checks";
import { resumeDefinition } from "@/lib/resume/design";
import { CheckResults } from "@/components/editor/ChecksPanel";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/Button";

export function AtsChecker() {
  const t = useTranslations("Ats"), locale = useLocale();
  const [file, setFile] = useState<File | null>(null), [pending, setPending] = useState(false), [error, setError] = useState(false), [pdf, setPdf] = useState(false);
  const [checks, setChecks] = useState<{ results: CheckResult[]; score: number; passed: number; total: number } | null>(null);
  return <main className="mx-auto max-w-3xl space-y-7 px-4 py-10 sm:px-6"><header><h1 className="text-3xl font-bold">{t("meta")}</h1><p className="mt-3 text-muted">{t("description")}</p></header>
    <form className="space-y-5 border-y border-border py-6" onSubmit={async (event) => {
      event.preventDefault(); if (!file) return; setPending(true); setError(false); setChecks(null);
      try {
        if (file.size > 10 * 1024 * 1024) throw new Error();
        const isPdf = /\.pdf$/i.test(file.name);
        const raw = isPdf ? resumeFromText(await pdfText(file), locale) : JSON.parse(await file.text());
        if (!isPdf && (!raw || typeof raw !== "object" || !raw.personal || typeof raw.personal !== "object")) throw new Error();
        const data = normalizeResume(raw);
        const results = runChecks(data, resumeDefinition(data), 1).filter((result) => result.id !== "length" && (!isPdf || !["ats","contrast","dates","metrics","title","photo"].includes(result.id)));
        setChecks({ results, ...checkScore(results) }); setPdf(isPdf);
      } catch { setError(true); } finally { setPending(false); }
    }}>
      <label className="block font-semibold">{t("file")}<input type="file" accept=".pdf,.json,application/pdf,application/json" required onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-3 block min-h-11 w-full text-base" /></label>
      <button disabled={!file || pending} className={buttonClass("primary")}>{t("check")}</button>
      {error && <p role="alert" className="text-danger">{t("error")}</p>}
    </form>
    {checks && <section aria-labelledby="ats-results"><h2 id="ats-results" className="text-xl font-bold">{t("results")}</h2><p role="status" className="mt-2 text-sm text-muted">{t(pdf ? "pdfNotice" : "jsonNotice")}</p><CheckResults checks={checks} /></section>}
    <Link href="/resume-wizard" className={buttonClass("secondary")}>{t("start")}</Link>
  </main>;
}
