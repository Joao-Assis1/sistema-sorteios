import * as db from "../config/database.js";
import drawService from "../services/DrawService.js";

/**
 * Mascara o nome: mostra primeiro nome + inicial do sobrenome
 */
function maskName(name) {
  if (!name) return "Participante";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return parts[0] + " " + parts[1].charAt(0) + ".";
}

/**
 * Mascara o email: mostra primeiros 2 chars + *** + domínio
 */
function maskEmail(email) {
  if (!email) return "***@***.com";
  const [local, domain] = email.split("@");
  if (!domain) return "***@***.com";
  const maskedLocal = local.length > 2 ? local.substring(0, 2) + "***" : "***";
  return maskedLocal + "@" + domain;
}

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
        let targetBlock = null;
        let listHash = null;
        try {
          const snapshot = await drawService.getParticipantSnapshot();
          listHash = snapshot.list_hash;
          const userIndex = snapshot.participants.findIndex(
            (p) => p.email.toLowerCase() === normalizedEmail,
          );
          if (userIndex !== -1) {
            luckyNumber = userIndex + 1;
          }

          // Buscar bloco alvo da config
          try {
            const configResult = await db.query(`
              SELECT target_block FROM sorteio_config WHERE id = 1
            `);
            if (configResult.rows.length > 0) {
              targetBlock = configResult.rows[0].target_block;
            }
          } catch (configError) {
            // Config pode não existir
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
          target_block: targetBlock,
          list_hash: listHash,
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
        name: maskName(p.name),
        email: maskEmail(p.email),
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

  /**
   * GET /public/snapshot
   * Retorna snapshot público com hash da lista e bloco alvo.
   */
  async getSnapshot(req, res) {
    try {
      const snapshot = await drawService.getNextDrawSnapshot();

      return res.json({
        total_active_participants: snapshot.total_participants,
        current_list_hash: snapshot.list_hash,
        next_draw_target_block: snapshot.target_block,
        explorer_url: snapshot.explorer_url,
      });
    } catch (error) {
      console.error("Get Snapshot Error:", error);
      return res.status(500).json({
        error: "Erro ao buscar snapshot.",
      });
    }
  }

  /**
   * GET /public/next-draw
   * Retorna informações do próximo sorteio: bloco alvo e lacre da lista.
   */
  async getNextDraw(req, res) {
    try {
      // Buscar configuração do sorteio
      let targetBlock = null;
      try {
        const configResult = await db.query(`
          SELECT target_block, premio_previsto FROM sorteio_config WHERE id = 1
        `);
        if (configResult.rows.length > 0) {
          targetBlock = configResult.rows[0].target_block;
        }
      } catch (configError) {
        // Tabela pode não existir ainda
        console.log("Config table not found, using null:", configError.message);
      }

      // Buscar snapshot da lista (lacre)
      const snapshot = await drawService.getParticipantSnapshot();

      return res.json({
        target_block: targetBlock,
        list_hash: snapshot.list_hash,
        total_participants: snapshot.total_participants,
        explorer_url: targetBlock
          ? `https://mempool.space/block/${targetBlock}`
          : null,
      });
    } catch (error) {
      console.error("Get Next Draw Error:", error);
      return res.status(500).json({
        error: "Erro ao buscar dados do próximo sorteio.",
      });
    }
  }
}

export default new PublicController();
