import sendEmail from "./nodemailerTransport";

export const loginOtpTemplate = async (
  userName: string,
  subject: string,
  email: string,
  otpCode: string,
) => {
  const year = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #f0f2f5;
      font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #1a1d23;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .wrapper { padding: 16px 12px !important; }
      .card { border-radius: 12px !important; }
      .otp-code { font-size: 28px !important; letter-spacing: 10px !important; }
      .content-pad { padding: 24px 20px !important; }
    }
  </style>
</head>
<body>
  <div class="wrapper" style="padding: 40px 16px; background-color: #f0f2f5;">

    <!-- Outer card -->
    <div class="card" style="
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e5ea;
    ">

      <!-- Header -->
      <div style="
        background-color: #1a40c8;
        padding: 32px 40px;
        text-align: center;
      ">
        <img
          src="https://imglink.cc/cdn/Ow8ExrW8jK.png"
          alt="Akkord AI"
          width="152"
          height="152"
          style="display: block; margin: 0 auto 12px; border-radius: 10px;"
        />
        
      </div>

      <!-- Body -->
      <div class="content-pad" style="padding: 36px 40px;">

        <!-- Badge -->
        <div style="margin-bottom: 18px;">
          <span style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background-color: #eef2ff;
            color: #2d4db5;
            font-size: 12px;
            font-weight: 600;
            padding: 5px 14px;
            border-radius: 100px;
            border: 1px solid #c5d0f5;
            letter-spacing: 0.2px;
          ">&#128274; Login verification</span>
        </div>

        <!-- Title -->
        <h1 style="
          font-size: 22px;
          font-weight: 700;
          color: #0f1117;
          letter-spacing: -0.4px;
          margin-bottom: 8px;
        ">Verify it's you</h1>

        <p style="font-size: 15px; color: #5a6070; line-height: 1.6; margin-bottom: 24px;">
          Hi <strong style="color: #1a1d23;">${userName}</strong>, a login attempt was made to your Akkord AI account. Use the code below to complete sign-in.
        </p>

        <!-- Divider -->
        <div style="border-top: 1px solid #ebedf0; margin-bottom: 24px;"></div>

        <!-- OTP label -->
        <p style="font-size: 13px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: #8a90a0; margin-bottom: 14px;">
          Your verification code
        </p>

        <!-- OTP block -->
        <div style="
          background-color: #f5f7ff;
          border: 1px dashed #b0bcf5;
          border-radius: 10px;
          padding: 28px 20px;
          text-align: center;
          margin-bottom: 16px;
        ">
          <p class="otp-code" style="
            font-size: 36px;
            font-weight: 800;
            color: #1a40c8;
            letter-spacing: 14px;
            line-height: 1;
            font-variant-numeric: tabular-nums;
          ">${otpCode}</p>
        </div>

        <!-- Expiry pill -->
        <div style="text-align: center; margin-bottom: 28px;">
          <span style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background-color: #fff4e5;
            color: #9a5700;
            font-size: 13px;
            font-weight: 600;
            padding: 6px 14px;
            border-radius: 100px;
            border: 1px solid #ffd280;
          ">&#9203; Expires in 2 minutes</span>
        </div>

        <!-- Divider -->
        <div style="border-top: 1px solid #ebedf0; margin-bottom: 24px;"></div>

        <!-- Alert callout -->
        <div style="
          background-color: #fff8f8;
          border-left: 3px solid #e24b4a;
          border-radius: 0 8px 8px 0;
          padding: 14px 16px;
          margin-bottom: 20px;
        ">
          <p style="font-size: 13.5px; color: #5a3030; line-height: 1.6;">
            <strong style="color: #a32d2d;">Didn't try to log in?</strong> If this wasn't you, your account may be at risk. Change your password immediately and contact our support team.
          </p>
        </div>

        <p style="font-size: 14px; color: #7a8090; line-height: 1.6;">
          Never share this code with anyone. Akkord AI staff will never ask for your verification code.
        </p>
      </div>

      <!-- Footer -->
      <div style="
        background-color: #f8f9fb;
        border-top: 1px solid #ebedf0;
        padding: 24px 40px;
        text-align: center;
      ">
        <p style="font-size: 13px; color: #9aa0ae; margin-bottom: 6px;">
          Sent by the <strong style="color: #6b7280;">Akkord AI</strong> team
        </p>
        <a href="https://www.akkord.ai" style="font-size: 13px; color: #1a40c8; font-weight: 500;">
          www.akkord.ai
        </a>
        <p style="font-size: 12px; color: #b8bdc9; margin-top: 16px;">
          &copy; ${year} Akkord AI. All rights reserved.
        </p>
      </div>

    </div><!-- /card -->
  </div><!-- /wrapper -->
</body>
</html>
`;

  await sendEmail(email, subject, html);
};