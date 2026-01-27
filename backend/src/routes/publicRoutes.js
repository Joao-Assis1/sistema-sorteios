import { Router } from "express";
import publicController from "../controllers/PublicController.js";

const router = Router();

// Rotas públicas - NÃO exigem autenticação

// Verificar status da assinatura pelo email
router.get("/status", publicController.checkStatus);

// Buscar últimos ganhadores
router.get("/winners", publicController.getRecentWinners);

// Buscar lista atual de participantes com hash de segurança
router.get("/current-list", publicController.getCurrentList);

export default router;
