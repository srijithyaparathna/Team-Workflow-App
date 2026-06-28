// configures and sends emails using nodemailer
import { transporter } from '../config/mailer.js';
// Import the env configuration and email templates
import { env } from '../config/env.js';
import { otpEmailTemplate, passwordResetEmailTemplate } from '../templates/emailTemplates.js';

// Function to send an OTP email to a user
export const sendOtpEmail = async (user, otp) => {
  await transporter.sendMail({
    from: env.emailFrom,
    to: user.email,
    subject: `Your Team Workflow App verification code: ${otp}`,
    html: otpEmailTemplate(user.name, otp),
  });
};

// Function to send a password reset email to a user
export const sendPasswordReset = async (user, resetUrl) => {
  await transporter.sendMail({
    from: env.emailFrom,
    to: user.email,
    subject: 'Reset your Team Workflow App password',
    html: passwordResetEmailTemplate(user.name, resetUrl),
  });
};
