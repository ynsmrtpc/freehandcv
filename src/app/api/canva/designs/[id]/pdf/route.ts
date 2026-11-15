import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { CanvaError, exportDesignPdf } from "@/server/canva";

const statuses: Record<CanvaError["code"], number> = {
  unavailable: 503,
  not_connected: 401,
  denied: 403,
  state: 400,
  export_failed: 502,
  export_timeout: 504,
  too_large: 413,
  rate_limited: 429,
  failed: 502,
};

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "not_connected" }, { status: 401 });
  const { id } = await context.params;
  try {
    const bytes = await exportDesignPdf(session.user.id, id);
    return new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const code = error instanceof CanvaError ? error.code : "failed";
    return NextResponse.json({ error: code }, { status: statuses[code] });
  }
}
