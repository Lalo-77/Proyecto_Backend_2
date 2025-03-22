import express from "express";
import TicketService from "../services/ticketService.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  const { amount, purchaser } = req.body;

  if (!amount || !purchaser) {
    return res.status(400).json({ error: "Faltan datos en la solicitud" });
  }

  const result = await TicketService.createTicket(amount, purchaser);
  if (result.success) {
    res.json({ message: "Ticket generado con éxito", ticket: result.ticket });
  } else {
    res.status(500).json({ error: "No se pudo generar el ticket", details: result.error });
  }
});

export default router;
