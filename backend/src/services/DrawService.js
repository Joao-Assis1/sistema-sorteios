import { pool } from "../config/database.js";

class DrawService {
  async performManualDraw(prizeDescription) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Buscar todos os assinantes ATIVOS
      const usersQuery = `
        SELECT id, name, email 
        FROM users 
        WHERE subscription_status = 'active'
      `;
      const usersRes = await client.query(usersQuery);
      const activeUsers = usersRes.rows;

      // 2. Validação se lista está vazia
      if (activeUsers.length === 0) {
        throw new Error("Nenhum assinante ativo para sortear.");
      }

      // 3. Sorteio Aleatório
      const randomIndex = Math.floor(Math.random() * activeUsers.length);
      const winner = activeUsers[randomIndex];

      // 4. Salvar na tabela daily_draws
      const insertDrawQuery = `
        INSERT INTO daily_draws (data_sorteio, premio_descricao, ganhador_user_id, status, created_at)
        VALUES (NOW(), $1, $2, 'completed', NOW())
        RETURNING id, data_sorteio, premio_descricao, status;
      `;
      const drawRes = await client.query(insertDrawQuery, [
        prizeDescription,
        winner.id,
      ]);
      const draw = drawRes.rows[0];

      await client.query("COMMIT");

      return {
        winner: {
          name: winner.name,
          email: winner.email,
        },
        total_participants: activeUsers.length,
        draw_details: draw,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new DrawService();
