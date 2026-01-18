import { Router } from "express";
import * as subController from "../controllers/subscriptionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import DrawController from "../controllers/DrawController.js";

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
router.get("/usuario/status", subController.checkStatus);
router.get("/public/winners", (req, res) =>
  DrawController.getHistory(req, res),
);

// ========================================
// ROTAS PROTEGIDAS (Requer Supabase Auth)
// ========================================
router.post("/admin/sortear", authMiddleware, subController.runRaffle);

export default router;
