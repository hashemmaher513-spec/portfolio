import { Resend } from "resend";

export interface ContactNotificationParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendAdminNotification({
  name,
  email,
  subject,
  message,
}: ContactNotificationParams): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.ADMIN_SEED_EMAIL ||
    "hashemmaher2009@gmail.com";
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

  // If no API key or default placeholder, log to console in development
  if (!apiKey || apiKey.startsWith("re_123") || apiKey.trim() === "") {
    console.log("[Email Notification Mocked]");
    console.log(`To: ${adminEmail}`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Subject: New message: ${subject || "Contact Form"}`);
    console.log(`Body: ${message}`);
    return { success: true };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `[بورتفوليو] رسالة جديدة من: ${name}`,
      replyTo: email,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
            وصلتك رسالة جديدة من البورتفوليو!
          </h2>
          <p><strong>الاسم:</strong> ${name}</p>
          <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${email}" dir="ltr">${email}</a></p>
          <p><strong>الموضوع:</strong> ${subject || "استفسار تواصل"}</p>
          <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin-top: 15px; border-radius: 8px;">
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
            يمكنك الرد مباشرة على هذا الإيميل وسيصل ردك إلى العميل.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Resend delivery failed:", error.message);
    // Don't crash message submission if email service fails
    return { success: false, error: error.message };
  }
}
