/**
 * Email sending service
 *
 * Supports:
 * - Resend (recommended, set RESEND_API_KEY in .env.local)
 * - Console fallback (development mode — logs email to console)
 *
 * To use Resend:
 * 1. Sign up at https://resend.com
 * 2. Get your API key
 * 3. Add to .env.local: RESEND_API_KEY=re_xxxxxxxxxxxxx
 * 4. Add: EMAIL_FROM=noreply@yourdomain.com
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html } = options;

  // Resend API
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "ShopVN <noreply@shopvn.vn>",
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[Email] Resend API error:", errorData);
        return {
          success: false,
          error: `Resend API error: ${response.status}`,
        };
      }

      const data = await response.json();
      console.log("[Email] Sent successfully via Resend:", data.id);
      return {
        success: true,
        messageId: data.id,
      };
    } catch (error) {
      console.error("[Email] Failed to send via Resend:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Fallback: Console log (development)
  console.log("═══════════════════════════════════════════");
  console.log("📧 EMAIL (Console Mode — no RESEND_API_KEY)");
  console.log("═══════════════════════════════════════════");
  console.log(`  To:      ${to}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  HTML:    ${html.length} characters`);
  console.log("═══════════════════════════════════════════");
  console.log("💡 Tip: Set RESEND_API_KEY in .env.local to send real emails");

  return {
    success: true,
    messageId: `console-${Date.now()}`,
  };
}
