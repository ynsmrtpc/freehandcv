// Creates an admin account or promotes an existing account without changing its password.
// Usage: bun run admin:create <email> <password> ["Full Name"]
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../src/server/db";
import { account, user } from "../src/server/db/schema";

const [rawEmail, password, name = ""] = process.argv.slice(2);
if (!rawEmail || !password) {
  console.error(
    'Usage: bun run admin:create <email> <password> ["Full Name"]',
  );
  process.exit(1);
}

const email = rawEmail.trim().toLowerCase();
if (!z.email().safeParse(email).success) {
  console.error("Enter a valid email address.");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Configure it in .env before running this command.");
  process.exit(1);
}

async function main() {
  const existing = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (existing) {
    await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.id, existing.id));
    console.log(`${email} already existed; role set to admin. Its password is unchanged.`);
  } else {
    if (password.length < 10 || password.length > 128) {
      console.error("The password must be between 10 and 128 characters.");
      process.exit(1);
    }
    // Use the same password format as Better Auth, without importing the Next.js auth instance.
    const hashedPassword = await hashPassword(password);
    const id = randomUUID();
    // A failed credential insert must not leave behind a user that cannot sign in.
    await db.transaction(async (tx) => {
      await tx.insert(user).values({ id, email, name: name.trim(), emailVerified: true, role: "admin" });
      await tx.insert(account).values({
        id: randomUUID(),
        userId: id,
        providerId: "credential",
        accountId: id,
        password: hashedPassword,
      });
    });
    console.log(
      `Admin created: ${email}. Set up two-factor authentication on first sign-in.`,
    );
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    const code = error?.cause?.code ?? error?.code;
    if (code === "42P01" || code === "42703") {
      console.error("The database schema is not up to date. Run bun run db:migrate first.");
    } else if (code === "ECONNREFUSED" || error?.cause?.errors?.some((e: { code?: string }) => e.code === "ECONNREFUSED")) {
      console.error("Could not connect to PostgreSQL. Check DATABASE_URL and start the database.");
    } else {
      console.error(`Could not create the admin account${code ? ` (${code})` : ""}. Check the database configuration.`);
    }
    process.exit(1);
  },
);
