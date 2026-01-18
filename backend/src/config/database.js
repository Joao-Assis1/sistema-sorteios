import pg from "pg";
import dotenv from "dotenv";
import dns from "node:dns";

dotenv.config();

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const { Pool } = pg;

// Verifica se estamos em produção (Render) ou local
// O Render define automaticamente a variável DATABASE_URL
const isProduction =
  process.env.NODE_ENV === "production" || process.env.DATABASE_URL;

const connectionConfig = isProduction
  ? {
      // PRODUÇÃO (Render): Usa a URL completa e ativa SSL
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Necessário para aceitar o certificado do Render/Neon
      },
    }
  : {
      // LOCAL (Docker/PC): Usa as variáveis separadas do .env
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    };

const pool = new Pool(connectionConfig);

// Debug para sabermos se conectou
pool.on("connect", () => {
  console.log("✅ Conexão com Banco de Dados estabelecida!");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);
export const dbPool = pool;
export { pool };
export default pool;
