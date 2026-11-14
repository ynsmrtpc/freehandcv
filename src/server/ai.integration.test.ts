import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type postgres from "postgres";

vi.mock("server-only", () => ({}));
vi.mock("./db", async () => {
  const url = process.env.TEST_DATABASE_URL;
  if (!url || new URL(url).pathname !== "/freehandcv_test") throw new Error("Test-only database required");
  const { default: postgres } = await import("postgres"); const { drizzle } = await import("drizzle-orm/postgres-js");
  const schema = await import("./db/schema"), testClient = postgres(url, { max: 5 });
  return { db: drizzle(testClient, { schema, casing: "snake_case" }), testClient };
});
describe.skipIf(!process.env.TEST_DATABASE_URL)("AI allowance on PostgreSQL", () => {
  const userId = randomUUID(); let client: postgres.Sql; let ai: typeof import("./ai");
  const fetchMock = vi.fn();
  const draft = { personal: { name: "Synthetic User", title: "Engineer", email: "", phone: "", location: "" }, summary: "", experience: [], education: [], skills: [], languages: [] };
  const request = () => ({ id: randomUUID(), text: "I am a synthetic engineer with software development experience.", locale: "en", consent: true });
  beforeAll(async () => {
    const databaseModule = await import("./db") as typeof import("./db") & { testClient: postgres.Sql }; client = databaseModule.testClient;
    expect((await client`select current_database() as name`)[0].name).toBe("freehandcv_test");
    await client`insert into "user" (id,email,name,email_verified) values (${userId},${`${userId}@example.test`},'Synthetic User',true)`;
    vi.stubEnv("AI_API_URL", "https://provider.example.test/chat"); vi.stubEnv("AI_API_KEY", "test-key"); vi.stubEnv("AI_MODEL", "configured-model"); vi.stubEnv("AI_PROVIDER_NAME", "Test provider");
    vi.stubGlobal("fetch", fetchMock); ai = await import("./ai");
  });
  afterAll(async () => { try { if (client) await client`delete from "user" where id=${userId}`; } finally { await client?.end(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); } });
  it("refunds provider failure, then enforces exactly three concurrent successes and idempotent retries", async () => {
    fetchMock.mockResolvedValueOnce(new Response("provider failure", { status: 503 }));
    await expect(ai.generateDraft(userId, request())).rejects.toMatchObject({ code: "failed" });
    expect((await ai.aiStatus(userId)).remaining).toBe(3);
    fetchMock.mockImplementation(async () => Response.json({ choices: [{ message: { content: JSON.stringify(draft) }, finish_reason: "stop" }] }));
    const first = request();
    const results = await Promise.allSettled([first, request(), request(), request()].map((input) => ai.generateDraft(userId, input)));
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(3);
    expect((await ai.aiStatus(userId)).remaining).toBe(0);
    expect(await ai.generateDraft(userId, first)).toMatchObject({ personal: { name: "Synthetic User" } });
    await expect(ai.generateDraft(userId, { ...first, text: "A different payload under the same request identifier is invalid." })).rejects.toMatchObject({ code: "invalid" });
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});
