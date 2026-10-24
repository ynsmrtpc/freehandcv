import { describe, expect, it } from "vitest";
import { atsScore, runChecks, checkScore } from "./checks";
import { sampleResume } from "./sample";
import en from "../../../messages/en";
import tr from "../../../messages/tr";
import { SECTIONS, TEMPLATE_IDS, emptyEntry, normalizeResume } from "./schema";
import {
  FEATURED_TEMPLATES,
  SYSTEM_TEMPLATE_LIST,
  SYSTEM_TEMPLATES,
  headerBand,
  hasSidebar,
  systemDefinition,
  resolveDesign,
  designSchema,
  hasWhiteTextOnAccent,
  resumeDefinition,
} from "./design";
import { whiteContrast, fileName, safeUrl, lines, dateRange, richTextParts } from "./utils";

describe("normalizeResume", () => {
  it("produces a valid resume from empty input", () => {
    const v = normalizeResume(null);
    expect(v.settings.template).toBe("modern");
    expect(v.settings.sectionOrder).toEqual([...SECTIONS]);
    expect(v.experience).toEqual([]);
  });

  it("maps the old 'yonetici' template to 'elegant'", () => {
    expect(normalizeResume({ settings: { template: "yonetici" } }).settings.template).toBe("elegant");
  });

  it("falls back to defaults for broken fields and appends missing sections to the order", () => {
    const v = normalizeResume({
      settings: { color: "kırmızı", size: "huge", sectionOrder: ["experience", "none", "experience"] },
      experience: "not a list",
      personal: { name: 42 },
    });
    expect(v.settings.color).toBe("#1f3a5f");
    expect(v.settings.size).toBe("medium");
    expect(v.settings.sectionOrder[0]).toBe("experience");
    expect(v.settings.sectionOrder).toHaveLength(SECTIONS.length);
    expect(v.experience).toEqual([]);
    expect(v.personal.name).toBe("");
  });

  it("assigns an id to an entry without one", () => {
    const v = normalizeResume({ experience: [{ position: "X" }] });
    expect(v.experience[0].id).toMatch(/\w+/);
  });

  it("emptyEntry comes with every field from the schema", () => {
    const e = emptyEntry("experience");
    expect(e).toMatchObject({ position: "", current: false, bullets: "" });
  });
});

describe("system templates", () => {
  const messages = { tr, en } as Record<string, typeof tr>;

  it("there are at least 20 templates; the id list and definitions match one to one", () => {
    expect(TEMPLATE_IDS.length).toBeGreaterThanOrEqual(20);
    expect(Object.keys(SYSTEM_TEMPLATES).sort()).toEqual([...TEMPLATE_IDS].sort());
    expect(SYSTEM_TEMPLATE_LIST.map((s) => s.id)).toEqual([...TEMPLATE_IDS]);
  });

  it.each(TEMPLATE_IDS)("%s matches the schema and has a consistent id", (id) => {
    const s = SYSTEM_TEMPLATES[id];
    expect(s.id).toBe(id);
    expect(designSchema.parse(s.definition)).toEqual(s.definition);
  });

  it.each(TEMPLATE_IDS)("%s has a valid ATS score", (id) => {
    const { ats, definition } = SYSTEM_TEMPLATES[id];
    expect(Number.isInteger(ats)).toBe(true);
    expect(ats).toBeGreaterThanOrEqual(1);
    expect(ats).toBeLessThanOrEqual(5);
    // Templates with a sidebar or a coloured band can't score 5 (honest score).
    if (hasSidebar(definition) || headerBand(definition) === "accent" || headerBand(definition) === "dark")
      expect(ats).toBeLessThan(5);
  });

  it.each(TEMPLATE_IDS)("%s has a tr and en name and description", (id) => {
    for (const locale of ["tr", "en"]) {
      const m = messages[locale];
      expect((m.Templates.names as Record<string, string>)[id]?.trim()).toBeTruthy();
      expect((m.Templates.descriptions as Record<string, string>)[id]?.trim()).toBeTruthy();
    }
  });

  it("templates with white text on the accent have a legible default colour (≥ 4.5:1)", () => {
    for (const s of SYSTEM_TEMPLATE_LIST) {
      if (hasWhiteTextOnAccent(s.definition))
        expect(whiteContrast(s.definition.colors.accent)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("templates are not copies of each other", () => {
    const signatures = SYSTEM_TEMPLATE_LIST.map(({ definition }) => JSON.stringify({ ...definition, colors: undefined }));
    expect(new Set(signatures).size).toBe(signatures.length);
  });

  it("there are 4–8 featured templates for the landing page", () => {
    expect(FEATURED_TEMPLATES.length).toBeGreaterThanOrEqual(4);
    expect(FEATURED_TEMPLATES.length).toBeLessThanOrEqual(8);
  });
});

describe("user template on a resume", () => {
  const custom = {
    id: "8f0c2b1e-3a4d-4c5e-9f60-7a8b9c0d1e2f",
    version: 3,
    name: "Mine",
    definition: { ...SYSTEM_TEMPLATES.swiss.definition, bullets: "arrow" as const },
  };

  it("is drawn with its copied definition instead of the system template", () => {
    const data = normalizeResume({ settings: { template: "modern", customTemplate: custom } });
    expect(data.settings.customTemplate).toEqual(custom);
    expect(resumeDefinition(data)).toEqual(custom.definition);
  });

  it("falls back to the system template when absent or broken", () => {
    expect(resumeDefinition(normalizeResume({ settings: { template: "ats" } }))).toBe(systemDefinition("ats"));
    const broken = normalizeResume({ settings: { template: "ats", customTemplate: { ...custom, definition: { layout: "x" } } } });
    expect(broken.settings.customTemplate).toBeNull();
    expect(resumeDefinition(broken)).toBe(systemDefinition("ats"));
  });
});

describe("design", () => {
  it("newer options are optional: a first-version definition is still valid", () => {
    const firstVersion = {
      version: 1,
      layout: "single-column",
      header: {
        align: "left",
        photo: "none",
        divider: "thin",
        title: "accent",
        nameColor: "dark",
      },
      colors: {
        accent: "#1f3a5f",
        text: "#1f2937",
        muted: "#4b5563",
        border: "#d6dbe3",
      },
      monochrome: false,
      typography: { font: "inter", size: 10, lineHeight: 1.4 },
      sectionHeading: "underline",
      bullets: "dot",
      skills: "list",
      contact: "icons",
      separator: "·",
      company: "bold",
      margins: { top: 12, bottom: 12, horizontal: 16 },
    };
    expect(() => designSchema.parse(firstVersion)).not.toThrow();
  });

  it("when the user picks a font, the heading font follows it", () => {
    const v = normalizeResume({ settings: { template: "corporate", font: "lato" } });
    const d = resolveDesign(systemDefinition("corporate"), v.settings);
    expect(d.typography.font).toBe("lato");
    expect(d.typography.headingFont).toBeUndefined();
    const fallback = resolveDesign(systemDefinition("corporate"), normalizeResume({}).settings);
    expect(fallback.typography.headingFont).toBe("playfair");
  });

  it("band: top-band defaults to accent; no band in a sidebar layout without a full-width header", () => {
    expect(headerBand(systemDefinition("technical"))).toBe("accent");
    expect(headerBand(systemDefinition("airy"))).toBe("light");
    expect(headerBand(systemDefinition("modern"))).toBe("none");
    expect(headerBand({ ...systemDefinition("sidebar"), band: "accent" })).toBe("none");
  });

  it("a monochrome template ignores the user's colour", () => {
    const v = normalizeResume({ settings: { template: "ats", color: "#8b1e3f" } });
    expect(resolveDesign(systemDefinition("ats"), v.settings).colors.accent).toBe("#111111");
    expect(resolveDesign(systemDefinition("modern"), v.settings).colors.accent).toBe("#8b1e3f");
  });

  it("system templates use their hand-assigned ATS score", () => {
    expect(atsScore(systemDefinition("modern"))).toBe(5);
    expect(atsScore(systemDefinition("sidebar"))).toBe(4);
  });
});

describe("utils", () => {
  it("rejects unsafe link schemes", () => {
    expect(safeUrl("javascript:alert(1)")).toBe("");
    expect(safeUrl("data:text/html,x")).toBe("");
    expect(safeUrl("github.com/x")).toBe("https://github.com/x");
    expect(safeUrl("mailto:a@b.c")).toBe("mailto:a@b.c");
  });

  it("extracts bullets and splits bold markers", () => {
    expect(lines("- bir\n• iki\n\n  üç ")).toEqual(["bir", "iki", "üç"]);
    expect(richTextParts("a **b** c")).toEqual([
      { text: "a ", bold: false },
      { text: "b", bold: true },
      { text: " c", bold: false },
    ]);
  });

  it("date range and file name", () => {
    expect(dateRange("Mar 2023", "", true, "Günümüz")).toBe("Mar 2023 – Günümüz");
    expect(fileName("Şükrü Çağlar Öz")).toBe("Sukru_Caglar_Oz_CV");
  });
});

describe("resume checks", () => {
  it("the sample resume scores high", () => {
    const v = sampleResume("tr");
    const { score } = checkScore(runChecks(v, systemDefinition("modern"), 1));
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it("catches a Turkish ID number", () => {
    const v = normalizeResume({ summary: "TC: 12345678901" });
    const check = runChecks(v, systemDefinition("modern"), 1).find((c) => c.id === "personalData");
    expect(check?.status).toBe("warning");
  });

  it("warns about low contrast in a coloured template", () => {
    const v = normalizeResume({ settings: { template: "sidebar", color: "#ffe600" } });
    const check = runChecks(v, systemDefinition("sidebar"), 1).find((c) => c.id === "contrast");
    expect(check?.status).toBe("warning");
  });
});
