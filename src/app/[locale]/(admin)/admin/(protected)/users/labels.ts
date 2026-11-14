import type { Role } from "@/server/db/schema";

export const ROLE_NAMES: Record<Role, string> = { user: "user", editor: "editor", admin: "administrator" };
export const ROLE_HINTS: Record<Role, string> = {
  user: "createsResumesAndTemplatesCannotAccessAdministration",
  editor: "editsPagesExamplesAndReviewsCannotManage",
  admin: "fullAccessIncludingUsersRolesAndSite",
};
