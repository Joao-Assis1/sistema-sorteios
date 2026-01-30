import { Router } from "express";
import drawController from "../controllers/DrawController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import WebhookController from "../controllers/WebhookController.js";

const router = Router();

// ========================================
// ROTAS ADMIN (Protegidas por Supabase Auth)
// ========================================

// Rota para disparar sorteio manual
router.post("/draw", authMiddleware, drawController.createDraw);

// Dashboard data (stats, participants, history)
router.get("/dashboard-data", authMiddleware, drawController.getDashboardData);

// Add manual participant
router.post("/participants", authMiddleware, drawController.addParticipant);

// Search members
router.get("/members", authMiddleware, drawController.searchMembers);

// Draw configuration (get/update)
router.get("/draw-config", authMiddleware, drawController.getDrawConfig);
router.put("/draw-config", authMiddleware, drawController.updateDrawConfig);

// Export participants as CSV
router.get(
  "/export-participants",
  authMiddleware,
  drawController.exportParticipants,
);

// ========================================
// ROTA PÚBLICA (Sem autenticação)
// ========================================
// GET /admin/history - Histórico de sorteios público (resumido)
router.get("/history", (req, res) => drawController.getHistory(req, res));

// GET /admin/results - Resultados de auditoria públicos (com dados completos)
// Esta rota retorna os campos de transparência para verificação externa
router.get("/results", (req, res) => drawController.getAuditResults(req, res));

// POST /admin/webhook - Webhook Lastlink (pagamentos e cancelamentos)
router.post("/webhook", (req, res) =>
  WebhookController.handleLastlink(req, res),
);

export default router;
