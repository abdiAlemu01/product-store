import express from "express";
import {
  createPromotion,
  getCustomerByPhone,
} from "../controllers/customerController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", requireAdmin, getCustomerByPhone);
router.post("/promotions", requireAdmin, createPromotion);

export default router;
