import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import webhookRoutes from "./routes/webhookRoutes.js";
import drawRoutes from "./routes/drawRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import dns from "node:dns";

dotenv.config();
console.log("DB Config:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  db: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

import { dbPool as pool } from "./config/database.js";

const app = express();
const port = process.env.PORT || 3000;

// Força o Node.js a usar IPv4 (resolve o erro ENETUNREACH no Render)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

// Middleware
app.use(cors());
app.use(express.json());

// ========================================
// ROTAS PÚBLICAS (Sem autenticação)
// ========================================

app.use("/webhooks", webhookRoutes); // Webhook Lastlink - PÚBLICO
app.use("/public", publicRoutes);

// ========================================
// ROTAS ADMIN (Protegidas internamente via middleware)
// ========================================
app.use("/admin", drawRoutes);

// Health Check
app.get("/health", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();
    res.status(200).json({ status: "ok", db_time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
