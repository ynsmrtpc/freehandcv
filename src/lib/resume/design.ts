// Template = appearance (plan 11.1). Users never write HTML/CSS; a template is a design definition
// validated with Zod, and the same rendering engine always draws the resume. System templates and
// user templates are both written as definitions; the engine has no template-specific `if`.
import { designSchema, FONTS, type DesignDefinition, type FontId } from "./designSchema";
import { TEMPLATE_IDS, type ResumeData, type SectionId, type ResumeSettings, type TemplateId } from "./schema";

export { designSchema, FONTS, type DesignDefinition, type FontId };

export type SystemTemplate = {
  id: TemplateId;
  /** Hand-assigned ATS score (1–5): plain single column is 5; sidebars, bands and ornaments lower it. */
  ats: number;
  /** Shown in the landing showcase and the hero preview. */
  featured?: boolean;
  definition: DesignDefinition;
};

const BASE_COLORS = { text: "#1f2937", muted: "#4b5563", border: "#d6dbe3" };
const MONOCHROME_COLORS = {
  accent: "#111111",
  text: "#111111",
  muted: "#3f4752",
  border: "#9aa1ab",
};
const BASE_MARGINS = { top: 12, bottom: 12, horizontal: 16 };
const SIDEBAR_SECTIONS = ["skills", "languages", "certifications", "interests"];

export const SYSTEM_TEMPLATES: Record<TemplateId, SystemTemplate> = {
  modern: {
    id: "modern",
    ats: 5,
    featured: true,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "left",
        photo: "round",
        divider: "accent",
        title: "accent",
        nameColor: "dark",
      },
      colors: { accent: "#1f3a5f", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "inter", size: 10, lineHeight: 1.42 },
      sectionHeading: "extended-rule",
      bullets: "dot",
      skills: "list",
      contact: "icons",
      separator: "·",
      company: "bold",
      margins: BASE_MARGINS,
    },
  },
  ats: {
    id: "ats",
    ats: 5,
    featured: true,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "left",
        photo: "none",
        divider: "thick",
        title: "accent",
        nameColor: "dark",
      },
      colors: MONOCHROME_COLORS,
      monochrome: true,
      typography: { font: "source-sans", size: 10, lineHeight: 1.42 },
      sectionHeading: "underline",
      bullets: "dot",
      skills: "list",
      contact: "separated",
      separator: "|",
      company: "bold",
      margins: { top: 12, bottom: 12, horizontal: 18 },
    },
  },
  elegant: {
    id: "elegant",
    ats: 5,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "center",
        photo: "round",
        divider: "double",
        title: "uppercase",
        nameColor: "dark",
      },
      colors: { accent: "#1f3a5f", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "source-serif", size: 10, lineHeight: 1.42 },
      sectionHeading: "underline",
      bullets: "dot",
      skills: "list",
      contact: "separated",
      separator: "·",
      company: "italic",
      margins: { top: 12, bottom: 12, horizontal: 19 },
    },
  },
  technical: {
    id: "technical",
    ats: 4,
    definition: {
      version: 1,
      layout: "top-band",
      header: {
        align: "left",
        photo: "rounded",
        divider: "none",
        title: "accent",
        nameColor: "dark",
      },
      colors: { accent: "#1d4ed8", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "ibm-plex", size: 10, lineHeight: 1.42 },
      sectionHeading: "square-marker",
      bullets: "dot",
      skills: "two-column",
      contact: "icons",
      separator: "·",
      company: "bold",
      margins: BASE_MARGINS,
    },
  },
  sidebar: {
    id: "sidebar",
    ats: 4,
    featured: true,
    definition: {
      version: 1,
      layout: "sidebar-left",
      sidebar: { width: 67, sections: SIDEBAR_SECTIONS },
      header: {
        align: "left",
        photo: "round",
        divider: "accent",
        title: "muted-uppercase",
        nameColor: "accent",
      },
      colors: { accent: "#0f766e", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "lato", size: 10, lineHeight: 1.42 },
      sectionHeading: "uppercase",
      bullets: "dot",
      skills: "list",
      contact: "icons",
      separator: "·",
      company: "bold",
      margins: BASE_MARGINS,
    },
  },
  corporate: {
    id: "corporate",
    ats: 5,
    featured: true,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "split",
        photo: "none",
        divider: "thick",
        title: "uppercase",
        nameColor: "dark",
        nameSize: "large",
      },
      colors: { accent: "#111827", ...BASE_COLORS },
      monochrome: false,
      typography: {
        font: "source-sans",
        headingFont: "playfair",
        size: 10.2,
        lineHeight: 1.45,
      },
      sectionHeading: "underline",
      headingCase: "normal",
      bullets: "square",
      skills: "list",
      contact: "icons",
      separator: "·",
      company: "italic",
      margins: { top: 14, bottom: 14, horizontal: 18 },
    },
  },
  swiss: {
    id: "swiss",
    ats: 4,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "left",
        photo: "none",
        divider: "none",
        title: "muted-uppercase",
        nameColor: "dark",
        nameSize: "huge",
      },
      colors: { accent: "#b91c1c", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "inter", size: 9.6, lineHeight: 1.45 },
      sectionHeading: "uppercase",
      sectionLayout: "side",
      bullets: "dash",
      skills: "list",
      contact: "separated",
      separator: "·",
      company: "bold",
      margins: { top: 14, bottom: 14, horizontal: 17 },
    },
  },
  "two-column": {
    id: "two-column",
    ats: 4,
    featured: true,
    definition: {
      version: 1,
      layout: "sidebar-right",
      sidebar: {
        width: 64,
        sections: SIDEBAR_SECTIONS,
        background: "gray",
        fullHeader: true,
      },
      header: {
        align: "left",
        photo: "round",
        divider: "none",
        title: "accent",
        nameColor: "dark",
        nameSize: "large",
      },
      colors: { accent: "#0e7490", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "dm-sans", size: 9.8, lineHeight: 1.42 },
      sectionHeading: "extended-rule",
      bullets: "dot",
      skills: "list",
      contact: "icons",
      separator: "·",
      company: "bold",
      margins: BASE_MARGINS,
    },
  },
  contrast: {
    id: "contrast",
    ats: 4,
    featured: true,
    definition: {
      version: 1,
      layout: "top-band",
      band: "dark",
      header: {
        align: "left",
        photo: "round",
        divider: "none",
        title: "accent",
        nameColor: "dark",
        nameSize: "large",
        nameStyle: "uppercase",
      },
      colors: { accent: "#9a3412", ...BASE_COLORS },
      monochrome: false,
      typography: {
        font: "source-sans",
        headingFont: "montserrat",
        size: 10,
        lineHeight: 1.42,
      },
      sectionHeading: "extended-rule",
      bullets: "square",
      skills: "tags",
      contact: "icons",
      separator: "·",
      company: "accent",
      margins: BASE_MARGINS,
    },
  },
  academic: {
    id: "academic",
    ats: 5,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "center",
        photo: "none",
        divider: "thin",
        title: "muted-uppercase",
        nameColor: "dark",
      },
      colors: { accent: "#1f3a5f", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "eb-garamond", size: 11, lineHeight: 1.38 },
      sectionHeading: "underline",
      headingCase: "normal",
      bullets: "dot",
      skills: "list",
      contact: "separated",
      separator: "·",
      company: "italic",
      datePosition: "left",
      margins: { top: 15, bottom: 15, horizontal: 20 },
    },
  },
  timeline: {
    id: "timeline",
    ats: 4,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "left",
        photo: "round",
        divider: "accent",
        title: "accent",
        nameColor: "dark",
      },
      colors: { accent: "#0e7490", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "work-sans", size: 9.6, lineHeight: 1.42 },
      sectionHeading: "left-bar",
      bullets: "dot",
      skills: "list",
      contact: "icons",
      separator: "·",
      company: "accent",
      datePosition: "left",
      timeline: true,
      margins: BASE_MARGINS,
    },
  },
  creative: {
    id: "creative",
    ats: 4,
    definition: {
      version: 1,
      layout: "single-column",
      stripe: "left",
      header: {
        align: "left",
        photo: "round",
        divider: "none",
        title: "accent",
        nameColor: "dark",
        nameSize: "huge",
        nameStyle: "uppercase",
      },
      colors: { accent: "#be185d", ...BASE_COLORS },
      monochrome: false,
      typography: {
        font: "work-sans",
        headingFont: "montserrat",
        size: 9.8,
        lineHeight: 1.45,
      },
      sectionHeading: "short-rule",
      bullets: "arrow",
      skills: "tags",
      tagStyle: "outline",
      contact: "icons",
      separator: "·",
      company: "accent",
      margins: { top: 14, bottom: 13, horizontal: 19 },
    },
  },
  startup: {
    id: "startup",
    ats: 4,
    definition: {
      version: 1,
      layout: "single-column",
      stripe: "top",
      header: {
        align: "left",
        photo: "rounded",
        divider: "none",
        title: "accent",
        nameColor: "dark",
        nameSize: "huge",
      },
      colors: { accent: "#5b21b6", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "space-grotesk", size: 9.8, lineHeight: 1.45 },
      sectionHeading: "short-rule",
      headingCase: "normal",
      bullets: "arrow",
      skills: "tags",
      contact: "icons",
      separator: "·",
      company: "accent",
      datePosition: "below",
      margins: { top: 15, bottom: 13, horizontal: 17 },
    },
  },
  airy: {
    id: "airy",
    ats: 5,
    definition: {
      version: 1,
      layout: "top-band",
      band: "light",
      header: {
        align: "left",
        photo: "round",
        divider: "none",
        title: "accent",
        nameColor: "accent",
      },
      colors: { accent: "#0f766e", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "nunito-sans", size: 10, lineHeight: 1.45 },
      sectionHeading: "underline",
      headingCase: "normal",
      bullets: "dot",
      skills: "list",
      contact: "icons",
      separator: "·",
      company: "bold",
      margins: BASE_MARGINS,
    },
  },
  graduate: {
    id: "graduate",
    ats: 4,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "left",
        photo: "round",
        divider: "none",
        title: "accent",
        nameColor: "accent",
        nameSize: "large",
      },
      colors: { accent: "#166534", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "nunito-sans", size: 10, lineHeight: 1.45 },
      sectionHeading: "box",
      bullets: "dot",
      skills: "tags",
      contact: "icons",
      separator: "·",
      company: "bold",
      margins: BASE_MARGINS,
    },
  },
  "light-sidebar": {
    id: "light-sidebar",
    ats: 4,
    definition: {
      version: 1,
      layout: "sidebar-left",
      sidebar: { width: 66, sections: SIDEBAR_SECTIONS, background: "light" },
      header: {
        align: "left",
        photo: "round",
        divider: "none",
        title: "accent",
        nameColor: "dark",
        nameSize: "large",
      },
      colors: { accent: "#1d4ed8", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "ibm-plex", size: 9.8, lineHeight: 1.42 },
      sectionHeading: "square-marker",
      bullets: "dot",
      skills: "list",
      contact: "icons",
      separator: "·",
      company: "bold",
      margins: BASE_MARGINS,
    },
  },
  editorial: {
    id: "editorial",
    ats: 4,
    definition: {
      version: 1,
      layout: "sidebar-left",
      sidebar: {
        width: 58,
        sections: SIDEBAR_SECTIONS,
        background: "rule",
        fullHeader: true,
      },
      header: {
        align: "left",
        photo: "square",
        divider: "thick",
        title: "muted-uppercase",
        nameColor: "dark",
        nameSize: "huge",
        nameStyle: "light",
      },
      colors: { accent: "#8b1e3f", ...BASE_COLORS },
      monochrome: false,
      typography: {
        font: "source-serif",
        headingFont: "playfair",
        size: 9.8,
        lineHeight: 1.45,
      },
      sectionHeading: "uppercase",
      bullets: "dash",
      skills: "list",
      contact: "separated",
      separator: "·",
      company: "italic",
      margins: BASE_MARGINS,
    },
  },
  boutique: {
    id: "boutique",
    ats: 5,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "center",
        photo: "round",
        divider: "none",
        title: "uppercase",
        nameColor: "dark",
        nameSize: "large",
        nameStyle: "light-uppercase",
      },
      colors: { accent: "#8b1e3f", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "lato", headingFont: "montserrat", size: 10, lineHeight: 1.45 },
      sectionHeading: "centered",
      bullets: "dot",
      skills: "list",
      contact: "separated",
      separator: "·",
      company: "italic",
      margins: { top: 14, bottom: 13, horizontal: 20 },
    },
  },
  compact: {
    id: "compact",
    ats: 5,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "left",
        photo: "none",
        divider: "thin",
        title: "accent",
        nameColor: "dark",
        nameSize: "small",
      },
      colors: { accent: "#334155", ...BASE_COLORS },
      monochrome: false,
      typography: { font: "source-sans", size: 9.2, lineHeight: 1.32 },
      sectionHeading: "underline",
      bullets: "dot",
      skills: "list",
      contact: "separated",
      separator: "|",
      company: "italic",
      margins: { top: 9, bottom: 9, horizontal: 13 },
    },
  },
  formal: {
    id: "formal",
    ats: 5,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "center",
        photo: "none",
        divider: "thick",
        title: "muted-uppercase",
        nameColor: "dark",
        nameStyle: "uppercase",
      },
      colors: MONOCHROME_COLORS,
      monochrome: true,
      typography: { font: "merriweather", size: 9.6, lineHeight: 1.45 },
      sectionHeading: "centered",
      bullets: "dash",
      skills: "list",
      contact: "separated",
      separator: "|",
      company: "italic",
      margins: { top: 15, bottom: 14, horizontal: 20 },
    },
  },
  classic: {
    id: "classic",
    ats: 5,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "split",
        photo: "none",
        divider: "double",
        title: "accent",
        nameColor: "dark",
      },
      colors: MONOCHROME_COLORS,
      monochrome: true,
      typography: { font: "source-serif", size: 10.4, lineHeight: 1.4 },
      sectionHeading: "underline",
      bullets: "dot",
      skills: "list",
      contact: "separated",
      separator: "|",
      company: "italic",
      margins: { top: 13, bottom: 13, horizontal: 18 },
    },
  },
  minimal: {
    id: "minimal",
    ats: 5,
    definition: {
      version: 1,
      layout: "single-column",
      header: {
        align: "center",
        photo: "none",
        divider: "none",
        title: "muted-uppercase",
        nameColor: "dark",
      },
      colors: MONOCHROME_COLORS,
      monochrome: true,
      typography: { font: "dm-sans", size: 10, lineHeight: 1.42 },
      sectionHeading: "extended-rule",
      bullets: "dot",
      skills: "list",
      contact: "separated",
      separator: "·",
      company: "bold",
      margins: { top: 13, bottom: 13, horizontal: 18 },
    },
  },
};

/** Order used by the template picker, the showcase and tests (same as TEMPLATE_IDS). */
export const SYSTEM_TEMPLATE_LIST: SystemTemplate[] = TEMPLATE_IDS.map((id) => SYSTEM_TEMPLATES[id]);
export const FEATURED_TEMPLATES: TemplateId[] = SYSTEM_TEMPLATE_LIST.filter((s) => s.featured).map(
  (s) => s.id,
);

export const ACCENT_COLORS = [
  "#1f3a5f",
  "#1d4ed8",
  "#0e7490",
  "#0f766e",
  "#166534",
  "#8b1e3f",
  "#be185d",
  "#b91c1c",
  "#9a3412",
  "#5b21b6",
  "#334155",
  "#111827",
] as const;

const SIZE_FACTOR = { small: 0.93, medium: 1, large: 1.07 } as const;
const SPACING_FACTOR = { compact: 0.7, normal: 1, relaxed: 1.3 } as const;

export const PAPER_SIZES = {
  A4: { width: 210, height: 297 },
  Letter: { width: 215.9, height: 279.4 },
} as const;

/** Definition + the resume's own settings (colour, font, size, spacing) = the final design to render. */
export type ResolvedDesign = DesignDefinition & {
  showPhoto: boolean;
  spacingFactor: number;
  paper: ResumeSettings["paper"];
};

export function resolveDesign(definition: DesignDefinition, settings: ResumeSettings): ResolvedDesign {
  // When the user picks a font, headings switch to it too (consistent, predictable result).
  const chosen = settings.font in FONTS ? (settings.font as FontId) : null;
  return {
    ...definition,
    colors: {
      ...definition.colors,
      accent: definition.monochrome ? definition.colors.text : settings.color,
    },
    typography: {
      ...definition.typography,
      font: chosen ?? definition.typography.font,
      headingFont: chosen ? undefined : definition.typography.headingFont,
      size: +(definition.typography.size * SIZE_FACTOR[settings.size]).toFixed(2),
    },
    showPhoto: settings.showPhoto && definition.header.photo !== "none",
    spacingFactor: SPACING_FACTOR[settings.spacing],
    paper: settings.paper,
  };
}

export function systemDefinition(id: TemplateId): DesignDefinition {
  return SYSTEM_TEMPLATES[id].definition;
}

/**
 * The definition with every optional option written out at the value the engine uses when it is
 * absent (same look). The template editor shows and edits these explicit values.
 */
export function withDefaults(d: DesignDefinition): DesignDefinition {
  return {
    ...d,
    sidebar: hasSidebar(d)
      ? {
          width: d.sidebar?.width ?? 62,
          sections: d.sidebar?.sections ?? SIDEBAR_SECTIONS,
          background: d.sidebar?.background ?? "accent",
          fullHeader: d.sidebar?.fullHeader ?? false,
        }
      : undefined,
    header: { ...d.header, nameSize: d.header.nameSize ?? "medium", nameStyle: d.header.nameStyle ?? "bold" },
    band: d.band ?? (d.layout === "top-band" ? "accent" : "none"),
    stripe: d.stripe ?? "none",
    headingCase: d.headingCase ?? "uppercase",
    sectionLayout: d.sectionLayout ?? "stacked",
    tagStyle: d.tagStyle ?? "filled",
    datePosition: d.datePosition ?? "right",
    timeline: d.timeline ?? false,
  };
}

/**
 * Before switching a resume to another design: a resume still in the current design's default
 * colour moves to the new one's colour; a colour the user picked is kept.
 */
export function switchTemplateColor(data: ResumeData, next: DesignDefinition) {
  const previous = resumeDefinition(data);
  const onDefault = previous.monochrome || data.settings.color.toLowerCase() === previous.colors.accent.toLowerCase();
  if (onDefault && !next.monochrome) data.settings.color = next.colors.accent;
}

/** The definition a resume is drawn with: its applied user template, else its system template. */
export function resumeDefinition(data: ResumeData): DesignDefinition {
  return data.settings.customTemplate?.definition ?? systemDefinition(data.settings.template);
}

export function hasSidebar(design: DesignDefinition) {
  return design.layout === "sidebar-left" || design.layout === "sidebar-right";
}

export function isInSidebar(design: DesignDefinition, section: SectionId) {
  return !!design.sidebar && design.sidebar.sections.includes(section);
}

/** Header background; in sidebar layouts there is none unless the header spans the full width. */
export function headerBand(design: DesignDefinition): NonNullable<DesignDefinition["band"]> {
  if (hasSidebar(design) && !design.sidebar?.fullHeader) return "none";
  return design.band ?? (design.layout === "top-band" ? "accent" : "none");
}

/** Is white text drawn on the accent colour? (the contrast check measures this) */
export function hasWhiteTextOnAccent(design: DesignDefinition) {
  if (design.monochrome) return false;
  return (
    headerBand(design) === "accent" ||
    (hasSidebar(design) && (design.sidebar?.background ?? "accent") === "accent") ||
    design.sectionHeading === "box"
  );
}
