// Creates the first admin account (sign-up is closed in phase 0).
// Usage: pnpm admin:create <email> <password> ["Full Name"]
import "dotenv/config";
import { eq } from "drizzle-orm";
import { auth } from "../src/server/auth";
import { db } from "../src/server/db";
import { user } from "../src/server/db/schema";

const [email, password, name = ""] = process.argv.slice(2);
if (!email || !password) {
  console.error(
    'Usage: pnpm admin:create <email> <password> ["Full Name"]',
  );
  process.exit(1);
}

async function main() {
  const ctx = await auth.$context;
  const existing = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (existing) {
    await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.id, existing.id));
    console.log(`${email} already existed; role set to admin.`);
  } else {
    if (password.length < 10) {
      console.error("The password must be at least 10 characters.");
      process.exit(1);
    }
    const created = await ctx.internalAdapter.createUser(
      {
        email: email.toLowerCase(),
        name,
        emailVerified: true,
        role: "admin",
      },
      { method: "admin" },
    );
    await ctx.internalAdapter.linkAccount({
      userId: created.id,
      providerId: "credential",
      accountId: created.id,
      password: await ctx.password.hash(password),
    });
    console.log(
      `Admin created: ${email}. Set up two-factor authentication on first sign-in.`,
    );
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
