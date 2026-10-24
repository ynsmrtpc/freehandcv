import { describe, expect, it } from "vitest";
import { normalizeUsername, usernameProblem } from "./username";

describe("usernames", () => {
  it.each(["ayse", "ayse_k", "mehmet-yilmaz", "dev42", "a1b"])("accepts %s", (name) => {
    expect(usernameProblem(name)).toBeNull();
  });

  it.each([
    ["ab", "length"],
    ["a".repeat(31), "length"],
    ["1ayse", "format"],
    ["ayşe", "format"],
    ["ayse--k", "format"],
    ["ayse_", "format"],
    ["ayse k", "format"],
    ["Ayse", "format"],
    ["admin", "reserved"],
    ["free-hand-cv", "reserved"],
  ])("rejects %s (%s)", (name, problem) => {
    expect(usernameProblem(name)).toBe(problem);
  });

  it("normalizes case and spaces", () => {
    expect(normalizeUsername("  Ayse_K ")).toBe("ayse_k");
  });
});
