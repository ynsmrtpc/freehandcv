// İlk yönetici hesabını açar (Faz 0'da kayıt kapalı).
// Kullanım: pnpm yonetici:olustur <e-posta> <şifre> ["Ad Soyad"]
import "dotenv/config";
import { eq } from "drizzle-orm";
import { auth } from "../src/sunucu/auth";
import { db } from "../src/sunucu/db";
import { user } from "../src/sunucu/db/sema";

const [eposta, sifre, ad = ""] = process.argv.slice(2);
if (!eposta || !sifre) {
  console.error(
    'Kullanım: pnpm yonetici:olustur <e-posta> <şifre> ["Ad Soyad"]',
  );
  process.exit(1);
}

async function main() {
  const ctx = await auth.$context;
  const mevcut = await db.query.user.findFirst({
    where: eq(user.email, eposta),
  });

  if (mevcut) {
    await db
      .update(user)
      .set({ rol: "yonetici" })
      .where(eq(user.id, mevcut.id));
    console.log(`${eposta} zaten vardı; rolü yönetici yapıldı.`);
  } else {
    if (sifre.length < 10) {
      console.error("Şifre en az 10 karakter olmalı.");
      process.exit(1);
    }
    const yeni = await ctx.internalAdapter.createUser(
      {
        email: eposta.toLowerCase(),
        name: ad,
        emailVerified: true,
        rol: "yonetici",
      },
      { method: "admin" },
    );
    await ctx.internalAdapter.linkAccount({
      userId: yeni.id,
      providerId: "credential",
      accountId: yeni.id,
      password: await ctx.password.hash(sifre),
    });
    console.log(
      `Yönetici oluşturuldu: ${eposta}. İlk girişte iki adımlı doğrulamayı kurun.`,
    );
  }
}

main().then(
  () => process.exit(0),
  (hata) => {
    console.error(hata);
    process.exit(1);
  },
);
