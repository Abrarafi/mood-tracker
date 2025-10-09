import api from "./api";
import type { User } from "@/types/user";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

let currentUserPromise: Promise<{ user: User }> | null = null;

const getCurrentUserWithCache = async (): Promise<{ user: User }> => {
  if (currentUserPromise) {
    return currentUserPromise;
  }

  currentUserPromise = api
    .get<{ user: User }>("/auth/me")
    .then((response) => response.data);

  try {
    const result = await currentUserPromise;
    return result;
  } finally {
    currentUserPromise = null;
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const logout = async (): Promise<{ message: string }> => {
  try {
    const response = await api.get<{ message: string }>("/auth/logout");
    return response.data;
  } catch (error: any) {
    // If logout fails due to authentication issues, still return success
    // This handles cases where tokens are already expired/invalid
    if (error.response?.status === 401 || error.response?.status === 403) {
      return { message: "Logged out successfully" };
    }
    throw error;
  }
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  return getCurrentUserWithCache();
};

export const refreshToken = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/refresh-token");
  return response.data;
};

export const getGoogleAuthUrl = (): string => {
  return `${
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  }/auth/google`;
};

export const getGithubAuthUrl = (): string => {
  return `${
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  }/auth/github`;
};
