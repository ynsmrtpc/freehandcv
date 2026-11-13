"use client";

import { InlineNotice, useAction } from "@/components/admin/forms";
import { buttonClass } from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { dismissReportsAction, featureTemplatesAction, hideTemplatesAction, restoreTemplatesAction, unfeatureTemplatesAction } from "../actions";

export function ModerationActions({
  id,
  hidden,
  openReports,
  featured,
  canFeature,
}: {
  id: string;
  hidden: boolean;
  openReports: number;
  featured: boolean;
  /** Only templates in the gallery (public and active) can be featured. */
  canFeature: boolean;
}) {
  const confirm = useConfirm();
  const { notice, pending, run } = useAction();
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {hidden ? (
          <button type="button" disabled={pending} onClick={() => run(() => restoreTemplatesAction([id]))} className={buttonClass("secondary", "sm")}>
            Yeniden aç
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={async () => {
              if (!(await confirm("Şablon galeriden ve sayfasından kaldırılsın mı? Sahibi kendi CV'lerinde kullanmaya devam eder.", { danger: true, title: "Şablonu gizle", confirmLabel: "Gizle" })))
                return;
              run(() => hideTemplatesAction([id]));
            }}
            className={buttonClass("secondary", "sm", "text-danger hover:border-danger/50")}
          >
            Şablonu gizle
          </button>
        )}
        {featured ? (
          <button type="button" disabled={pending} onClick={() => run(() => unfeatureTemplatesAction([id]))} className={buttonClass("secondary", "sm")}>
            Öne çıkarmayı kaldır
          </button>
        ) : (
          canFeature && (
            <button type="button" disabled={pending} onClick={() => run(() => featureTemplatesAction([id]))} className={buttonClass("secondary", "sm")}>
              Galeride öne çıkar
            </button>
          )
        )}
        {openReports > 0 && (
          <button type="button" disabled={pending} onClick={() => run(() => dismissReportsAction([id]))} className={buttonClass("secondary", "sm")}>
            Sorun yok, şikâyetleri kapat
          </button>
        )}
      </div>
      <InlineNotice notice={notice} />
    </div>
  );
}
