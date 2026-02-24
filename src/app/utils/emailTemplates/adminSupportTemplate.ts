import sendEmail from "./nodemailerTransport";

export const supportAdminTemplate = async (
  adminEmail: string,
  ticket: {
    name: string;
    email: string;
    category: string;
    subject: string;
    message: string;
    id: string;
  }
) => {
  const html = `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;padding:30px;">
      <h2 style="color:#6C5CE7;">📩 New Support Ticket</h2>
      
      <p><strong>Ticket ID:</strong> ${ticket.id}</p>
      <p><strong>Name:</strong> ${ticket.name}</p>
      <p><strong>Email:</strong> ${ticket.email}</p>
      <p><strong>Category:</strong> ${ticket.category}</p>
      <p><strong>Subject:</strong> ${ticket.subject}</p>

      <hr style="margin:20px 0;" />

      <p style="white-space:pre-line;">${ticket.message}</p>

      <hr style="margin:20px 0;" />

      <p style="font-size:14px;color:#888;">
        Please respond within 24 hours.
      </p>
    </div>
  </div>
  `;

  await sendEmail(adminEmail, `New Support Ticket - ${ticket.subject}`, html);
};