import drawService from "../services/DrawService.js";
import { pool } from "../config/database.js";

class DrawController {
  async createDraw(req, res) {
    try {
      const { prize } = req.body;

      if (!prize) {
        return res
          .status(400)
          .json({ error: "Descrição do prêmio é obrigatória." });
      }

      const result = await drawService.performManualDraw(prize);

      return res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      console.error("Draw Error:", error);
      if (error.message === "Nenhum assinante ativo para sortear.") {
        return res.status(400).json({ error: error.message });
      }
      return res
        .status(500)
        .json({ error: "Erro interno ao realizar sorteio." });
    }
  }

  // GET /admin/dashboard-data
  async getDashboardData(req, res) {
    try {
      // 1. Count active participants
      const participantsCountRes = await pool.query(
        `SELECT COUNT(*) as total FROM users WHERE subscription_status = 'active'`
      );
      const totalParticipants = parseInt(
        participantsCountRes.rows[0].total,
        10
      );

      // 2. Count total draws
      const drawsCountRes = await pool.query(
        `SELECT COUNT(*) as total FROM daily_draws`
      );
      const totalDraws = parseInt(drawsCountRes.rows[0].total, 10);

      // 3. Last draw date
      const lastDrawRes = await pool.query(
        `SELECT data_sorteio FROM daily_draws ORDER BY data_sorteio DESC LIMIT 1`
      );
      const lastDrawDate = lastDrawRes.rows[0]?.data_sorteio
        ? new Date(lastDrawRes.rows[0].data_sorteio).toLocaleDateString("pt-BR")
        : "Nenhum";

      // 4. List of active participants
      const participantsRes = await pool.query(
        `SELECT id, name, email, phone FROM users WHERE subscription_status = 'active' ORDER BY created_at DESC LIMIT 100`
      );
      const participants = participantsRes.rows;

      // 5. Draw history (last 10)
      const historyRes = await pool.query(
        `SELECT 
          dd.id,
          dd.data_sorteio,
          dd.premio_descricao,
          dd.numero_sorteado,
          u.name as winner_name,
          u.email as winner_email,
          u.phone as winner_phone
        FROM daily_draws dd
        LEFT JOIN users u ON dd.ganhador_user_id = u.id
        ORDER BY dd.data_sorteio DESC
        LIMIT 10`
      );
      const history = historyRes.rows.map((row) => ({
        id: row.id,
        date: new Date(row.data_sorteio).toLocaleDateString("pt-BR"),
        prize: row.premio_descricao,
        number: row.numero_sorteado,
        winner: row.winner_name || "N/A",
        email: row.winner_email || "N/A",
        phone: row.winner_phone || "N/A",
      }));

      return res.status(200).json({
        stats: {
          total_participants: totalParticipants,
          total_draws: totalDraws,
          last_draw_date: lastDrawDate,
        },
        participants,
        history,
      });
    } catch (error) {
      console.error("Dashboard Data Error:", error);
      return res
        .status(500)
        .json({ error: "Erro ao carregar dados do painel." });
    }
  }

  // POST /admin/participants
  async addParticipant(req, res) {
    try {
      const { name, email, phone } = req.body;

      if (!name || !email) {
        return res
          .status(400)
          .json({ error: "Nome e email são obrigatórios." });
      }

      // Check if user already exists
      const existingUser = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "Usuário com este email já existe." });
      }

      // Insert new participant with active status
      const insertRes = await pool.query(
        `INSERT INTO users (name, email, phone, subscription_status, role, created_at, updated_at)
         VALUES ($1, $2, $3, 'active', 'customer', NOW(), NOW())
         RETURNING id, name, email, phone, subscription_status, created_at`,
        [name, email, phone || null]
      );

      return res.status(201).json({
        status: "success",
        data: insertRes.rows[0],
      });
    } catch (error) {
      console.error("Add Participant Error:", error);
      return res.status(500).json({ error: "Erro ao adicionar participante." });
    }
  }
}

export default new DrawController();
