import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";

// Track online users: Map<userId, socketId[]>
export const onlineUsers = new Map<number, string[]>();

export const initSocketServer = (io: SocketIOServer) => {
  // Authentication middleware
  io.use((socket: Socket, next) => {
    try {
      let token: string | undefined;

      // 1. Try to extract token from handshake auth or query params (localStorage client approach)
      if (socket.handshake.auth && socket.handshake.auth.token) {
        token = socket.handshake.auth.token;
      } else if (socket.handshake.query && typeof socket.handshake.query.token === "string") {
        token = socket.handshake.query.token;
      } else if (socket.handshake.headers.authorization) {
        token = socket.handshake.headers.authorization.split(" ")[1];
      }

      // 2. Fallback: try to extract token from cookie header
      if (!token && socket.handshake.headers.cookie) {
        const cookieHeader = socket.handshake.headers.cookie;
        const cookies = cookieHeader.split(";").reduce((acc: any, curr: any) => {
          const [key, value] = curr.split("=");
          if (key && value) {
            acc[key.trim()] = value.trim();
          }
          return acc;
        }, {} as Record<string, string>);
        token = cookies.token;
      }

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as {
        userId: number;
      };

      socket.data.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user;
    if (!user) return;
    const userId = user.userId;

    console.log(`Socket client connected: User ID ${userId}`);

    // Add socket to tracking map
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, []);
    }
    onlineUsers.get(userId)!.push(socket.id);

    // Join private room for user-targeted messages
    socket.join(`user_${userId}`);
    console.log(`User ID ${userId} joined private room: user_${userId}`);

    // Broadcast status change to other users
    io.emit("user_status_change", {
      userId,
      status: "online"
    });

    // Client requests list of online users
    socket.on("get_online_users", () => {
      socket.emit("online_users_list", Array.from(onlineUsers.keys()));
    });

    // Join room for active conversation
    socket.on("join_conversation", (conversationId: number | string) => {
      const roomName = `conversation_${conversationId}`;
      socket.join(roomName);
      console.log(`User ${userId} joined room: ${roomName}`);
    });

    // Leave room
    socket.on("leave_conversation", (conversationId: number | string) => {
      const roomName = `conversation_${conversationId}`;
      socket.leave(roomName);
      console.log(`User ${userId} left room: ${roomName}`);
    });

    // Typing indicators
    socket.on("typing_start", (data: { conversationId: number | string; userName?: string }) => {
      const roomName = `conversation_${data.conversationId}`;
      socket.to(roomName).emit("typing_status", {
        conversationId: data.conversationId,
        userId,
        userName: data.userName || "Someone",
        isTyping: true
      });
    });

    socket.on("typing_stop", (data: { conversationId: number | string }) => {
      const roomName = `conversation_${data.conversationId}`;
      socket.to(roomName).emit("typing_status", {
        conversationId: data.conversationId,
        userId,
        isTyping: false
      });
    });

    socket.on("disconnect", () => {
      console.log(`Socket client disconnected: User ID ${userId}`);
      const socketIds = onlineUsers.get(userId) || [];
      const remainingSocketIds = socketIds.filter((id) => id !== socket.id);

      if (remainingSocketIds.length === 0) {
        onlineUsers.delete(userId);
        // Broadcast offline status
        io.emit("user_status_change", {
          userId,
          status: "offline"
        });
      } else {
        onlineUsers.set(userId, remainingSocketIds);
      }
    });
  });
};
