"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { startWithTemplateAction } from "@/actions/template";
import { useRouter } from "@/i18n/navigation";
import { useEditor } from "@/client/editor/store";
import { SYSTEM_TEMPLATES, switchTemplateColor } from "@/lib/resume/design";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/resume/schema";
import { TEMPLATE_PARAM } from "@/lib/templates";

/**
 * /cv-olustur?sablon=<id>, "Create a resume with this template" on an official template's page.
 * Guests get the template on the resume in their browser (undo brings back the previous look);
 * signed-in users get a new resume in their account. The parameter is removed afterwards.
 */
export function StartFromTemplate({ notify, signedIn }: { notify: (text: string) => void; signedIn: boolean }) {
  const t = useTranslations("Editor.templateStart");
  const locale = useLocale();
  const raw = useSearchParams().get(TEMPLATE_PARAM);
  const id = (TEMPLATE_IDS as readonly string[]).includes(raw ?? "") ? (raw as TemplateId) : null;
  const ready = useEditor((s) => s.data !== null);
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (!raw || !ready || done.current) return;
    done.current = true;
    if (!id) return router.replace("/create-resume");
    if (signedIn) {
      void startWithTemplateAction({ kind: "system", id }, locale).then((r) =>
        r.ok ? router.replace({ pathname: "/resume/[id]", params: { id: r.resumeId } }) : notify(t("error")),
      );
      return;
    }
    useEditor.getState().update((v) => {
      switchTemplateColor(v, SYSTEM_TEMPLATES[id].definition);
      v.settings.template = id;
      v.settings.customTemplate = null;
    }, false);
    router.replace("/create-resume");
    notify(t("applied"));
  }, [raw, id, ready, signedIn, locale, router, notify, t]);

  return null;
}
