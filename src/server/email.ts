import "server-only";

export type EmailMessage = { to: string; subject: string; text: string; html: string };

/**
 * Sends an email through the Resend HTTP API (plan: Resend for verification and password reset).
 * Without RESEND_API_KEY and EMAIL_FROM the message is not sent: in development it is printed to the
 * server console (links included) so the flow can be tested; in production a warning is logged.
 * Never throws, so a mail failure cannot break the request that triggered it.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      console.warn(`[email] RESEND_API_KEY or EMAIL_FROM is not set; email "${message.subject}" was not sent.`);
    } else {
      console.info(`[email] (not sent, no RESEND_API_KEY) to: ${message.to}\nsubject: ${message.subject}\n\n${message.text}\n`);
    }
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text, html: message.html }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(`[email] Resend responded ${response.status}: ${await response.text().catch(() => "")}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] Resend request failed", error);
    return false;
  }
}

/** Escapes text for use inside the HTML body. */
export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
