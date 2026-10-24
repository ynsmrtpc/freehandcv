// Choices the template editor offers for each enum field of the design schema, in schema order.
// Labels: TemplateEditor.options.<field>.<value> (options.test.ts keeps all three in step).
export const OPTIONS = {
  layout: ["single-column", "sidebar-left", "sidebar-right", "top-band"],
  sidebarBackground: ["accent", "light", "gray", "rule"],
  align: ["left", "center", "split"],
  photo: ["none", "round", "square", "rounded"],
  divider: ["none", "thin", "thick", "accent", "double"],
  title: ["accent", "uppercase", "muted-uppercase"],
  nameColor: ["dark", "accent"],
  nameSize: ["small", "medium", "large", "huge"],
  nameStyle: ["bold", "light", "uppercase", "light-uppercase"],
  band: ["none", "accent", "dark", "light"],
  stripe: ["none", "left", "top"],
  sectionHeading: ["uppercase", "underline", "left-bar", "square-marker", "extended-rule", "box", "centered", "short-rule"],
  headingCase: ["uppercase", "normal"],
  sectionLayout: ["stacked", "side"],
  bullets: ["dot", "dash", "arrow", "square", "none"],
  skills: ["list", "tags", "two-column"],
  tagStyle: ["filled", "outline"],
  contact: ["icons", "separated"],
  separator: ["|", "·", "–"],
  company: ["bold", "italic", "accent"],
  datePosition: ["right", "below", "left"],
} as const;
export type OptionField = keyof typeof OPTIONS;
