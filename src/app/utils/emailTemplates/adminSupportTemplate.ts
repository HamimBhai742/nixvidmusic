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
  },
) => {
  const receivedAt = new Date().toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  //   const html = `
  // <!DOCTYPE html>
  // <html lang="en">
  // <head>
  //   <meta charset="UTF-8" />
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //   <title>New Support Ticket — ${ticket.subject}</title>
  //   <!--[if mso]>
  //   <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  //   <![endif]-->
  //   <style>
  //     * { box-sizing: border-box; margin: 0; padding: 0; }
  //     body {
  //       background-color: #f0f2f5;
  //       font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  //       color: #1a1d23;
  //       -webkit-font-smoothing: antialiased;
  //     }
  //     a { color: #1a40c8; text-decoration: none; }
  //     @media only screen and (max-width: 620px) {
  //       .wrapper { padding: 16px 12px !important; }
  //       .card { border-radius: 12px !important; }
  //       .content-pad { padding: 24px 20px !important; }
  //       .meta-table td { display: block; width: 100% !important; }
  //     }
  //   </style>
  // </head>
  // <body>
  //   <div class="wrapper" style="padding: 40px 16px; background-color: #f0f2f5;">
  //     <div class="card" style="
  //       max-width: 580px;
  //       margin: 0 auto;
  //       background-color: #ffffff;
  //       border-radius: 16px;
  //       overflow: hidden;
  //       border: 1px solid #e2e5ea;
  //     ">

  //       <!-- Header -->
  //       <div style="
  //         background-color: #1a40c8;
  //         padding: 24px 40px;
  //         display: flex;
  //         align-items: center;
  //         justify-content: space-between;
  //       ">
  //         <div style="display: flex; align-items: center; gap: 12px;">
  //           <img
  //             src="https://imglink.cc/cdn/Ow8ExrW8jK.png"
  //             alt="Akkord AI"
  //             width="40" height="40"
  //             style="border-radius: 10px; display: block;"
  //           />
  //           <p style="color: rgba(255,255,255,0.95); font-size: 17px; font-weight: 600;">Akkord AI</p>
  //         </div>
  //         <span style="
  //           background: rgba(255,255,255,0.2);
  //           color: #ffffff;
  //           font-size: 11px;
  //           font-weight: 700;
  //           padding: 4px 12px;
  //           border-radius: 100px;
  //           letter-spacing: 0.6px;
  //         ">INTERNAL</span>
  //       </div>

  //       <!-- Alert bar -->
  //       <div style="
  //         background-color: #fef3c7;
  //         border-bottom: 1px solid #fcd34d;
  //         padding: 10px 40px;
  //         display: flex;
  //         align-items: center;
  //         gap: 8px;
  //       ">
  //         <span style="font-size: 15px;">&#128276;</span>
  //         <p style="font-size: 13px; font-weight: 600; color: #92400e;">
  //           New support ticket requires your attention
  //         </p>
  //       </div>

  //       <!-- Body -->
  //       <div class="content-pad" style="padding: 32px 40px;">

  //         <!-- Title row -->
  //         <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 6px;">
  //           <h1 style="
  //             font-size: 20px;
  //             font-weight: 700;
  //             color: #0f1117;
  //             letter-spacing: -0.3px;
  //             line-height: 1.3;
  //             flex: 1;
  //           ">${ticket.subject}</h1>
  //           <span style="
  //             flex-shrink: 0;
  //             background-color: #eef2ff;
  //             color: #2d4db5;
  //             font-size: 12px;
  //             font-weight: 700;
  //             padding: 4px 12px;
  //             border-radius: 6px;
  //             border: 1px solid #c5d0f5;
  //             white-space: nowrap;
  //           ">${ticket.category}</span>
  //         </div>

  //         <p style="font-size: 13px; color: #8a90a0; margin-bottom: 24px;">
  //           Received: ${receivedAt}
  //         </p>

  //         <!-- Meta grid -->
  //         <div style="
  //           background-color: #f8f9fb;
  //           border: 1px solid #ebedf0;
  //           border-radius: 10px;
  //           padding: 4px 20px;
  //           margin-bottom: 24px;
  //         ">
  //           <table class="meta-table" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
  //             <tr>
  //               <td style="padding: 11px 0; font-size: 12px; font-weight: 600; color: #8a90a0; text-transform: uppercase; letter-spacing: 0.5px; width: 100px;">Ticket ID</td>
  //               <td style="padding: 11px 0; font-size: 13px; color: #1a1d23; font-family: 'Courier New', monospace; font-weight: 600;">#${ticket.id}</td>
  //             </tr>
  //             <tr style="border-top: 1px solid #ebedf0;">
  //               <td style="padding: 11px 0; font-size: 12px; font-weight: 600; color: #8a90a0; text-transform: uppercase; letter-spacing: 0.5px;">Name</td>
  //               <td style="padding: 11px 0; font-size: 13px; color: #1a1d23;">${ticket.name}</td>
  //             </tr>
  //             <tr style="border-top: 1px solid #ebedf0;">
  //               <td style="padding: 11px 0; font-size: 12px; font-weight: 600; color: #8a90a0; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
  //               <td style="padding: 11px 0; font-size: 13px;">
  //                 <a href="mailto:${ticket.email}" style="color: #1a40c8;">${ticket.email}</a>
  //               </td>
  //             </tr>
  //             <tr style="border-top: 1px solid #ebedf0;">
  //               <td style="padding: 11px 0; font-size: 12px; font-weight: 600; color: #8a90a0; text-transform: uppercase; letter-spacing: 0.5px;">Category</td>
  //               <td style="padding: 11px 0; font-size: 13px; color: #1a1d23;">${ticket.category}</td>
  //             </tr>
  //           </table>
  //         </div>

  //         <!-- Message block -->
  //         <p style="font-size: 13px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: #8a90a0; margin-bottom: 12px;">
  //           User message
  //         </p>

  //         <div style="
  //           background-color: #f5f7ff;
  //           border-left: 3px solid #1a40c8;
  //           border-radius: 0 8px 8px 0;
  //           padding: 16px 18px;
  //           margin-bottom: 24px;
  //         ">
  //           <p style="
  //             font-size: 14px;
  //             color: #2c3040;
  //             line-height: 1.75;
  //             white-space: pre-line;
  //           ">${ticket.message}</p>
  //         </div>

  //         <!-- SLA notice -->
  //         <div style="
  //           background-color: #fff8f8;
  //           border: 1px solid #fecaca;
  //           border-radius: 8px;
  //           padding: 14px 16px;
  //           display: flex;
  //           align-items: flex-start;
  //           gap: 10px;
  //         ">
  //           <span style="font-size: 17px; flex-shrink: 0; line-height: 1;">&#9200;</span>
  //           <p style="font-size: 13px; color: #7f1d1d; line-height: 1.6;">
  //             <strong style="color: #b91c1c;">SLA reminder:</strong> Please respond to this ticket within
  //             <strong style="color: #b91c1c;">24 hours</strong> to meet our support commitment.
  //           </p>
  //         </div>

  //       </div>

  //       <!-- Footer -->
  //       <div style="
  //         background-color: #f8f9fb;
  //         border-top: 1px solid #ebedf0;
  //         padding: 22px 40px;
  //         text-align: center;
  //       ">
  //         <p style="font-size: 13px; color: #9aa0ae; margin-bottom: 4px;">
  //           Akkord AI &middot; Internal Support Notification
  //         </p>
  //         <p style="font-size: 12px; color: #b8bdc9; margin-top: 8px;">
  //           &copy; ${new Date().getFullYear()} Akkord AI. All rights reserved.
  //         </p>
  //       </div>

  //     </div>
  //   </div>
  // </body>
  // </html>
  // `;

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background:#f0f2f5; font-family:Arial, sans-serif;">

<table width="100%" bgcolor="#f0f2f5" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e2e5ea;">

<!-- Header -->
<tr>
<td style="background:#1a40c8; padding:20px;">
  <table width="100%">
    <tr>
      <td>
        <img src="https://imglink.cc/cdn/Ow8ExrW8jK.png" width="40" style="border-radius:8px;">
      </td>
      <td align="right">
        <span style="color:#fff; font-size:12px; background:rgba(255,255,255,0.2); padding:4px 10px; border-radius:20px;">
          INTERNAL
        </span>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- Alert -->
<tr>
<td style="background:#fef3c7; padding:10px 20px; color:#92400e; font-size:13px;">
  🔔 New support ticket requires your attention
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:30px;">

<h2 style="margin:0; font-size:20px;">${ticket.subject}</h2>

<p style="color:#888; font-size:13px; margin-top:6px;">
Received: ${receivedAt}
</p>

<!-- Meta -->
<table width="100%" style="margin-top:20px; border:1px solid #eee; border-radius:8px;">
<tr>
<td style="padding:10px; font-size:12px; color:#888;">Ticket ID</td>
<td style="padding:10px;">#${ticket.id}</td>
</tr>
<tr>
<td style="padding:10px; font-size:12px; color:#888;">Name</td>
<td style="padding:10px;">${ticket.name}</td>
</tr>
<tr>
<td style="padding:10px; font-size:12px; color:#888;">Email</td>
<td style="padding:10px;">
<a href="mailto:${ticket.email}" style="color:#1a40c8;">${ticket.email}</a>
</td>
</tr>
</table>

<!-- Message -->
<p style="margin-top:20px; font-size:12px; color:#888;">USER MESSAGE</p>

<div style="background:#f5f7ff; padding:15px; border-left:4px solid #1a40c8;">
${ticket.message}
</div>

<!-- CTA Button -->
<div style="margin-top:25px; text-align:center;">
<a href="#" style="
  background:#1a40c8;
  color:#fff;
  padding:12px 20px;
  text-decoration:none;
  border-radius:6px;
  display:inline-block;
">
  Open Ticket Dashboard
</a>
</div>

<!-- SLA -->
<div style="margin-top:20px; background:#fff8f8; padding:12px; border:1px solid #fecaca;">
⏰ <b>SLA Reminder:</b> Please respond within 24 hours
</div>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="text-align:center; padding:20px; font-size:12px; color:#999;">
Akkord AI · Internal Notification <br/>
© ${new Date().getFullYear()}
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

  await sendEmail(adminEmail, `New Support Ticket — ${ticket.subject}`, html);
};
