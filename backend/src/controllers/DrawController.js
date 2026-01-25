import drawService from "../services/DrawService.js";
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
        data: {
          winner: result.winner,
          total_participants: result.total_participants,
          draw_details: result.draw_details,
        },
        audit: result.audit_data,
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

  // GET /public/winners
  async getHistory(req, res) {
    try {
      // O SEGREDO ESTÁ AQUI:
      // Fazemos JOIN com 'lastlink_members' em vez de 'users'
      const query = `
        SELECT 
          h.id, 
          h.data_sorteio, 
          h.premio, 
          m.nome as ganhador_nome, -- Pega o nome da tabela certa
          m.email as ganhador_email -- Opcional, se quiser mascarar no front
        FROM historico_sorteios h
        LEFT JOIN lastlink_members m ON h.participante_id = m.id
        ORDER BY h.data_sorteio DESC
        LIMIT 20;
      `;

      const result = await db.query(query);

      return res.json(result.rows);
    } catch (error) {
      console.error("❌ Erro ao buscar histórico:", error);
      return res.status(500).json({ error: "Erro ao carregar ganhadores." });
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

      // 4. ÚLTIMO SORTEIO (NOVO!) 🗓️
      // Busca a data do registro mais recente
      const lastDrawQuery = await db.query(
        "SELECT data_sorteio FROM historico_sorteios ORDER BY data_sorteio DESC LIMIT 1",
      );

      let lastDrawDate = "Nenhum"; // Valor padrão se nunca teve sorteio

      if (lastDrawQuery.rows.length > 0) {
        // Formata a data para Dia/Mês/Ano (PT-BR)
        const dataCrua = new Date(lastDrawQuery.rows[0].data_sorteio);
        lastDrawDate = dataCrua.toLocaleDateString("pt-BR");
      }

      // ✅ RETORNO EM INGLÊS (Para casar com o Frontend)
      return res.json({
        total_participants: Number(totalParticipants), // O Frontend espera exatamente isso
        active_participants: Number(activeParticipants), // Provavelmente espera isso também
        total_draws: Number(totalDraws), // E isso
        last_draw_date: lastDrawDate,
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

      // Check if member already exists
      const existingMember = await db.query(
        `SELECT id FROM lastlink_members WHERE email = $1`,
        [email],
      );

      if (existingMember.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "Membro com este email já existe." });
      }

      // Insert new member with active status
      const insertRes = await db.query(
        `INSERT INTO lastlink_members (nome, email, telefone, status)
         VALUES ($1, $2, $3, 'active')
         RETURNING id, nome, email, telefone, status`,
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

  // GET /admin/members?search=query
  async searchMembers(req, res) {
    try {
      const { search } = req.query;

      if (!search || search.trim().length === 0) {
        return res.json([]);
      }

      const searchPattern = `%${search.trim()}%`;

      const result = await db.query(
        `SELECT id, nome, email, telefone, status
         FROM lastlink_members
         WHERE status = 'active'
           AND (
             LOWER(nome) LIKE LOWER($1)
             OR LOWER(email) LIKE LOWER($1)
             OR telefone LIKE $1
           )
         ORDER BY nome ASC
         LIMIT 50`,
        [searchPattern],
      );

      return res.json(result.rows);
    } catch (error) {
      console.error("Search Members Error:", error);
      return res.status(500).json({ error: "Erro ao buscar membros." });
    }
  }
}

export default new DrawController();
