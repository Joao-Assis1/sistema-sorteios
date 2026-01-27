import * as db from "../config/database.js";
import drawService from "../services/DrawService.js";

class PublicController {
  /**
   * Mascara o nome: mostra primeiro nome + inicial do sobrenome
   */
  maskName(name) {
    if (!name) return "Participante";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0];
    return parts[0] + " " + parts[1].charAt(0) + ".";
  }

  /**
   * Mascara o email: mostra primeiros 2 chars + *** + domínio
   */
  maskEmail(email) {
    if (!email) return "***@***.com";
    const [local, domain] = email.split("@");
    if (!domain) return "***@***.com";
    const maskedLocal =
      local.length > 2 ? local.substring(0, 2) + "***" : "***";
    return maskedLocal + "@" + domain;
  }
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

      const normalizedEmail = email.toLowerCase().trim();

      // Busca usuário pelo email na tabela correta
      const result = await db.query(
        `SELECT id, nome, status 
         FROM lastlink_members 
         WHERE email = $1`,
        [normalizedEmail],
      );

      if (result.rows.length === 0) {
        return res.status(200).json({ status: "inactive" });
      }

      const user = result.rows[0];

      if (user.status === "active") {
        // Buscar o Número da Sorte do usuário na lista atual
        let luckyNumber = null;
        try {
          const snapshot = await drawService.getParticipantSnapshot();
          const userIndex = snapshot.participants.findIndex(
            (p) => p.email.toLowerCase() === normalizedEmail,
          );
          if (userIndex !== -1) {
            luckyNumber = userIndex + 1;
          }
        } catch (snapshotError) {
          console.error("Erro ao buscar lucky number:", snapshotError);
        }

        return res.status(200).json({
          status: "active",
          user: {
            name: user.nome,
          },
          lucky_number: luckyNumber,
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
      const result = await db.query(
        `SELECT 
          h.id,
          h.data_sorteio,
          h.premio,
          m.nome as winner_name
        FROM historico_sorteios h
        LEFT JOIN lastlink_members m ON h.participante_id = m.id
        ORDER BY h.data_sorteio DESC
        LIMIT 3`,
      );

      const winners = result.rows.map((row, index) => {
        // Mascara o nome: mostra apenas o primeiro nome
        const firstName = row.winner_name
          ? row.winner_name.split(" ")[0]
          : "Ganhador";

        return {
          position: index + 1,
          name: firstName,
          prize: row.premio || "Prêmio do Dia",
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

  /**
   * GET /public/current-list
   * Retorna o snapshot da lista atual de participantes com hash de segurança.
   */
  async getCurrentList(req, res) {
    try {
      const snapshot = await drawService.getParticipantSnapshot();

      // Anonimizar dados pessoais
      const anonymizedList = snapshot.participants.map((p) => ({
        lucky_number: p.lucky_number,
        name: this.maskName(p.name),
        email: this.maskEmail(p.email),
      }));

      return res.json({
        total_participants: snapshot.total_participants,
        list_hash: snapshot.list_hash,
        participants: anonymizedList,
      });
    } catch (error) {
      console.error("Get Current List Error:", error);
      return res.status(500).json({
        error: "Erro ao buscar lista atual.",
      });
    }
  }
}

export default new PublicController();
