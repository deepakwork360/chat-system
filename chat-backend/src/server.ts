import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { initSocketServer } from "./socket";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import conversationRoutes from "./routes/conversation.routes";
import messagesRoutes from "./routes/messages.routes";

const app = express();

const getAllowedOrigins = () => {
  const origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
  ];
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  return origins;
};

const isOriginAllowed = (origin: string): boolean => {
  const allowedOrigins = getAllowedOrigins();
  return (
    allowedOrigins.includes(origin) ||
    /^http:\/\/(?:10\.\d+|192\.168\.\d+|172\.(?:1[6-9]|2\d|3[01]))\.\d+\.\d+(?::\d+)?$/.test(origin) ||
    /^https?:\/\/[\w-]+\.vercel\.app$/.test(origin) ||
    /^https?:\/\/[\w-]+\.b4a\.run$/.test(origin)
  );
};

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Dynamically mirror the requesting origin to prevent CORS errors on Vercel / custom domains
    callback(null, origin || true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 204,
};

// Enable CORS for all routes and preflight OPTIONS requests
app.use(cors(corsOptions));

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
  cors: corsOptions,
});

initSocketServer(io);
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
