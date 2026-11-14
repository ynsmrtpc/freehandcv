import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSession, save, remove, restore, purge } = vi.hoisted(() => ({
  getSession: vi.fn(), save: vi.fn(), remove: vi.fn(), restore: vi.fn(), purge: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/server/db", () => ({ db: {} }));
vi.mock("@/server/authz", () => ({ getSession }));
vi.mock("@/server/resumes", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/server/resumes")>(),
  saveResume: save, deleteResume: remove, restoreVersion: restore, purgeTrashedResumes: purge,
}));
import * as actions from "./resume";
import { ResumeConflictError, ResumeNotFoundError } from "@/server/resumes";

const id = "00000000-0000-4000-8000-000000000001";
const versionId = "00000000-0000-4000-8000-000000000002";

beforeEach(() => {
  vi.clearAllMocks();
  getSession.mockResolvedValue({ user: { id: "session-owner" } });
  save.mockReset().mockResolvedValue(2);
  remove.mockReset().mockResolvedValue(undefined);
  restore.mockReset().mockResolvedValue({});
  purge.mockReset().mockResolvedValue(undefined);
});

describe("resume action authorization", () => {
  it("rejects every action without a session", async () => {
    getSession.mockResolvedValue(null);
    const results = await Promise.all([
      actions.createResumeAction({}), actions.saveResumeAction(id, {}, 1),
      actions.duplicateResumeAction(id), actions.deleteResumeAction(id),
      actions.listVersionsAction(id), actions.createVersionAction(id, {}, "manual"),
      actions.restoreVersionAction(id, versionId, {}), actions.restoreResumeAction(id),
      actions.purgeTrashAction(id), actions.purgeTrashAction(),
    ]);
    for (const result of results) expect(result).toEqual({ ok: false, reason: "unauthenticated" });
    expect(save).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
    expect(restore).not.toHaveBeenCalled();
    expect(purge).not.toHaveBeenCalled();
  });

  it("passes the session owner to writes, history restore and trash deletion", async () => {
    const data = { personal: { name: "Example" }, userId: "forged-owner" };
    await actions.saveResumeAction(id, data, 1);
    await actions.deleteResumeAction(id);
    await actions.restoreVersionAction(id, versionId, data);
    await actions.purgeTrashAction(id);
    expect(save).toHaveBeenCalledWith(id, "session-owner", data, 1);
    expect(remove).toHaveBeenCalledWith(id, "session-owner");
    expect(restore).toHaveBeenCalledWith(id, versionId, "session-owner", data);
    expect(purge).toHaveBeenCalledWith("session-owner", id);
  });

  it("returns the same missing response for inaccessible resumes", async () => {
    remove.mockRejectedValue(new ResumeNotFoundError());
    expect(await actions.deleteResumeAction(id)).toEqual({ ok: false, reason: "not_found" });
  });

  it("preserves the server version on concurrent edits", async () => {
    save.mockRejectedValue(new ResumeConflictError(7));
    expect(await actions.saveResumeAction(id, {}, 1)).toEqual({ ok: false, reason: "conflict", serverVersion: 7 });
  });

  it("rejects malformed IDs before calling mutation functions", async () => {
    expect(await actions.deleteResumeAction("not-a-uuid")).toEqual({ ok: false, reason: "not_found" });
    expect(remove).not.toHaveBeenCalled();
  });
});
