"use server";
import { appendGithubProjects, githubProjects } from "@/server/github";
export async function githubProjectsAction(page: number) {
  try { return { ok: true as const, items: await githubProjects(page) }; } catch { return { ok: false as const }; }
}
export async function appendGithubProjectsAction(resumeId: string, ids: number[], page: number) {
  try { return { ok: true as const, id: await appendGithubProjects(resumeId, ids, page) }; } catch { return { ok: false as const }; }
}
