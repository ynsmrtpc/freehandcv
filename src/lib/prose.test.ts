import { describe, expect, it } from "vitest";
import { inlineParts, isSafeHref } from "./prose";

describe("inlineParts", () => {
  it("splits text, bold and links", () => {
    expect(inlineParts("Önce **özet** yaz, sonra [ATS rehberine](/rehber/ats-uyumlu-cv-nasil-hazirlanir) bak.")).toEqual([
      { kind: "text", text: "Önce " },
      { kind: "bold", text: "özet" },
      { kind: "text", text: " yaz, sonra " },
      { kind: "link", text: "ATS rehberine", href: "/rehber/ats-uyumlu-cv-nasil-hazirlanir" },
      { kind: "text", text: " bak." },
    ]);
  });

  it("keeps only the label of unsafe links", () => {
    for (const href of ["javascript:void0", "http://example.com", "//evil.example", "data:text/html,x"]) {
      expect(inlineParts(`[tıkla](${href})`)).toEqual([{ kind: "text", text: "tıkla" }]);
    }
  });

  it("never turns a javascript: target into a link", () => {
    expect(inlineParts("[tıkla](javascript:alert(1))").some((p) => p.kind === "link")).toBe(false);
  });

  it("allows site paths and https", () => {
    expect(isSafeHref("/cv-olustur")).toBe(true);
    expect(isSafeHref("https://www.example.com/x")).toBe(true);
    expect(isSafeHref("//example.com")).toBe(false);
  });

  it("leaves plain brackets alone", () => {
    expect(inlineParts("[Unvan] ve (adres)")).toEqual([{ kind: "text", text: "[Unvan] ve (adres)" }]);
  });
});
