import sendEmail from "./nodemailerTransport";

export const forgetPasswordOtpTemplate = async (userName: string, subject: string, email: string, otp: string) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Forgot Password Verification</title>
<style>
    body {
        margin: 0; padding: 0;
        background-color: #f4f6f8;
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
        color: #2c3e50;
    }

    .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 15px rgba(0,0,0,0.1);
    }

    .header {
        background-color: #225ce4;
        padding: 30px;
        text-align: center;
        color: #fff;
    }

    .header img {
        max-width: 100px;
        margin-bottom: 15px;
    }

    .content {
        padding: 30px 25px;
        line-height: 1.6;
        font-size: 16px;
    }

    .greeting {
        font-weight: 600;
        margin-bottom: 15px;
    }

    .otp-section {
        background-color: #f4f6f8;
        padding: 20px;
        text-align: center;
        border-radius: 8px;
        margin: 20px 0;
    }

    .otp-code {
        font-size: 32px;
        font-weight: bold;
        color: #225ce4;
        letter-spacing: 3px;
    }

    .cta-button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 25px;
        background-color: #225ce4;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: 600;
        transition: background-color 0.3s ease;
    }

    .cta-button:hover {
        background-color: #1a3dbd;
    }

    .footer {
        text-align: center;
        font-size: 14px;
        color: #7f8c8d;
        padding: 20px 25px;
        border-top: 1px solid #e0e0e0;
    }

    .footer a {
        color: #225ce4;
        text-decoration: none;
    }

    @media only screen and (max-width: 600px) {
        .content, .footer {
            padding: 20px 15px;
        }
        .otp-code {
            font-size: 28px;
        }
    }
</style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="https://i.ibb.co.com/QvN1hR6K/accord-technology-logo.png" alt="Accord Technology Logo">
            <h1>Accord Technology</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">Hello ${userName},</p>
            <p>We received a request to reset the password for your account. Use the OTP below to complete the process. <strong>Do not share this code with anyone.</strong></p>

            <!-- OTP Section -->
            <div class="otp-section">
                <p class="otp-code">${otp}</p>
            </div>

            <p>If you did not request this, you can safely ignore this email.</p>

            <a href="#" class="cta-button">Reset Password</a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Regards,<br>Team <strong>Accord Technology</strong></p>
            <p><a href="#">www.accordtechnology.com</a></p>
        </div>
    </div>
</body>
</html>
`;
    await sendEmail(email, subject, html);
};