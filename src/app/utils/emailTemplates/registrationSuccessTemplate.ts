import sendEmail from "./nodemailerTransport";

export const registrationSuccessTemplate = async (
  userName: string,
  email: string,
) => {
  const subject = "Welcome to Akkord AI – You're All Set!";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Successful</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
    .email-header { padding: 40px 40px 20px; text-align: center; }
    .company-logo img { width: 120px; height: auto; }
    .email-content { padding: 0 40px 30px; }
    .greeting { font-size: 16px; color: #2c3e50; margin-bottom: 16px; font-weight: 500; }
    .main-text { font-size: 16px; color: #5a6c7d; line-height: 1.6; margin-bottom: 16px; }
    .success-banner { text-align: center; padding: 28px 20px; background: linear-gradient(135deg, #e8f4fd 0%, #eaf6ec 100%); border-radius: 8px; margin: 24px 0; border: 1px solid #d4edda; }
    .success-icon { font-size: 48px; margin-bottom: 12px; }
    .success-title { font-size: 20px; font-weight: 700; color: #1a7f4b; margin-bottom: 6px; }
    .success-subtitle { font-size: 14px; color: #5a6c7d; }
    .divider { border: none; border-top: 1px solid #ecf0f1; margin: 24px 0; }
    .features-title { font-size: 15px; font-weight: 600; color: #2c3e50; margin-bottom: 16px; }
    .feature-item { display: flex; align-items: flex-start; margin-bottom: 14px; }
    .feature-icon { font-size: 18px; margin-right: 12px; flex-shrink: 0; line-height: 1.4; }
    .feature-text { font-size: 14px; color: #5a6c7d; line-height: 1.5; }
    .feature-text strong { color: #2c3e50; }
    .cta-section { text-align: center; margin: 28px 0 12px; }
    .cta-button { display: inline-block; background-color: #225ce4; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 36px; border-radius: 6px; letter-spacing: 0.3px; }
    .cta-subtext { font-size: 13px; color: #95a5a6; margin-top: 12px; }
    .footer { padding: 24px 40px; text-align: center; border-top: 1px solid #ecf0f1; color: #7f8c8d; font-size: 14px; line-height: 1.7; }
    .footer a { color: #225ce4; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .email-header, .email-content, .footer { padding-left: 20px !important; padding-right: 20px !important; }
      .cta-button { padding: 12px 24px !important; font-size: 14px !important; }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td style="padding: 20px 0;">
        <div class="email-container">

          <!-- Header -->
          <div class="email-header">
            <div class="company-logo">
              <img src="https://i.ibb.co.com/QvN1hR6K/accord-technology-logo.png" alt="Akkord AI" />
            </div>
          </div>

          <!-- Content -->
          <div class="email-content">
            <p class="greeting">Hi ${userName},</p>

            <p class="main-text">
              Your email has been successfully verified and your <strong>Akkord AI</strong> account is now active.
              We're thrilled to have you on board!
            </p>

            <!-- Success Banner -->
            <div class="success-banner">
              <div class="success-icon">✅</div>
              <div class="success-title">Account Successfully Created</div>
              <div class="success-subtitle">You're now part of the Akkord AI community</div>
            </div>

            <hr class="divider" />

            <!-- What's Next -->
            <p class="features-title">Here's what you can do with Akkord AI:</p>

            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <span class="feature-text"><strong>Supercharge your workflow</strong> – Leverage AI-powered tools designed to save you time and effort every single day.</span>
            </div>

            <div class="feature-item">
              <span class="feature-icon">🤝</span>
              <span class="feature-text"><strong>Collaborate seamlessly</strong> – Invite your team, share insights, and work smarter together in one unified platform.</span>
            </div>

            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <span class="feature-text"><strong>Gain actionable insights</strong> – Access real-time analytics and intelligent reports to drive confident, data-backed decisions.</span>
            </div>

            <hr class="divider" />

            <!-- CTA -->
            <div class="cta-section">
              <a href="https://akkordai.com/dashboard" class="cta-button">Go to Your Dashboard →</a>
              <p class="cta-subtext">No setup required. You're ready to go.</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            Need help getting started? Visit our <a href="https://akkordai.com/help">Help Center</a> or reply to this email.<br /><br />
            Regards,<br />
            Team <strong>Akkord AI</strong>
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  await sendEmail(email, subject, html);
};