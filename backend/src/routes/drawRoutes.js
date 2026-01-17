import { Router } from "express";
import drawController from "../controllers/DrawController.js";

const router = Router();

// Rota para disparar sorteio manual
router.post("/draw", drawController.createDraw);

// Dashboard data (stats, participants, history)
router.get("/dashboard-data", drawController.getDashboardData);

// Add manual participant
router.post("/participants", drawController.addParticipant);

export default router;
