"use client";

import { InlineNotice, useAction } from "@/components/admin/forms";
import { buttonClass } from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { dismissReportsAction, hideTemplatesAction, restoreTemplatesAction } from "../actions";

export function ModerationActions({ id, hidden, openReports }: { id: string; hidden: boolean; openReports: number }) {
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
