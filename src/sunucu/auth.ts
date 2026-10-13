import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { oneTap, twoFactor } from "better-auth/plugins";
import { db } from "./db";
import { account, session, twoFactor as twoFactorTablo, user, verification } from "./db/sema";

// Google girişi ve One Tap ("Ad Soyad olarak devam et") yalnız istemci kimliği tanımlıysa açılır.
const google =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }
    : null;

export const auth = betterAuth({
  appName: "FreehandCV",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification, twoFactor: twoFactorTablo },
  }),
  // Kayıtta yalnız e-posta ve şifre zorunlu; ad soyad isteğe bağlı (plan 1). E-posta doğrulaması
  // girişi engellemez (plan 13); doğrulama ve şifre sıfırlama e-postaları Resend kurulunca açılır.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
  },
  socialProviders: google ? { google: { ...google, prompt: "select_account" } } : {},
  account: {
    // E-postayla kayıtlı kişi aynı adresle Google'dan gelirse hesabına bağlanır (Google adresi doğrular).
    accountLinking: { enabled: true, trustedProviders: ["google"] },
  },
  user: {
    additionalFields: {
      // Kullanıcı adı ve tercihler hesap sayfasından değişir; kayıt formundan gelmez.
      kullaniciAdi: { type: "string", required: false, input: false },
      arayuzDili: { type: "string", required: false, input: false },
      pazar: { type: "string", required: false, input: false },
      rol: { type: "string", required: false, defaultValue: "kullanici", input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 gün
    updateAge: 60 * 60 * 24, // günde bir uzatılır
  },
  // Tek sunucu olduğu için bellekte tutulması yeterli. Giriş ve kayıt uçları daha sıkı (plan 13).
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
    // Server Action'larda oturum çerezini ayarlar; listenin sonunda kalmalı.
    nextCookies(),
  ],
});

export type Oturum = typeof auth.$Infer.Session;
export const googleAcik = !!google;
