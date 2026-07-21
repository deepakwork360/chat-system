import { Router } from "express";
import { getMessages, sendMessage, deleteMessage, deleteMessagesBatch } from "../controllers/message.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadMessageFile } from "../middleware/upload.middleware";

const router = Router();

router.get("/:conversationId/messages", authMiddleware, getMessages);
router.post("/:conversationId/messages", authMiddleware, uploadMessageFile.single("file"), sendMessage);
router.delete("/messages/:messageId", authMiddleware, deleteMessage);
router.post("/messages/delete-batch", authMiddleware, deleteMessagesBatch);

export default router;
