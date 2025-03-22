import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

class SmsService {
  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async sendSms(to, message) {
    try {
      const response = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to, 
      });

      console.log("Mensaje enviado:", response.sid);
      return { success: true, sid: response.sid };
    } catch (error) {
      console.error("Error enviando SMS:", error);
      return { success: false, error };
    }
  }
}

export default new SmsService();
