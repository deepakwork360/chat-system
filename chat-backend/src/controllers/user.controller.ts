import { Request, Response } from "express";
import { db } from "../config/db";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user.userId;
    const search = String(req.query.search || "");

    const result = await db.query(
      `
      SELECT id, name, email, avatar_url
      FROM users
      WHERE (name ILIKE $1 OR email ILIKE $1)
      AND id != $2
      ORDER BY name ASC
      `,
      [`%${search}%`, currentUserId]
    );

    return res.status(200).json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
