"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
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

export type WizardAiStatus = {
  enabled: boolean;
  provider: string;
  remaining: number;
};
type Props = {
  signedIn: boolean;
  ai: WizardAiStatus;
  initialData?: ResumeData;
  onClose?: () => void;
};
const templates = ["ats", "modern", "classic", "minimal"] as const;

export function ResumeWizard({ signedIn, ai, initialData, onClose }: Props) {
  const locale = useLocale(),
    t = useTranslations("Wizard"),
    templateText = useTranslations("Templates"),
    router = useRouter(),
    confirm = useConfirm();
  const id = useId(),
    dialog = useRef<HTMLDialogElement>(null),
    content = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const [data, setData] = useState<ResumeData>(() => {
    const value = structuredClone(initialData ?? emptyResume(locale));
    value.settings.template = "ats";
    value.settings.showPhoto = false;
    return value;
  });
  const [step, setStep] = useState(0),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const [remaining, setRemaining] = useState(ai.remaining),
    [useAi, setUseAi] = useState(false),
    [consent, setConsent] = useState(false);
  const [generated, setGenerated] = useState(false),
    [aiError, setAiError] = useState("");
  const patch = (fn: (draft: ResumeData) => void) => {
    setGenerated(false);
    setData((previous) => {
      const next = structuredClone(previous);
      fn(next);
      return next;
    });
  };
  useEffect(() => {
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, []);
  useEffect(() => {
    content.current?.scrollTo(0, 0);
    heading.current?.focus();
  }, [step]);
  function close() {
    if (!pending) {
      if (onClose) onClose();
      else router.push(signedIn ? "/dashboard" : "/create-resume");
    }
  }
  async function finish() {
    setPending(true);
    setError("");
    try {
      if (signedIn) {
        const result = await createResumeAction(data);
        if (!result.ok) {
          setError(t("error"));
          return;
        }
        router.push({ pathname: "/resume/[id]", params: { id: result.id } });
      } else {
        if (
          localStorage.getItem(GUEST_STORAGE_KEY) &&
          !(await confirm(t("replace")))
        )
          return;
        useEditor.getState().startGuest(locale);
        useEditor.getState().replace(data);
        useEditor.getState().saveNow();
        router.push("/create-resume");
      }
    } catch {
      setError(t("error"));
    } finally {
      setPending(false);
    }
  }
  async function next() {
    setError("");
    setAiError("");
    if (step === 5) return finish();
    if (step === 4 && useAi && !generated) {
      setPending(true);
      try {
        const result = await generateDraftAction({
          id: crypto.randomUUID(),
          text: JSON.stringify({
            personal: data.personal,
            summary: data.summary,
            experience: data.experience,
            education: data.education,
            skills: data.skills,
            languages: data.languages,
          }),
          locale: data.settings.locale,
          consent,
        });
        if (!result.ok) {
          setAiError(result.reason);
          return;
        }
        setData((current) => ({
          ...current,
          ...result.data,
          personal: { ...result.data.personal, ...current.personal },
          settings: current.settings,
        }));
        setRemaining((value) => Math.max(0, value - 1));
        setGenerated(true);
      } catch {
        setAiError("failed");
        return;
      } finally {
        setPending(false);
      }
    }
    setStep(step + 1);
  }
  function list(
    section: "experience" | "education" | "skills" | "languages",
    fields: string[],
  ) {
    return (
      <div className="space-y-4">
        {data[section].map((entry, index) => (
          <fieldset
            key={entry.id}
            className="rounded-lg border border-border p-4 sm:p-5"
          >
            <legend className="px-2 text-sm font-semibold">
              {t(section)} {index + 1}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) =>
                field === "description" ? (
                  <div key={field} className="sm:col-span-2">
                    <label
                      htmlFor={`${id}-${entry.id}-${field}`}
                      className="block text-[15px] font-semibold"
                    >
                      {t(field as never)}
                    </label>
                    <textarea
                      id={`${id}-${entry.id}-${field}`}
                      rows={3}
                      maxLength={2000}
                      value={String(
                        (entry as unknown as Record<string, unknown>)[field] ??
                          "",
                      )}
                      className={`${adminInputClass} mt-1.5 h-auto py-3`}
                      onChange={(event) =>
                        patch((draft) => {
                          Object.assign(draft[section][index], {
                            [field]: event.target.value,
                          });
                        })
                      }
                    />
                  </div>
                ) : (
                  <TextField
                    key={field}
                    label={t(field as never)}
                    type={
                      field === "start" || field === "end" ? "month" : "text"
                    }
                    disabled={
                      field === "end" &&
                      section === "experience" &&
                      data.experience[index].current
                    }
                    value={String(
                      (entry as unknown as Record<string, unknown>)[field] ??
                        "",
                    )}
                    maxLength={500}
                    onChange={(event) =>
                      patch((draft) => {
                        Object.assign(draft[section][index], {
                          [field]: event.target.value,
                        });
                      })
                    }
                  />
                ),
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              {section === "experience" && (
                <label className="flex min-h-11 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.experience[index].current}
                    onChange={(event) =>
                      patch((draft) => {
                        draft.experience[index].current = event.target.checked;
                        if (event.target.checked)
                          draft.experience[index].end = "";
                      })
                    }
                  />
                  {t("current")}
                </label>
              )}
              <button
                type="button"
                className={buttonClass("ghost", "sm")}
                aria-label={t("removeEntry", {
                  section: t(section),
                  number: index + 1,
                })}
                onClick={() =>
                  patch((draft) => {
                    draft[section].splice(index, 1);
                  })
                }
              >
                {t("remove")}
              </button>
            </div>
          </fieldset>
        ))}
        <button
          type="button"
          className={buttonClass("secondary")}
          onClick={() =>
            patch((draft) => {
              if (section === "experience")
                draft.experience.push(emptyEntry("experience"));
              if (section === "education")
                draft.education.push(emptyEntry("education"));
              if (section === "skills") draft.skills.push(emptyEntry("skills"));
              if (section === "languages")
                draft.languages.push(emptyEntry("languages"));
            })
          }
        >
          <Plus className="size-4" aria-hidden />
          {t("addSection", { section: t(section) })}
        </button>
      </div>
    );
  }
  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-hint`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      className="fixed inset-0 m-auto h-[min(860px,100dvh)] max-h-dvh w-full max-w-5xl overflow-hidden border border-border bg-surface p-0 text-foreground shadow-elevated backdrop:bg-foreground/40 sm:h-[min(860px,calc(100dvh-3rem))] sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100%_-_3rem)] sm:rounded-xl"
    >
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4 sm:px-8">
          <span className="font-bold">{t("meta")}</span>
          <button
            type="button"
            disabled={pending}
            className={buttonClass("ghost", "sm")}
            aria-label={t("close")}
            onClick={close}
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>
        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-56 shrink-0 border-e border-border bg-surface-2 p-6 md:block">
            <p className="mb-6 text-sm text-muted">{t("intro")}</p>
            <ol className="space-y-5">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <li
                  key={index}
                  aria-current={step === index ? "step" : undefined}
                  className={`flex items-center gap-3 text-sm ${step === index ? "font-bold text-primary-text" : "text-muted"}`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border ${step === index ? "border-primary bg-primary-soft" : "border-border-strong"}`}
                  >
                    {step > index ? (
                      <Check className="size-4" aria-hidden />
                    ) : (
                      index + 1
                    )}
                  </span>
                  {t(`steps.${index}` as never)}
                </li>
              ))}
            </ol>
          </aside>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void next();
            }}
            className="flex min-w-0 flex-1 flex-col"
            aria-busy={pending}
          >
            <div
              ref={content}
              className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8"
            >
              <p className="text-sm font-semibold text-primary-text">
                {t("progress", { current: step + 1, total: 6 })}
              </p>
              <div
                className="mt-2 h-1 overflow-hidden rounded bg-border"
                aria-hidden
              >
                <div
                  className="h-full bg-primary"
                  style={{ width: `${((step + 1) / 6) * 100}%` }}
                />
              </div>
              <h2
                ref={heading}
                tabIndex={-1}
                id={`${id}-title`}
                className="mt-6 text-2xl font-bold outline-none"
              >
                {t(`questions.${step}` as never)}
              </h2>
              <p id={`${id}-hint`} className="mb-6 mt-2 text-muted">
                {t(`hints.${step}` as never)}
              </p>
              <fieldset disabled={pending} className="min-w-0 space-y-6">
                {step === 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(
                      ["name", "title", "email", "phone", "location"] as const
                    ).map((key) => (
                      <TextField
                        key={key}
                        label={t(key)}
                        type={
                          key === "email"
                            ? "email"
                            : key === "phone"
                              ? "tel"
                              : "text"
                        }
                        autoComplete={
                          key === "name"
                            ? "name"
                            : key === "email"
                              ? "email"
                              : key === "phone"
                                ? "tel"
                                : "off"
                        }
                        required={key === "name"}
                        value={data.personal[key]}
                        maxLength={200}
                        onChange={(event) =>
                          patch((draft) => {
                            draft.personal[key] = event.target.value;
                          })
                        }
                      />
                    ))}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor={`${id}-summary`}
                        className="block font-semibold"
                      >
                        {t("summary")}
                      </label>
                      <textarea
                        id={`${id}-summary`}
                        rows={3}
                        maxLength={2000}
                        value={data.summary}
                        className={`${adminInputClass} mt-2 h-auto py-3`}
                        onChange={(event) =>
                          patch((draft) => {
                            draft.summary = event.target.value;
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {step === 1 &&
                  list("experience", [
                    "position",
                    "company",
                    "start",
                    "end",
                    "description",
                  ])}
                {step === 2 &&
                  list("education", [
                    "school",
                    "field",
                    "degree",
                    "start",
                    "end",
                  ])}
                {step === 3 && (
                  <>
                    <section>
                      <h3 className="mb-3 font-bold">{t("skills")}</h3>
                      {list("skills", ["category", "items"])}
                    </section>
                    <section>
                      <h3 className="mb-3 font-bold">{t("languages")}</h3>
                      {list("languages", ["language", "level"])}
                    </section>
                  </>
                )}
                {step === 4 && (
                  <>
                    <fieldset>
                      <legend className="mb-3 font-semibold">
                        {t("template")}
                      </legend>
                      <div className="grid grid-cols-2 gap-3">
                        {templates.map((template) => (
                          <label
                            key={template}
                            className={`cursor-pointer rounded-lg border p-3 ${data.settings.template === template ? "border-primary bg-primary-soft" : "border-border"}`}
                          >
                            <div
                              className="pointer-events-none mb-3 h-40 overflow-hidden bg-paper"
                              aria-hidden
                              inert
                            >
                              <ScaledPaper initialScale={0.18}>
                                <ResumeDocument
                                  data={{
                                    ...data,
                                    settings: { ...data.settings, template },
                                  }}
                                  definition={resumeDefinition({
                                    ...data,
                                    settings: { ...data.settings, template },
                                  })}
                                  embedded
                                  noLinks
                                />
                              </ScaledPaper>
                            </div>
                            <span className="flex items-center gap-2 text-sm font-semibold">
                              <input
                                type="radio"
                                name="template"
                                value={template}
                                checked={data.settings.template === template}
                                onChange={() =>
                                  setData((current) => ({
                                    ...current,
                                    settings: { ...current.settings, template },
                                  }))
                                }
                              />
                              {templateText(`names.${template}`)}
                            </span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-muted">{t("atsHint")}</p>
                    </fieldset>
                    <label className="block font-semibold">
                      {t("resumeLanguage")}
                      <select
                        className={`${adminInputClass} mt-2`}
                        value={data.settings.locale}
                        onChange={(event) =>
                          patch((draft) => {
                            draft.settings.locale = event.target.value as
                              "tr" | "en";
                          })
                        }
                      >
                        <option value="tr">{t("turkish")}</option>
                        <option value="en">{t("english")}</option>
                      </select>
                    </label>
                    <section className="border-t border-border pt-5">
                      <label className="flex items-center gap-3 font-semibold">
                        <input
                          type="checkbox"
                          checked={useAi}
                          disabled={!signedIn || !ai.enabled || remaining <= 0}
                          onChange={(event) => setUseAi(event.target.checked)}
                        />
                        <Sparkles className="size-4" aria-hidden />
                        {t("aiTitle")}
                      </label>
                      <p className="mt-2 text-sm text-muted">
                        {!signedIn
                          ? t("aiSignIn")
                          : !ai.enabled
                            ? t("aiUnavailable")
                            : t("aiDescription")}
                      </p>
                      {signedIn && ai.enabled && (
                        <p className="mt-2 text-sm text-muted">
                          {t("aiRemaining", { remaining })}
                        </p>
                      )}
                      {useAi && (
                        <label className="mt-4 flex items-start gap-3 text-sm">
                          <input
                            type="checkbox"
                            required
                            checked={consent}
                            onChange={(event) =>
                              setConsent(event.target.checked)
                            }
                            className="mt-1 shrink-0"
                          />
                          <span>
                            {t("aiConsent", { provider: ai.provider })}
                          </span>
                        </label>
                      )}
                    </section>
                  </>
                )}
                {step === 5 && (
                  <>
                    <p role="status" className="text-sm text-muted">
                      {generated ? t("aiReview") : t("review")}
                    </p>
                    <div className="overflow-hidden rounded-lg border border-border bg-desk p-3 sm:p-5">
                      <ScaledPaper initialScale={0.5}>
                        <ResumeDocument
                          data={data}
                          definition={resumeDefinition(data)}
                          embedded
                        />
                      </ScaledPaper>
                    </div>
                  </>
                )}
              </fieldset>
              {aiError && (
                <p role="alert" className="mt-4 text-danger">
                  {t(
                    t.has(`aiErrors.${aiError}` as never)
                      ? (`aiErrors.${aiError}` as never)
                      : "aiErrors.failed",
                  )}
                </p>
              )}
              {error && (
                <p role="alert" className="mt-4 text-danger">
                  {error}
                </p>
              )}
            </div>
            <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-surface px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
              <button
                type="button"
                disabled={step === 0 || pending}
                className={buttonClass("ghost")}
                onClick={() => {
                  setStep(step - 1);
                  setAiError("");
                }}
              >
                <ArrowLeft className="size-4" aria-hidden />
                {t("previous")}
              </button>
              <button disabled={pending} className={buttonClass("primary")}>
                {pending ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin motion-reduce:animate-none"
                      aria-hidden
                    />
                    {t("working")}
                  </>
                ) : (
                  <>
                    {t(
                      step === 5
                        ? "finish"
                        : step === 4 && useAi && !generated
                          ? "aiGenerate"
                          : "next",
                    )}
                    <ArrowRight className="size-4" aria-hidden />
                  </>
                )}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </dialog>
  );
}
