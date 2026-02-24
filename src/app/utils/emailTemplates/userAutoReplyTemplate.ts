import sendEmail from "./nodemailerTransport";

export const supportAutoReplyTemplate = async (
  userEmail: string,
  userName: string,
  ticketId: string
) => {
  const html = `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;padding:30px;">
      
      <h2 style="color:#6C5CE7;">We Received Your Support Request</h2>

      <p>Hello ${userName},</p>

      <p>
        Thank you for contacting our support team. 
        Your ticket ID is <strong>#${ticketId}</strong>.
      </p>

      <p>
        Our team will review your request and respond within 24 hours.
      </p>

      <hr style="margin:20px 0;" />

      <p style="font-size:14px;color:#888;">
        If you did not create this request, please ignore this email.
      </p>

      <p style="margin-top:30px;">
        Regards,<br/>
        <strong>Support Team</strong>
      </p>
    </div>
  </div>
  `;

  await sendEmail(userEmail, "Support Request Received", html);
};