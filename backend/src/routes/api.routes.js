import { Router } from "express";
import * as subController from "../controllers/subscriptionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import DrawController from "../controllers/DrawController.js";
import WebhookController from "../controllers/WebhookController.js";

const router = Router();

// Middleware de Validação Inline (Mantenha simples)
const validateCadastro = (req, res, next) => {
  const { nome, email, lastlink_id } = req.body;
  if (!nome || !email || !lastlink_id) {
    const error = new Error("Dados incompletos.");
    error.statusCode = 400;
    return next(error);
  }
  next();
};

// ========================================
// ROTAS PÚBLICAS (Sem autenticação)
// ========================================
router.post(
  "/webhook/cadastro",
  validateCadastro,
  subController.createSubscription,
);

// Rota do Webhook Lastlink (pagamentos e cancelamentos)
router.post("/webhook/lastlink", (req, res) =>
  WebhookController.handleLastlink(req, res),
);
router.get("/usuario/status", subController.checkStatus);
router.get("/public/winners", (req, res) =>
  DrawController.getHistory(req, res),
);

// ========================================
// ROTAS PROTEGIDAS (Requer Supabase Auth)
// ========================================

// Dashboard e dados administrativos
router.get("/admin/dashboard", authMiddleware, (req, res) =>
  DrawController.getDashboardData(req, res),
);

// Executar sorteio
router.post("/admin/sortear", authMiddleware, (req, res) =>
  DrawController.createDraw(req, res),
);

// Adicionar participante manualmente
router.post("/admin/participants", authMiddleware, (req, res) =>
  DrawController.addParticipant(req, res),
);

// Buscar membros (search)
router.get("/admin/members", authMiddleware, (req, res) =>
  DrawController.searchMembers(req, res),
);

export default router;
