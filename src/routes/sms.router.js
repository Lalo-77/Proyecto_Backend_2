import express from "express";
import SmsService from "../services/smsService.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: "Faltan datos en la solicitud" });
  }

  const result = await SmsService.sendSms(to, message);
  if (result.success) {
    res.json({ message: "SMS enviado con éxito", sid: result.sid });
  } else {
    res.status(500).json({ error: "No se pudo enviar el SMS", details: result.error });
  }
});

export default router;
