import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import postgres from "postgres";
import { expect, test } from "@playwright/test";

const password = "e2e-only-password-12345";
const ids = [randomUUID(), randomUUID(), randomUUID(), randomUUID()];
const emails = ids.map((id) => `e2e-${id}@example.test`);
const resumeIds = [randomUUID(), randomUUID()];
const resetToken = randomUUID();
let sql: ReturnType<typeof postgres>;

test.beforeAll(async () => {
  // Repeat the guard at the mutation boundary, including the server's actual database identity.
  const url = process.env.TEST_DATABASE_URL;
  if (!url || new URL(url).pathname !== "/freehandcv_test") throw new Error("An isolated test database is required");
  sql = postgres(url, { max: 1 });
  const [database] = await sql`select current_database() as name`;
  expect(database.name).toBe("freehandcv_test");
  const hashed = await hashPassword(password);
  await sql.begin(async (tx) => {
    for (let index = 0; index < ids.length; index++) {
      await tx`insert into "user" (id, name, email, email_verified, banned)
        values (${ids[index]}, ${`E2E Person ${index}`}, ${emails[index]}, ${index !== 2}, ${index === 3})`;
      await tx`insert into account (id, account_id, provider_id, user_id, password, created_at, updated_at)
        values (${randomUUID()}, ${ids[index]}, 'credential', ${ids[index]}, ${hashed}, now(), now())`;
    }
    for (let index = 0; index < resumeIds.length; index++) {
      const content = { personal: { name: `Private Person ${index}` } };
      await tx`insert into resumes (id, user_id, title, content, locale, market)
        values (${resumeIds[index]}, ${ids[index]}, ${`Private Resume ${index}`}, ${tx.typed(JSON.stringify(content), 25)}::jsonb, 'en', 'en-US')`;
    }
    await tx`insert into verification (id, identifier, value, expires_at, created_at, updated_at)
      values (${randomUUID()}, ${`reset-password:${resetToken}`}, ${ids[0]}, now() + interval '10 minutes', now(), now())`;
  });
});

test.afterAll(async () => {
  if (!sql) return;
  try {
    await sql`delete from verification where identifier = ${`reset-password:${resetToken}`}`;
    await sql`delete from "user" where id in ${sql(ids)}`;
  } finally {
    await sql.end();
  }
});

test("account exports are isolated and password reset revokes existing sessions", async ({ playwright, baseURL }) => {
  const first = await playwright.request.newContext({ baseURL });
  const second = await playwright.request.newContext({ baseURL });
  const fresh = await playwright.request.newContext({ baseURL });
  const origin = { Origin: baseURL! };
  try {
    for (const [index, client] of [first, second].entries()) {
      const response = await client.post("/api/auth/sign-in/email", { headers: origin, data: { email: emails[index], password } });
      expect(response.ok()).toBe(true);
      const exported = await client.get("/api/account/export");
      expect(exported.status()).toBe(200);
      expect(exported.headers()["cache-control"]).toBe("no-store");
      const data = await exported.json();
      expect(data.profile.email).toBe(emails[index]);
      expect(data.resumes.map((resume: { id: string }) => resume.id)).toEqual([resumeIds[index]]);
      expect(JSON.stringify(data)).not.toContain(emails[1 - index]);
      expect(JSON.stringify(data)).not.toContain('"password"');
    }

    const reset = await fresh.post("/api/auth/reset-password", {
      headers: origin, data: { token: resetToken, newPassword: "e2e-new-password-67890" },
    });
    expect(reset.ok()).toBe(true);
    expect((await first.get("/api/account/export")).status()).toBe(401);
    expect((await second.get("/api/account/export")).status()).toBe(200);
    const oldLogin = await fresh.post("/api/auth/sign-in/email", { headers: origin, data: { email: emails[0], password } });
    expect(oldLogin.ok()).toBe(false);
    const newLogin = await fresh.post("/api/auth/sign-in/email", {
      headers: origin, data: { email: emails[0], password: "e2e-new-password-67890" },
    });
    expect(newLogin.ok()).toBe(true);
    // A consumed reset link cannot be used again.
    expect((await fresh.post("/api/auth/reset-password", {
      headers: origin, data: { token: resetToken, newPassword: password },
    })).ok()).toBe(false);
  } finally {
    await Promise.all([first.dispose(), second.dispose(), fresh.dispose()]);
  }
});

test("unverified and suspended users cannot open a session", async ({ request, baseURL }) => {
  for (const index of [2, 3]) {
    const response = await request.post("/api/auth/sign-in/email", {
      headers: { Origin: baseURL! }, data: { email: emails[index], password },
    });
    expect(response.ok()).toBe(false);
    expect((await request.get("/api/account/export")).status()).toBe(401);
  }
});
