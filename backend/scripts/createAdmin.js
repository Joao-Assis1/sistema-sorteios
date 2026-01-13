import "dotenv/config"; // Carrega o .env automaticamente
import bcrypt from "bcrypt";
import { pool } from "../src/config/database.js"; // Importação atualizada com .js

// Captura argumentos da linha de comando
const [, , email, senhaPlain] = process.argv;

const createAdmin = async () => {
  // 1. Validação Básica
  if (!email || !senhaPlain) {
    console.error("❌ Erro: Uso incorreto.");
    console.log("👉 Uso: npm run create-admin -- <email> <senha>");
    process.exit(1);
  }

  try {
    console.log(`⏳ Criando administrador: ${email}...`);

    // 2. Verificar se já existe
    const checkQuery = "SELECT id FROM administradores WHERE email = $1";
    const checkRes = await pool.query(checkQuery, [email]);

    if (checkRes.rows.length > 0) {
      console.error("❌ Erro: Já existe um administrador com este e-mail.");
      process.exit(1);
    }

    // 3. Gerar Hash
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senhaPlain, saltRounds);

    // 4. Salvar no Banco
    const insertQuery = `
            INSERT INTO administradores (email, senha_hash)
            VALUES ($1, $2)
            RETURNING id, email, criado_em;
        `;

    const res = await pool.query(insertQuery, [email, senhaHash]);
    const novoAdmin = res.rows[0];

    console.log("✅ Administrador criado com sucesso!");
    console.table(novoAdmin);
  } catch (error) {
    console.error("❌ Erro ao criar administrador:", error.message);
  } finally {
    // 5. Encerrar conexão
    await pool.end();
    process.exit(0);
  }
};

createAdmin();
