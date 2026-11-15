"use client";

import { useState } from "react";
import { FolderGit2, ContactRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/client/auth";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buttonClass } from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";

export type AccountConnection = {
  provider: "github" | "linkedin";
  enabled: boolean;
  connected: boolean;
};
export function ConnectedAccountRows({
  connections,
  hasPassword,
}: {
  connections: AccountConnection[];
  hasPassword: boolean;
}) {
  const t = useTranslations("Account"),
    locale = useLocale() as Locale,
    confirm = useConfirm();
  const [rows, setRows] = useState(connections),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  return (
    <>
      {rows.map((row) => (
        <li
          key={row.provider}
          className="flex flex-wrap items-center gap-3 py-4"
        >
          {row.provider === "github" ? (
            <FolderGit2 className="size-5 shrink-0" aria-hidden />
          ) : (
            <ContactRound className="size-5 shrink-0" aria-hidden />
          )}
          <div className="min-w-0 flex-1 basis-32">
            <p className="text-[15px] font-medium">
              {row.provider === "github" ? "GitHub" : "LinkedIn"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {t(`methods.${row.provider}Hint`)}
            </p>
          </div>
          <span
            className={`text-sm font-semibold ${row.connected ? "text-accent" : "text-muted"}`}
          >
            {t(
              row.connected
                ? "methods.connected"
                : row.enabled
                  ? "methods.off"
                  : "methods.unavailable",
            )}
          </span>
          <button
            type="button"
            disabled={pending || (!row.connected && !row.enabled)}
            className={buttonClass(row.connected ? "ghost" : "secondary", "sm")}
            onClick={async () => {
              setError("");
              if (row.connected && !hasPassword) {
                setError(t("methods.disconnectNeedsPassword"));
                return;
              }
              if (
                row.connected &&
                !(await confirm(
                  t("methods.disconnectProviderConfirm", {
                    provider: row.provider === "github" ? "GitHub" : "LinkedIn",
                  }),
                ))
              )
                return;
              setPending(true);
              try {
                if (row.connected) {
                  const accounts = await authClient.listAccounts();
                  const account = accounts.data?.find(
                    (item) => item.providerId === row.provider,
                  );
                  if (!account) throw new Error();
                  const result = await authClient.unlinkAccount({
                    accountId: account.accountId,
                  });
                  if (result.error) throw new Error();
                  setRows((previous) =>
                    previous.map((item) =>
                      item.provider === row.provider
                        ? { ...item, connected: false }
                        : item,
                    ),
                  );
                } else {
                  const result = await authClient.linkSocial({
                    provider: row.provider,
                    callbackURL: getPathname({ href: "/account", locale }),
                  });
                  if (result.error) throw new Error();
                }
              } catch {
                setError(t("error"));
              } finally {
                setPending(false);
              }
            }}
          >
            {t(
              row.connected
                ? "methods.disconnect"
                : row.provider === "github"
                  ? "methods.connectGithub"
                  : "methods.connectLinkedin",
            )}
          </button>
          {row.connected && row.provider === "github" && (
            <Link href="/resume-import" className={buttonClass("ghost", "sm")}>
              {t("methods.importProjects")}
            </Link>
          )}
        </li>
      ))}
      {error && (
        <li role="alert" className="py-3 text-sm text-danger">
          {error}
        </li>
      )}
    </>
  );
}
