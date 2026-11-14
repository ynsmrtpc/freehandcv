import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)), "@private": fileURLToPath(new URL("./.private", import.meta.url)) } },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    // Resolve Next's extensionless entrypoints in next-intl through Vite, as Next does.
    server: { deps: { inline: ["next-intl"] } },
  },
});
