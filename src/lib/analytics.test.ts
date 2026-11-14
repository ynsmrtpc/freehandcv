import { describe, expect, it } from "vitest";
import { isAnalyticsPath } from "./analytics";
describe("public-only analytics", () => {
  it.each(["/", "/guides/example", "/resume-examples/example", "/resume-templates/ats", "/ats-resume-check"])("allows %s", (path) => expect(isAnalyticsPath(path)).toBe(true));
  it.each(["/admin", "/admin/users", "/account", "/dashboard", "/resume/private-id", "/users/person", "/resume-import", "/resume-wizard", "/companies", "/companies/candidates/private-id", "/api/v1/companies/candidates"])("excludes %s", (path) => expect(isAnalyticsPath(path)).toBe(false));
});
