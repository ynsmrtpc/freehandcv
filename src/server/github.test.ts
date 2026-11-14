import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeResume } from "@/lib/resume/schema";
const { session, token, linked, getResume, saveResume, fetchMock } = vi.hoisted(() => ({ session: vi.fn(), token: vi.fn(), linked: vi.fn(), getResume: vi.fn(), saveResume: vi.fn(), fetchMock: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("./authz", () => ({ getSession: session }));
vi.mock("./auth", () => ({ githubEnabled: true, auth: { api: { getAccessToken: token } } }));
vi.mock("./db", () => ({ db: { select: () => ({ from: () => ({ where: () => ({ limit: linked }) }) }) } }));
vi.mock("./resumes", () => ({ getResume, saveResume }));
import { appendGithubProjects, githubProjects } from "./github";
const repository = { id: 123, name: "Example", description: "Synthetic project", html_url: "https://github.com/example/project", language: "TypeScript", private: false };
beforeEach(() => {
  vi.clearAllMocks(); session.mockResolvedValue({ user: { id: "owner", emailVerified: true } });
  token.mockResolvedValue({ accessToken: "synthetic-token" }); linked.mockResolvedValue([{ id: "linked-account-row" }]);
  fetchMock.mockImplementation(async () => Response.json([repository, { ...repository, id: 456, private: true }])); vi.stubGlobal("fetch", fetchMock);
  getResume.mockResolvedValue({ content: normalizeResume({}), version: 4 }); saveResume.mockResolvedValue(5);
});
afterEach(() => vi.unstubAllGlobals());
describe("read-only GitHub project import", () => {
  it("requires a verified session before accessing provider credentials", async () => {
    session.mockResolvedValue(null); await expect(githubProjects()).rejects.toThrow("unavailable"); expect(token).not.toHaveBeenCalled();
  });
  it("selects the linked account row and never returns a private repository or token", async () => {
    const result = await githubProjects();
    expect(token.mock.calls[0][0].body).toEqual({ accountId: "linked-account-row" });
    expect(result.map((repo) => repo.id)).toEqual([123]); expect(JSON.stringify(result)).not.toContain("synthetic-token");
    expect(new URL(fetchMock.mock.calls[0][0]).searchParams.get("visibility")).toBe("public");
  });
  it("appends to a session-owned CV with optimistic locking and no duplicate project links", async () => {
    const id = "00000000-0000-4000-8000-000000000001";
    getResume.mockResolvedValue({ content: normalizeResume({ projects: [{ link: repository.html_url, name: "Existing project" }] }), version: 4 });
    await appendGithubProjects(id, [123], 1);
    expect(getResume).toHaveBeenCalledWith(id, "owner"); expect(saveResume.mock.calls[0][3]).toBe(4);
    expect(saveResume.mock.calls[0][2].projects).toHaveLength(1);
  });
  it("rejects repository identifiers that the provider did not return", async () => {
    await expect(appendGithubProjects("00000000-0000-4000-8000-000000000001", [999], 1)).rejects.toThrow("invalid_selection"); expect(saveResume).not.toHaveBeenCalled();
  });
});
