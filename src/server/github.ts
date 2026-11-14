import "server-only";
import { headers } from "next/headers";
import { z } from "zod";
import { auth, githubEnabled } from "./auth";
import { getSession } from "./authz";
import { getResume, saveResume } from "./resumes";
import { emptyEntry } from "@/lib/resume/schema";
import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { account } from "./db/schema";

export async function githubProjects(page = 1) {
  const session = await getSession();
  if (!session?.user.emailVerified || !githubEnabled) throw new Error("unavailable");
  z.int().min(1).max(20).parse(page);
  const [linked] = await db.select({ id: account.id }).from(account).where(and(eq(account.userId, session.user.id), eq(account.providerId, "github"))).limit(1);
  if (!linked) throw new Error("not_connected");
  const token = await auth.api.getAccessToken({ headers: await headers(), body: { accountId: linked.id } });
  if (!token.accessToken) throw new Error("not_connected");
  const response = await fetch(`https://api.github.com/user/repos?visibility=public&affiliation=owner&sort=updated&per_page=50&page=${page}`, { cache: "no-store", signal: AbortSignal.timeout(15_000), redirect: "error", headers: { Authorization: `Bearer ${token.accessToken}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2026-03-10" } });
  if (!response.ok) throw new Error("provider_error");
  const repositories = z.array(z.object({ id: z.number(), name: z.string().max(200), description: z.string().max(2000).nullable(), html_url: z.url(), language: z.string().max(100).nullable(), private: z.boolean() })).max(50).parse(await response.json());
  return repositories.filter((repo) => !repo.private && new URL(repo.html_url).hostname === "github.com").map((repo) => ({ id: repo.id, name: repo.name, description: repo.description ?? "", link: repo.html_url, technologies: repo.language ?? "" }));
}
export async function appendGithubProjects(resumeId: string, ids: number[], page: number) {
  z.uuid().parse(resumeId); z.array(z.int().positive()).min(1).max(20).parse(ids);
  const session = await getSession(); if (!session) throw new Error("unauthenticated");
  const [resume, repositories] = await Promise.all([getResume(resumeId, session.user.id), githubProjects(page)]);
  const selected = repositories.filter((repo) => ids.includes(repo.id));
  if (selected.length !== new Set(ids).size) throw new Error("invalid_selection");
  for (const repo of selected) if (!resume.content.projects.some((project) => project.link === repo.link)) resume.content.projects.push({ ...emptyEntry("projects"), name: repo.name, description: repo.description, link: repo.link, technologies: repo.technologies });
  resume.content.settings.hiddenSections = resume.content.settings.hiddenSections.filter((section) => section !== "projects");
  await saveResume(resumeId, session.user.id, resume.content, resume.version);
  return resumeId;
}
