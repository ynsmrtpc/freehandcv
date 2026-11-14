import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    // Second dev server on the test database (NEXT_DIST_DIR, see README)
    ".next-test/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated third-party PDF.js worker; lint our importer, not Mozilla's bundled distribution.
    "public/pdf.worker.min.mjs",
    // Claude Code worktrees (separate git worktree copies)
    ".claude/**",
  ]),
]);

export default eslintConfig;
