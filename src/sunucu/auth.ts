import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { db } from "./db";
import { account, session, twoFactor as twoFactorTablo, user, verification } from "./db/sema";

export const auth = betterAuth({
  appName: "FreehandCV",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification, twoFactor: twoFactorTablo },
  }),
  emailAndPassword: {
    enabled: true,
    // Faz 0: yalnız yönetici girişi. Hesaplar `pnpm yonetici:olustur` ile açılır.
    // Faz 2'de kullanıcı kaydı açılınca kaldırılır.
    disableSignUp: true,
    minPasswordLength: 10,
  },
  user: {
    additionalFields: {
      kullaniciAdi: { type: "string", required: false },
      arayuzDili: { type: "string", required: false },
      pazar: { type: "string", required: false },
      rol: { type: "string", required: false, defaultValue: "kullanici", input: false },
    },
  },
  // Tek sunucu olduğu için bellekte tutulması yeterli.
  rateLimit: { enabled: true },
  plugins: [
    twoFactor({ issuer: "FreehandCV" }),
    // Server Action'larda oturum çerezini ayarlar; listenin sonunda kalmalı.
    nextCookies(),
  ],
});

export type Oturum = typeof auth.$Infer.Session;
