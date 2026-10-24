import { describe, expect, it } from "vitest";
import { bayesianRating, parseTemplateSlug, slugify, templateSlug } from "./templates";

const ID = "7d62941b-5370-451b-a77b-c0e91380a6a0";

describe("template slugs", () => {
  it("transliterates Turkish names", () => {
    expect(slugify("Şık ve Güçlü Öğretmen Şablonu")).toBe("sik-ve-guclu-ogretmen-sablonu");
    expect(slugify("  ---  ")).toBe("");
  });

  it("round-trips system and user templates", () => {
    expect(parseTemplateSlug(templateSlug({ kind: "system", id: "modern" }))).toEqual({ kind: "system", id: "modern" });
    const slug = templateSlug({ kind: "user", id: ID }, "Sade Mavi");
    expect(slug).toBe(`sade-mavi-${ID}`);
    expect(parseTemplateSlug(slug)).toEqual({ kind: "user", id: ID });
    expect(parseTemplateSlug(templateSlug({ kind: "user", id: ID }, "!!!"))).toEqual({ kind: "user", id: ID });
  });

  it("rejects anything else", () => {
    expect(parseTemplateSlug("sade-mavi")).toBeNull();
    expect(parseTemplateSlug(`x-${ID.slice(0, 30)}`)).toBeNull();
  });
});

describe("bayesian rating", () => {
  it("one 5-star vote does not beat 200 votes averaging 4.7", () => {
    const mean = 4;
    expect(bayesianRating(5, 1, mean)).toBeLessThan(bayesianRating(4.7 * 200, 200, mean));
  });

  it("is the mean without votes", () => {
    expect(bayesianRating(0, 0, 3.8)).toBe(3.8);
  });
});
