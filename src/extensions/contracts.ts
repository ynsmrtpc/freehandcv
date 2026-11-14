import type { Db } from "@/server/db";
export type ExtensionTransaction = Parameters<Parameters<Db["transaction"]>[0]>[0];
