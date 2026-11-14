import { beforeEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import { systemDefinition } from "@/lib/resume/design";

const { limit, where } = vi.hoisted(() => ({ limit: vi.fn(), where: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("./db", () => ({ db: { select: () => ({ from: () => ({ where }) }) } }));
import { publicResourceExists } from "./publicRoutes";

beforeEach(() => {
  limit.mockReset().mockResolvedValue([]);
  where.mockReset().mockReturnValue({ limit });
});

const query = () => new PgDialect({ casing: "snake_case" }).sqlToQuery(where.mock.calls[0][0]);

describe("public route availability", () => {
  it.each(["/tr/dashboard", "/en/account", "/tr/resume-templates/modern", "/tr/resume-examples/saglik", "/en/resume-examples/healthcare"])(
    "does not query the database for %s", async (path) => {
      expect(await publicResourceExists(path)).toBe(true);
      expect(where).not.toHaveBeenCalled();
    },
  );

  it.each(["/tr/resume-templates/missing", "/en/guides/%ZZ"])("rejects malformed resource %s without querying", async (path) => {
    expect(await publicResourceExists(path)).toBe(false);
    expect(where).not.toHaveBeenCalled();
  });

  it("requires a published guide with a snapshot in the requested language", async () => {
    expect(await publicResourceExists("/en/guides/writing-a-resume")).toBe(false);
    const { sql, params } = query();
    expect(params).toEqual(["en", "writing-a-resume", "guide", "published"]);
    expect(sql).toContain('"pages"."published_blocks" is not null');
  });

  it("requires active examples in the requested language", async () => {
    limit.mockResolvedValue([{ id: "example" }]);
    expect(await publicResourceExists("/tr/resume-examples/hemsire-cv-ornegi")).toBe(true);
    expect(query().params).toEqual(["tr", "hemsire-cv-ornegi", true]);
  });

  it("normalizes profile names without requiring public templates", async () => {
    limit.mockResolvedValue([{ id: "owner" }]);
    expect(await publicResourceExists("/en/users/Example")).toBe(true);
    expect(query().params).toEqual(["example"]);
  });

  it("does not expose private, deleted or moderated templates", async () => {
    const id = "00000000-0000-4000-8000-000000000001";
    expect(await publicResourceExists(`/tr/resume-templates/name-${id}`)).toBe(false);
    const { sql, params } = query();
    expect(params).toEqual([id, "active", "public", "unlisted"]);
    expect(sql).toContain('"templates"."deleted_at" is null');
  });

  it("does not retain a miss when content is published", async () => {
    limit.mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: "guide" }]);
    expect(await publicResourceExists("/tr/guides/new-guide")).toBe(false);
    expect(await publicResourceExists("/tr/guides/new-guide")).toBe(true);
  });

  it("rejects broken template definitions just like the page renderer", async () => {
    const path = "/en/resume-templates/00000000-0000-4000-8000-000000000001";
    limit.mockResolvedValueOnce([{ definition: {} }]).mockResolvedValueOnce([{ definition: systemDefinition("modern") }]);
    expect(await publicResourceExists(path)).toBe(false);
    expect(await publicResourceExists(path)).toBe(true);
  });
});
