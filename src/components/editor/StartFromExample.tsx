"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { startFromExampleAction } from "@/actions/example";
import { useRouter } from "@/i18n/navigation";
import { GUEST_STORAGE_KEY, useEditor } from "@/client/editor/store";

export const EXAMPLE_PARAM = "ornek";

/**
 * /cv-olustur?ornek=<slug>, the "start from this example" link on example pages. Signed-in users
 * get a new resume in their account; guests get the example in the editor (undo brings back what
 * was there). The parameter is removed afterwards so a reload doesn't load it again.
 */
export function StartFromExample({ notify }: { notify: (text: string) => void }) {
  const t = useTranslations("Editor.example");
  const locale = useLocale();
  const slug = useSearchParams().get(EXAMPLE_PARAM);
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (!slug || done.current) return;
    done.current = true;
    void (async () => {
      const r = await startFromExampleAction(locale, slug).catch(() => null);
      if (r?.ok && r.kind === "account") return router.replace({ pathname: "/resume/[id]", params: { id: r.id } });
      router.replace("/create-resume");
      if (!r?.ok) return notify(t(r?.reason === "limit" ? "limit" : "error"));
      let hasSaved = false;
      try {
        hasSaved = localStorage.getItem(GUEST_STORAGE_KEY) !== null;
      } catch {}
      if (hasSaved && !confirm(t("confirmReplace"))) return;
      useEditor.getState().replace(r.data);
      notify(t("loaded"));
    })();
  }, [slug, locale, router, notify, t]);

  return null;
}
