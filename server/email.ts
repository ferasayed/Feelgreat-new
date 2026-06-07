import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Feel Great Newsletter <newsletter@feelgreat.us.com>";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  tags?: { name: string; value: string }[];
  headers?: Record<string, string>;
}

export interface BatchEmailItem {
  to: string;
  subject: string;
  html: string;
  tags?: { name: string; value: string }[];
  headers?: Record<string, string>;
}

/**
 * Send a single email via Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ id: string; success: boolean }> {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      tags: options.tags,
      headers: options.headers,
    });

    if (result.error) {
      console.error("[Email] Send error:", result.error);
      return { id: "", success: false };
    }

    return { id: result.data?.id || "", success: true };
  } catch (error: any) {
    console.error("[Email] Exception:", error.message);
    return { id: "", success: false };
  }
}

/**
 * Send batch emails via Resend (up to 100 per batch)
 */
export async function sendBatchEmails(emails: BatchEmailItem[]): Promise<{ sent: number; failed: number; emailIds: { to: string; id: string }[] }> {
  let sent = 0;
  let failed = 0;
  const emailIds: { to: string; id: string }[] = [];

  // Resend batch API supports up to 100 emails per call
  const batchSize = 100;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    try {
      const result = await resend.batch.send(
        batch.map((email) => ({
          from: FROM_EMAIL,
          to: [email.to],
          subject: email.subject,
          html: email.html,
          tags: email.tags,
          headers: email.headers,
        }))
      );

      if (result.error) {
        console.error("[Email] Batch error:", result.error);
        failed += batch.length;
      } else {
        sent += batch.length;
        // Capture email IDs for tracking
        const ids = (result.data as any)?.data || [];
        for (let j = 0; j < batch.length; j++) {
          const emailId = ids[j]?.id || "";
          if (emailId) emailIds.push({ to: batch[j].to, id: emailId });
        }
      }
    } catch (error: any) {
      console.error("[Email] Batch exception:", error.message);
      failed += batch.length;
    }
  }

  return { sent, failed, emailIds };
}

/**
 * Generate newsletter HTML email template
 */
export function generateNewsletterHtml(options: {
  greeting: string;
  articlesSection: string;
  researchSection: string;
  unsubscribeUrl: string;
  unsubscribeLabel: string;
  lang: string;
}): string {
  const { greeting, articlesSection, researchSection, unsubscribeUrl, unsubscribeLabel, lang } = options;
  const isRtl = lang === "ar";
  const dir = isRtl ? "rtl" : "ltr";
  const fontFamily = isRtl
    ? "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
    : "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${greeting}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:${fontFamily};direction:${dir};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fa;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488,#0f766e);padding:32px 24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">FeelGreat.us.com</h1>
              <p style="color:#ccfbf1;margin:8px 0 0;font-size:14px;">Health Knowledge Platform</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <p style="font-size:16px;color:#1f2937;margin:0 0 24px;">${greeting}</p>
              ${articlesSection}
              ${researchSection}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:24px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;font-size:12px;color:#6b7280;">
                &copy; ${new Date().getFullYear()} FeelGreat.us.com
              </p>
              <a href="${unsubscribeUrl}" style="color:#6b7280;font-size:12px;text-decoration:underline;">${unsubscribeLabel}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!-- Tracking pixel placeholder - replaced by Resend automatically -->
</body>
</html>`;
}

/**
 * Generate article section HTML for newsletter
 */
export function generateArticleSectionHtml(articles: { title: string; url: string }[], sectionTitle: string): string {
  if (articles.length === 0) return "";
  const items = articles
    .map(
      (a) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
          <a href="${a.url}" style="color:#0d9488;text-decoration:none;font-size:15px;font-weight:500;">${a.title}</a>
        </td></tr>`
    )
    .join("");

  return `<div style="margin-bottom:24px;">
    <h2 style="font-size:18px;color:#1f2937;margin:0 0 12px;padding-bottom:8px;border-bottom:2px solid #0d9488;">📰 ${sectionTitle}</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
  </div>`;
}

/**
 * Generate research section HTML for newsletter
 */
export function generateResearchSectionHtml(studies: { title: string; url: string }[], sectionTitle: string): string {
  if (studies.length === 0) return "";
  const items = studies
    .map(
      (s) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
          <a href="${s.url}" style="color:#0d9488;text-decoration:none;font-size:15px;font-weight:500;">${s.title}</a>
        </td></tr>`
    )
    .join("");

  return `<div style="margin-bottom:24px;">
    <h2 style="font-size:18px;color:#1f2937;margin:0 0 12px;padding-bottom:8px;border-bottom:2px solid #0d9488;">🔬 ${sectionTitle}</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
  </div>`;
}
