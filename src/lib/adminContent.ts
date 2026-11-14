import messages from "../../messages/tr/AdminContent.json";

// The existing team CMS uses Turkish copy. Keep that copy in the message catalog;
// the account/user-management and optional extension screens use their locale namespaces.
export const adminContent = messages;
export function formatAdminContent(template: string, values: Record<string, unknown>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}
