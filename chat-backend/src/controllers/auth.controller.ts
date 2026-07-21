import { Request, Response } from "express";
import { db } from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try{
    const { name, email, password } = req.body;

    const existingUser = await db.query("Select * FROM users WHERE email=$1", [email])
  
  if (existingUser.rows.length > 0) {
     return res.status(400).json({
       message: "Email already exists"
     })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(`INSERT INTO USERS (name, email, password) VALUES($1, $2, $3)`,
    [ name, email, hashedPassword]
  );

  return res.status(201).json({
    message: "User Created",
     });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    })
   }
  };

export const login = async (req: Request, res: Response) => {
    try {

      const { email, password } = req.body;

      const result = await db.query(`SELECT * FROM users WHERE email=$1`, [email])

     const user = result.rows[0]

     if(!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
     }

     const isMatch = await bcrypt.compare(password, user.password);

     if(!isMatch) {
      return res.status(401).json({
        message: "Invalid credntials"
      });
     }

     const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET as string, { expiresIn: "7d",});
     return res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "lax", // or strict
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }).json({
      message: "Login Successfull"
    });
     } catch (error:any) {
         console.error(error);
      
       res.status(500).json({
        message: "Server Error",
       })
     }
  }

  // profile route
  export const profile = async ( req: Request, res: Response ) => {

    const userId = (req as any).user.userId;
    const result = await db.query(` SELECT id, name, email, avatar_url FROM users WHERE id=$1`, [userId]);

    return res.json( result.rows[0]);
  }

  // update profile route
  export const updateProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          message: "Name and email are required",
        });
      }

      const existingUser = await db.query(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [email, userId]
      );
      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          message: "Email is already taken",
        });
      }

      let avatarUrl: string | null = null;
      if (req.file) {
        avatarUrl = `http://localhost:5000/uploads/avatars/${req.file.filename}`;
      }

      let query = "";
      let params: any[] = [];

      if (avatarUrl) {
        query = `
          UPDATE users 
          SET name = $1, email = $2, avatar_url = $3 
          WHERE id = $4 
          RETURNING id, name, email, avatar_url
        `;
        params = [name, email, avatarUrl, userId];
      } else {
        query = `
          UPDATE users 
          SET name = $1, email = $2 
          WHERE id = $3 
          RETURNING id, name, email, avatar_url
        `;
        params = [name, email, userId];
      }

      const result = await db.query(query, params);
      return res.json({
        message: "Profile updated successfully",
        user: result.rows[0],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  };

  // logout route
  export const logout = async ( req: Request, res: Response ) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.json({ message: "Logged out successfully" });
  }