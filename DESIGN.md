---
name: FreehandCV
description: Cool form paper, graphite text, and ballpoint-blue actions.
colors:
  primary: "#2536a8"
  primary-dark: "#1b2780"
  primary-soft: "#e7e9f8"
  background: "#f2f3f6"
  surface: "#ffffff"
  foreground: "#15171d"
  muted: "#4a5062"
  border: "#d8dbe3"
  border-strong: "#b4bac8"
  accent: "#0e7244"
  warning: "#8a5200"
  danger: "#b42318"
typography:
  body:
    fontFamily: "Atkinson Hyperlegible Next"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: "Atkinson Hyperlegible Next"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  md: "5px"
  lg: "7px"
  xl: "8px"
  2xl: "10px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    height: "44px"
    padding: "0 20px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: "44px"
    padding: "0 12px"
---

# Design System: FreehandCV

## Overview

**Creative North Star: "A form filled in with a blue ballpoint pen"**

The existing direction combines a plain public-service structure with the identity of form paper.
White surfaces sit on a cool grey desk. Graphite text and hairline rules organize the work;
ballpoint blue identifies actions and selections. The audience includes occasional computer users
and people reading on small phones, so clear labels and visible actions come first.

The public site introduces the product; the dashboard and editors stay focused on completing a CV.
The direction and page-specific composition are recorded in `.impeccable/surfaces/`.

**Key Characteristics:**
- One legible type family, small corners, and ruled separation.
- A hand-drawn ink underline and tick as the signature, implemented in `InkMark.tsx`.
- Real resume output used for previews, with no invented testimonials or usage counts.

## Colors

The frontmatter captures the light palette; `src/app/globals.css` defines both themes and remains
the implementation source of truth. Components use semantic classes, including `text-primary-text`
for blue text, `bg-primary` for actions, and `bg-desk` behind resume paper.

### Primary
Ballpoint blue marks the main action. Its soft tint marks selection; it does not compete with the
filled primary button. Dark mode separates blue text from the blue button background.

### Secondary
Stamp green communicates success, amber caution, and red destructive actions. Every state has a
text label or icon as well as color.

### Neutral
Cool paper is the content surface; graphite is text; blue-grey rules group content. Resume paper
stays white in both themes because it represents printed output.

## Typography

**Body and UI Font:** Atkinson Hyperlegible Next, loaded through `next/font`, with system fallbacks.
Resume fonts belong to the template definition and are independent of UI typography.

Dashboard titles use 30px bold text; group headings use 18px bold text. Form labels use 15px
semibold text and inputs use 16px text. Metadata may be smaller, but must stay readable in both
themes. Use tabular numerals for measurements and scores. Keep headings visible without animation.

## Layout

Dashboard content is centered within a 72rem container with 16px phone and 24px desktop gutters.
Resume and template lists show one column on narrow phones, two from 480px, and three from 1024px.
Each item has a preview, title, metadata, visible edit action, and a labelled secondary-action menu.

Editors use a 380–460px settings column beside the paper from 1024px. Below that, editing and preview
are separate views with shared bottom navigation. Reserve the device's bottom safe area. The CV
toolbar has a separate action row below 640px so save status and PDF download remain readable.

## Elevation & Depth

Borders organize resting UI surfaces. `shadow-elevated` belongs to menus and dialogs;
`shadow-paper` belongs to the resume on its desk. Do not add hover elevation to dashboard cards.
Interactive transitions are short and respect reduced motion; app screens have no entrance sequence.

## Shapes

Use the global corner tokens, with the small form-paper radii in the frontmatter. Inputs and buttons
share their corner language. Circles are reserved for avatars, compact indicators, and actual controls.

## Components

### Buttons
Use `buttonClass()`. One primary action per page; navigation and secondary actions use secondary
or ghost styling. The standard control is 44px tall; compact desktop controls may use 36px. Provide
disabled and busy states and a visible focus outline.

### Inputs / Fields
Use the shared editor primitives. Labels remain visible above fields. Inputs are 44px tall and
16px text prevents focus zoom on phones. Use semantic focus, error, and disabled colors.

### Cards / Containers
Dashboard cards are flat paper with a single hairline border and 16px padding. Long names truncate
with their full text available through the link's accessible name or title. Actions remain available
without hovering. Destructive actions sit in the labelled menu and retain confirmation.

### Navigation
Dashboard links identify the current page with `aria-current`. Editor content tabs use tab roles
and arrow-key navigation. The shared phone edit/preview switch uses pressed states and a soft ink
selection, leaving the filled primary treatment for PDF download or saving a template.

### Reading Pages
Use `ReadingLayout` for CMS documents and long-form guides. Its outer width is 64rem, with a paper
column and a 240px desktop outline. On phones the outline becomes a native disclosure. Titles use
30–36px text; section headings use 24px; prose uses 17px. All sections share the same left edge.
Reading blocks inherit the paper surface; do not add alternating grey panels behind text sections.
The document's own content and publishing state remain in the CMS. Catalogue introductions use
the same title scale within their 72rem container. Account navigation includes resumes, templates,
and the account page.

### Landing and Catalogues
The landing is Persuade mode but keeps the form skeleton. The hero holds the page's only filled
primary action; the site header link and the closing section use the secondary button. The hero
has no badges, stamps, chips, or glow: its promises are ruled lines with ink ticks. Selectors
(hero template switcher, example and template showcases, catalogue filters) use bordered boxes with
the soft-ink tint for the selected item, never filled blue pills. The closing section is a form-end
row: a 2px graphite rule above the heading, text on the desk, no coloured slab. Comparisons and long
lists are ruled rows rather than cards: the example index is a register of hairline-separated rows,
two columns from 1024px.

### Confirmations
Use `useConfirm()` for destructive or content-replacing operations. `ConfirmProvider` renders a
translated, theme-aware alert dialog with the affected item in its message. Deletion uses a red
action; cancellation receives initial focus. Escape cancels, Tab stays within the dialog, and
closing returns focus to the trigger. Browser `confirm()` and `alert()` are not used for app actions.

## Do's and Don'ts

### Do:
- **Do** use semantic tokens for both themes.
- **Do** test narrow phones, desktop, long text, and keyboard interactions.
- **Do** keep PDF output independent of editor controls and theme.

### Don't:
- **Don't** hide essential actions behind hover.
- **Don't** substitute decorative imagery for real resume previews.
- **Don't** add gradients, floating statistics, or invented product claims.
- **Don't** put a primary-filled block or a second filled primary on a page that already has one.
- **Don't** place icons inside tinted tiles; an icon sits inline with its label or not at all.

Validation and remaining release work are recorded in `docs/WORK-STATUS.md`.
