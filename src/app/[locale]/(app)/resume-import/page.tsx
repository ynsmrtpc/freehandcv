import type { Metadata } from "next";
import { Suspense } from "react";
import { getSession } from "@/server/authz";
import { aiStatus } from "@/server/ai";
import { getSignInMethods } from "@/server/account";
import { githubEnabled } from "@/server/auth";
import { listResumes } from "@/server/resumes";
import { ResumeImport } from "@/components/wizard/ResumeImport";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function ImportPage() { return <Suspense fallback={null}><Content /></Suspense>; }
async function Content() {
  const session = await getSession();
  const [ai, methods, resumes] = session ? await Promise.all([aiStatus(session.user.id), getSignInMethods(session.user.id), listResumes(session.user.id)]) : [{ enabled: false, provider: "", remaining: 0 }, [], []];
  return <ResumeImport signedIn={!!session} githubConfigured={githubEnabled} githubConnected={methods.includes("github")} resumes={resumes.map(({ id, title }) => ({ id, title }))} ai={ai} />;
}
