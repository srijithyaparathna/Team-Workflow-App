export const otpEmailTemplate = (name, otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your verification code</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="background:#1a56db;padding:32px 40px;text-align:center;">
            <span style="color:#ffffff;font-size:22px;font-weight:700;">Team Workflow App</span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">
              Verify your email
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
              Hi <strong style="color:#111827;">${name}</strong>,<br/>
              Use the verification code below to activate your Team Workflow App account.
            </p>

            <div style="text-align:center;margin:8px 0 28px;">
              <div style="display:inline-block;background:#f1f5f9;border:1px dashed #94a3b8;
                          border-radius:10px;padding:18px 32px;">
                <span style="font-size:34px;font-weight:700;letter-spacing:10px;color:#1a56db;">
                  ${otp}
                </span>
              </div>
            </div>

            <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
              This code expires in <strong style="color:#6b7280;">10 minutes</strong>.
              If you did not create a Team Workflow App account, you can ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #f3f4f6;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              (c) ${new Date().getFullYear()} Team Workflow App. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

export const passwordResetEmailTemplate = (name, resetUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="background:#1a56db;padding:32px 40px;text-align:center;">
            <span style="color:#ffffff;font-size:22px;font-weight:700;">Team Workflow App</span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">
              Reset your password
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
              Hi <strong style="color:#111827;">${name}</strong>,<br/>
              Click the button below to reset your password. This link expires in 30 minutes.
            </p>
            <div style="text-align:center;margin:8px 0 28px;">
              <a href="${resetUrl}"
                style="background:#1a56db;color:#ffffff;text-decoration:none;
                       padding:14px 32px;border-radius:8px;font-weight:700;display:inline-block;">
                Reset Password
              </a>
            </div>
            <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
              If you did not request a password reset, you can ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #f3f4f6;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              (c) ${new Date().getFullYear()} Team Workflow App. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;
