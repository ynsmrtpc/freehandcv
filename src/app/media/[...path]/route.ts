import { readMediaFile } from "@/server/media";

// Serves uploaded files from MEDIA_DIR. Keys contain a random id, so a file never changes:
// browsers and the reverse proxy may cache it for a year. nginx can also serve the folder directly
// (docs/DEPLOY-AAPANEL.md); this handler keeps working without that.
export async function GET(_request: Request, { params }: RouteContext<"/media/[...path]">) {
  const { path } = await params;
  const file = await readMediaFile(path.join("/"));
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.type,
      "Content-Length": String(file.data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Last-Modified": file.modified.toUTCString(),
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
