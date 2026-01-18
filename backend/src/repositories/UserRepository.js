import * as db from "../config/database.js";

class UserRepository {
  /**
   * Busca membro por ID
   */
  async findById(id) {
    const query = `
      SELECT id, nome, email, telefone, status
      FROM lastlink_members
      WHERE id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  /**
   * Busca membro por email
   */
  async findByEmail(email) {
    const query = `
      SELECT id, nome, email, telefone, status
      FROM lastlink_members
      WHERE email = $1
    `;
    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  /**
   * Lista todos os membros ativos (para sorteio)
   */
  async findAllActive() {
    const query = `
      SELECT id, nome, email, telefone, status
      FROM lastlink_members
      WHERE status = 'active'
    `;
    const { rows } = await db.query(query);
    return rows;
  }
}

export default new UserRepository();
