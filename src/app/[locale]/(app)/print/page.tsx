import type { Metadata } from "next";
import { PrintView } from "./PrintView";

export const metadata: Metadata = { title: "PDF" };

// Rendered by the server's headless browser for the PDF download (src/server/pdf.ts); the resume
// arrives through a script the browser injects, never through the URL.
export default function PrintPage() {
  return <PrintView />;
}
