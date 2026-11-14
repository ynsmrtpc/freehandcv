import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { exists } = vi.hoisted(() => ({ exists: vi.fn() }));
vi.mock("./server/publicRoutes", () => ({ publicResourceExists: exists }));
import proxy from "./proxy";

beforeEach(() => {
  exists.mockReset().mockResolvedValue(true);
});

describe("public resource responses before streaming", () => {
  it.each([
    ["/cv-sablonlari/missing", "/tr/resume-templates/missing", "tr"],
    ["/en/resume-templates/missing", "/en/resume-templates/missing", "en"],
    ["/cv-ornekleri/missing", "/tr/resume-examples/missing", "tr"],
    ["/en/resume-examples/missing", "/en/resume-examples/missing", "en"],
    ["/rehber/missing", "/tr/guides/missing", "tr"],
    ["/en/guides/missing", "/en/guides/missing", "en"],
    ["/kullanici/missing", "/tr/users/missing", "tr"],
    ["/en/users/missing", "/en/users/missing", "en"],
  ])("returns a localized HTTP 404 for %s", async (path, internal, locale) => {
    exists.mockResolvedValue(false);
    const response = await proxy(new NextRequest(`http://localhost:3100${path}`));
    expect(exists).toHaveBeenCalledWith(internal);
    expect(response.status).toBe(404);
    expect(new URL(response.headers.get("x-middleware-rewrite")!).pathname).toBe(`/${locale}/__missing-public-resource`);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-request-x-next-intl-locale")).toBe(locale);
  });

  it("keeps existing pages and their normal rewrite", async () => {
    const response = await proxy(new NextRequest("http://localhost:3100/cv-sablonlari/modern"));
    expect(response.status).toBe(200);
    expect(new URL(response.headers.get("x-middleware-rewrite")!).pathname).toBe("/tr/resume-templates/modern");
  });

  it("does not query resources before a locale redirect", async () => {
    const response = await proxy(new NextRequest("http://localhost:3100/tr/cv-sablonlari/modern"));
    expect(response.status).toBe(307);
    expect(exists).not.toHaveBeenCalled();
  });

  it("does not turn a database outage into a cached missing resource", async () => {
    exists.mockRejectedValue(new Error("database unavailable"));
    await expect(proxy(new NextRequest("http://localhost:3100/rehber/example"))).rejects.toThrow("database unavailable");
  });
});
