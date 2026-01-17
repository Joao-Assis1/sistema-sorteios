import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/api.routes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import drawRoutes from "./routes/drawRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

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

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/admin", drawRoutes);
app.use("/public", publicRoutes);

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
