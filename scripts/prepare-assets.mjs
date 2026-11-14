import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const worker = resolve(root, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
if (existsSync(worker)) copyFileSync(worker, resolve(root, "public/pdf.worker.min.mjs"));
