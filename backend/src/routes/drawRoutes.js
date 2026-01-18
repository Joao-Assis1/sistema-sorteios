import { Router } from "express";
import drawController from "../controllers/DrawController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

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

export default router;
