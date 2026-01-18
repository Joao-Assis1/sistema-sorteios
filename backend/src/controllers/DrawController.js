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
      // 1. Total de Assinantes (Busca na tabela lastlink_members, não em users!)
      const totalMembrosQuery = await db.query(
        "SELECT COUNT(*) FROM lastlink_members",
      );
      const totalMembros = totalMembrosQuery.rows[0].count;

      // 2. Membros Ativos (Para saber quem pode participar)
      const membrosAtivosQuery = await db.query(
        "SELECT COUNT(*) FROM lastlink_members WHERE status = 'active'",
      );
      const membrosAtivos = membrosAtivosQuery.rows[0].count;

      // 3. Total de Sorteios Realizados
      const totalSorteiosQuery = await db.query(
        "SELECT COUNT(*) FROM historico_sorteios",
      );
      const totalSorteios = totalSorteiosQuery.rows[0].count;

      // Retorna os dados limpos para o Frontend
      return res.json({
        totalMembros: Number(totalMembros),
        membrosAtivos: Number(membrosAtivos),
        totalSorteios: Number(totalSorteios),
      });
    } catch (error) {
      console.error("❌ Erro ao carregar Dashboard:", error);
      // Retorna erro amigável para não quebrar o front
      return res.status(500).json({ error: "Erro interno ao buscar dados." });
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
