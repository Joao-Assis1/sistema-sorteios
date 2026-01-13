import express from "express";
import ticketController from "../controllers/TicketController.js";

const router = express.Router();

router.post("/purchase", ticketController.purchase); // Should be protected
router.get("/:raffleId", ticketController.listByRaffle);

export default router;
