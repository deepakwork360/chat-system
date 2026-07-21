import { Request, Response } from "express";
import { db } from "../config/db";

export const createConversation = async (req: Request, res: Response) => {
  const client = await db.connect();

  try {
    const currentUserId = (req as any).user.userId;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({
        success: false,
        message: "otherUserId is required",
      });
    }

    if (Number(otherUserId) === Number(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot create conversation with yourself",
      });
    }

    const userResult = await client.query(
      `SELECT id, name, email, avatar_url FROM users WHERE id = $1`,
      [otherUserId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingConversation = await client.query(
      `
      SELECT c.id, c.created_at, c.updated_at
      FROM conversations c
      JOIN conversation_members cm1 ON cm1.conversation_id = c.id
      JOIN conversation_members cm2 ON cm2.conversation_id = c.id
      WHERE cm1.user_id = $1
      AND cm2.user_id = $2
      LIMIT 1
      `,
      [currentUserId, otherUserId]
    );

    if (existingConversation.rows.length > 0) {
      return res.status(200).json({
        success: true,
        conversation: existingConversation.rows[0],
        otherUser: userResult.rows[0],
      });
    }

    await client.query("BEGIN");

    const conversationResult = await client.query(
      `INSERT INTO conversations DEFAULT VALUES RETURNING id, created_at, updated_at`
    );

    const conversation = conversationResult.rows[0];

    await client.query(
      `
      INSERT INTO conversation_members (conversation_id, user_id)
      VALUES ($1, $2), ($1, $3)
      `,
      [conversation.id, currentUserId, otherUserId]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      conversation,
      otherUser: userResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  } finally {
    client.release();
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user.userId;

    const result = await db.query(
      `
      SELECT
        c.id,
        c.is_group,
        c.name AS group_name,
        c.avatar_url AS group_avatar_url,
        c.description AS group_description,
        c.created_by AS group_created_by,
        c.created_at,
        c.updated_at,
        CASE WHEN c.is_group = false THEN u.id ELSE NULL END AS other_user_id,
        CASE WHEN c.is_group = false THEN u.name ELSE NULL END AS other_user_name,
        CASE WHEN c.is_group = false THEN u.email ELSE NULL END AS other_user_email,
        CASE WHEN c.is_group = false THEN u.avatar_url ELSE NULL END AS other_user_avatar_url,
        latest_message.content AS latest_message,
        latest_message.created_at AS latest_message_created_at,
        (
          SELECT COUNT(*)::int
          FROM messages
          WHERE conversation_id = c.id
          AND sender_id != $1
          AND is_read = false
        ) AS unread_count,
        (
          SELECT COUNT(*)::int
          FROM conversation_members
          WHERE conversation_id = c.id
        ) AS member_count
      FROM conversations c
      JOIN conversation_members my_member
        ON my_member.conversation_id = c.id
      LEFT JOIN conversation_members other_member
        ON other_member.conversation_id = c.id
        AND other_member.user_id != $1
        AND c.is_group = false
      LEFT JOIN users u
        ON u.id = other_member.user_id
        AND c.is_group = false
      LEFT JOIN LATERAL (
        SELECT content, created_at
        FROM messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
      ) latest_message ON true
      WHERE my_member.user_id = $1
      ORDER BY COALESCE(latest_message.created_at, c.updated_at, c.created_at) DESC
      `,
      [currentUserId]
    );

    return res.status(200).json({
      success: true,
      conversations: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user.userId;
    const conversationId = Number(req.params.conversationId);

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId is required",
      });
    }

    // Update database records
    await db.query(
      `
      UPDATE messages 
      SET is_read = true 
      WHERE conversation_id = $1 
      AND sender_id != $2 
      AND is_read = false
      `,
      [conversationId, currentUserId]
    );

    // Emit real-time Socket notification
    const io = req.app.get("io");
    if (io) {
      io.to(`conversation_${conversationId}`).emit("messages_read", {
        conversationId,
        readBy: currentUserId
      });
    }

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const createGroupConversation = async (req: Request, res: Response) => {
  const client = await db.connect();

  try {
    const currentUserId = (req as any).user.userId;
    const { name, description, userIds } = req.body;

    if (!name || String(name).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one participant must be specified",
      });
    }

    // De-duplicate user IDs and make sure current user is included
    const participantIds = Array.from(new Set([currentUserId, ...userIds.map(Number).filter((id) => !isNaN(id))]));

    await client.query("BEGIN");

    // 1. Create group conversation record
    const groupResult = await client.query(
      `
      INSERT INTO conversations (is_group, name, description, created_by)
      VALUES (true, $1, $2, $3)
      RETURNING id, is_group, name AS group_name, avatar_url AS group_avatar_url, description AS group_description, created_by AS group_created_by, created_at, updated_at
      `,
      [String(name).trim(), description ? String(description).trim() : null, currentUserId]
    );

    const group = groupResult.rows[0];

    // 2. Insert member records in bulk
    for (const userId of participantIds) {
      // Validate that participant user exists
      const userExistsResult = await client.query("SELECT id FROM users WHERE id = $1", [userId]);
      if (userExistsResult.rows.length > 0) {
        await client.query(
          "INSERT INTO conversation_members (conversation_id, user_id) VALUES ($1, $2)",
          [group.id, userId]
        );
      }
    }

    await client.query("COMMIT");

    // Enrich group chat object to match Conversation interface expected by frontend
    const enrichedGroup = {
      ...group,
      other_user_id: null,
      other_user_name: null,
      other_user_email: null,
      other_user_avatar_url: null,
      latest_message: null,
      latest_message_created_at: null,
      unread_count: 0,
      member_count: participantIds.length
    };

    // 3. Emit real-time socket alert to all online participants' private rooms
    const io = req.app.get("io");
    if (io) {
      participantIds.forEach((memberId) => {
        io.to(`user_${memberId}`).emit("conversation_created", enrichedGroup);
      });
    }

    return res.status(201).json({
      success: true,
      conversation: enrichedGroup,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in createGroupConversation:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  } finally {
    client.release();
  }
};

export const getConversationMembers = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user.userId;
    const conversationId = Number(req.params.conversationId);

    if (!conversationId || isNaN(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "A valid conversationId parameter is required",
      });
    }

    // 1. Validate membership of the current requesting user
    const membershipCheck = await db.query(
      "SELECT 1 FROM conversation_members WHERE conversation_id = $1 AND user_id = $2",
      [conversationId, currentUserId]
    );

    if (membershipCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this conversation",
      });
    }

    // 2. Fetch all members
    const result = await db.query(
      `
      SELECT u.id, u.name, u.email, u.avatar_url
      FROM conversation_members cm
      JOIN users u ON u.id = cm.user_id
      WHERE cm.conversation_id = $1
      ORDER BY u.name ASC
      `,
      [conversationId]
    );

    return res.status(200).json({
      success: true,
      members: result.rows,
    });
  } catch (error) {
    console.error("Error in getConversationMembers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
