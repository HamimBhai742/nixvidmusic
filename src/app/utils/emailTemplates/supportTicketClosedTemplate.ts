import sendEmail from "./nodemailerTransport";

export const supportClosedTemplate = async (
  userEmail: string,
  userName: string,
  ticketId: string
) => {
  const html = `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;padding:30px;">
      
      <h2 style="color:#00B894;">✅ Ticket Resolved</h2>

      <p>Hello ${userName},</p>

      <p>
        Your support ticket <strong>#${ticketId}</strong> has been marked as resolved.
      </p>

      <p>
        If your issue is still not resolved, you can reply to this email.
      </p>

      <hr style="margin:20px 0;" />

      <p style="font-size:14px;color:#888;">
        Thank you for using our service.
      </p>

      <p style="margin-top:30px;">
        Regards,<br/>
        <strong>Support Team</strong>
      </p>
    </div>
  </div>
  `;

  await sendEmail(userEmail, "Your Support Ticket is Resolved", html);
};