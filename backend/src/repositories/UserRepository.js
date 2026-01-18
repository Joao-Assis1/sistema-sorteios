import * as db from "../config/database.js";

class UserRepository {
  /**
   * Busca usuário/membro por ID (para rotas protegidas)
   */
  async findById(id) {
    const query = `
      SELECT m.*, r.role as role
      FROM lastlink_members m
      LEFT JOIN user_roles r ON m.id = r.user_id
      WHERE m.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  /**
   * Busca usuário/membro por email (usado pelo Supabase Auth)
   */
  async findByEmail(email) {
    const query = `
      SELECT 
        m.id,
        m.nome,
        m.email,
        m.status,
        r.role as role
      FROM lastlink_members m
      LEFT JOIN user_roles r ON m.id = r.user_id
      WHERE m.email = $1
    `;
    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  /**
   * Lista todos os membros ativos (para sorteio)
   */
  async findAllActive() {
    const query = `
      SELECT id, nome, email, status
      FROM lastlink_members
      WHERE status = 'active'
    `;
    const { rows } = await db.query(query);
    return rows;
  }
}

export default new UserRepository();
