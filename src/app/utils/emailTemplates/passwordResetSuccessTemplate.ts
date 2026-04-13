import sendEmail from "./nodemailerTransport";

export const passwordResetSuccessTemplate = async (
  userName: string,
  subject: string,
  email: string,
  loginLink: string,
): Promise<void> => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f0f2f5;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table role="presentation" width="100%" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e6ea;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:36px 40px 28px;border-bottom:1px solid #f0f2f5;">
              <img src="https://imglink.cc/cdn/Ow8ExrW8jK.png" alt="Akkord AI" width="110" style="display:block;height:auto;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">

              <p style="margin:0 0 8px;font-size:20px;font-weight:600;color:#111827;">
                Password reset successful
              </p>

              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#4b5563;">
                Hi ${userName}, your <strong style="color:#111827;">Akkord AI</strong> password
                has been reset. You can now sign in with your new credentials.
              </p>

              <!-- Success badge -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center" style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:24px 20px;">
                    <p style="margin:0 0 8px;font-size:28px;line-height:1;">✓</p>
                    <p style="margin:0 0 4px;font-size:16px;font-weight:600;color:#15803d;">Password reset successfully</p>
                    <p style="margin:0;font-size:13px;color:#16a34a;">Your account is secured with your new password</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <a href="${loginLink}"
                       style="display:inline-block;background-color:#10b981;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:7px;letter-spacing:0.2px;">
                      Log in to your account &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Warning callout -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#fffbeb;border-left:3px solid #f59e0b;border-radius:4px;padding:14px 16px;">
                    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#92400e;">Wasn't you?</p>
                    <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                      If you did not perform this action, please contact our support team
                      immediately to secure your account.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #f0f2f5;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">
                Sent by <strong style="color:#374151;">Akkord AI</strong>
                &mdash; this is an automated security notification.
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; ${new Date().getFullYear()} Akkord AI. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;

  await sendEmail(email, subject, html);
};