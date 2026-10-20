import "server-only";
import { chromium, type Browser } from "playwright-core";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { PDF_DATA_KEY, PDF_READY_ATTRIBUTE } from "@/lib/pdf";
import type { ResumeData } from "@/lib/resume/schema";
import { createRateLimiter } from "./rateLimit";

// Server-side PDF (plan 4, phase 2): a headless Chromium opens the app's own print page, which draws
// the resume with the same component and CSS as the editor preview, and prints it. Text stays
// selectable (ATS-readable). One browser is shared; each request gets its own context.
//
// CHROMIUM_PATH: the system Chromium (Docker image); empty = the browser installed by Playwright.
// PDF_RENDER_ORIGIN: where the browser reaches this app; default is the local server.

// "localhost", not 127.0.0.1: the dev server treats another host name as a cross-origin request and blocks its scripts.
const ORIGIN = process.env.PDF_RENDER_ORIGIN || `http://localhost:${process.env.PORT || 3000}`;
const MAX_CONCURRENT = 2;
const TIMEOUT_MS = 20_000;

export class PdfBusyError extends Error {}

/** Guests can download too, so the limit is per client IP: 30 PDFs per 10 minutes. */
export const allowPdfRequest = createRateLimiter(10 * 60 * 1000, 30);

const globalForPdf = globalThis as unknown as { pdfBrowser?: Promise<Browser> };

function getBrowser() {
  globalForPdf.pdfBrowser ??= chromium
    .launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--disable-dev-shm-usage"] })
    .then((browser) => {
      // A crashed browser is relaunched on the next request.
      browser.on("disconnected", () => (globalForPdf.pdfBrowser = undefined));
      return browser;
    })
    .catch((error) => {
      globalForPdf.pdfBrowser = undefined;
      throw error;
    });
  return globalForPdf.pdfBrowser;
}

let running = 0;
const queue: (() => void)[] = [];
const QUEUE_LIMIT = 20;

async function slot() {
  if (running < MAX_CONCURRENT) {
    running++;
    return;
  }
  if (queue.length >= QUEUE_LIMIT) throw new PdfBusyError();
  await new Promise<void>((resolve) => queue.push(resolve));
}

function release() {
  const next = queue.shift();
  if (next) next();
  else running--;
}

export async function renderResumePdf(data: ResumeData, locale: Locale): Promise<Uint8Array> {
  await slot();
  try {
    const browser = await getBrowser();
    const context = await browser.newContext({ colorScheme: "light" });
    try {
      // Only the app itself (page, scripts, fonts) may load: resume data never makes the server fetch other addresses.
      await context.route(
        (url) => url.origin !== ORIGIN && url.protocol !== "data:",
        (route) => route.abort("blockedbyclient"),
      );
      const page = await context.newPage();
      page.setDefaultTimeout(TIMEOUT_MS);
      await page.addInitScript(([key, value]) => ((window as unknown as Record<string, unknown>)[key] = value), [
        PDF_DATA_KEY,
        data,
      ] as const);
      await page.goto(ORIGIN + getPathname({ href: "/print", locale }), { waitUntil: "load" });
      await page.waitForSelector(`body[${PDF_READY_ATTRIBUTE}]`, { state: "attached" });
      return await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true });
    } finally {
      await context.close();
    }
  } finally {
    release();
  }
}
