import * as db from "../config/database.js";

class TicketRepository {
  async create({ raffleId, userId, number, status = "reserved" }) {
    const query = `
      INSERT INTO tickets (raffle_id, user_id, number, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [raffleId, userId, number, status];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findByRaffleIdAndNumber(raffleId, number) {
    const query = `SELECT * FROM tickets WHERE raffle_id = $1 AND number = $2`;
    const result = await db.query(query, [raffleId, number]);
    return result.rows[0];
  }

  async findByRaffleId(raffleId) {
    const query = `SELECT * FROM tickets WHERE raffle_id = $1`;
    const result = await db.query(query, [raffleId]);
    return result.rows;
  }
}

export default new TicketRepository();
