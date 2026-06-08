import express from "express";
import { sendMessage, getMessages, deleteMessage } from "../controllers/messageController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route for customers to send messages
router.post("/", sendMessage);

// Admin-only routes
router.get("/", requireAdmin, getMessages);
router.delete("/:id", requireAdmin, deleteMessage);

export default router;
