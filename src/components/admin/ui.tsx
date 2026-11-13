// Pieces of the admin sign-in and two-factor screens, which sit outside the admin shell.
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui/Button";
import { adminInputClass } from "./forms";

/** Centered single-column frame with the logo and an optional step line above the title. */
export function Card({ children, label, aside }: { children: React.ReactNode; label: string; aside?: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-2">
          <Logo />
          <span className="text-sm font-semibold text-muted">{label}</span>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">{children}</div>
        {aside && <div className="mt-4 text-[15px] text-muted">{aside}</div>}
      </div>
    </div>
  );
}

export function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const { label, hint, ...input } = props;
  return (
    <label className="mt-5 block text-[15px] font-semibold text-foreground">
      {label}
      <input {...input} className={`${adminInputClass} mt-1.5 font-normal`} />
      {hint && <span className="mt-1.5 block text-sm font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={buttonClass("primary", "md", "mt-6 w-full")} />;
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  return children ? (
    <p role="alert" className="mt-4 rounded-lg bg-danger-soft px-3 py-2 text-[15px] font-medium text-danger">
      {children}
    </p>
  ) : null;
}
