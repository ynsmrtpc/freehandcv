import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { oneTap, twoFactor } from "better-auth/plugins";
import { db } from "./db";
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
  // Sign-up requires only email and password; full name is optional (plan 1). Email verification
  // does not block sign-in (plan 13); verification and password reset emails come once Resend is set up.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
  },
  socialProviders: google ? { google: { ...google, prompt: "select_account" } } : {},
  account: {
    // A user registered by email who arrives via Google with the same address is linked (Google verifies it).
    accountLinking: { enabled: true, trustedProviders: ["google"] },
  },
  user: {
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
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // extended once a day
  },
  // In-memory storage is enough on a single server. Sign-in and sign-up endpoints are stricter (plan 13).
  rateLimit: {
    enabled: true,
    customRules: {
      "/sign-in/email": { window: 60, max: 8 },
      "/sign-up/email": { window: 60, max: 5 },
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
