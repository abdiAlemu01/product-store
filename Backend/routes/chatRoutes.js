import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/chatController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/conversations", requireAuth, getConversations);
router.get("/conversations/:id/messages", requireAuth, getMessages);
router.post("/conversations/:id/messages", requireAuth, sendMessage);

export default router;
