"use client";
import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { TextField, adminInputClass } from "@/components/admin/forms";
import { buttonClass } from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { ScaledPaper } from "@/components/resume/ScaledPaper";
import { emptyResume, emptyEntry, type ResumeData } from "@/lib/resume/schema";
import { resumeDefinition } from "@/lib/resume/design";
import { GUEST_STORAGE_KEY, useEditor } from "@/client/editor/store";
import { createResumeAction } from "@/actions/resume";
import { generateDraftAction } from "@/actions/ai";

type Props = { signedIn: boolean; ai: { enabled: boolean; provider: string; remaining: number }; initialData?: ResumeData };
export function ResumeWizard({ signedIn, ai, initialData }: Props) {
  const locale = useLocale(), t = useTranslations("Wizard"), router = useRouter(), confirm = useConfirm();
  const fieldId = useId();
  const [data, setData] = useState<ResumeData>(() => initialData ?? emptyResume(locale)), [step, setStep] = useState(0), [pending, setPending] = useState(false), [error, setError] = useState("");
  const [remaining, setRemaining] = useState(ai.remaining), [aiError, setAiError] = useState(""), [generated, setGenerated] = useState(false);
  const patch = (fn: (draft: ResumeData) => void) => setData((previous) => { const next = structuredClone(previous); fn(next); return next; });
  async function finish() {
    setPending(true); setError("");
    try {
      if (signedIn) {
        const result = await createResumeAction(data);
        if (!result.ok) { setError(t("error")); return; }
        router.push({ pathname: "/resume/[id]", params: { id: result.id } });
      } else {
        if (localStorage.getItem(GUEST_STORAGE_KEY) && !await confirm(t("replace"))) return;
        useEditor.getState().startGuest(locale); useEditor.getState().replace(data); useEditor.getState().saveNow(); router.push("/create-resume");
      }
    } catch { setError(t("error")); } finally { setPending(false); }
  }
  function list(section: "experience" | "education" | "skills" | "languages", fields: string[]) {
    return <section className="space-y-4"><h2 className="text-xl font-bold">{t(section)}</h2>
      {data[section].map((entry, index) => <fieldset key={entry.id} className="space-y-4 border-y border-border py-5"><legend className="sr-only">{t(section)} {index + 1}</legend>
        <div className="grid gap-4 sm:grid-cols-2">{fields.map((field) => <TextField key={field} label={t(field as never)} value={String((entry as unknown as Record<string, unknown>)[field] ?? "")} maxLength={field === "description" ? 8000 : 1000} onChange={(event) => patch((draft) => { Object.assign(draft[section][index], { [field]: event.target.value }); })} />)}</div>
        {section === "experience" && <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={data.experience[index].current} onChange={(event) => patch((draft) => { draft.experience[index].current = event.target.checked; })} />{t("current")}</label>}
        <button type="button" className={buttonClass("ghost")} onClick={() => patch((draft) => { draft[section].splice(index, 1); })}>{t("remove")}</button>
      </fieldset>)}
      <button type="button" className={buttonClass("secondary")} onClick={() => patch((draft) => {
        if (section === "experience") draft.experience.push(emptyEntry("experience"));
        if (section === "education") draft.education.push(emptyEntry("education"));
        if (section === "skills") draft.skills.push(emptyEntry("skills"));
        if (section === "languages") draft.languages.push(emptyEntry("languages"));
      })}>{t("add")}</button>
    </section>;
  }
  return <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
    <header><h1 className="text-3xl font-bold">{t("meta")}</h1><p className="mt-3 text-muted">{t("intro")}</p><Link href="/create-resume" className="mt-3 inline-flex min-h-11 items-center font-semibold text-primary-text hover:underline">{t("directEditor")}</Link></header>
    <ol className="grid grid-cols-2 gap-3 border-y border-border py-4 sm:grid-cols-4">{[0,1,2,3].map((index) => <li key={index} aria-current={step === index ? "step" : undefined} className={step === index ? "font-bold text-primary-text" : "text-muted"}>{index + 1}. {t(`steps.${index}` as never)}</li>)}</ol>
    <details className="border-b border-border pb-5"><summary className="min-h-11 cursor-pointer font-semibold">{t("aiTitle")}</summary>
      <div className="space-y-4 pt-4"><p className="text-muted">{t("aiDescription")}</p>
        {!signedIn ? <p>{t("aiSignIn")}</p> : !ai.enabled ? <p>{t("aiUnavailable")}</p> : <form className="space-y-4" onSubmit={async (event) => {
          event.preventDefault(); const form = new FormData(event.currentTarget); setPending(true); setAiError("");
          const result = await generateDraftAction({ id: crypto.randomUUID(), text: String(form.get("text")), locale, consent: form.get("consent") === "on" }).catch(() => ({ok: false as const, reason: "failed"}));
          setPending(false); if (!result.ok) return setAiError(result.reason);
          setData(result.data); setRemaining((value) => Math.max(0, value - 1)); setGenerated(true); setStep(3);
        }}>
          <div><label htmlFor={`${fieldId}-ai`} className="block font-semibold">{t("aiText")}</label><textarea id={`${fieldId}-ai`} name="text" required minLength={40} maxLength={20_000} rows={7} className={`${adminInputClass} mt-2 h-auto py-3`} /></div>
          <label className="flex min-h-11 gap-3"><input type="checkbox" name="consent" required className="mt-1 size-5 shrink-0" /><span>{t("aiConsent", { provider: ai.provider })}</span></label>
          <p className="text-sm text-muted">{t("aiRemaining", { remaining })}</p><button disabled={pending || remaining <= 0} className={buttonClass("secondary")}>{t("aiGenerate")}</button>
        </form>}
        {aiError && <p role="alert" className="text-danger">{t(t.has(`aiErrors.${aiError}` as never) ? `aiErrors.${aiError}` as never : "aiErrors.failed")}</p>}
      </div>
    </details>
    <form className="space-y-8" onSubmit={(event) => { event.preventDefault(); if (step < 3) setStep(step + 1); else void finish(); }}>
      {step === 0 && <section className="space-y-5"><div className="grid gap-4 sm:grid-cols-2">{(["name","title","email","phone","location"] as const).map((key) => <TextField key={key} label={t(key)} type={key === "email" ? "email" : "text"} required={key === "name"} value={data.personal[key]} maxLength={200} onChange={(event) => patch((draft) => { draft.personal[key] = event.target.value; })} />)}</div>
        <div><label htmlFor={`${fieldId}-summary`} className="block font-semibold">{t("summary")}</label><textarea id={`${fieldId}-summary`} className={`${adminInputClass} mt-2 h-auto py-3`} rows={5} value={data.summary} maxLength={8000} onChange={(event) => patch((draft) => { draft.summary = event.target.value; })} /></div></section>}
      {step === 1 && <>{list("experience", ["position","company","start","end","description"])}{list("education", ["school","field","degree","start","end"])}</>}
      {step === 2 && <>{list("skills", ["category","items"])}{list("languages", ["language","level"])}</>}
      {step === 3 && <section className="space-y-5"><p role="status" className="text-muted">{generated ? t("aiReview") : t("review")}</p><div className="overflow-hidden rounded-lg border border-border bg-desk p-3 sm:p-6"><ScaledPaper initialScale={0.7}><ResumeDocument data={data} definition={resumeDefinition(data)} embedded /></ScaledPaper></div></section>}
      {error && <p role="alert" className="text-danger">{error}</p>}
      <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-5"><button type="button" disabled={step === 0 || pending} className={buttonClass("secondary")} onClick={() => setStep(step - 1)}>{t("previous")}</button><button disabled={pending} className={buttonClass("primary")}>{t(step === 3 ? "finish" : "next")}</button></div>
    </form>
  </main>;
}
