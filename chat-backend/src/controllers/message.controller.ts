import { Request, Response } from "express";
import { db } from "../config/db";

const checkConversationMember = async (conversationId: number, userId: number) => {
  const result = await db.query(
    `
    SELECT id
    FROM conversation_members
    WHERE conversation_id = $1
    AND user_id = $2
    `,
    [conversationId, userId]
  );

  return result.rows.length > 0;
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user.userId;
    const conversationId = Number(req.params.conversationId);
    
    let { content, messageType } = req.body;
    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileSize: number | null = null;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId is required",
      });
    }

    if (req.file) {
      // It's a file upload (Cloudinary URL or local relative path)
      if (req.file.path && (req.file.path.startsWith("http://") || req.file.path.startsWith("https://"))) {
        fileUrl = req.file.path;
      } else if (req.file.filename) {
        fileUrl = `/uploads/messages/${req.file.filename}`;
      } else {
        fileUrl = (req.file as any).secure_url || (req.file as any).url || null;
      }
      fileName = req.file.originalname;
      fileSize = req.file.size;
      messageType = req.file.mimetype.startsWith("image/") 
        ? "image" 
        : req.file.mimetype.startsWith("audio/") 
          ? "audio" 
          : "file";
      content = content || req.file.originalname;
    } else {
      // It's a text message or location share
      messageType = messageType || "text";
      if (!content || String(content).trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Message content is required",
        });
      }
    }

    const isMember = await checkConversationMember(conversationId, senderId);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to send message in this conversation",
      });
    }

    const result = await db.query(
      `
      INSERT INTO messages (conversation_id, sender_id, content, message_type, file_url, file_name, file_size)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, conversation_id, sender_id, content, message_type, file_url, file_name, file_size, is_read, is_deleted, created_at
      `,
      [
        conversationId,
        senderId,
        String(content).trim(),
        messageType,
        fileUrl,
        fileName,
        fileSize
      ]
    );

    await db.query(
      `UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [conversationId]
    );

    const messageObj = result.rows[0];

    // Fetch sender profile details to enrich the socket message payload
    const senderResult = await db.query(
      `SELECT name, email, avatar_url FROM users WHERE id = $1`,
      [senderId]
    );

    const enrichedMessage = {
      ...messageObj,
      sender_name: senderResult.rows[0]?.name || "Unknown",
      sender_email: senderResult.rows[0]?.email || "",
      sender_avatar_url: senderResult.rows[0]?.avatar_url || null
    };

    // Emit socket event to conversation room and other members' private user rooms
    const io = req.app.get("io");
    if (io) {
      // Emit to conversation room (active view)
      io.to(`conversation_${conversationId}`).emit("new_message", enrichedMessage);

      // Fetch all member IDs in this conversation to send background alerts
      try {
        const membersResult = await db.query(
          "SELECT user_id FROM conversation_members WHERE conversation_id = $1",
          [conversationId]
        );
        membersResult.rows.forEach((row) => {
          if (Number(row.user_id) !== Number(senderId)) {
            io.to(`user_${row.user_id}`).emit("new_message", enrichedMessage);
          }
        });
      } catch (err) {
        console.error("Failed to fetch conversation members for socket broadcast:", err);
      }
    }

    return res.status(201).json({
      success: true,
      message: enrichedMessage,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user.userId;
    const conversationId = Number(req.params.conversationId);

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId is required",
      });
    }

    const isMember = await checkConversationMember(conversationId, currentUserId);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to read this conversation",
      });
    }

    const result = await db.query(
      `
      SELECT
        m.id,
        m.conversation_id,
        m.sender_id,
        CASE 
          WHEN m.is_deleted = true THEN 'This message was deleted'
          ELSE m.content
        END AS content,
        CASE 
          WHEN m.is_deleted = true THEN 'deleted'
          ELSE m.message_type
        END AS message_type,
        CASE 
          WHEN m.is_deleted = true THEN NULL
          ELSE m.file_url
        END AS file_url,
        CASE 
          WHEN m.is_deleted = true THEN NULL
          ELSE m.file_name
        END AS file_name,
        CASE 
          WHEN m.is_deleted = true THEN NULL
          ELSE m.file_size
        END AS file_size,
        m.is_read,
        m.is_deleted,
        m.created_at,
        u.name AS sender_name,
        u.email AS sender_email,
        u.avatar_url AS sender_avatar_url
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC
      `,
      [conversationId]
    );

    return res.status(200).json({
      success: true,
      messages: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user.userId;
    const messageId = Number(req.params.messageId);

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "messageId is required",
      });
    }

    // 1. Fetch message details to check ownership
    const messageResult = await db.query(
      "SELECT id, sender_id, conversation_id, created_at FROM messages WHERE id = $1",
      [messageId]
    );

    if (messageResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const message = messageResult.rows[0];

    // 2. Validate ownership (only the sender can unsend messages)
    if (Number(message.sender_id) !== Number(currentUserId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this message",
      });
    }

    // Enforce 3-hour delete window limit
    const messageTime = new Date(message.created_at).getTime();
    const currentTime = Date.now();
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    if (currentTime - messageTime > threeHoursInMs) {
      return res.status(400).json({
        success: false,
        message: "Messages can only be deleted within 3 hours of sending",
      });
    }

    // 3. Mark message as deleted and wipe raw storage for absolute privacy
    await db.query(
      `
      UPDATE messages 
      SET is_deleted = true,
          content = 'This message was deleted',
          message_type = 'deleted',
          file_url = NULL,
          file_name = NULL,
          file_size = NULL
      WHERE id = $1
      `,
      [messageId]
    );

    // 4. Broadcast message_deleted socket event to participants
    const io = req.app.get("io");
    if (io) {
      const payload = {
        conversationId: message.conversation_id,
        messageId: message.id
      };
      
      // Emit to active conversation room
      io.to(`conversation_${message.conversation_id}`).emit("message_deleted", payload);

      // Emit to each user's private rooms to reload sidebar previews
      try {
        const membersResult = await db.query(
          "SELECT user_id FROM conversation_members WHERE conversation_id = $1",
          [message.conversation_id]
        );
        membersResult.rows.forEach((row) => {
          io.to(`user_${row.user_id}`).emit("message_deleted", payload);
        });
      } catch (err) {
        console.error("Failed to fetch conversation members for delete broadcast:", err);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      messageId: message.id,
      conversationId: message.conversation_id
    });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteMessagesBatch = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user.userId;
    const { messageIds } = req.body;

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "messageIds array is required",
      });
    }

    // Convert messageIds elements to numbers
    const ids = messageIds.map(Number).filter((id) => !isNaN(id));
    if (ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid messageIds array",
      });
    }

    // 1. Fetch all matching messages
    const queryResult = await db.query(
      "SELECT id, sender_id, conversation_id, created_at FROM messages WHERE id = ANY($1)",
      [ids]
    );

    if (queryResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No messages found for the provided IDs",
      });
    }

    const messages = queryResult.rows;
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const currentTime = Date.now();

    // 2. Validate ownership & time limit for all messages
    for (const msg of messages) {
      if (Number(msg.sender_id) !== Number(currentUserId)) {
        return res.status(403).json({
          success: false,
          message: `You are not authorized to delete message ID ${msg.id}`,
        });
      }

      const msgTime = new Date(msg.created_at).getTime();
      if (currentTime - msgTime > threeHoursInMs) {
        return res.status(400).json({
          success: false,
          message: `Message ID ${msg.id} exceeds the 3-hour delete window`,
        });
      }
    }

    // 3. Mark messages as deleted
    await db.query(
      `
      UPDATE messages
      SET is_deleted = true,
          content = 'This message was deleted',
          message_type = 'deleted',
          file_url = NULL,
          file_name = NULL,
          file_size = NULL
      WHERE id = ANY($1)
      `,
      [ids]
    );

    // Group broadcast by conversationId
    const firstMsg = messages[0];
    const conversationId = firstMsg.conversation_id;

    // 4. Emit socket event
    const io = req.app.get("io");
    if (io) {
      const payload = {
        conversationId,
        messageIds: ids
      };

      // Emit to active conversation room
      io.to(`conversation_${conversationId}`).emit("messages_deleted", payload);

      // Emit to private user rooms for background updates
      try {
        const membersResult = await db.query(
          "SELECT user_id FROM conversation_members WHERE conversation_id = $1",
          [conversationId]
        );
        membersResult.rows.forEach((row) => {
          io.to(`user_${row.user_id}`).emit("messages_deleted", payload);
        });
      } catch (err) {
        console.error("Failed to fetch conversation members for batch delete broadcast:", err);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Messages deleted successfully",
      messageIds: ids,
      conversationId
    });
  } catch (error) {
    console.error("Error in deleteMessagesBatch:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
