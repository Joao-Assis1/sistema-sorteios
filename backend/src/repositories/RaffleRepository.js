import * as db from "../config/database.js";

class RaffleRepository {
  async create({
    title,
    description,
    price,
    totalNumbers,
    imageUrl,
    status = "open",
  }) {
    const query = `
      INSERT INTO raffles (title, description, price, total_numbers, image_url, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [title, description, price, totalNumbers, imageUrl, status];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const query = `SELECT * FROM raffles ORDER BY created_at DESC`;
    const result = await db.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = `SELECT * FROM raffles WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

export default new RaffleRepository();
