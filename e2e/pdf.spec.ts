import { expect, test } from "@playwright/test";
import { sampleResume } from "@/lib/resume/sample";

test("server PDFs keep selectable text, page sizes and multi-page content", async ({ request, page }) => {
  test.setTimeout(90_000);
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  for (const paper of ["A4", "Letter"] as const) {
    const data = sampleResume("en"); data.personal.name = "Synthetic Çağrı Şahin"; data.settings.paper = paper;
    data.experience = Array.from({ length: 12 }, (_, index) => ({ ...data.experience[0], id: `synthetic-${index}`, position: `Synthetic position ${index}`, bullets: "Delivered a synthetic project with measurable results.\nImproved a synthetic process by 25 percent.\nCollaborated with a synthetic team to build accessible software." }));
    const response = await request.post("/api/pdf", { data: { data, locale: "en" } });
    expect(response.status()).toBe(200); expect(response.headers()["content-type"]).toContain("application/pdf");
    const buffer = await response.body(); expect(buffer.subarray(0, 5).toString()).toBe("%PDF-");
    const task = pdfjs.getDocument({ data: new Uint8Array(buffer) });
    const document = await task.promise;
    try {
      expect(document.numPages).toBeGreaterThan(1);
      const first = await document.getPage(1), viewport = first.getViewport({ scale: 1 });
      expect(viewport.width).toBeCloseTo(paper === "A4" ? 595.28 : 612, -1);
      let text = "";
      for (let index = 1; index <= document.numPages; index++) text += (await (await document.getPage(index)).getTextContent()).items.flatMap((item) => "str" in item ? [item.str] : []).join("");
      expect(text).toContain("Synthetic Çağrı Şahin"); expect(text).toContain("Synthetic position 11");
    } finally { await task.destroy(); }
    // Also exercise the browser-only extractor with the real server-generated PDF.
    await page.goto("/en/resume-import");
    await expect(page.locator('input[type="file"]')).toBeEnabled();
    await page.locator('input[type="file"]').setInputFiles({ name: `${paper}.pdf`, mimeType: "application/pdf", buffer });
    await expect(page.getByLabel("Extracted or pasted text", { exact: true })).toHaveValue(/Synthetic Çağrı Şahin/, { timeout: 15_000 });
  }
});
