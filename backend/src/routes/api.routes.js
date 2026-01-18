import { Router } from "express";
import * as subController from "../controllers/subscriptionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

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

// ========================================
// ROTAS PROTEGIDAS (Requer Supabase Auth)
// ========================================
router.post("/admin/sortear", authMiddleware, subController.runRaffle);

export default router;
