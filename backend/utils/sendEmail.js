import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

/**
 * Sends an email using nodemailer.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {Object} content - Email content with optional html and text.
 * @param {string} [content.text] - Plain text content.
 * @param {string} [content.html] - HTML content.
 * @returns {Promise<void>}
 */
export default async function sendEmail(to, subject, content) {
  try {
    const USER = process.env.SMTP_USER?.trim();
    const PASS = process.env.SMTP_PASS?.trim();
    if (!USER || !PASS) {
      throw new Error("SMTP_USER or SMTP_PASS is not defined in environment variables");
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or replace with custom SMTP config
      auth: {
        user: USER,
        pass: PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Lavani Wellness" <${USER}>`,
      to,
      subject,
      text: content.text,   // plain-text fallback
      html: content.html    // HTML content
    });

    console.log(`✅ Email sent successfully to ${to}, Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
}
