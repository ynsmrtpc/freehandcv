"use client";
export async function pdfText(file: File) {
  if (file.size > 10 * 1024 * 1024) throw new Error("too_large");
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-") throw new Error("invalid_file");
  const task = pdfjs.getDocument({ data: bytes, stopAtErrors: true, useSystemFonts: true, enableXfa: false });
  try {
    const document = await task.promise;
    if (document.numPages > 20) throw new Error("too_large");
    let text = "";
    for (let index = 1; index <= document.numPages; index++) {
      const page = await document.getPage(index), content = await page.getTextContent();
      // PDF.js emits real spaces as text items. Adding a space between font runs would split
      // Turkish words when an accented glyph uses a separate subset or fallback font.
      for (const item of content.items) if ("str" in item) text += item.str + (item.hasEOL ? "\n" : "");
      text += "\n"; if (text.length > 50_000) throw new Error("too_large"); page.cleanup();
    }
    if (!text.trim()) throw new Error("no_text");
    return text;
  } finally { await task.destroy(); }
}
