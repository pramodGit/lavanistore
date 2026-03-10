/**
 * Generates Lavani "Forgot Password" email content (HTML + plain text)
 * @param {string} userName - The user's Lavani username (e.g. LW123456)
 * @param {string} password - The user's existing or temporary password
 * @param {string} firstName - Optional first name
 * @returns {{ html: string, text: string }} Object containing HTML and plain-text email content
 */
const forgotPasswordEmailTemplate = (userName, password, firstName = "User") => {
    console.log(userName, password, firstName);
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lavani - Password Recovery</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
      }
      .email-wrapper {
        width: 100%;
        background-color: #f4f4f7;
        padding: 40px 0;
      }
      .email-content {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .email-header {
        background-color: #3b82f6;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .email-header h2 {
        margin: 0;
        font-size: 22px;
      }
      .email-body {
        padding: 25px 30px;
        color: #333333;
      }
      .email-body h3 {
        color: #3b82f6;
      }
      .email-body p {
        font-size: 15px;
        line-height: 1.6;
        margin: 10px 0;
      }
      .credentials {
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 15px;
        margin: 15px 0;
      }
      .credentials p {
        margin: 8px 0;
        font-size: 15px;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #888;
        padding: 20px;
      }
      .footer a {
        color: #3b82f6;
        text-decoration: none;
      }
      @media only screen and (max-width: 600px) {
        .email-body {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-content">
        <div class="email-header">
          <h2>Password Recovery - Lavani Wellness</h2>
        </div>
        <div class="email-body">
          <h3>Dear ${firstName || "User"},</h3>
          <p>We received a request to recover your Lavani account password.</p>

          <div class="credentials">
            <p><b>Username:</b> ${userName}</p>
            <p><b>Password:</b> ${password}</p>
          </div>

          <p>You can now log in to your Lavani account using the above credentials.</p>

          <br/>
          <p>If you did not request this password recovery, please contact our support team immediately.</p>

          <br/>
          <p>Regards,<br/><strong>Lavani Team</strong></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Lavani. All rights reserved.</p>
          <p>
            <a href="https://lavani.com">Visit Website</a> |
            <a href="mailto:support@lavani.com">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  const text = `
  Lavani Password Recovery

  Dear ${firstName || "User"},

  We received a request to recover your Lavani account password.

  Username: ${userName}
  Password: ${password}

  You can now log in using the above credentials.

  If you did not request this, please contact our support team.

  Regards,
  Lavani Team
  `;

  return { html, text };
};

export default forgotPasswordEmailTemplate;
