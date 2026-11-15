import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";

// Canva Connect API (OAuth 2.0 authorization code + PKCE). Tokens never reach the database or the
// browser's JavaScript: they live in one encrypted, httpOnly cookie bound to the signed-in user,
// so disconnecting or signing out on this device removes them. See docs/CANVA-IMPORT.md.

const AUTHORIZE_URL = "https://www.canva.com/api/oauth/authorize";
const API = "https://api.canva.com/rest/v1";
const SCOPES = "design:meta:read design:content:read profile:read";
const TOKEN_COOKIE = "fhcv_canva";
const FLOW_COOKIE = "fhcv_canva_flow";
const MAX_PDF_BYTES = 10 * 1024 * 1024;

const clientId = process.env.CANVA_CLIENT_ID;
const clientSecret = process.env.CANVA_CLIENT_SECRET;
export const canvaEnabled = !!(clientId && clientSecret && process.env.BETTER_AUTH_SECRET);

export class CanvaError extends Error {
  constructor(
    readonly code:
      | "unavailable"
      | "not_connected"
      | "denied"
      | "state"
      | "export_failed"
      | "export_timeout"
      | "too_large"
      | "rate_limited"
      | "failed",
  ) {
    super(code);
  }
}

export function canvaRedirectUri() {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || process.env.BETTER_AUTH_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
  return process.env.CANVA_REDIRECT_URI || `${origin}/api/canva/callback`;
}

// ---- Encrypted cookie payloads -------------------------------------------------------------

const key = () => createHash("sha256").update(`canva-cookie-v1:${process.env.BETTER_AUTH_SECRET}`).digest();

function seal(value: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

function open<T>(sealed: string | undefined, schema: z.ZodType<T>): T | null {
  if (!sealed) return null;
  try {
    const raw = Buffer.from(sealed, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const text = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
    const parsed = schema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

const cookieOptions = (maxAge: number, path = "/") => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path,
  maxAge,
});

const flowSchema = z.object({ user: z.string(), state: z.string(), verifier: z.string(), locale: z.string() });
const tokenSchema = z.object({
  user: z.string(),
  access: z.string(),
  refresh: z.string(),
  expires: z.number(),
  name: z.string().default(""),
});
type Tokens = z.infer<typeof tokenSchema>;

// ---- OAuth ----------------------------------------------------------------------------------

/** Starts the flow: remembers state and the PKCE verifier, returns Canva's consent URL. */
export async function beginAuthorization(userId: string, locale: string) {
  if (!canvaEnabled) throw new CanvaError("unavailable");
  const verifier = randomBytes(64).toString("base64url");
  const state = randomBytes(24).toString("base64url");
  const store = await cookies();
  store.set(FLOW_COOKIE, seal({ user: userId, state, verifier, locale }), cookieOptions(600, "/api/canva"));
  const url = new URL(AUTHORIZE_URL);
  url.search = new URLSearchParams({
    code_challenge: createHash("sha256").update(verifier).digest("base64url"),
    code_challenge_method: "s256",
    scope: SCOPES,
    response_type: "code",
    client_id: clientId!,
    state,
    redirect_uri: canvaRedirectUri(),
  }).toString();
  return url;
}

const tokenResponse = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.number().positive(),
});

async function tokenRequest(body: Record<string, string>) {
  const response = await fetch(`${API}/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    console.warn("Canva token request rejected", { status: response.status });
    throw new CanvaError(response.status === 400 || response.status === 401 ? "not_connected" : "failed");
  }
  return tokenResponse.parse(await response.json());
}

async function storeTokens(tokens: Tokens) {
  // Canva refresh tokens rotate on use; the cookie outlives the 4-hour access token.
  (await cookies()).set(TOKEN_COOKIE, seal(tokens), cookieOptions(60 * 60 * 24 * 30));
}

/** Completes the flow on the callback. Returns the locale the user started from. */
export async function completeAuthorization(userId: string, params: URLSearchParams) {
  const store = await cookies();
  const flow = open(store.get(FLOW_COOKIE)?.value, flowSchema);
  store.delete({ name: FLOW_COOKIE, path: "/api/canva" });
  if (!flow) throw new CanvaError("state");
  const fail = (code: CanvaError["code"]) => Object.assign(new CanvaError(code), { locale: flow.locale });
  if (params.get("error")) throw fail("denied");
  const code = params.get("code");
  if (!code || params.get("state") !== flow.state || flow.user !== userId) throw fail("state");
  try {
    const token = await tokenRequest({
      grant_type: "authorization_code",
      code_verifier: flow.verifier,
      code,
      redirect_uri: canvaRedirectUri(),
    });
    const tokens: Tokens = {
      user: userId,
      access: token.access_token,
      refresh: token.refresh_token,
      expires: Date.now() + token.expires_in * 1000,
      name: await displayName(token.access_token),
    };
    await storeTokens(tokens);
  } catch (error) {
    throw fail(error instanceof CanvaError ? error.code : "failed");
  }
  return flow.locale;
}

async function displayName(access: string) {
  try {
    const response = await fetch(`${API}/users/me/profile`, {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return "";
    const body = z.object({ profile: z.object({ display_name: z.string().max(200).optional() }) }).safeParse(await response.json());
    return body.success ? (body.data.profile.display_name ?? "") : "";
  } catch {
    return "";
  }
}

/** Connection state for the import screen; never exposes tokens. */
export async function canvaConnection(userId: string) {
  if (!canvaEnabled) return { enabled: false, connected: false, name: "" };
  const tokens = open((await cookies()).get(TOKEN_COOKIE)?.value, tokenSchema);
  return { enabled: true, connected: tokens?.user === userId, name: tokens?.user === userId ? tokens.name : "" };
}

async function accessToken(userId: string) {
  if (!canvaEnabled) throw new CanvaError("unavailable");
  const store = await cookies();
  const tokens = open(store.get(TOKEN_COOKIE)?.value, tokenSchema);
  if (!tokens || tokens.user !== userId) throw new CanvaError("not_connected");
  if (tokens.expires - Date.now() > 60_000) return tokens.access;
  try {
    const next = await tokenRequest({ grant_type: "refresh_token", refresh_token: tokens.refresh });
    await storeTokens({
      ...tokens,
      access: next.access_token,
      refresh: next.refresh_token,
      expires: Date.now() + next.expires_in * 1000,
    });
    return next.access_token;
  } catch (error) {
    if (error instanceof CanvaError && error.code === "not_connected") store.delete(TOKEN_COOKIE);
    throw error;
  }
}

export async function disconnect(userId: string) {
  const store = await cookies();
  const tokens = open(store.get(TOKEN_COOKIE)?.value, tokenSchema);
  store.delete(TOKEN_COOKIE);
  if (!tokens || tokens.user !== userId || !canvaEnabled) return;
  // Best effort: the local cookie is already gone even if Canva cannot be reached.
  await fetch(`${API}/oauth/revoke`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ token: tokens.refresh }),
    signal: AbortSignal.timeout(8_000),
  }).catch(() => undefined);
}

// ---- Designs and export ---------------------------------------------------------------------

async function api(userId: string, path: string, init?: RequestInit) {
  const token = await accessToken(userId);
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status === 401) {
    (await cookies()).delete(TOKEN_COOKIE);
    throw new CanvaError("not_connected");
  }
  if (response.status === 429) throw new CanvaError("rate_limited");
  if (!response.ok) {
    console.warn("Canva API request failed", { path: path.split("?")[0], status: response.status });
    throw new CanvaError("failed");
  }
  return response.json();
}

const designList = z.object({
  continuation: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      thumbnail: z.object({ url: z.string().url(), width: z.number(), height: z.number() }).optional(),
      urls: z.object({ edit_url: z.string().url() }).partial().optional(),
      updated_at: z.number().optional(),
      page_count: z.number().optional(),
    }),
  ),
});

export type CanvaDesign = {
  id: string;
  title: string;
  thumbnail: { url: string; width: number; height: number } | null;
  editUrl: string | null;
  updatedAt: string | null;
  pageCount: number | null;
};

export async function listDesigns(userId: string, input: { continuation?: string; query?: string }) {
  const { continuation, query } = z
    .object({ continuation: z.string().max(2000).optional(), query: z.string().trim().max(100).optional() })
    .parse(input);
  const params = new URLSearchParams({ ownership: "any", sort_by: "modified_descending" });
  if (query) params.set("query", query);
  if (continuation) params.set("continuation", continuation);
  const body = designList.parse(await api(userId, `/designs?${params}`));
  return {
    continuation: body.continuation ?? null,
    items: body.items.map(
      (item): CanvaDesign => ({
        id: item.id,
        title: item.title ?? "",
        thumbnail: item.thumbnail ?? null,
        editUrl: item.urls?.edit_url ?? null,
        updatedAt: item.updated_at ? new Date(item.updated_at * 1000).toISOString() : null,
        pageCount: item.page_count ?? null,
      }),
    ),
  };
}

const exportJob = z.object({
  job: z.object({
    id: z.string(),
    status: z.enum(["in_progress", "success", "failed"]),
    urls: z.array(z.string().url()).optional(),
  }),
});

/** Asks Canva for a PDF of the design and returns its bytes for text extraction in the browser. */
export async function exportDesignPdf(userId: string, designId: string) {
  const id = z.string().regex(/^[A-Za-z0-9_-]{4,64}$/).parse(designId);
  let { job } = exportJob.parse(
    await api(userId, "/exports", { method: "POST", body: JSON.stringify({ design_id: id, format: { type: "pdf" } }) }),
  );
  const deadline = Date.now() + 40_000;
  for (let wait = 800; job.status === "in_progress"; wait = Math.min(wait * 1.5, 4000)) {
    if (Date.now() > deadline) throw new CanvaError("export_timeout");
    await new Promise((resolve) => setTimeout(resolve, wait));
    ({ job } = exportJob.parse(await api(userId, `/exports/${encodeURIComponent(job.id)}`)));
  }
  const url = job.status === "success" ? job.urls?.[0] : undefined;
  if (!url || new URL(url).protocol !== "https:") throw new CanvaError("export_failed");
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(30_000) });
  if (!response.ok || !response.body) throw new CanvaError("export_failed");
  if (Number(response.headers.get("content-length") ?? 0) > MAX_PDF_BYTES) throw new CanvaError("too_large");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_PDF_BYTES) {
      await reader.cancel();
      throw new CanvaError("too_large");
    }
    chunks.push(value);
  }
  const bytes = Buffer.concat(chunks);
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") throw new CanvaError("export_failed");
  return bytes;
}
