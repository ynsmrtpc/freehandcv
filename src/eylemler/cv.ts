"use server";

// Hesaptaki CV'ler için Server Action'lar. Kullanıcı kimliği her zaman oturumdan okunur;
// istemciden gelen kimliğe güvenilmez (plan 5, 13).
import { z } from "zod";
import {
  cvCogalt,
  cvKaydet,
  cvOlustur,
  cvSil,
  CvBulunamadi,
  CvCakismasi,
  CvCokBuyuk,
  CvSiniri,
} from "@/sunucu/cvler";
import { oturumGetir } from "@/sunucu/yetki";

export type CvSonucu<T = object> =
  | ({ tamam: true } & T)
  | { tamam: false; neden: "oturum" | "bulunamadi" | "cakisma" | "buyuk" | "sinir" | "hata"; sunucuSurumu?: number };

const kimlik = z.uuid();

async function kullanici() {
  const o = await oturumGetir();
  return o?.user.id ?? null;
}

function hata(e: unknown): CvSonucu<never> {
  if (e instanceof CvBulunamadi || e instanceof z.ZodError) return { tamam: false, neden: "bulunamadi" };
  if (e instanceof CvCakismasi) return { tamam: false, neden: "cakisma", sunucuSurumu: e.sunucuSurumu };
  if (e instanceof CvCokBuyuk) return { tamam: false, neden: "buyuk" };
  if (e instanceof CvSiniri) return { tamam: false, neden: "sinir" };
  console.error(e);
  return { tamam: false, neden: "hata" };
}

export async function cvOlusturEylemi(veri: unknown): Promise<CvSonucu<{ id: string }>> {
  const k = await kullanici();
  if (!k) return { tamam: false, neden: "oturum" };
  try {
    return { tamam: true, id: await cvOlustur(k, veri) };
  } catch (e) {
    return hata(e);
  }
}

export async function cvKaydetEylemi(id: string, veri: unknown, surum: number): Promise<CvSonucu<{ surum: number }>> {
  const k = await kullanici();
  if (!k) return { tamam: false, neden: "oturum" };
  try {
    return { tamam: true, surum: await cvKaydet(kimlik.parse(id), k, veri, z.int().min(0).parse(surum)) };
  } catch (e) {
    return hata(e);
  }
}

export async function cvCogaltEylemi(id: string): Promise<CvSonucu<{ id: string }>> {
  const k = await kullanici();
  if (!k) return { tamam: false, neden: "oturum" };
  try {
    return { tamam: true, id: await cvCogalt(kimlik.parse(id), k) };
  } catch (e) {
    return hata(e);
  }
}

export async function cvSilEylemi(id: string): Promise<CvSonucu> {
  const k = await kullanici();
  if (!k) return { tamam: false, neden: "oturum" };
  try {
    await cvSil(kimlik.parse(id), k);
    return { tamam: true };
  } catch (e) {
    return hata(e);
  }
}
