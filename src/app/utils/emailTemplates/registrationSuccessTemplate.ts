import sendEmail from "./nodemailerTransport";

export const registrationSuccessTemplate = async (
  userName: string,
  email: string,
): Promise<void> => {
  const subject = "Welcome to Akkord AI – You're All Set!";

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
                Welcome to Akkord AI, ${userName}!
              </p>

              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#4b5563;">
                Your email has been verified and your account is now active.
                Here's everything you can do from day one.
              </p>

              <!-- Success badge -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center" style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:24px 20px;">
                    <p style="margin:0 0 8px;font-size:28px;line-height:1;">✓</p>
                    <p style="margin:0 0 4px;font-size:16px;font-weight:600;color:#15803d;">Account successfully created</p>
                    <p style="margin:0;font-size:13px;color:#16a34a;">You're now part of the Akkord AI community</p>
                  </td>
                </tr>
              </table>

              <!-- Section label -->
              <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
                What you can do now
              </p>

              <!-- Feature: Workflow -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:8px;">
                <tr>
                  <td style="background-color:#f9fafb;border-radius:8px;padding:14px 16px;">
                    <p style="margin:0 0 3px;font-size:14px;font-weight:600;color:#111827;">⚡ Supercharge your workflow</p>
                    <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">AI-powered tools designed to save you time and effort every single day.</p>
                  </td>
                </tr>
              </table>

              <!-- Feature: Collaborate -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:8px;">
                <tr>
                  <td style="background-color:#f9fafb;border-radius:8px;padding:14px 16px;">
                    <p style="margin:0 0 3px;font-size:14px;font-weight:600;color:#111827;">🤝 Collaborate seamlessly</p>
                    <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">Invite your team, share insights, and work smarter together in one unified platform.</p>
                  </td>
                </tr>
              </table>

              <!-- Feature: Insights -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#f9fafb;border-radius:8px;padding:14px 16px;">
                    <p style="margin:0 0 3px;font-size:14px;font-weight:600;color:#111827;">📊 Gain actionable insights</p>
                    <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">Access real-time analytics and intelligent reports to drive data-backed decisions.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom:10px;">
                    <a href="https://akkordai.com/dashboard"
                       style="display:inline-block;background-color:#2250d9;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:7px;letter-spacing:0.2px;">
                      Go to your dashboard &rarr;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin:0;font-size:13px;color:#9ca3af;">No setup required. You're ready to go.</p>
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
                Need help getting started? Visit our
                <a href="https://akkordai.com/help" style="color:#2250d9;text-decoration:none;">Help Center</a>
                or reply to this email.
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