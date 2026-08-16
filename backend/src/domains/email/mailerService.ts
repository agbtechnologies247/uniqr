import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class MailerService {
  private transporter: nodemailer.Transporter | null = null;
  private fromAddress: string;

  constructor() {
    const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER || 'support@agbtechnologies.com';
    const smtpPass = process.env.SMTP_PASS || '';

    this.fromAddress = process.env.SMTP_FROM || `"UniQR Security" <${smtpUser}>`;

    if (smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        console.log(`[MAILER] Initialized SMTP Transporter (${smtpHost}:${smtpPort}) for ${smtpUser}`);
      } catch (err: any) {
        console.warn('[MAILER] Failed to create SMTP transporter:', err.message);
      }
    } else {
      console.log(`[MAILER] SMTP credentials not provided. Emails will be logged to console.`);
    }
  }

  public async sendMail(options: EmailOptions): Promise<boolean> {
    console.log(`\n📧 [EMAIL DISPATCH] To: ${options.to} | Subject: ${options.subject}`);

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: this.fromAddress,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text || options.subject
        });
        console.log(`✅ [EMAIL SENT] MessageId: ${info.messageId} to ${options.to}`);
        return true;
      } catch (err: any) {
        console.warn(`⚠️ [EMAIL SEND FAILED via SMTP]: ${err.message}. Logging email output:`);
        return false;
      }
    }

    return true;
  }

  /**
   * Send Branded UniQR Login OTP Email
   */
  public async sendOtpEmail(toEmail: string, otpCode: string): Promise<boolean> {
    const subject = `UniQR Login OTP - ${otpCode}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7EAE0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1D4533;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7EAE0; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="540" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; border: 2px solid #F9D2BA; overflow: hidden; box-shadow: 0 10px 25px rgba(29, 69, 51, 0.08);">
          
          <!-- HEADER -->
          <tr>
            <td style="background-color: #1D4533; padding: 28px 24px; text-align: center;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #F9D2BA; color: #1D4533; font-weight: 900; font-size: 22px; padding: 8px 18px; border-radius: 12px; letter-spacing: 1px;">
                      UniQR
                    </div>
                    <div style="color: #F7EAE0; font-size: 11px; font-weight: 600; margin-top: 8px; letter-spacing: 0.5px; text-transform: uppercase;">
                      Universal Digital Twin & Product Passport Platform
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #1D4533;">
                Your One-Time Login Passcode
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #5E3122; font-weight: 500;">
                Use the verification code below to securely sign in to your UniQR account.
              </p>

              <!-- OTP CODE BOX -->
              <div style="background-color: #F7EAE0; border: 2px dashed #1D4533; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 12px; font-weight: 700; color: #5E3122; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">
                  Login Verification Code
                </span>
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #1D4533; display: inline-block; margin-left: 10px;">
                  ${otpCode}
                </span>
              </div>

              <p style="margin: 0 0 8px 0; font-size: 12px; color: #5E3122; font-weight: 600;">
                ⏱️ This code is valid for <strong>10 minutes</strong>.
              </p>
              <p style="margin: 0; font-size: 12px; color: #8C6A58; line-height: 1.4;">
                If you did not request this login code, you can safely ignore this email. No access will be granted without this OTP.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #F7EAE0; padding: 20px 24px; text-align: center; border-top: 1px solid #F9D2BA;">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #1D4533;">
                Powered by UniQR — <a href="https://uniqr.agbtechnologies.in" style="color: #1D4533; text-decoration: underline;">agbtechnologies.in</a>
              </p>
              <p style="margin: 0; font-size: 10px; color: #5E3122;">
                AGB Technologies Pvt. Ltd. | Secure Enterprise Universal QR Network
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return this.sendMail({
      to: toEmail,
      subject,
      html
    });
  }

  /**
   * Send Branded UniQR Welcome Email with Feature Tour & Direct Links
   */
  public async sendWelcomeEmail(toEmail: string, userName: string): Promise<boolean> {
    const subject = `Welcome to UniQR — Universal Digital Twin & Product Passport Platform`;
    const cleanName = userName || 'Valued User';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7EAE0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1D4533;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7EAE0; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; border: 2px solid #F9D2BA; overflow: hidden; box-shadow: 0 12px 30px rgba(29, 69, 51, 0.09);">
          
          <!-- HERO HEADER -->
          <tr>
            <td style="background-color: #1D4533; padding: 36px 28px; text-align: center;">
              <div style="display: inline-block; background-color: #F9D2BA; color: #1D4533; font-weight: 900; font-size: 26px; padding: 8px 22px; border-radius: 14px; letter-spacing: 1px;">
                UniQR
              </div>
              <h1 style="color: #F7EAE0; font-size: 22px; font-weight: 800; margin: 16px 0 6px 0;">
                Welcome aboard, ${cleanName}! 🎉
              </h1>
              <p style="color: #F9D2BA; font-size: 13px; margin: 0; font-weight: 600;">
                Your Universal Digital Twin & Product Passport Platform is Ready.
              </p>
            </td>
          </tr>

          <!-- WELCOME MESSAGE -->
          <tr>
            <td style="padding: 32px 28px 20px 28px;">
              <p style="font-size: 14px; line-height: 1.6; color: #5E3122; margin: 0 0 20px 0;">
                Thank you for joining <strong>UniQR</strong>. You now have complete access to generate tamper-evident dynamic QR codes, publish EU DPP-compliant digital product passports, track real-time scan telemetry, and connect enterprise asset networks.
              </p>

              <h3 style="font-size: 15px; font-weight: 800; color: #1D4533; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Explore Core Platform Features:
              </h3>

              <!-- FEATURE 1: QR STUDIO -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7EAE0; border-radius: 14px; padding: 14px; margin-bottom: 12px; border: 1px solid #F9D2BA;">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 800; color: #1D4533; margin-bottom: 4px;">
                      🎯 Universal QR Studio
                    </div>
                    <div style="font-size: 12px; color: #5E3122; margin-bottom: 8px; line-height: 1.4;">
                      Design dynamic QR codes with embedded branding, logos, custom palettes, and vector exports (SVG, PDF, PNG).
                    </div>
                    <a href="https://uniqr.agbtechnologies.in/app/qr-studio" style="font-size: 11px; font-weight: 800; color: #1D4533; text-decoration: underline;">
                      Open QR Studio &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- FEATURE 2: DIGITAL PRODUCT PASSPORTS -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7EAE0; border-radius: 14px; padding: 14px; margin-bottom: 12px; border: 1px solid #F9D2BA;">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 800; color: #1D4533; margin-bottom: 4px;">
                      📄 Digital Product Passports (DPP)
                    </div>
                    <div style="font-size: 12px; color: #5E3122; margin-bottom: 8px; line-height: 1.4;">
                      Publish interactive product twins with specifications, user manuals, warranty certificates, and batch ledgers.
                    </div>
                    <a href="https://uniqr.agbtechnologies.in/app/passports" style="font-size: 11px; font-weight: 800; color: #1D4533; text-decoration: underline;">
                      Manage Passports &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- FEATURE 3: INTELLIGENCE GRAPH -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7EAE0; border-radius: 14px; padding: 14px; margin-bottom: 12px; border: 1px solid #F9D2BA;">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 800; color: #1D4533; margin-bottom: 4px;">
                      🧠 Ecosystem Intelligence Graph
                    </div>
                    <div style="font-size: 12px; color: #5E3122; margin-bottom: 8px; line-height: 1.4;">
                      Visualize interconnected asset topologies, supplier relationships, ownership transfers, and risk alerts.
                    </div>
                    <a href="https://uniqr.agbtechnologies.in/app/intelligance" style="font-size: 11px; font-weight: 800; color: #1D4533; text-decoration: underline;">
                      View Intelligence Graph &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- FEATURE 4: SCAN ANALYSIS -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7EAE0; border-radius: 14px; padding: 14px; margin-bottom: 12px; border: 1px solid #F9D2BA;">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 800; color: #1D4533; margin-bottom: 4px;">
                      📊 Live Scan Telemetry &amp; Fraud Analysis
                    </div>
                    <div style="font-size: 12px; color: #5E3122; margin-bottom: 8px; line-height: 1.4;">
                      Monitor live scan geolocations, device platforms, latency, and automated counterfeit scan triggers.
                    </div>
                    <a href="https://uniqr.agbtechnologies.in/app/scan-analysis" style="font-size: 11px; font-weight: 800; color: #1D4533; text-decoration: underline;">
                      Open Scan Analytics &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- FEATURE 5: BILLING & GST -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7EAE0; border-radius: 14px; padding: 14px; margin-bottom: 24px; border: 1px solid #F9D2BA;">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 800; color: #1D4533; margin-bottom: 4px;">
                      💳 Subscription &amp; GST Invoicing Hub
                    </div>
                    <div style="font-size: 12px; color: #5E3122; margin-bottom: 8px; line-height: 1.4;">
                      Manage quotas, upgrade plans with 1-tap UPI, and download official 18% statutory GST tax receipts (SAC 998313).
                    </div>
                    <a href="https://uniqr.agbtechnologies.in/app/subscription" style="font-size: 11px; font-weight: 800; color: #1D4533; text-decoration: underline;">
                      Billing &amp; GST Invoices &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- MAIN CTA BUTTON -->
              <div style="text-align: center; margin-bottom: 12px;">
                <a href="https://uniqr.agbtechnologies.in/app/dashboard" style="display: inline-block; background-color: #1D4533; color: #F7EAE0; font-size: 14px; font-weight: 800; padding: 14px 32px; border-radius: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(29, 69, 51, 0.25);">
                  Launch Platform Dashboard &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #F7EAE0; padding: 22px 28px; text-align: center; border-top: 1px solid #F9D2BA;">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #1D4533;">
                Powered by UniQR — <a href="https://uniqr.agbtechnologies.in" style="color: #1D4533; text-decoration: underline;">agbtechnologies.in</a>
              </p>
              <p style="margin: 0; font-size: 10px; color: #5E3122;">
                AGB Technologies Pvt. Ltd. | 27AABCA1234F1Z5 | Pune, India
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return this.sendMail({
      to: toEmail,
      subject,
      html
    });
  }
}

export const mailerService = new MailerService();
