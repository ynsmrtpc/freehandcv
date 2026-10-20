import { exportAccountData } from "@/server/account";
import { auth } from "@/server/auth";

// "Download my data" (plan 9 /hesap; KVKK right of access): everything stored about the signed-in
// user as one JSON file. Never cached.
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response("Unauthorized", { status: 401 });
  const data = await exportAccountData(session.user.id);
  if (!data) return new Response("Not found", { status: 404 });
  const day = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="freehandcv-data-${day}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
