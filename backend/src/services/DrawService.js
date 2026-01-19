import { pool } from "../config/database.js";

class DrawService {
  async performManualDraw(prizeDescription) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Buscar todos os membros ATIVOS
      const usersQuery = `
        SELECT id, nome, email 
        FROM lastlink_members 
        WHERE status = 'active'
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

      // 4. Salvar na tabela historico_sorteios
      const insertDrawQuery = `
        INSERT INTO historico_sorteios (data_sorteio, premio, participante_id)
        VALUES (NOW(), $1, $2)
        RETURNING id, data_sorteio, premio;
      `;
      const drawRes = await client.query(insertDrawQuery, [
        prizeDescription,
        winner.id,
      ]);
      const draw = drawRes.rows[0];

      await client.query("COMMIT");

      return {
        winner: {
          name: winner.nome,
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
