import { Router } from "express";
import * as subController from "../controllers/subscriptionController.js";
import authController from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

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

// Rotas Públicas
router.post(
  "/webhook/cadastro",
  validateCadastro,
  subController.createSubscription
);
router.get("/usuario/status", subController.checkStatus);
router.post("/auth/login", authController.login);

// Rotas Privadas (Admin)
router.post("/admin/sortear", verifyToken, subController.runRaffle);

export default router;
