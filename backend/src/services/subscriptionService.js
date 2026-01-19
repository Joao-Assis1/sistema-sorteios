import { pool, query } from "../config/database.js";

class SubscriptionService {
  /**
   * Chamado pelo Webhook da Lastlink quando pagamento é confirmado.
   * Atualiza ou cria o membro na tabela lastlink_members.
   */
  async handlePaymentSuccess({ email, nome }) {
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
   * Desativa usuário quando assinatura é cancelada, reembolsada ou chargeback.
   */
  async deactivateUser(email) {
    const sql = `UPDATE lastlink_members SET status = 'inactive', updated_at = NOW() WHERE email = $1`;
    await query(sql, [email]);
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
