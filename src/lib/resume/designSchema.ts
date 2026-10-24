// The design definition schema (plan 11.1), kept apart from design.ts so the resume schema can embed
// a user template's definition without a circular import.
import { z } from "zod";

export const FONTS = {
  inter: {
    name: "Inter",
    css: "var(--resume-font-inter), 'Segoe UI', Arial, sans-serif",
  },
  "ibm-plex": {
    name: "IBM Plex Sans",
    css: "var(--resume-font-ibm-plex), 'Segoe UI', Arial, sans-serif",
  },
  "source-sans": {
    name: "Source Sans 3",
    css: "var(--resume-font-source-sans), 'Segoe UI', Arial, sans-serif",
  },
  lato: {
    name: "Lato",
    css: "var(--resume-font-lato), 'Segoe UI', Arial, sans-serif",
  },
  "dm-sans": {
    name: "DM Sans",
    css: "var(--resume-font-dm-sans), 'Segoe UI', Arial, sans-serif",
  },
  "nunito-sans": {
    name: "Nunito Sans",
    css: "var(--resume-font-nunito-sans), 'Segoe UI', Arial, sans-serif",
  },
  "work-sans": {
    name: "Work Sans",
    css: "var(--resume-font-work-sans), 'Segoe UI', Arial, sans-serif",
  },
  "space-grotesk": {
    name: "Space Grotesk",
    css: "var(--resume-font-space-grotesk), 'Segoe UI', Arial, sans-serif",
  },
  montserrat: {
    name: "Montserrat",
    css: "var(--resume-font-montserrat), 'Segoe UI', Arial, sans-serif",
  },
  "source-serif": {
    name: "Source Serif 4",
    css: "var(--resume-font-source-serif), Georgia, 'Times New Roman', serif",
  },
  merriweather: {
    name: "Merriweather",
    css: "var(--resume-font-merriweather), Georgia, serif",
  },
  "eb-garamond": {
    name: "EB Garamond",
    css: "var(--resume-font-eb-garamond), Garamond, Georgia, serif",
  },
  playfair: {
    name: "Playfair Display",
    css: "var(--resume-font-playfair), Georgia, 'Times New Roman', serif",
  },
} as const;
export type FontId = keyof typeof FONTS;
const fontField = z.enum(Object.keys(FONTS) as [FontId, ...FontId[]]);

const color = z.string().regex(/^#[0-9a-f]{6}$/i);
const mm = (min: number, max: number) => z.number().min(min).max(max);

// Options added later are optional; when absent the engine keeps the first version's look.
// This way older definitions (and user templates) stay valid unchanged.
export const designSchema = z.object({
  version: z.literal(1),
  layout: z.enum(["single-column", "sidebar-left", "sidebar-right", "top-band"]),
  sidebar: z
    .object({
      width: mm(45, 90),
      /** Sections shown in the sidebar; the rest go to the main column. */
      sections: z.array(z.string()),
      /** Sidebar background: accent colour (white text), light accent tint, gray, or just a divider rule. */
      background: z.enum(["accent", "light", "gray", "rule"]).optional(),
      /** The header (name, contact, photo) spans both columns at full width. */
      fullHeader: z.boolean().optional(),
    })
    .optional(),
  header: z.object({
    /** split: name and title on the left, contact stacked on the right. */
    align: z.enum(["left", "center", "split"]),
    photo: z.enum(["none", "round", "square", "rounded"]),
    divider: z.enum(["none", "thin", "thick", "accent", "double"]),
    title: z.enum(["accent", "uppercase", "muted-uppercase"]),
    nameColor: z.enum(["dark", "accent"]),
    nameSize: z.enum(["small", "medium", "large", "huge"]).optional(),
    nameStyle: z.enum(["bold", "light", "uppercase", "light-uppercase"]).optional(),
  }),
  /**
   * Header background. When absent: accent in the "top-band" layout, none otherwise.
   * accent/dark: white text; light: dark text on a light accent tint.
   */
  band: z.enum(["none", "accent", "dark", "light"]).optional(),
  /** Thin accent stripe on the paper edge (not applied in sidebar layouts). */
  stripe: z.enum(["none", "left", "top"]).optional(),
  colors: z.object({ accent: color, text: color, muted: color, border: color }),
  /** Text colour everywhere instead of the accent (black-and-white ATS templates). */
  monochrome: z.boolean(),
  typography: z.object({
    font: fontField,
    /** Separate font for the name and section headings (same as body when absent). */
    headingFont: fontField.optional(),
    size: z.number().min(8.5).max(12),
    lineHeight: z.number().min(1.2).max(1.7),
  }),
  sectionHeading: z.enum([
    "uppercase",
    "underline",
    "left-bar",
    "square-marker",
    "extended-rule",
    "box",
    "centered",
    "short-rule",
  ]),
  /** Section heading letters: UPPERCASE (default) or as written, slightly larger. */
  headingCase: z.enum(["uppercase", "normal"]).optional(),
  /** side: section heading in a narrow column on the left, content to its right. */
  sectionLayout: z.enum(["stacked", "side"]).optional(),
  bullets: z.enum(["dot", "dash", "arrow", "square", "none"]),
  skills: z.enum(["list", "tags", "two-column"]),
  tagStyle: z.enum(["filled", "outline"]).optional(),
  contact: z.enum(["icons", "separated"]),
  separator: z.enum(["|", "·", "–"]),
  company: z.enum(["bold", "italic", "accent"]),
  /** Date range: right of the heading line, below the heading, or in a separate column on the left. */
  datePosition: z.enum(["right", "below", "left"]).optional(),
  /** Experience, project and education entries are linked by a vertical timeline. */
  timeline: z.boolean().optional(),
  margins: z.object({ top: mm(6, 25), bottom: mm(6, 25), horizontal: mm(10, 25) }),
});
export type DesignDefinition = z.infer<typeof designSchema>;
