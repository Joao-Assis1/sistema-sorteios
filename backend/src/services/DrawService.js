import { pool } from "../config/database.js";
import axios from "axios";
import crypto from "crypto";
import { deterministicSelect } from "../utils/lotteryUtils.js";

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

  async performManualDraw(prizeDescription) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Buscar hash do Bitcoin ANTES do sorteio (para auditoria)
      console.log("🔗 Buscando hash do Bitcoin...");
      const bitcoinData = await this.fetchLatestBitcoinHash();
      console.log("✅ Hash obtido:", bitcoinData.hash.substring(0, 16) + "...");

      // 2. Buscar todos os membros ATIVOS (ordenados por ID para consistência)
      const usersQuery = `
        SELECT id, nome, email 
        FROM lastlink_members 
        WHERE status = 'active'
        ORDER BY id ASC
      `;
      const usersRes = await client.query(usersQuery);
      const activeUsers = usersRes.rows;

      console.log(`👥 Participantes ativos encontrados: ${activeUsers.length}`);

      // 3. Validação se lista está vazia
      if (activeUsers.length === 0) {
        throw new Error("Nenhum assinante ativo para sortear.");
      }

      // 4. Sorteio DETERMINÍSTICO (substituindo Math.random)
      const { winner, index } = deterministicSelect(
        bitcoinData.hash,
        activeUsers,
      );

      console.log(`🎉 Vencedor selecionado: ${winner.nome} (índice ${index})`);

      // 5. Calcular dados de auditoria ANTES do INSERT
      const participantsCount = activeUsers.length;

      // Calcular draw_hash manualmente (mesmo algoritmo do trigger)
      // Formato: seed_value | seed_source | participante_id
      const concatenated = `${bitcoinData.hash}|https://blockchain.info/q/latesthash|${winner.id}`;
      const crypto = await import("crypto");
      const drawHash = crypto
        .createHash("sha256")
        .update(concatenated)
        .digest("hex");

      // 6. Gerar UUID para o novo registro de sorteio (id é TEXT, não auto-gerado)
      const sorteioId = crypto.randomUUID();

      // 7. Salvar na tabela historico_sorteios COM todos os campos de transparência
      const insertDrawQuery = `
        INSERT INTO historico_sorteios (
          id,
          data_sorteio, 
          premio, 
          participante_id,
          seed_value,
          seed_source,
          participants_count,
          draw_hash
        )
        VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7)
        RETURNING id, data_sorteio, premio, seed_value, seed_source, draw_hash, participants_count;
      `;
      const drawRes = await client.query(insertDrawQuery, [
        sorteioId,
        prizeDescription,
        winner.id,
        bitcoinData.hash,
        "https://blockchain.info/q/latesthash",
        participantsCount,
        drawHash,
      ]);
      const draw = drawRes.rows[0];

      await client.query("COMMIT");
      console.log("✅ Sorteio salvo com sucesso! ID:", draw.id);

      return {
        winner: {
          name: winner.nome,
          email: winner.email,
        },
        total_participants: activeUsers.length,
        draw_details: draw,
        audit_data: {
          seed_value: bitcoinData.hash,
          seed_source: "https://blockchain.info/q/latesthash",
          draw_hash: drawHash,
          winner_index: index,
          total_participants: activeUsers.length,
          algorithm: "BigInt(0x + seed_value) % total_participants",
        },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("❌ Erro no sorteio:", error.message);

      // Log detalhado para erros de constraint
      const notNull = "23502";
      const unique = "23505";
      if (error.code === notNull) {
        console.error("⚠️ Violação NOT NULL - coluna:", error.column);
      } else if (error.code === "23503") {
        console.error("⚠️ Violação FK - detalhe:", error.detail);
      } else if (error.code === unique) {
        console.error("⚠️ Violação UNIQUE - detalhe:", error.detail);
      }

      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Gera um snapshot imutável da lista de participantes ativos.
   * Retorna o hash SHA-256 da lista (lacre) e dados anonimizados.
   * @returns {Promise<{total_participants: number, list_hash: string, participants: Array}>}
   */
  async getParticipantSnapshot() {
    try {
      // 1. Buscar todos os membros ativos ordenados por ID (ordem determinística)
      const query = `
        SELECT id, nome, email 
        FROM lastlink_members 
        WHERE status = 'active'
        ORDER BY id ASC
      `;
      const result = await pool.query(query);
      const activeUsers = result.rows;

      // 2. Gerar hash SHA-256 concatenando IDs dos participantes
      // Este hash serve como "lacre" da lista - qualquer alteração muda o hash
      const idsConcatenated = activeUsers.map((u) => u.id).join("|");
      const listHash = crypto
        .createHash("sha256")
        .update(idsConcatenated)
        .digest("hex");

      // 3. Retornar dados com "Número da Sorte" (índice + 1)
      const participants = activeUsers.map((user, index) => ({
        lucky_number: index + 1,
        name: user.nome,
        email: user.email,
      }));

      console.log(
        `📋 Snapshot gerado: ${activeUsers.length} participantes, hash: ${listHash.substring(0, 16)}...`,
      );

      return {
        total_participants: activeUsers.length,
        list_hash: listHash,
        participants,
      };
    } catch (error) {
      console.error("❌ Erro ao gerar snapshot:", error.message);
      throw new Error("Falha ao gerar snapshot da lista de participantes.");
    }
  }

  /**
   * Busca o hash de um bloco Bitcoin específico pela altura.
   * @param {number} blockHeight - Altura do bloco alvo
   * @returns {Promise<{hash: string, height: number}>}
   */
  async fetchBlockHashByHeight(blockHeight) {
    try {
      const response = await axios.get(
        `https://blockchain.info/block-height/${blockHeight}?format=json`,
        { timeout: 15000 },
      );

      if (response.data && response.data.blocks && response.data.blocks[0]) {
        const block = response.data.blocks[0];
        return {
          hash: block.hash,
          height: block.height,
        };
      }

      throw new Error(`Bloco ${blockHeight} não encontrado.`);
    } catch (error) {
      console.error(`❌ Erro ao buscar bloco ${blockHeight}:`, error.message);
      throw new Error(`Falha ao obter hash do bloco ${blockHeight}.`);
    }
  }

  /**
   * Retorna snapshot completo para o endpoint público /public/snapshot.
   * Inclui o bloco alvo do próximo sorteio se configurado.
   * @returns {Promise<{total_participants, list_hash, target_block, explorer_url}>}
   */
  async getNextDrawSnapshot() {
    try {
      // Gerar snapshot da lista atual
      const snapshot = await this.getParticipantSnapshot();

      // Bloco alvo pode ser configurado via variável de ambiente ou banco
      // Por enquanto, usamos uma variável de ambiente ou null
      const targetBlock = process.env.NEXT_DRAW_TARGET_BLOCK
        ? parseInt(process.env.NEXT_DRAW_TARGET_BLOCK, 10)
        : null;

      return {
        total_participants: snapshot.total_participants,
        list_hash: snapshot.list_hash,
        target_block: targetBlock,
        explorer_url: targetBlock
          ? `https://mempool.space/block/${targetBlock}`
          : null,
      };
    } catch (error) {
      console.error("❌ Erro ao gerar snapshot para endpoint:", error.message);
      throw error;
    }
  }
}

export default new DrawService();
