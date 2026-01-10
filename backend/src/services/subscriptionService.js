import { pool, query } from "../config/database.js"; // Note o .js!

class SubscriptionService {
  async registerUserWithSubscription(userData, subscriptionData) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const userQuery = `
        INSERT INTO usuarios (nome, email, telefone)
        VALUES ($1, $2, $3)
        RETURNING id, nome, email;
      `;
      const userRes = await client.query(userQuery, [
        userData.nome,
        userData.email,
        userData.telefone,
      ]);
      const newUser = userRes.rows[0];

      const subQuery = `
        INSERT INTO assinaturas (usuario_id, lastlink_id, data_inicio, data_fim, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, status, data_fim;
      `;
      const subRes = await client.query(subQuery, [
        newUser.id,
        subscriptionData.lastlink_id,
        subscriptionData.data_inicio,
        subscriptionData.data_fim,
        "ATIVA",
      ]);

      await client.query("COMMIT");
      return { user: newUser, subscription: subRes.rows[0] };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async executeRaffle(premioDescricao) {
    const sql = `
      WITH ganhador_aleatorio AS (
          SELECT usuario_id
          FROM assinaturas
          WHERE status = 'ATIVA' 
            AND NOW() BETWEEN data_inicio AND data_fim
          ORDER BY RANDOM()
          LIMIT 1
      )
      INSERT INTO sorteios (premio_descricao, ganhador_usuario_id, data_realizacao)
      SELECT $1, usuario_id, NOW()
      FROM ganhador_aleatorio
      RETURNING id, ganhador_usuario_id, data_realizacao;
    `;

    const result = await query(sql, [premioDescricao]);

    if (result.rows.length === 0) {
      throw new Error("Nenhum participante elegível para o sorteio.");
    }
    return result.rows[0];
  }

  async checkParticipation(email) {
    const sql = `
      SELECT 
          u.nome, 
          CASE 
              WHEN a.status = 'ATIVA' AND NOW() BETWEEN a.data_inicio AND a.data_fim THEN true
              ELSE false 
          END AS esta_participando
      FROM usuarios u
      LEFT JOIN assinaturas a ON u.id = a.usuario_id
      WHERE u.email = $1;
    `;
    const result = await query(sql, [email]);
    return result.rows[0];
  }
}

export default new SubscriptionService();
