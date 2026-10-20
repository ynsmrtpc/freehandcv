import { hasLocale } from "next-intl";
import { z } from "zod";
import { routing } from "@/i18n/routing";
import { fileName } from "@/lib/resume/utils";
import { normalizeResume } from "@/lib/resume/schema";
import { allowPdfRequest, PdfBusyError, renderResumePdf } from "@/server/pdf";
import { clientIp } from "@/server/rateLimit";
import { RESUME_MAX_BYTES } from "@/server/resumes";

// PDF download for guests and accounts alike (plan: the editor and the PDF work without an account).
// The resume comes in the body, so nothing is read from the database here.

const bodySchema = z.object({ locale: z.string(), data: z.unknown() });

export async function POST(request: Request) {
  if (!allowPdfRequest(clientIp(request.headers))) return new Response("Too many requests", { status: 429, headers: { "Retry-After": "600" } });

  const text = await request.text();
  if (text.length > RESUME_MAX_BYTES * 1.5) return new Response("Too large", { status: 413 });
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(JSON.parse(text));
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  const locale = hasLocale(routing.locales, body.locale) ? body.locale : routing.defaultLocale;
  const data = normalizeResume(body.data);

  try {
    const pdf = await renderResumePdf(data, locale);
    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        // fileName() is ASCII only, so no extra encoding is needed.
        "Content-Disposition": `attachment; filename="${fileName(data.personal.name, "pdf")}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof PdfBusyError) return new Response("Busy", { status: 503, headers: { "Retry-After": "5" } });
    console.error("PDF render failed", error);
    return new Response("PDF failed", { status: 500 });
  }
}
