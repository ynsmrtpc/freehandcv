import type { Metadata } from "next";
import { Suspense } from "react";
import { getSession } from "@/server/authz";
import { aiStatus } from "@/server/ai";
import { getSignInMethods } from "@/server/account";
import { githubEnabled } from "@/server/auth";
import { canvaConnection, canvaEnabled } from "@/server/canva";
import { listResumes } from "@/server/resumes";
import { ResumeImport } from "@/components/wizard/ResumeImport";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function ImportPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; canva_error?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}

async function Content({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; canva_error?: string }>;
}) {
  const [session, query] = await Promise.all([getSession(), searchParams]);
  const [ai, methods, resumes, canva] = session
    ? await Promise.all([
        aiStatus(session.user.id),
        getSignInMethods(session.user.id),
        listResumes(session.user.id),
        canvaConnection(session.user.id),
      ])
    : [
        { enabled: false, provider: "", remaining: 0 },
        [],
        [],
        { enabled: canvaEnabled, connected: false, name: "" },
      ];
  return (
    <ResumeImport
      signedIn={!!session}
      githubConfigured={githubEnabled}
      githubConnected={methods.includes("github")}
      canva={canva}
      initialSource={query.source === "canva" ? "canva" : "file"}
      initialCanvaError={query.canva_error ?? ""}
      resumes={resumes.map(({ id, title }) => ({ id, title }))}
      ai={ai}
    />
  );
}
