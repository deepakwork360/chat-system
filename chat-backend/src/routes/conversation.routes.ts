import { Router } from "express";
import {
  createConversation,
  getConversations,
  markAsRead,
  createGroupConversation,
  getConversationMembers,
} from "../controllers/conversation.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createConversation);
router.post("/group", authMiddleware, createGroupConversation);
router.get("/", authMiddleware, getConversations);
router.get("/:conversationId/members", authMiddleware, getConversationMembers);
router.patch("/:conversationId/read", authMiddleware, markAsRead);

export default router;
