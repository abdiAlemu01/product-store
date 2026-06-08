import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
  openConversation,
} from "../controllers/chatController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/conversations", requireAuth, getConversations);
router.post("/conversations/open", requireAuth, openConversation);
router.get("/conversations/:id/messages", requireAuth, getMessages);
router.post("/conversations/:id/messages", requireAuth, sendMessage);

export default router;
