import express from "express";
import raffleController from "../controllers/RaffleController.js";

const router = express.Router();
// const authMiddleware = require('../middlewares/authMiddleware'); // TODO: Implement middleware for admin check

router.post("/", raffleController.create); // Should be admin protected
router.get("/", raffleController.list);
router.get("/:id", raffleController.getOne);

export default router;
