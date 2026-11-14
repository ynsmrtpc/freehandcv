import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
import { EmptyState, formatDate, Table, Td, Th } from "@/components/admin/kit";
import { Link } from "@/i18n/navigation";

export const ACTION_LABELS: Record<string, string> = {
  save_draft: ADMIN_CONTENT.auditLogAuditLogTableSaveDraft1,
  publish: ADMIN_CONTENT.auditLogAuditLogTablePublish2,
  restore_version: ADMIN_CONTENT.auditLogAuditLogTableRestoreVersion3,
  update_site_settings: ADMIN_CONTENT.auditLogAuditLogTableUpdateSiteSettings4,
  change_role: ADMIN_CONTENT.auditLogAuditLogTableChangeRole5,
  approve_review: ADMIN_CONTENT.auditLogAuditLogTableApproveReview6,
  hide_review: ADMIN_CONTENT.auditLogAuditLogTableHideReview7,
  create_example: ADMIN_CONTENT.auditLogAuditLogTableCreateExample8,
  update_example: ADMIN_CONTENT.auditLogAuditLogTableUpdateExample9,
  publish_example: ADMIN_CONTENT.auditLogAuditLogTablePublishExample10,
  unpublish_example: ADMIN_CONTENT.auditLogAuditLogTableUnpublishExample11,
  delete_example: ADMIN_CONTENT.auditLogAuditLogTableDeleteExample12,
  delete_page: ADMIN_CONTENT.auditLogAuditLogTableDeletePage13,
  unpublish_page: ADMIN_CONTENT.auditLogAuditLogTableUnpublishPage14,
  create_user: ADMIN_CONTENT.auditLogAuditLogTableCreateUser15,
  update_user: ADMIN_CONTENT.auditLogAuditLogTableUpdateUser16,
  suspend_user: ADMIN_CONTENT.auditLogAuditLogTableSuspendUser17,
  restore_user: ADMIN_CONTENT.auditLogAuditLogTableRestoreUser18,
  set_password: ADMIN_CONTENT.auditLogAuditLogTableSetPassword19,
  send_password_reset: ADMIN_CONTENT.auditLogAuditLogTableSendPasswordReset20,
  revoke_sessions: ADMIN_CONTENT.auditLogAuditLogTableRevokeSessions21,
  delete_user: ADMIN_CONTENT.auditLogAuditLogTableDeleteUser22,
  close_account: ADMIN_CONTENT.auditLogAuditLogTableCloseAccount23,
  create_faq: ADMIN_CONTENT.auditLogAuditLogTableCreateFaq24,
  update_faq: ADMIN_CONTENT.auditLogAuditLogTableUpdateFaq25,
  publish_faq: ADMIN_CONTENT.auditLogAuditLogTablePublishFaq26,
  unpublish_faq: ADMIN_CONTENT.auditLogAuditLogTableUnpublishFaq27,
  delete_faq: ADMIN_CONTENT.auditLogAuditLogTableDeleteFaq28,
  import_faqs: ADMIN_CONTENT.auditLogAuditLogTableImportFaqs29,
  hide_template: ADMIN_CONTENT.auditLogAuditLogTableHideTemplate30,
  restore_template: ADMIN_CONTENT.auditLogAuditLogTableRestoreTemplate31,
  feature_template: ADMIN_CONTENT.auditLogAuditLogTableFeatureTemplate32,
  unfeature_template: ADMIN_CONTENT.auditLogAuditLogTableUnfeatureTemplate33,
  dismiss_reports: ADMIN_CONTENT.auditLogAuditLogTableDismissReports34,
  upload_media: ADMIN_CONTENT.auditLogAuditLogTableUploadMedia35,
  update_media: ADMIN_CONTENT.auditLogAuditLogTableUpdateMedia36,
  delete_media: ADMIN_CONTENT.auditLogAuditLogTableDeleteMedia37,
};

const TARGET_LABELS: Record<string, string> = {
  page: ADMIN_CONTENT.auditLogAuditLogTablePage38,
  site_settings: ADMIN_CONTENT.auditLogAuditLogTableSiteSettings39,
  user: ADMIN_CONTENT.auditLogAuditLogTableUser40,
  site_review: ADMIN_CONTENT.auditLogAuditLogTableSiteReview41,
  example_resume: ADMIN_CONTENT.auditLogAuditLogTableExampleResume42,
  faq: ADMIN_CONTENT.auditLogAuditLogTableFaq43,
  template: ADMIN_CONTENT.auditLogAuditLogTableTemplate44,
  media: ADMIN_CONTENT.auditLogAuditLogTableMedia45,
};

type Row = {
  id: string;
  action: string;
  targetType: string;
  targetId: string | null;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
};

export function AuditLogTable({ rows }: { rows: Row[] }) {
  if (!rows.length) return <EmptyState title={ADMIN_CONTENT.auditLogAuditLogTableTitle46}>{ADMIN_CONTENT.auditLogAuditLogTableContent47}</EmptyState>;
  return (
    <Table label={ADMIN_CONTENT.auditLogAuditLogTableLabel48}>
      <thead>
        <tr>
          <Th>{ADMIN_CONTENT.auditLogAuditLogTableContent49}</Th>
          <Th>{ADMIN_CONTENT.auditLogAuditLogTableContent50}</Th>
          <Th>{ADMIN_CONTENT.auditLogAuditLogTableContent51}</Th>
          <Th className="max-md:hidden">{ADMIN_CONTENT.auditLogAuditLogTableContent52}</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <Td className="whitespace-nowrap text-muted tabular-nums">{formatDate(r.createdAt, true)}</Td>
            <Td className="text-foreground">{r.userName || r.userEmail || "—"}</Td>
            <Td className="font-medium text-foreground">{ACTION_LABELS[r.action] ?? r.action}</Td>
            <Td className="text-muted max-md:hidden">
              {r.targetType === "user" && r.targetId ? (
                <Link href={{ pathname: "/admin/users/[id]", params: { id: r.targetId } }} className="text-primary-text hover:underline">
                  {TARGET_LABELS.user}
                </Link>
              ) : r.targetType === "page" && r.targetId ? (
                <Link href={{ pathname: "/admin/pages/[id]", params: { id: r.targetId } }} className="text-primary-text hover:underline">
                  {TARGET_LABELS.page}
                </Link>
              ) : r.targetType === "example_resume" && r.targetId ? (
                <Link href={{ pathname: "/admin/examples/[id]", params: { id: r.targetId } }} className="text-primary-text hover:underline">
                  {TARGET_LABELS.example_resume}
                </Link>
              ) : (
                (TARGET_LABELS[r.targetType] ?? r.targetType)
              )}
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
