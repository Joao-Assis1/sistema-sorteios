import ticketRepository from "../repositories/TicketRepository.js";
import raffleRepository from "../repositories/RaffleRepository.js";

class TicketService {
  async reserveTicket(raffleId, number, userId) {
    // 1. Check if raffle exists and is open
    const raffle = await raffleRepository.findById(raffleId);
    if (!raffle) throw new Error("Raffle not found");
    if (raffle.status !== "open") throw new Error("Raffle is not open");

    // 2. Check if number is within range
    if (number < 1 || number > raffle.total_numbers) {
      throw new Error(`Number must be between 1 and ${raffle.total_numbers}`);
    }

    // 3. Check if number is available
    const existingTicket = await ticketRepository.findByRaffleIdAndNumber(
      raffleId,
      number
    );
    if (existingTicket) {
      throw new Error("Number already taken");
    }

    // 4. Create ticket (Reserve)
    return await ticketRepository.create({
      raffleId,
      userId,
      number,
      status: "reserved",
    });
  }

  async listRaffleTickets(raffleId) {
    return await ticketRepository.findByRaffleId(raffleId);
  }
}

export default new TicketService();
