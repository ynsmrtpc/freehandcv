import "server-only";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { oneTap, twoFactor } from "better-auth/plugins";
import { db } from "./db";
import { setSharing } from "./consents";
import { hasLocale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  RESET_TOKEN_EXPIRES_IN_SECONDS,
  sendChangeEmailConfirmation,
  sendExistingAccountEmail,
  sendNewEmailVerification,
  sendPasswordResetEmail,
  sendVerificationEmail,
  VERIFY_TOKEN_EXPIRES_IN_SECONDS,
} from "./authEmails";
import { account, session, twoFactor as twoFactorTable, user, verification } from "./db/schema";

// Google sign-in and One Tap ("Continue as Full Name") are enabled only when a client id is set.
const google =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }
    : null;

export const auth = betterAuth({
  appName: "FreehandCV",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification, twoFactor: twoFactorTable },
  }),
  // Sign-up requires only email and password; full name is optional (plan 1). The address must be
  // verified before the first session (decided 13 Nov 2026, replacing plan 13's "does not block").
  // Emails go out through Resend (src/server/email.ts); without RESEND_API_KEY the links are printed
  // to the dev console.
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // Sign-up with a taken address answers like a new sign-up (no account enumeration); the owner
    // gets an email instead. Not awaited, for the same timing reason as the reset email.
    onExistingUserSignUp: async ({ user }) => {
      const ui = (user as { uiLocale?: unknown }).uiLocale;
      const locale = typeof ui === "string" && hasLocale(routing.locales, ui) ? ui : routing.defaultLocale;
      const site = process.env.BETTER_AUTH_URL ?? "";
      void sendExistingAccountEmail({
        user,
        signInUrl: site + getPathname({ href: "/sign-in", locale }),
        resetUrl: site + getPathname({ href: "/reset-password", locale }),
      }).catch((error) => console.error("[auth] existing-account email failed", error));
    },
    minPasswordLength: 10,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: RESET_TOKEN_EXPIRES_IN_SECONDS,
    // Not awaited: the response takes the same time whether or not the account exists
    // (no account enumeration through timing). sendEmail itself never throws.
    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail({ user, url }).catch((error) => console.error("[auth] reset email failed", error));
    },
    // Someone resetting may have lost control of the account: sign out every device.
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    // An unverified sign-in attempt sends a fresh link (an expired one is the common case).
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: VERIFY_TOKEN_EXPIRES_IN_SECONDS,
    // The same hook verifies a new account and a new address during an email change; the change is
    // recognised by the address differing from the one stored for the account.
    sendVerificationEmail: async ({ user: u, url }) => {
      const [stored] = await db.select({ email: user.email }).from(user).where(eq(user.id, u.id));
      const send = stored && stored.email !== u.email ? sendNewEmailVerification : sendVerificationEmail;
      void send({ user: u, url }).catch((error) => console.error("[auth] verification email failed", error));
    },
  },
  socialProviders: google ? { google: { ...google, prompt: "select_account" } } : {},
  account: {
    // A user registered by email who arrives via Google with the same address is linked (Google verifies it).
    accountLinking: { enabled: true, trustedProviders: ["google"] },
  },
  user: {
    // Two steps: the current address approves, then the new address is verified; only then it changes.
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user: u, newEmail, url }) => {
        void sendChangeEmailConfirmation({ user: u, newEmail, url }).catch((error) => console.error("[auth] change-email confirmation failed", error));
      },
    },
    additionalFields: {
      // Username and preferences change on the account page; they never come from the sign-up form.
      username: { type: "string", required: false, input: false },
      uiLocale: { type: "string", required: false, input: false },
      market: { type: "string", required: false, input: false },
      role: { type: "string", required: false, defaultValue: "user", input: false },
      // Employer sharing changes only through setSharing, which records the consent.
      employerSharing: { type: "boolean", required: false, defaultValue: false, input: false },
      sharedResumeId: { type: "string", required: false, input: false },
    },
  },
  // A suspended account cannot open a session by any sign-in method (email, Google, One Tap).
  databaseHooks: {
    user: {
      create: {
        // Employer sharing ticked on the sign-up form (sent as `onay=1` in the verification callback,
        // the one sign-up field Better Auth carries). Recorded with the account, before verification,
        // so a later verification link without the flag cannot lose it.
        after: async (created, ctx) => {
          const callback = ctx?.path === "/sign-up/email" ? (ctx.body as { callbackURL?: unknown } | undefined)?.callbackURL : undefined;
          if (typeof callback === "string" && new URL(callback, "http://x").searchParams.get("onay") === "1")
            await setSharing(created.id, true, null, "sign_up");
        },
      },
    },
    session: {
      create: {
        before: async (s) => {
          const [u] = await db.select({ banned: user.banned }).from(user).where(eq(user.id, s.userId));
          if (u?.banned) throw new APIError("FORBIDDEN", { message: "Account suspended", code: "ACCOUNT_SUSPENDED" });
        },
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // extended once a day
  },
  // In-memory storage is enough on a single server. Sign-in, sign-up and password reset endpoints
  // are stricter (plan 13).
  rateLimit: {
    enabled: true,
    customRules: {
      "/sign-in/email": { window: 60, max: 8 },
      "/sign-up/email": { window: 60, max: 5 },
      // Matches Better Auth's built-in rule, written out to keep it visible: 3 reset emails a minute per IP.
      "/request-password-reset": { window: 60, max: 3 },
      "/reset-password": { window: 60, max: 5 },
      "/send-verification-email": { window: 60, max: 3 },
      "/change-email": { window: 60, max: 3 },
    },
  },
  plugins: [
    twoFactor({ issuer: "FreehandCV" }),
    ...(google ? [oneTap()] : []),
    // Sets the session cookie in Server Actions; must stay last.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export const googleEnabled = !!google;
