import * as db from "../config/database.js";

class UserRepository {
  async create({ name, email, passwordHash, role = "user" }) {
    const query = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at;
    `;
    const values = [name, email, passwordHash, role];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  async findById(id) {
    const query = `SELECT id, name, email, role, created_at FROM users WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

export default new UserRepository();
