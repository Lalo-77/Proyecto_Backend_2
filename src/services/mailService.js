import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to, subject, htmlContent) {
    try {
      const mailOptions = {
        from: `"entrega node" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Correo enviado: ", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error enviando correo:", error);
      return { success: false, error };
    }
  }
}

export default new MailService();
