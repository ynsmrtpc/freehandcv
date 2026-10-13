// Yönetim ekranlarının küçük ortak parçaları. Faz 1'de shadcn/ui bileşenleriyle değişir.
import { Logo } from "@/bilesenler/site/Logo";
import { butonSinifi } from "@/bilesenler/ui/Buton";

export function Kart({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-cizgi bg-yuzey p-7 shadow-yuksek">{children}</div>
      </div>
    </div>
  );
}

export function Alan(props: React.InputHTMLAttributes<HTMLInputElement> & { etiket: string }) {
  const { etiket, ...girdi } = props;
  return (
    <label className="mt-4 block text-sm font-semibold text-metin">
      {etiket}
      <input
        {...girdi}
        className="mt-1.5 block h-11 w-full rounded-xl border border-cizgi-guclu bg-yuzey px-3.5 text-base font-normal text-metin transition-[border-color,box-shadow] outline-none focus:border-ana focus:ring-4 focus:ring-ana/15"
      />
    </label>
  );
}

export function Buton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={butonSinifi("ana", "orta", "mt-6 w-full")}
    />
  );
}

export function Hata({ children }: { children: React.ReactNode }) {
  return children ? (
    <p role="alert" className="mt-4 rounded-lg bg-hata-acik px-3 py-2 text-sm font-medium text-hata">
      {children}
    </p>
  ) : null;
}
