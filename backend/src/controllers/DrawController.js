import drawService from "../services/DrawService.js";
import { pool } from "../config/database.js";
import * as db from "../config/database.js";

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
      // 1. Total Participants (Total de Membros)
      const totalQuery = await db.query(
        "SELECT COUNT(*) FROM lastlink_members",
      );
      const totalParticipants = totalQuery.rows[0].count;

      // 2. Active Participants (Membros Ativos)
      // Se você ainda não rodou o SQL da coluna 'status', remova o "WHERE status = 'active'"
      const activeQuery = await db.query(
        "SELECT COUNT(*) FROM lastlink_members WHERE status = 'active'",
      );
      const activeParticipants = activeQuery.rows[0].count;

      // 3. Total Draws (Total de Sorteios)
      const drawsQuery = await db.query(
        "SELECT COUNT(*) FROM historico_sorteios",
      );
      const totalDraws = drawsQuery.rows[0].count;

      // ✅ RETORNO EM INGLÊS (Para casar com o Frontend)
      return res.json({
        total_participants: Number(totalParticipants), // O Frontend espera exatamente isso
        active_participants: Number(activeParticipants), // Provavelmente espera isso também
        total_draws: Number(totalDraws), // E isso
      });
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
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
        [email],
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
        [name, email, phone || null],
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
