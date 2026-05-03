const nodemailer = require('nodemailer');

/**
 * sendEmail — sends an email via Gmail SMTP.
 *
 * IMPORTANT: Email credentials must be set in .env:
 *   EMAIL_USER=your_gmail@gmail.com
 *   EMAIL_PASS=your_gmail_app_password   ← Gmail App Password (not your login password)
 *
 * How to get Gmail App Password:
 *   Google Account → Security → 2-Step Verification → App Passwords → Generate
 *
 * If credentials are missing or wrong, the function logs a warning and
 * resolves silently so the rest of the request still succeeds.
 */
const sendEmail = async ({ to, subject, html, attachments }) => {
  // Guard: skip silently if credentials are not configured
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS ||
    process.env.EMAIL_USER === 'your_gmail@gmail.com' ||
    process.env.EMAIL_PASS === 'your_gmail_app_password'
  ) {
    console.warn(`[Email] Skipped — credentials not configured. Subject: "${subject}"`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Hospital Management" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments: attachments || [],
    });

    console.log(`[Email] Sent to ${to} — "${subject}"`);
  } catch (err) {
    // Log the error but never throw — email failure should not break the API
    console.error(`[Email] Failed to send to ${to}: ${err.message}`);
  }
};

module.exports = sendEmail;
