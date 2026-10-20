import "server-only";
import { purgeTrash } from "./account";

// Periodic maintenance, started from src/instrumentation.ts. One app instance runs on Coolify, so an
// in-process timer is enough; with several instances the jobs stay safe (they are idempotent deletes).

const HOUR = 60 * 60 * 1000;
const globalForJobs = globalThis as unknown as { jobsStarted?: boolean };

async function runPurge() {
  try {
    const n = await purgeTrash();
    if (n) console.log(`purgeTrash: ${n} resume(s) removed from the trash for good`);
  } catch (error) {
    console.error("purgeTrash failed", error);
  }
}

export function startJobs() {
  // Dev reloads modules; the flag keeps one timer per process.
  if (globalForJobs.jobsStarted) return;
  globalForJobs.jobsStarted = true;
  setTimeout(runPurge, 60_000).unref();
  setInterval(runPurge, 6 * HOUR).unref();
}
