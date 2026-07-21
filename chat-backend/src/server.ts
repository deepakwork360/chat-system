import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { initSocketServer } from "./socket";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import conversationRoutes from "./routes/conversation.routes";
import messagesRoutes from "./routes/messages.routes";

import path from "path";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
  ];

  const origin = req.headers.origin;

  if (origin) {
    const isAllowed = allowedOrigins.includes(origin) || 
                      /^http:\/\/(?:10\.\d+|192\.168\.\d+|172\.(?:1[6-9]|2\d|3[01]))\.\d+\.\d+(?::\d+)?$/.test(origin);
    if (isAllowed) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/conversations", messagesRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Backend Running",
  });
});

const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
      ];
      if (!origin) {
        callback(null, true);
        return;
      }
      const isAllowed = allowedOrigins.includes(origin) || 
                        /^http:\/\/(?:10\.\d+|192\.168\.\d+|172\.(?:1[6-9]|2\d|3[01]))\.\d+\.\d+(?::\d+)?$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  }
});

initSocketServer(io);
app.set("io", io);

server.listen(5000, () => {
  console.log("Server running on port 5000 (127.0.0.1 host)");
});

