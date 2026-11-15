import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("./db", () => ({ db: {} }));
import { aiConfiguration, requestDraft } from "./ai";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe("configurable AI provider", () => {
  it("stays disabled until all provider settings exist", () => {
    vi.stubEnv("AI_API_URL", ""); expect(aiConfiguration()).toBeNull();
  });
  it("rejects unencrypted remote providers", () => {
    vi.stubEnv("AI_API_URL", "http://external.example.test/chat"); vi.stubEnv("AI_API_KEY", "test-key"); vi.stubEnv("AI_MODEL", "configured-model"); vi.stubEnv("AI_PROVIDER_NAME", "Test provider");
    expect(aiConfiguration()).toBeNull();
  });
  it("does not accept incomplete or truncated provider output", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ choices: [{ message: { content: "{}" }, finish_reason: "length" }] })));
    await expect(requestDraft("Synthetic source facts", "en", { endpoint: "https://provider.example.test/chat", key: "test-key", model: "configured", provider: "Test" })).rejects.toThrow();
  });
  it("sends only the supplied facts to the selected provider and explicitly disables stored completions", async () => {
    const draft = { personal: { name: "Jane Example", title: "Engineer", email: "", phone: "", location: "" }, summary: "", experience: [], education: [], skills: [], languages: [] };
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ choices: [{ message: { content: JSON.stringify(draft) }, finish_reason: "stop" }] })); vi.stubGlobal("fetch", fetchMock);
    expect(await requestDraft("Only my own factual information", "en", { endpoint: "https://provider.example.test/chat", key: "test-key", model: "configured", provider: "Test" })).toEqual(draft);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body); expect(body.store).toBe(false); expect(body.messages[1].content).toBe("Only my own factual information");
  });
});


describe("Gemini transport compatibility", () => {
  it("omits the unsupported store parameter for Gemini", async () => {
    const draft = { personal: { name: "Synthetic User", title: "Engineer", email: "", phone: "", location: "" }, summary: "", experience: [], education: [], skills: [], languages: [] };
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ choices: [{ message: { content: JSON.stringify(draft) }, finish_reason: "stop" }] }));
    vi.stubGlobal("fetch", fetchMock);
    await requestDraft("Synthetic source facts", "en", { endpoint: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", key: "test-key", model: "gemini-test", provider: "Google Gemini" });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).not.toHaveProperty("store");
    expect(body.response_format).toEqual({ type: "json_object" });
  });
  it.each([[400, "provider_request"], [401, "provider_auth"], [403, "provider_auth"], [404, "provider_model"], [429, "provider_limit"], [503, "failed"]])("classifies provider HTTP %s without exposing the response", async (status, code) => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Sensitive provider details", { status: Number(status) })));
    await expect(requestDraft("Synthetic source facts", "en", { endpoint: "https://provider.example.test/chat", key: "test-key", model: "configured", provider: "Test" })).rejects.toMatchObject({ code });
    vi.restoreAllMocks();
  });
});
