import { api } from "@/lib/api";
import { LoginPayload, LoginResponse, RegisterPayload, AuthUser } from "@/types/auth.types";

export const register = async (data: RegisterPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
}

export const getProfile = async (): Promise<AuthUser> => {
  const response = await api.get("/auth/profile");
  return response.data;
}

export const updateProfile = async (formData: FormData): Promise<AuthUser> => {
  const response = await api.put("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.user;
}

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
}