// Shared by the print page (browser) and the PDF renderer (src/server/pdf.ts).

/** Window property the headless browser sets to the resume before the print page loads. */
export const PDF_DATA_KEY = "__FREEHANDCV_PDF__";
/** Present on <body> once the resume and its fonts are laid out; the renderer waits for it. */
export const PDF_READY_ATTRIBUTE = "data-pdf-ready";
