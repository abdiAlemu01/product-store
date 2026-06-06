import express from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getOrders);
router.post("/", requireAuth, createOrder);

export default router;
