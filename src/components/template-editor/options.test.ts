import { describe, expect, it } from "vitest";
import { z } from "zod";
import en from "../../../messages/en";
import tr from "../../../messages/tr";
import { designSchema } from "@/lib/resume/design";
import { OPTIONS } from "./options";

const shape = designSchema.shape;
const header = shape.header.shape;
const sidebar = shape.sidebar.unwrap().shape;
const enumOf = (s: z.ZodType) => (s instanceof z.ZodOptional ? s.unwrap() : s) as z.ZodEnum;

/** Schema enum behind each editor field. */
const SCHEMA = {
  layout: shape.layout,
  sidebarBackground: sidebar.background,
  align: header.align,
  photo: header.photo,
  divider: header.divider,
  title: header.title,
  nameColor: header.nameColor,
  nameSize: header.nameSize,
  nameStyle: header.nameStyle,
  band: shape.band,
  stripe: shape.stripe,
  sectionHeading: shape.sectionHeading,
  headingCase: shape.headingCase,
  sectionLayout: shape.sectionLayout,
  bullets: shape.bullets,
  skills: shape.skills,
  tagStyle: shape.tagStyle,
  contact: shape.contact,
  separator: shape.separator,
  company: shape.company,
  datePosition: shape.datePosition,
} satisfies Record<keyof typeof OPTIONS, z.ZodType>;

describe("template editor options", () => {
  it.each(Object.keys(OPTIONS) as (keyof typeof OPTIONS)[])("%s offers exactly the schema's values, labelled in tr and en", (field) => {
    expect([...OPTIONS[field]]).toEqual(enumOf(SCHEMA[field]).options);
    for (const m of [tr, en]) {
      const labels = (m.TemplateEditor.options as Record<string, Record<string, string>>)[field];
      for (const value of OPTIONS[field]) expect(labels[value]?.trim()).toBeTruthy();
      expect((m.TemplateEditor.fields as Record<string, string>)[field]?.trim()).toBeTruthy();
    }
  });

  it("tr and en have the same keys", () => {
    const keys = (o: object, prefix = ""): string[] =>
      Object.entries(o).flatMap(([k, v]) => (typeof v === "object" ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
    expect(keys(en.TemplateEditor).sort()).toEqual(keys(tr.TemplateEditor).sort());
  });
});
