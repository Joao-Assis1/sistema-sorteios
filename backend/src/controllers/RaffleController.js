import raffleService from "../services/RaffleService.js";

class RaffleController {
  async create(req, res) {
    try {
      // TODO: Check admin role here or in middleware
      const { title, description, price, totalNumbers, imageUrl } = req.body;
      if (!title || !price || !totalNumbers) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const raffle = await raffleService.createRaffle({
        title,
        description,
        price,
        totalNumbers,
        imageUrl,
      });
      res.status(201).json(raffle);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async list(req, res) {
    try {
      const raffles = await raffleService.listRaffles();
      res.status(200).json(raffles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const raffle = await raffleService.getRaffleDetails(id);
      res.status(200).json(raffle);
    } catch (error) {
      if (error.message === "Raffle not found") {
        return res.status(404).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new RaffleController();
