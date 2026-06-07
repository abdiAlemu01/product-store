import express from "express";
import {
  createOrder,
  getOrders,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getOrders);
router.post("/", requireAuth, createOrder);
router.patch("/:id/status", requireAuth, updateOrderStatus);
router.delete("/:id", requireAuth, deleteOrder);

export default router;
