// Runs once when a server instance starts. Background jobs live only in the Node.js runtime and
// never during `next build`.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NEXT_PHASE === "phase-production-build") return;
  const { startJobs } = await import("./server/jobs");
  startJobs();
}
