import nodemailer from "nodemailer";
import crypto from "crypto";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure your email transporter here
    // For development, you can use a service like Gmail or a testing service like Ethereal
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || "EventHub <noreply@eventhub.com>",
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }

  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  generateVerificationCode(): string {
    // Generate a 6-digit verification code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateVerificationEmailHTML(name: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verifikoni Email-in tuaj - EventHub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EventHub</h1>
          </div>
          <div class="content">
            <h2>Mirë se vini në EventHub, ${name}!</h2>
            <p>Faleminderit që u regjistruat në platformën tonë. Për të përfunduar regjistrimin tuaj, ju lutemi verifikoni adresën tuaj të email-it duke klikuar butonin më poshtë:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verifikoni Email-in</a>
            </div>
            
            <p>Nëse butoni nuk funksionon, kopjoni dhe ngjitni këtë lidhje në shfletuesin tuaj:</p>
            <p style="word-break: break-all; color: #3b82f6;">${verificationUrl}</p>
            
            <p><strong>Kjo lidhje do të skadojë pas 24 orësh.</strong></p>
            
            <p>Nëse nuk keni krijuar një llogari në EventHub, ju lutemi injoroni këtë email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 EventHub. Të gjitha të drejtat e rezervuara.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateVerificationCodeEmailHTML(name: string, verificationCode: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Kodi i Verifikimit - EventHub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .code-box { 
            background: #3b82f6; 
            color: white; 
            padding: 20px; 
            text-align: center; 
            border-radius: 10px; 
            margin: 20px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EventHub</h1>
          </div>
          <div class="content">
            <h2>Mirë se vini në EventHub, ${name}!</h2>
            <p>Faleminderit që u regjistruat në platformën tonë. Për të përfunduar regjistrimin tuaj, ju lutemi përdorni kodin e verifikimit më poshtë:</p>
            
            <div class="code-box">
              ${verificationCode}
            </div>
            
            <p><strong>Ky kod do të skadojë pas 15 minutash.</strong></p>
            
            <p>Shkruani këtë kod në faqen e verifikimit për të aktivizuar llogarinë tuaj.</p>
            
            <p>Nëse nuk keni krijuar një llogari në EventHub, ju lutemi injoroni këtë email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 EventHub. Të gjitha të drejtat e rezervuara.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const emailHTML = this.generateWelcomeEmailHTML(name);
    
    await this.sendEmail({
      to,
      subject: "Mirë se vini në EventHub! 🎉",
      html: emailHTML,
    });
  }

  generateWelcomeEmailHTML(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Mirë se vini në EventHub!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .welcome-message { 
            background: #e0f2fe; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0; 
            border-left: 4px solid #3b82f6;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { 
            display: inline-block; 
            background: #3b82f6; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 EventHub</h1>
          </div>
          <div class="content">
            <h2>Mirë se vini në EventHub!</h2>
            
            <div class="welcome-message">
              <p><strong>Përshëndetje ${name},</strong></p>
              
              <p>Faleminderit që u regjistruat në EventHub! Jemi të lumtur që ju kemi pjesë të komunitetit tonë. Tani keni qasje për të eksploruar dhe marrë pjesë në të gjitha eventet tona.</p>
              
              <p>Nëse keni ndonjë pyetje apo nevojë për ndihmë, ekipi ynë është gjithmonë në dispozicionin tuaj.</p>
              
              <p><strong>Me respekt,<br/>
              Ekipi EventHub</strong></p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}" class="button">Eksploro Eventet</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
            
            <h3>🚀 Çfarë mund të bëni tani:</h3>
            <ul>
              <li>📅 <strong>Eksploroni eventet:</strong> Shihni të gjitha eventet e disponueshme</li>
              <li>🎫 <strong>Regjistrohuni:</strong> Merrni pjesë në eventet që ju interesojnë</li>
              <li>📝 <strong>Krijoni evente:</strong> Organizoni eventet tuaja</li>
              <li>👥 <strong>Ndiqni organizatorët:</strong> Qëndroni të informuar për eventet e reja</li>
            </ul>
          </div>
          <div class="footer">
            <p>&copy; 2024 EventHub. Të gjitha të drejtat e rezervuara.</p>
            <p>Ky email është dërguar sepse u regjistruat në EventHub.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
