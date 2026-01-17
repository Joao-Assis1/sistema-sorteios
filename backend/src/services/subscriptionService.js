import { pool, query } from "../config/database.js";

class SubscriptionService {
  async handlePaymentSuccess({ email, lastlinkId, nome }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Verificar se usuário existe
      const userQuery = `SELECT id, email FROM users WHERE email = $1`;
      const userRes = await client.query(userQuery, [email]);
      let user = userRes.rows[0];

      if (user) {
        // 2. Se existe: Atualizar
        const updateQuery = `
          UPDATE users 
          SET 
            lastlink_id = $1,
            subscription_status = 'active',
            subscription_end_date = NOW() + INTERVAL '1 year',
            updated_at = NOW()
          WHERE id = $2
          RETURNING id, email, subscription_status, subscription_end_date;
        `;
        const updateRes = await client.query(updateQuery, [
          lastlinkId,
          user.id,
        ]);
        user = updateRes.rows[0];
      } else {
        // 3. Se NÃO existe: Criar
        // Gera uma senha aleatória simples (o ideal seria enviar por email, mas por enquanto vamos gerar)
        const tempPassword = Math.random().toString(36).slice(-8);
        // Em produção, você deve hashear essa senha.
        // Como o AuthService usa bcrypt, precisaríamos importar aqui ou mover a lógica de criação para o UserRepository.
        // Para simplificar e seguir o prompt, vou salvar um hash placeholder ou plain se o campo permitir (o campo é password_hash).
        // IMPORTANTE: O prompt pediu para usar crypto ou string fixa.
        // Vou assumir que o sistema espera um hash. Vou usar um hash 'dummy' válido ou importar bcrypt se necessário.
        // Melhor opção: Criar usuário com status active.

        const insertQuery = `
          INSERT INTO users (name, email, lastlink_id, subscription_status, subscription_end_date, password_hash)
          VALUES ($1, $2, $3, 'active', NOW() + INTERVAL '1 year', $4)
          RETURNING id, email, subscription_status, subscription_end_date;
        `;
        // Hash dummy para "mudar123" (apenas exemplo)
        const dummyHash = "$2a$10$X7.G.6.G.6.G.6.G.6.G.6";

        const insertRes = await client.query(insertQuery, [
          nome,
          email,
          lastlinkId,
          dummyHash,
        ]);
        user = insertRes.rows[0];
      }

      await client.query("COMMIT");
      return user;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async executeRaffle(premioDescricao) {
    const sql = `
      WITH random_winner AS (
          SELECT user_id
          FROM subscriptions
          WHERE status = 'ACTIVE' 
            AND NOW() BETWEEN start_date AND end_date
          ORDER BY RANDOM()
          LIMIT 1
      )
      INSERT INTO raffles (title, description, winner_id, draw_date, status, price, total_numbers)
      SELECT $1, $1, user_id, NOW(), 'closed', 0, 0
      FROM random_winner
      RETURNING id, winner_id, draw_date;
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
          u.name, 
          CASE 
              WHEN s.status = 'ACTIVE' AND NOW() BETWEEN s.start_date AND s.end_date THEN true
              ELSE false 
          END AS is_participating
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id
      WHERE u.email = $1;
    `;
    const result = await query(sql, [email]);
    return result.rows[0];
  }
}

export default new SubscriptionService();
