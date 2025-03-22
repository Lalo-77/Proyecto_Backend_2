import express from "express";
import MailService from "../services/mailService.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Faltan datos en la solicitud" });
  }

  const htmlContent = `
    <h2>${subject}</h2>
    <p>${message}</p>
  `;

  const result = await MailService.sendMail(to, subject, htmlContent);
  if (result.success) {
    res.json({ message: "Correo enviado con éxito", id: result.messageId });
  } else {
    res.status(500).json({ error: "No se pudo enviar el correo", details: result.error });
  }
});

export default router;
