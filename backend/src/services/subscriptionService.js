import { pool, query } from "../config/database.js";
import crypto from "crypto";

class SubscriptionService {
  /**
   * Chamado pelo Webhook da Lastlink quando pagamento é confirmado.
   * Atualiza ou cria o membro na tabela lastlink_members.
   * @param {Object} data - Dados do webhook
   * @param {string} data.email - Email do membro
   * @param {string} data.nome - Nome do membro
   * @param {string} [data.telefone] - Telefone do membro (opcional)
   * @param {string} [data.id] - ID da LastLink (opcional, usado como id do membro se fornecido)
   */
  async handlePaymentSuccess({ email, nome, telefone, id: lastlinkId }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const normalizedEmail = email.toLowerCase().trim();

      // 1. Verificar se membro já existe
      const memberQuery = `SELECT id, email, status FROM lastlink_members WHERE email = $1`;
      const memberRes = await client.query(memberQuery, [normalizedEmail]);
      let member = memberRes.rows[0];

      if (member) {
        // 2. Se existe: Atualizar para ativo e atualizar telefone se fornecido
        console.log(`📝 Atualizando membro existente: ${normalizedEmail}`);
        const updateQuery = `
          UPDATE lastlink_members 
          SET status = 'active',
              telefone = COALESCE($2, telefone)
          WHERE id = $1
          RETURNING id, email, telefone, status;
        `;
        const updateRes = await client.query(updateQuery, [
          member.id,
          telefone || null,
        ]);
        member = updateRes.rows[0];
      } else {
        // 3. Se NÃO existe: Criar novo membro
        // Usa o ID da LastLink se fornecido, senão gera UUID
        const memberId = lastlinkId || crypto.randomUUID();

        console.log(
          `➕ Criando novo membro: ${nome} (${normalizedEmail}) - ID: ${memberId}`,
        );
        const insertQuery = `
          INSERT INTO lastlink_members (id, nome, email, telefone, status)
          VALUES ($1, $2, $3, $4, 'active')
          RETURNING id, email, telefone, status;
        `;
        const insertRes = await client.query(insertQuery, [
          memberId,
          nome.trim(),
          normalizedEmail,
          telefone || null,
        ]);
        member = insertRes.rows[0];
      }

      await client.query("COMMIT");
      console.log(`✅ Membro processado com sucesso: ${member.email}`);
      return member;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("❌ Erro ao processar membro:", error);

      // Log detalhado para erros de constraint
      const notNull = "23502";
      const unique = "23505";
      if (error.code === notNull) {
        console.error("⚠️ Violação NOT NULL - coluna:", error.column);
      } else if (error.code === unique) {
        console.error("⚠️ Violação UNIQUE - detalhe:", error.detail);
      }

      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Desativa usuário quando assinatura é cancelada, reembolsada ou chargeback.
   */
  async deactivateUser(email) {
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`🚫 Desativando membro: ${normalizedEmail}`);
    const sql = `UPDATE lastlink_members SET status = 'inactive' WHERE email = $1 RETURNING id, email, status`;
    const result = await query(sql, [normalizedEmail]);

    if (result.rows.length > 0) {
      console.log(`✅ Membro desativado: ${result.rows[0].id}`);
    } else {
      console.log(
        `⚠️ Membro não encontrado para desativação: ${normalizedEmail}`,
      );
    }

    return result.rows[0];
  }
}

export default new SubscriptionService();
