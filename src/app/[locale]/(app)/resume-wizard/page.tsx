import type { Metadata } from "next";
import { Suspense } from "react";
import { getSession } from "@/server/authz";
import { aiStatus } from "@/server/ai";
import { ResumeWizard } from "@/components/wizard/ResumeWizard";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function WizardPage() { return <Suspense fallback={null}><Content /></Suspense>; }
async function Content() {
  const session = await getSession();
  const ai = session?.user.emailVerified ? await aiStatus(session.user.id) : { enabled: false, provider: "", remaining: 0 };
  return <ResumeWizard signedIn={!!session} ai={ai} />;
}
