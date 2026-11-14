"use client";
import { useId, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/client/auth";
import { Link, getPathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buttonClass } from "@/components/ui/Button";
import { adminInputClass } from "@/components/admin/forms";
import { emptyResume, type ResumeData } from "@/lib/resume/schema";
import { mergeLinkedInCsv, resumeFromText } from "@/lib/resume/import";
import { pdfText } from "@/client/pdfImport";
import { appendGithubProjectsAction, githubProjectsAction } from "@/actions/github";
import { ResumeWizard } from "./ResumeWizard";

type Repo = { id: number; name: string; description: string; link: string; technologies: string };
type Props = { signedIn: boolean; githubConfigured: boolean; githubConnected: boolean; resumes: { id: string; title: string }[]; ai: { enabled: boolean; provider: string; remaining: number } };
export function ResumeImport(props: Props) {
  const t = useTranslations("Import"), locale = useLocale() as Locale, router = useRouter();
  const textId = useId();
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [text, setText] = useState(""), [csv, setCsv] = useState<ResumeData | null>(null), [draft, setDraft] = useState<ResumeData | null>(null), [pending, setPending] = useState(false), [error, setError] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]), [page, setPage] = useState(1), [selected, setSelected] = useState<number[]>([]), [resumeId, setResumeId] = useState(props.resumes[0]?.id ?? "");
  async function loadRepositories(next: number) {
    setPending(true); setError(""); const result = await githubProjectsAction(next).catch(() => ({ok: false as const})); setPending(false);
    if (!result.ok) return setError(t("githubError")); setRepos(result.items); setPage(next); setSelected([]);
  }
  if (draft) return <ResumeWizard signedIn={props.signedIn} ai={props.ai} initialData={draft} />;
  return <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
    <header><h1 className="text-3xl font-bold">{t("meta")}</h1><p className="mt-3 leading-relaxed text-muted">{t("description")}</p></header>
    <section className="space-y-5 border-b border-border pb-8">
      <label className="block font-semibold">{t("file")}<input type="file" accept=".pdf,.txt,.csv,text/plain,text/csv,application/pdf" multiple disabled={pending || !hydrated} className="mt-3 block min-h-11 w-full text-base" onChange={async (event) => {
        const files = [...(event.target.files ?? [])]; if (!files.length) return;
        setPending(true); setError(""); setCsv(null);
        try {
          if (files.length > 5) throw new Error("too_large");
          let content = "", mapped = emptyResume(locale), hasCsv = false;
          for (const file of files) {
            if (file.size > 10 * 1024 * 1024) throw new Error("too_large");
            if (/\.csv$/i.test(file.name)) { mapped = mergeLinkedInCsv(mapped, await file.text()); hasCsv = true; }
            else if (/\.pdf$/i.test(file.name)) content += await pdfText(file) + "\n";
            else if (/\.txt$/i.test(file.name)) content += await file.text() + "\n";
            else throw new Error("invalid_file");
          }
          if (content.length > 50_000) throw new Error("too_large");
          if (hasCsv && content.trim()) throw new Error("invalid_file");
          setText(content); if (hasCsv) setCsv(mapped);
        } catch (failure) { setError(failure instanceof Error && failure.message === "no_text" ? t("noText") : t("error")); }
        finally { setPending(false); event.target.value = ""; }
      }} /></label>
      <p className="text-sm text-muted">{t("fileHint")}</p>
      {csv ? <p role="status">{t("csvReady")}</p> : <div><label htmlFor={textId} className="block font-semibold">{t("text")}</label><textarea id={textId} rows={10} maxLength={50_000} value={text} onChange={(event) => setText(event.target.value)} className={`${adminInputClass} mt-2 h-auto py-3`} /></div>}
      <p className="text-sm text-muted">{t("reviewNote")}</p>
      <button disabled={pending || !csv && !text.trim()} className={buttonClass("primary")} onClick={() => { try { setDraft(csv ?? resumeFromText(text, locale)); } catch { setError(t("error")); } }}>{t("review")}</button>
      {error && <p role="alert" className="text-danger">{error}</p>}
    </section>
    <section className="space-y-4"><h2 className="text-xl font-bold">{t("githubTitle")}</h2><p className="text-muted">{t("githubDescription")}</p>
      {!props.signedIn ? <Link href={{ pathname: "/sign-in", query: { next: getPathname({ locale, href: "/resume-import" }) } }} className={buttonClass("secondary")}>{t("githubSignIn")}</Link>
        : !props.githubConfigured ? <p>{t("githubUnavailable")}</p>
        : !props.githubConnected ? <button className={buttonClass("secondary")} disabled={pending} onClick={async () => { setPending(true); const result = await authClient.linkSocial({ provider: "github", callbackURL: getPathname({ locale, href: "/resume-import" }) }); if (result.error) setError(t("githubError")); setPending(false); }}>{t("githubConnect")}</button>
        : <div className="space-y-4"><button className={buttonClass("secondary")} disabled={pending} onClick={() => loadRepositories(1)}>{t("githubLoad")}</button>
          <ul className="divide-y divide-border border-y border-border">{repos.map((repo) => <li key={repo.id}><label className="flex min-h-11 gap-3 py-4"><input type="checkbox" className="mt-1 size-5" checked={selected.includes(repo.id)} onChange={(event) => setSelected((ids) => event.target.checked ? [...ids, repo.id] : ids.filter((id) => id !== repo.id))} /><span className="min-w-0"><strong className="break-words">{repo.name}</strong><span className="mt-1 block text-sm text-muted">{repo.description}</span></span></label></li>)}</ul>
          {repos.length === 50 && <button className={buttonClass("secondary")} disabled={pending} onClick={() => loadRepositories(page + 1)}>{t("githubNext")}</button>}
          {props.resumes.length ? <><label className="block font-semibold">{t("resume")}<select value={resumeId} onChange={(event) => setResumeId(event.target.value)} className={`${adminInputClass} mt-2`}>{props.resumes.map((resume) => <option key={resume.id} value={resume.id}>{resume.title}</option>)}</select></label>
            <button className={buttonClass("secondary")} disabled={pending || !selected.length || selected.length > 20} onClick={async () => { setPending(true); const result = await appendGithubProjectsAction(resumeId, selected, page).catch(() => ({ok: false as const})); setPending(false); if (result.ok) router.push({ pathname: "/resume/[id]", params: { id: result.id } }); else setError(t("githubError")); }}>{t("githubAdd")}</button></> : <p>{t("noResumes")}</p>}
        </div>}
    </section>
    <Link href="/resume-wizard" className={buttonClass("secondary")}>{t("wizard")}</Link>
  </main>;
}
