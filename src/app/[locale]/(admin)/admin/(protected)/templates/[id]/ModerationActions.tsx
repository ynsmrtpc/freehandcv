"use client";
import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";


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
            {ADMIN_CONTENT.templatesIdModerationActionsContent311}</button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={async () => {
              if (!(await confirm(ADMIN_CONTENT.templatesIdModerationActionsLabel312, { danger: true, title: ADMIN_CONTENT.templatesIdModerationActionsTitle313, confirmLabel: "Gizle" })))
                return;
              run(() => hideTemplatesAction([id]));
            }}
            className={buttonClass("secondary", "sm", "text-danger hover:border-danger/50")}
          >
            {ADMIN_CONTENT.templatesIdModerationActionsTitle313}</button>
        )}
        {featured ? (
          <button type="button" disabled={pending} onClick={() => run(() => unfeatureTemplatesAction([id]))} className={buttonClass("secondary", "sm")}>
            {ADMIN_CONTENT.templatesIdModerationActionsContent314}</button>
        ) : (
          canFeature && (
            <button type="button" disabled={pending} onClick={() => run(() => featureTemplatesAction([id]))} className={buttonClass("secondary", "sm")}>
              {ADMIN_CONTENT.templatesIdModerationActionsContent315}</button>
          )
        )}
        {openReports > 0 && (
          <button type="button" disabled={pending} onClick={() => run(() => dismissReportsAction([id]))} className={buttonClass("secondary", "sm")}>
            {ADMIN_CONTENT.templatesIdModerationActionsContent316}</button>
        )}
      </div>
      <InlineNotice notice={notice} />
    </div>
  );
}
