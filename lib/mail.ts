import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true, // Use SSL for port 465
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  // Add these timeouts to prevent infinite hanging
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const wrappedHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #2563eb;">Assan Ecommerce</h2>
      </div>
      <div style="color: #333; line-height: 1.6;">
        ${html}
      </div>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #888;">
        &copy; ${new Date().getFullYear()} ${process.env.MAIL_FROM_NAME}. All rights reserved.
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      html: wrappedHtml,
    });
    console.log("✅ Email sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    // Don't throw error to prevent crashing the registration flow
    return { success: false, error };
  }
}
