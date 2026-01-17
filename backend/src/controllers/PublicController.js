import { pool } from "../config/database.js";

class PublicController {
  /**
   * GET /public/status?email=user@example.com
   * Verifica o status da assinatura do usuário pelo email.
   */
  async checkStatus(req, res) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          error: "O parâmetro 'email' é obrigatório.",
        });
      }

      // Busca usuário pelo email
      const result = await pool.query(
        `SELECT name, subscription_status, subscription_end_date 
         FROM users 
         WHERE email = $1`,
        [email.toLowerCase().trim()]
      );

      if (result.rows.length === 0) {
        return res.status(200).json({ status: "inactive" });
      }

      const user = result.rows[0];

      if (user.subscription_status === "active") {
        return res.status(200).json({
          status: "active",
          user: {
            name: user.name,
            subscription_end_date: user.subscription_end_date
              ? new Date(user.subscription_end_date).toLocaleDateString("pt-BR")
              : null,
          },
        });
      }

      return res.status(200).json({ status: "inactive" });
    } catch (error) {
      console.error("Public Status Check Error:", error);
      return res.status(500).json({
        error: "Erro ao verificar status.",
      });
    }
  }

  /**
   * GET /public/winners
   * Retorna os últimos 3 sorteios concluídos com ganhadores (nome mascarado).
   */
  async getRecentWinners(req, res) {
    try {
      const result = await pool.query(
        `SELECT 
          dd.id,
          dd.data_sorteio,
          dd.premio_descricao,
          u.name as winner_name
        FROM daily_draws dd
        LEFT JOIN users u ON dd.ganhador_user_id = u.id
        WHERE dd.status = 'completed'
        ORDER BY dd.data_sorteio DESC
        LIMIT 3`
      );

      const winners = result.rows.map((row, index) => {
        // Mascara o nome: mostra apenas o primeiro nome
        const firstName = row.winner_name
          ? row.winner_name.split(" ")[0]
          : "Ganhador";

        return {
          position: index + 1,
          name: firstName,
          prize: row.premio_descricao || "Prêmio do Dia",
          date: row.data_sorteio
            ? new Date(row.data_sorteio).toLocaleDateString("pt-BR")
            : "N/A",
        };
      });

      return res.status(200).json({
        winners,
      });
    } catch (error) {
      console.error("Get Recent Winners Error:", error);
      return res.status(500).json({
        error: "Erro ao buscar ganhadores.",
      });
    }
  }
}

export default new PublicController();
