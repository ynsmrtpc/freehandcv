import { useTranslations } from "next-intl";

// Faz 1: hesapsız editör (localStorage) buraya gelir.
export default function CvOlustur() {
  const t = useTranslations("Uygulama");
  return <p className="p-8 text-soluk">{t("editorYakinda")}</p>;
}
