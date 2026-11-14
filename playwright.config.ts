import { defineConfig, devices } from "@playwright/test";

// Never inherit DATABASE_URL from .env: E2E must opt into its isolated database explicitly.
const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl || new URL(databaseUrl).pathname !== "/freehandcv_test") {
  throw new Error("TEST_DATABASE_URL must point to the freehandcv_test database. Development data must never be used for E2E.");
}

const origin = "http://localhost:3100";
const production = process.env.E2E_PRODUCTION === "1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: origin, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: production
      ? "bun run db:migrate && bun run build && bun run start --hostname localhost --port 3100"
      : "bun run db:migrate && bun run dev --hostname localhost --port 3100",
    url: `${origin}/en/sign-in`,
    reuseExistingServer: false,
    timeout: production ? 240_000 : 120_000,
    env: {
      DATABASE_URL: databaseUrl,
      NEXT_DIST_DIR: ".next-test",
      BETTER_AUTH_URL: origin,
      NEXT_PUBLIC_SITE_URL: origin,
      BETTER_AUTH_SECRET: "isolated-e2e-secret-never-use-in-production-0000",
      RESEND_API_KEY: "",
      EMAIL_FROM: "",
      GOOGLE_CLIENT_ID: "",
      GOOGLE_CLIENT_SECRET: "",
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: "",
      GITHUB_CLIENT_ID: "",
      GITHUB_CLIENT_SECRET: "",
      AI_API_URL: "",
      AI_API_KEY: "",
      AI_MODEL: "",
      AI_PROVIDER_NAME: "",
      PDF_RENDER_ORIGIN: origin,
    },
  },
});
