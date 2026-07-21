import axios from "axios";

// In production (deployed on Vercel), use the env variable pointing to Railway.
// In development & local mobile testing, dynamically resolve from window hostname.
const getBaseURL = () => {
  if (typeof window === "undefined") {
    // SSR fallback
    return process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : "http://localhost:5000/api";
  }

  // If an explicit production URL is set (Vercel env var), always use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api`;
  }

  // Local / LAN development fallback: resolve from hostname (supports mobile testing)
  const hostname = window.location.hostname;
  return `http://${hostname}:5000/api`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Re-resolve baseURL dynamically on each request (dev LAN support)
  if (typeof window !== "undefined") {
    config.baseURL = getBaseURL();
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});