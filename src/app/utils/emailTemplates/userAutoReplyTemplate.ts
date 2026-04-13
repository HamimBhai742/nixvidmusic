import sendEmail from "./nodemailerTransport";

export const supportAutoReplyTemplate = async (
  userEmail: string,
  userName: string,
  ticketId: string
) => {
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

<table width="100%" bgcolor="#f4f6f8" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">

<!-- Header -->
<tr>
<td style="background:#6C5CE7; padding:20px; text-align:center;">
  <h2 style="color:#ffffff; margin:0;">Akkord AI Support</h2>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:30px;">

<h3 style="margin-top:0;">We Received Your Request ✅</h3>

<p>Hello <strong>${userName}</strong>,</p>

<p>
Thank you for contacting our support team. Your ticket has been successfully created.
</p>

<p>
<strong>Ticket ID:</strong> #${ticketId}
</p>

<p>
Our team will review your request and respond within <strong>24 hours</strong>.
</p>

<!-- CTA -->
<div style="text-align:center; margin:25px 0;">
<a href="#" style="
  background:#6C5CE7;
  color:#fff;
  padding:12px 20px;
  text-decoration:none;
  border-radius:6px;
  display:inline-block;
">
  Track Your Ticket
</a>
</div>

<hr style="margin:20px 0;" />

<p style="font-size:13px; color:#888;">
If you did not create this request, you can safely ignore this email.
</p>

<p style="margin-top:25px;">
Best regards,<br/>
<strong>Akkord AI Support Team</strong>
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#888;">
© ${new Date().getFullYear()} Akkord AI. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

  await sendEmail(userEmail, "Support Request Received", html);
};