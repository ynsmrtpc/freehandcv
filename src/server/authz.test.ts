import { beforeEach, describe, expect, it, vi } from "vitest";

const { session } = vi.hoisted(() => ({ session: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("react", () => ({ cache: (fn: unknown) => fn }));
vi.mock("./auth", () => ({ auth: { api: { getSession: session } } }));
import { adminStatus, AuthorizationError, requireAdmin } from "./authz";

beforeEach(() => session.mockReset());

describe("admin authorization", () => {
  it("rejects a signed-out request", async () => {
    session.mockResolvedValue(null);
    expect(await adminStatus()).toEqual({ status: "signed-out" });
    await expect(requireAdmin()).rejects.toBeInstanceOf(AuthorizationError);
  });

  it.each([
    ["user", true, "forbidden"],
    ["admin", false, "two-factor-required"],
    ["editor", false, "two-factor-required"],
  ])("rejects role %s with TOTP %s", async (role, twoFactorEnabled, status) => {
    session.mockResolvedValue({ user: { id: "actor", role, twoFactorEnabled } });
    expect(await adminStatus()).toEqual({ status });
    await expect(requireAdmin()).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("lets editors manage content but rejects admin-only operations", async () => {
    session.mockResolvedValue({ user: { id: "editor", role: "editor", twoFactorEnabled: true, email: "editor@example.test" } });
    expect((await requireAdmin()).id).toBe("editor");
    await expect(requireAdmin(["admin"])).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("allows a TOTP-enabled administrator", async () => {
    session.mockResolvedValue({ user: { id: "admin", role: "admin", twoFactorEnabled: true, email: "admin@example.test" } });
    expect((await requireAdmin(["admin"])).id).toBe("admin");
  });
});
