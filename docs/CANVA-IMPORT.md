# Canva import feasibility

The request in plan section 14.1 is feasible as a guided conversion, but is not implemented.

## What the current engine can represent

The resume renderer consumes validated resume fields and a `DesignDefinition`, not an arbitrary
canvas. Available layouts, fonts, colors, spacing, headers, and section styles are enumerated in
`src/lib/resume/designSchema.ts` and `src/components/template-editor/options.ts`.

Arbitrary positioned objects, text on paths, freeform illustration, and overlapping layers have no
equivalent in that schema. A Canva document therefore cannot be promised as a pixel-identical import.

## Recommended first scope

1. Let the user upload their exported document and show an explicit conversion explanation.
2. Extract text into an editable review step: personal details, experience, education, and skills.
   Do not silently assign uncertain dates or associate a job with the wrong company.
3. Ask the user to confirm the field mapping before replacing any existing resume. Keep the original
   resume available through the existing undo/history mechanism.
4. Offer the closest supported layout and user-confirmed colors; unsupported fonts use a clear,
   visible fallback. Resume text remains semantic HTML and selectable PDF text.
5. Save the result as ordinary `ResumeData` plus a validated `DesignDefinition`, so every subsequent
   edit, preview, export, and recruiter check uses the existing engine.

Start with text-based PDF exports. Scanned PDFs require a separate OCR capability; PPTX support
needs a separate parser. Neither capability is currently a dependency of this project. Evaluate
parser fidelity on real user-provided samples before choosing a package or promising support.

## Boundaries to settle before implementation

- Obtain representative exports and define acceptable field-mapping accuracy.
- Decide browser-only extraction versus explicitly consented server processing, file limits,
  retention, and malformed-file handling.
- Keep imported templates private by default. Do not automatically publish third-party assets;
  publication needs a separate rights decision and user confirmation.
- A direct Canva account integration is a separate project requiring its own API/access evaluation.

The next concrete deliverable should be a local parser prototype against sample exports, followed
by the mapping review UI. No import button is exposed until that flow works end to end.
