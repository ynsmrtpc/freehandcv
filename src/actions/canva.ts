"use server";

import { getSession } from "@/server/authz";
import { CanvaError, disconnect, listDesigns, type CanvaDesign } from "@/server/canva";

export async function canvaDesignsAction(input: {
  continuation?: string;
  query?: string;
}): Promise<
  | { ok: true; items: CanvaDesign[]; continuation: string | null }
  | { ok: false; error: string }
> {
  const session = await getSession();
  if (!session) return { ok: false, error: "not_connected" };
  try {
    const result = await listDesigns(session.user.id, input);
    return { ok: true, ...result };
  } catch (error) {
    return { ok: false, error: error instanceof CanvaError ? error.code : "failed" };
  }
}

export async function canvaDisconnectAction(): Promise<{ ok: true }> {
  const session = await getSession();
  if (session) await disconnect(session.user.id);
  return { ok: true };
}
