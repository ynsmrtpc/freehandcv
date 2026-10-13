// Small shared pieces of the admin screens. To be replaced by shadcn/ui components in phase 1.
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui/Button";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-border bg-surface p-7 shadow-elevated">{children}</div>
      </div>
    </div>
  );
}

export function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...input } = props;
  return (
    <label className="mt-4 block text-sm font-semibold text-foreground">
      {label}
      <input
        {...input}
        className="mt-1.5 block h-11 w-full rounded-xl border border-border-strong bg-surface px-3.5 text-base font-normal text-foreground transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
    </label>
  );
}

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={buttonClass("primary", "md", "mt-6 w-full")}
    />
  );
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  return children ? (
    <p role="alert" className="mt-4 rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
      {children}
    </p>
  ) : null;
}
