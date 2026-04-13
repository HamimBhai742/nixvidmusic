import sendEmail from "./nodemailerTransport";

export const registrationOtpTemplate = async (
  userName: string,
  subject: string,
  email: string,
  otp: string,
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
                Verify your email address
              </p>

              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#4b5563;">
                Hi ${userName}, welcome to <strong style="color:#111827;">Akkord AI</strong>. 
                Use the code below to complete your registration. 
                It is valid for <strong style="color:#111827;">2 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color:#f5f7ff;border:1px dashed #c7d2fe;border-radius:10px;padding:28px 20px;">
                    <p style="margin:0 0 10px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
                      One-time verification code
                    </p>
                    <p style="margin:0;font-size:40px;font-weight:700;letter-spacing:10px;color:#2250d9;font-family:'Courier New',Courier,monospace;">
                      ${otp}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;">
                <tr>
                  <td style="background-color:#fffbeb;border-left:3px solid #f59e0b;border-radius:4px;padding:12px 16px;">
                    <p style="margin:0;font-size:13px;line-height:1.6;color:#92400e;">
                      If you did not create an account with Akkord AI, please disregard this email. 
                      Your address will not be registered.
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
                Sent by <strong style="color:#374151;">Akkord AI</strong> &mdash; you're receiving this because you signed up.
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