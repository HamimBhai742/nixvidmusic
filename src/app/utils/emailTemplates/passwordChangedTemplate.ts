import sendEmail from "./nodemailerTransport";

export const passwordChangedTemplate = async (
  userName: string,
  subject: string,
  email: string,
  secureLink: string,
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
                Your password was changed
              </p>

              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#4b5563;">
                Hi ${userName}, this is a confirmation that your
                <strong style="color:#111827;">Akkord AI</strong> account password
                was successfully updated.
              </p>

              <!-- Confirmation badge -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background-color:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;padding:16px 18px;">
                    <p style="margin:0 0 3px;font-size:14px;font-weight:600;color:#5b21b6;">
                      🔒 Password updated successfully
                    </p>
                    <p style="margin:0;font-size:13px;color:#7c3aed;line-height:1.6;">
                      If you made this change, no further action is required.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warning callout -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#fffbeb;border-left:3px solid #f59e0b;border-radius:4px;padding:12px 16px;">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:600;color:#92400e;">Wasn't you?</p>
                    <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                      If you did <strong>not</strong> change your password, your account may be at risk.
                      Secure it immediately using the button below.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${secureLink}"
                       style="display:inline-block;background-color:#7c3aed;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:7px;letter-spacing:0.2px;">
                      Secure my account &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security tip -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color:#f9fafb;border-radius:8px;padding:14px 16px;">
                    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
                      💡 <strong style="color:#374151;">Security tip:</strong>
                      Enable two-factor authentication to add an extra layer of protection to your account.
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