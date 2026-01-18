import { pool, query } from "../config/database.js";

class SubscriptionService {
  /**
   * Chamado pelo Webhook da Lastlink quando pagamento é confirmado.
   * Atualiza ou cria o membro na tabela lastlink_members.
   */
  async handlePaymentSuccess({ email, lastlinkId, nome }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Verificar se membro já existe
      const memberQuery = `SELECT id, email FROM lastlink_members WHERE email = $1`;
      const memberRes = await client.query(memberQuery, [email]);
      let member = memberRes.rows[0];

      if (member) {
        // 2. Se existe: Atualizar para ativo
        const updateQuery = `
          UPDATE lastlink_members 
          SET status = 'active'
          WHERE id = $1
          RETURNING id, email, status;
        `;
        const updateRes = await client.query(updateQuery, [member.id]);
        member = updateRes.rows[0];
      } else {
        // 3. Se NÃO existe: Criar novo membro
        const insertQuery = `
          INSERT INTO lastlink_members (nome, email, status)
          VALUES ($1, $2, 'active')
          RETURNING id, email, status;
        `;
        const insertRes = await client.query(insertQuery, [nome, email]);
        member = insertRes.rows[0];
      }

      await client.query("COMMIT");
      return member;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Executa sorteio entre membros ativos e registra no histórico.
   */
  async executeRaffle(premioDescricao) {
    const sql = `
      WITH random_winner AS (
          SELECT id
          FROM lastlink_members
          WHERE status = 'active'
          ORDER BY RANDOM()
          LIMIT 1
      )
      INSERT INTO historico_sorteios (data_sorteio, premio, participante_id)
      SELECT NOW(), $1, id
      FROM random_winner
      RETURNING id, participante_id, data_sorteio;
    `;

    const result = await query(sql, [premioDescricao]);

    if (result.rows.length === 0) {
      throw new Error("Nenhum participante elegível para o sorteio.");
    }
    return result.rows[0];
  }

  /**
   * Verifica se email está participando (ativo).
   */
  async checkParticipation(email) {
    const sql = `
      SELECT 
          nome, 
          status,
          CASE 
              WHEN status = 'active' THEN true
              ELSE false 
          END AS is_participating
      FROM lastlink_members
      WHERE email = $1;
    `;
    const result = await query(sql, [email]);
    return result.rows[0];
  }

  /**
   * Registra usuário via webhook de cadastro.
   */
  async registerUserWithSubscription({ nome, email, lastlink_id }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Verifica se já existe
      const existingQuery = `SELECT id FROM lastlink_members WHERE email = $1`;
      const existingRes = await client.query(existingQuery, [email]);

      if (existingRes.rows.length > 0) {
        // Atualiza para ativo
        const updateQuery = `
          UPDATE lastlink_members 
          SET status = 'active'
          WHERE email = $1
          RETURNING id, email, status;
        `;
        const updateRes = await client.query(updateQuery, [email]);
        await client.query("COMMIT");
        return updateRes.rows[0];
      }

      // Cria novo
      const insertQuery = `
        INSERT INTO lastlink_members (nome, email, status)
        VALUES ($1, $2, 'active')
        RETURNING id, email, status;
      `;
      const insertRes = await client.query(insertQuery, [nome, email]);

      await client.query("COMMIT");
      return insertRes.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new SubscriptionService();
