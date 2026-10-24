import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  // A second dev server (end-to-end runs on the test database) needs its own build folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Server PDF (src/server/pdf.ts) drives a browser; the package is loaded from node_modules, not bundled.
  serverExternalPackages: ["playwright-core"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default createNextIntlPlugin()(nextConfig);
