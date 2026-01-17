import { Router } from "express";
import webhookController from "../controllers/WebhookController.js";

const router = Router();

router.post("/lastlink", webhookController.handleLastlink);

export default router;
