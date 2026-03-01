const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, attachments }) => {
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
};

module.exports = sendEmail;
