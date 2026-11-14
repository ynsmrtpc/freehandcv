import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, cpSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

// Public checkouts build without any proprietary code or external account.
const root = resolve(import.meta.dirname, "..");
const directory = resolve(root, "src/extensions");
const extension = resolve(root, ".private/company");
const enabled = process.env.PRIVATE_EXTENSIONS !== "0" && existsSync(resolve(extension, "extension.json"));
mkdirSync(directory, { recursive: true });
const put = (name, source) => {
  const target = resolve(directory, `generated-${name}`);
  if (!existsSync(target) || readFileSync(target, "utf8") !== source) writeFileSync(target, source);
};
put("client.tsx", enabled
  ? 'export { UserCreationOptions, ExtensionMenu } from "@private/company/components/integration";\n'
  : 'import type { ReactNode } from "react";\nexport function UserCreationOptions({children}: {children: ReactNode}) {return children;}\nexport function ExtensionMenu() {return null;}\n');
put("server.tsx", enabled
  ? 'export { UserDetailsExtension, extensionLandingPath } from "@private/company/server/integration";\n'
  : 'export function UserDetailsExtension(_props: {userId: string}) {void _props; return null;}\nexport async function extensionLandingPath(_userId: string, _locale: string): Promise<string | null> {void _userId; void _locale; return null;}\n');
put("maintenance.ts", enabled ? 'export {runExtensionMaintenance} from "@private/company/server/maintenance";\n' : 'export async function runExtensionMaintenance() {}\n');
put("data.ts", enabled
  ? 'export {getExtensionAccountData, closeExtensionData} from "@private/company/server/data";\n'
  : 'import type {ExtensionTransaction} from "./contracts";\nexport async function getExtensionAccountData(_id: string, _resumeIds: string[]) {void _id; void _resumeIds; return null;}\nexport async function closeExtensionData(_tx: ExtensionTransaction, _id: string) {void _tx; void _id;}\n');
put("routing.ts", enabled
  ? 'export { extensionPathnames } from "@private/company/routing";\n'
  : 'export const extensionPathnames = {};\n');
put("messages.ts", enabled
  ? 'import tr from "@private/company/messages/tr/Company.json";\nimport en from "@private/company/messages/en/Company.json";\nexport const extensionMessages = {tr: {Company: tr}, en: {Company: en}};\n'
  : 'export const extensionMessages = {tr: {}, en: {}};\n');
for (const [source, target] of [["routes/locale", "src/app/[locale]/(private-extension)"], ["routes/api", "src/app/api/(private-extension)"], ["e2e", "e2e/(private-extension)"]]) {
  const destination = resolve(root, target);
  rmSync(destination, { recursive: true, force: true });
  if (enabled && existsSync(resolve(extension, source))) cpSync(resolve(extension, source), destination, { recursive: true });
}
const command = process.argv[2];
if (enabled && command === "test") {
  const result = spawnSync("bun", ["x", "vitest", "run", "--config", resolve(extension, "vitest.config.mts")], { cwd: root, stdio: "inherit", env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
if (enabled && (command === "generate" || command === "migrate")) {
  const result = spawnSync("bun", ["x", "drizzle-kit", command, "--config", resolve(extension, "drizzle.config.ts")], { cwd: root, stdio: "inherit", env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
