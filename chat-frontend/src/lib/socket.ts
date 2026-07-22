import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getSocketUrl = (): string => {
  if (typeof window === "undefined") {
    // SSR fallback
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  }

  // In production (Vercel), use the explicit Railway backend URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Local / LAN development fallback: resolve from hostname (supports mobile testing)
  const hostname = window.location.hostname;
  return `http://${hostname}:5000`;
};

export const initSocket = (): Socket => {
  if (!socket) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    socket = io(getSocketUrl(), {
      withCredentials: true,
      autoConnect: false,
      auth: {
        token: token || "",
      },
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
