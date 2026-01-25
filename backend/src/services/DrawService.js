import { pool } from "../config/database.js";
import axios from "axios";

class DrawService {
  /**
   * Busca o hash do último bloco de Bitcoin na API Blockchain.info
   * @returns {Promise<{hash: string, fetchedAt: string}>}
   */
  async fetchLatestBitcoinHash() {
    try {
      const response = await axios.get("https://blockchain.info/q/latesthash", {
        timeout: 10000,
      });
      return {
        hash: response.data,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Erro ao buscar hash Bitcoin:", error.message);
      throw new Error("Falha ao obter hash do bloco Bitcoin para auditoria.");
    }
  }

  /**
   * Seleção determinística baseada em seed (hash hexadecimal)
   * @param {string} seedValue - Hash hexadecimal (ex: "0000...abc123")
   * @param {Array} participants - Lista de participantes ordenada por ID
   * @returns {{winner: object, index: number}}
   */
  deterministicSelect(seedValue, participants) {
    // Converte hash hexadecimal para BigInt
    const seed = BigInt("0x" + seedValue);
    const total = BigInt(participants.length);
    const winnerIndex = Number(seed % total);

    return {
      winner: participants[winnerIndex],
      index: winnerIndex,
    };
  }

  async performManualDraw(prizeDescription) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Buscar hash do Bitcoin ANTES do sorteio (para auditoria)
      const bitcoinData = await this.fetchLatestBitcoinHash();

      // 2. Buscar todos os membros ATIVOS (ordenados por ID para consistência)
      const usersQuery = `
        SELECT id, nome, email 
        FROM lastlink_members 
        WHERE status = 'active'
        ORDER BY id ASC
      `;
      const usersRes = await client.query(usersQuery);
      const activeUsers = usersRes.rows;

      // 3. Validação se lista está vazia
      if (activeUsers.length === 0) {
        throw new Error("Nenhum assinante ativo para sortear.");
      }

      // 4. Sorteio DETERMINÍSTICO (substituindo Math.random)
      const { winner, index } = this.deterministicSelect(
        bitcoinData.hash,
        activeUsers,
      );

      // 5. Calcular dados de auditoria ANTES do INSERT (para satisfazer o trigger de validação)
      const participantsCount = activeUsers.length;

      // Calcular draw_hash manualmente (mesmo algoritmo do trigger)
      // Formato: seed_value | seed_source | participante_id
      const concatenated = `${bitcoinData.hash}|blockchain.info/q/latesthash|${winner.id}`;
      const crypto = await import("crypto");
      const drawHash = crypto
        .createHash("sha256")
        .update(concatenated)
        .digest("hex");

      // 6. Salvar na tabela historico_sorteios COM todos os campos de transparência
      const insertDrawQuery = `
        INSERT INTO historico_sorteios (
          data_sorteio, 
          premio, 
          participante_id,
          seed_value,
          seed_source,
          participants_count,
          draw_hash
        )
        VALUES (NOW(), $1, $2, $3, $4, $5, $6)
        RETURNING id, data_sorteio, premio, seed_value, seed_source, draw_hash, participants_count;
      `;
      const drawRes = await client.query(insertDrawQuery, [
        prizeDescription,
        winner.id,
        bitcoinData.hash,
        "blockchain.info/q/latesthash",
        participantsCount,
        drawHash,
      ]);
      const draw = drawRes.rows[0];

      await client.query("COMMIT");

      return {
        winner: {
          name: winner.nome,
          email: winner.email,
        },
        total_participants: activeUsers.length,
        draw_details: draw,
        audit_data: {
          seed_value: bitcoinData.hash,
          seed_source: "blockchain.info/q/latesthash",
          draw_hash: drawHash,
          winner_index: index,
          total_participants: activeUsers.length,
          algorithm: "BigInt(0x + seed_value) % total_participants",
        },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new DrawService();
