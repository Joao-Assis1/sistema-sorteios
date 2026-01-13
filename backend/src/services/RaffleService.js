import raffleRepository from "../repositories/RaffleRepository.js";

class RaffleService {
  async createRaffle(data) {
    // Add any validation logic here if needed beyond controller
    return await raffleRepository.create(data);
  }

  async listRaffles() {
    return await raffleRepository.findAll();
  }

  async getRaffleDetails(id) {
    const raffle = await raffleRepository.findById(id);
    if (!raffle) {
      throw new Error("Raffle not found");
    }
    return raffle;
  }
}

export default new RaffleService();
