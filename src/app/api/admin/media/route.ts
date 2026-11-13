import { AuthorizationError, requireAdmin } from "@/server/authz";
import { MAX_UPLOAD_BYTES, MediaSizeError, MediaTypeError, saveUpload } from "@/server/media";

// Uploads go through a Route Handler rather than a Server Action, so the 1 MB Server Action body
// limit stays in place for the rest of the app. The admin check runs here, not in a layout.
export async function POST(request: Request) {
  try {
    const user = await requireAdmin();
    const form = await request.formData();
    const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    if (!files.length) return Response.json({ ok: false, error: "Dosya seçilmedi." }, { status: 400 });
    if (files.length > 20) return Response.json({ ok: false, error: "Bir seferde en fazla 20 dosya yükleyebilirsin." }, { status: 400 });
    const alt = String(form.get("alt") ?? "");
    const saved: string[] = [];
    const failed: string[] = [];
    for (const file of files) {
      try {
        await saveUpload(file, alt, user.id);
        saved.push(file.name);
      } catch (error) {
        if (error instanceof MediaTypeError) failed.push(`${file.name}: desteklenmeyen biçim`);
        else if (error instanceof MediaSizeError) failed.push(`${file.name}: ${MAX_UPLOAD_BYTES / 1024 / 1024} MB'tan büyük`);
        else throw error;
      }
    }
    return Response.json({ ok: saved.length > 0, saved: saved.length, failed });
  } catch (error) {
    if (error instanceof AuthorizationError) return Response.json({ ok: false, error: "Yetkin yok." }, { status: 403 });
    console.error(error);
    return Response.json({ ok: false, error: "Yükleme başarısız oldu." }, { status: 500 });
  }
}
