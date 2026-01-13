import ticketService from "../services/TicketService.js";

class TicketController {
  async purchase(req, res) {
    try {
      const { raffleId, number, userId } = req.body; // In real app, userId comes from auth token
      if (!raffleId || !number || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const ticket = await ticketService.reserveTicket(
        raffleId,
        number,
        userId
      );
      res.status(201).json(ticket);
    } catch (error) {
      if (
        error.message === "Number already taken" ||
        error.message.includes("must be between")
      ) {
        return res.status(409).json({ error: error.message });
      } else if (error.message === "Raffle not found") {
        return res.status(404).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async listByRaffle(req, res) {
    try {
      const { raffleId } = req.params;
      const tickets = await ticketService.listRaffleTickets(raffleId);
      res.status(200).json(tickets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new TicketController();
