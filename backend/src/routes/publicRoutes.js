import { Router } from "express";
import publicController from "../controllers/PublicController.js";

const router = Router();

// Rotas públicas - NÃO exigem autenticação

// Verificar status da assinatura pelo email
router.get("/status", publicController.checkStatus);

// Buscar últimos ganhadores
router.get("/winners", publicController.getRecentWinners);

export default router;
